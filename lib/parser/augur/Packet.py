import codecs
import yaml
import re
from utils import sanitize, is_valid_content, reformat_line
from Tossup import Tossup
from Bonus import Bonus
from Classifier import Classifier

TOSSUP_TEXT_REGEX = re.compile(r'^\s*(\(\d+\)|\d+\.?|extra|t(ie)?b(reak(er)?)?:?)\s*', re.I)
TOSSUP_ANSWER_REGEX = re.compile(r'^\s*answer:?\s*', re.I)
BONUS_LEADIN_REGEX = re.compile(r'^\s*(\(\d+\)|\d+\.?|extra|t(ie)?b(reak(er)?)?:?)\s*', re.I)
BONUSPART_TEXT_REGEX = re.compile(r'^\s*(\(\d+\)|\[\d+\])\s*', re.I)
BONUSPART_ANSWER_REGEX = re.compile(r'^\s*answer:?\s*', re.I)

class Packet:

    def __init__(self, filename, tournament, round,
                 tossup_text_re=TOSSUP_TEXT_REGEX, tossup_answer_re=TOSSUP_ANSWER_REGEX,
                 bonus_leadin_re=BONUS_LEADIN_REGEX, bonuspart_text_re=BONUSPART_TEXT_REGEX,
                 bonuspart_answer_re=BONUSPART_ANSWER_REGEX,
                 num_tossups=-1, strippable_lines_res=[],
                 classifier_data_filename="quizdb_classifier_training_data.json"):
        self.filename = filename
        self.tournament = tournament
        self.round = round

        self.tossup_text_re = tossup_text_re
        self.tossup_answer_re = tossup_answer_re
        self.bonus_leadin_re = bonus_leadin_re
        self.bonuspart_text_re = bonuspart_text_re
        self.bonuspart_answer_re = bonuspart_answer_re
        self.strippable_lines_res = strippable_lines_res

        self.num_tossups = num_tossups

        self.tossups = []
        self.bonuses = []

        self.classifier_data_filename = classifier_data_filename

    def load_html(self):
        with codecs.open(self.filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        prepared_lines = []
        for l in lines:
            # HACK to fix a common case of an answer/text not being on a new line
            # by using how we split up line breaks ourselves
            hacked_l = re.sub('(ANSWER|\[10\])', r'<br>\1', l, re.I)

            split_lines = re.split('<br\s*/?>', hacked_l)
            for split_line in split_lines:
                sanitized_line = sanitize(split_line).strip()
                if is_valid_content(sanitized_line, strippable_lines_res=self.strippable_lines_res):
                    prepared_lines.append(sanitized_line)
        return prepared_lines

    def is_valid(self):
        valid = True
        for tossup in self.tossups:
            if not tossup.is_valid():
                valid = False
                print("Tossup %d invalid" % tossup.number)
                print("Its text: %s" % tossup.text)
                print("Its answer: %s" % tossup.answer)
        for bonus in self.bonuses:
            if not bonus.is_valid():
                valid = False
                print("Bonus %d invalid" % bonus.number)
                print("Its leadin: %s" % (bonus.leadin))
                print("Its texts: %s (length: %d)" % (bonus.texts, len(bonus.texts)))
                print("Its answers: %s (length: %d)" % (bonus.answers, len(bonus.answers)))
        return valid

    def classify(self):
        classifier = Classifier(self.classifier_data_filename)
        if len(self.tossups) > 0:
            tossup_category_Y = classifier.predict_categories(self.tossups)
            tossup_subcategory_Y = classifier.predict_subcategories(self.tossups)
        for i in range(len(self.tossups)):
            self.tossups[i].category = str(tossup_category_Y[i])
            if re.search("^" + str(tossup_category_Y[i]), str(tossup_subcategory_Y[i])):
                self.tossups[i].subcategory = str(tossup_subcategory_Y[i])
            else:
                self.tossups[i].subcategory = "None"
        if len(self.bonuses) > 0:
            bonus_X = [t.content() for t in self.bonuses]
            bonus_category_Y = classifier.predict_categories(self.bonuses)
            bonus_subcategory_Y = classifier.predict_subcategories(self.bonuses)
        for i in range(len(self.bonuses)):
            self.bonuses[i].category = str(bonus_category_Y[i])
            if re.search("^" + str(bonus_category_Y[i]), str(bonus_subcategory_Y[i])):
                self.bonuses[i].subcategory = str(bonus_subcategory_Y[i])
            else:
                self.bonuses[i].subcategory = "None"

    def dump_yaml(self, filename=None):
        if filename is None:
            filename = self.filename + ".yml"
        with open(filename, 'w') as f:
            f.write("# generated using these settings:\n")
            settings = {
                "tournament": self.tournament,
                "round": self.round,
                "tossup_text_re": self.tossup_text_re.pattern,
                "tossup_answer_re": self.tossup_answer_re.pattern,
                "bonus_leadin_re": self.bonus_leadin_re.pattern,
                "bonuspart_text_re": self.bonuspart_text_re.pattern,
                "bonuspart_answer_re": self.bonuspart_answer_re.pattern,
                "num_tossups": self.num_tossups
            }
            f.write("# %s \n" % (settings))
            f.write("# TOSSUPS\n")
            f.write("# %d tossups total\n" % len(self.tossups))
            # import pudb; pudb.set_trace()
            yaml.safe_dump([tu.to_dict() for tu in self.tossups], f,
                           default_flow_style=False)
            f.write("# BONUSES\n")
            f.write("# %d bonuses total\n" % len(self.bonuses))
            yaml.safe_dump([b.to_dict() for b in self.bonuses], f,
                           default_flow_style=False)

    def parse_packet(self):
        lines = self.load_html()

        tossups = []
        current_tossup = Tossup(1)
        # assume we start with tossups first, since that's what almost
        # every packet structure looks like
        parsing_tossups = True

        bonuses = []
        current_bonus = Bonus(1)

        for l in lines:
            sanitized_l = sanitize(reformat_line(l))
            # import pdb; pdb.set_trace()

            # edge case for switching from tossups to bonuses
            # we use -1 as a short circuit to say "use the Bonuses marker instead"
            if (self.num_tossups != -1 and
                    len(tossups) + 1 >= self.num_tossups and
                    self.bonus_leadin_re.search(sanitized_l) and
                    current_tossup.has_content()):
                parsing_tossups = False

            if parsing_tossups:
                if self.tossup_text_re.search(sanitized_l):
                    # assume finding a new tossup means we're done with the old one
                    if current_tossup.has_content():
                        tossups.append(current_tossup)
                    current_tossup = Tossup(len(tossups) + 1)
                    current_tossup.text = self.tossup_text_re.sub("", l, count=1)
                    current_tossup.answer = ""
                # TODO: handle case where the next answer line isn't actually on the next line *sigh*
                elif self.tossup_answer_re.search(sanitized_l):
                    current_tossup.answer = self.tossup_answer_re.sub("", l, count=1)
                else:
                    if re.search(r'^bonus(es)?$', sanitized_l, re.I):
                        parsing_tossups = False
                        next
                    # this assumes everything between the current answer and the beginning of the
                    # next tossup is wortwhile answer text
                    # this will catch some junk in the middle occasionally, but we should
                    # handle that by stripping it in the preparation stuff, and this approach
                    # allows us to handle bad packet loading that turns paragraphs into multilines
                    if current_tossup.has_content():
                        if current_tossup.answer != "":
                            current_tossup.answer += (" " + l)
                        else:
                            current_tossup.text += (" " + l)

            else:
                if self.bonus_leadin_re.search(sanitized_l):
                    if len(bonuses) == 0 and current_tossup.has_content():
                        tossups.append(current_tossup)
                        current_tossup = Tossup(len(tossups) + 1)
                    if current_bonus.has_content():
                        bonuses.append(current_bonus)
                    current_bonus = Bonus(len(bonuses) + 1,
                                          leadin=self.bonus_leadin_re.sub("", l, count=1))
                elif self.bonuspart_text_re.search(sanitized_l):
                    current_bonus.texts += [self.bonuspart_text_re.sub("", l, count=1)]
                elif self.bonuspart_answer_re.search(sanitized_l):
                    current_bonus.answers += [self.bonuspart_answer_re.sub("", l, count=1)]
                else:
                    if current_bonus.texts == [] and current_bonus.answers == []:
                        current_bonus.leadin += (" " + l)
                    elif len(current_bonus.texts) > len(current_bonus.answers):
                        current_bonus.texts[-1] += (" " + l)
                    else:
                        current_bonus.answers[-1] += (" " + l)

        if current_tossup.has_content():
            tossups.append(current_tossup)
        if current_bonus.has_content():
            bonuses.append(current_bonus)

        for i in range(len(tossups)):
            tossups[i].tournament = self.tournament
            tossups[i].round = self.round
        for i in range(len(bonuses)):
            bonuses[i].tournament = self.tournament
            bonuses[i].round = self.round

        self.tossups = tossups
        self.bonuses = bonuses
        return (tossups, bonuses)
