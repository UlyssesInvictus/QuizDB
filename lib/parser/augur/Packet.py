import codecs
import yaml
import re
from utils import sanitize, is_valid_content
from Tossup import Tossup
from Bonus import Bonus
from Classifier import Classifier

TOSSUP_TEXT_REGEX = re.compile(r'^\s*(\(\d+\)|\d+\.?|question:?|t(ie)?b(reak(er)?)?:?)\s*', re.I)
TOSSUP_ANSWER_REGEX = re.compile(r'^\s*a(ns(wer)?)?:?\s*', re.I)
BONUS_LEADIN_REGEX = re.compile(r'^\s*(\(\d+\)|\d+\.?|question:?|t(ie)?b(reak(er)?)?:?)\s*', re.I)
BONUSPART_TEXT_REGEX = re.compile(r'^\s*(\(\d+\)|\[\d+\])\s*', re.I)
BONUSPART_ANSWER_REGEX = re.compile(r'^\s*a(ns(wer)?)?:?\s*', re.I)


class Packet:

    def __init__(self, filename, tournament, round,
                 tossup_text_re=TOSSUP_TEXT_REGEX, tossup_answer_re=TOSSUP_ANSWER_REGEX,
                 bonus_leadin_re=BONUS_LEADIN_REGEX, bonuspart_text_re=BONUSPART_TEXT_REGEX,
                 bonuspart_answer_re=BONUSPART_ANSWER_REGEX,
                 num_tossups=-1, strippable_lines_res=[],
                 classifier_data_filename="quizb_classifier_training_data.json"):
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
            split_lines = re.split('<br\s*/?>', l)
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
                print "Tossup %d invalid" % tossup.number
        for bonus in self.bonuses:
            if not bonus.is_valid():
                valid = False
                print "Bonus %d invalid" % bonus.number
        return valid

    def classify(self):
        classifier = Classifier(self.classifier_data_filename)
        tossup_category_Y = classifier.predict_categories(self.tossups)
        tossup_subcategory_Y = classifier.predict_subcategories(self.tossups)
        for i in xrange(len(self.tossups)):
            self.tossups[i].category = str(tossup_category_Y[i])
            if re.search("^" + str(tossup_category_Y[i]), str(tossup_subcategory_Y[i])):
                self.tossups[i].subcategory = str(tossup_subcategory_Y[i])
            else:
                self.tossups[i].subcategory = "None"
        bonus_X = [t.content() for t in self.bonuses]
        bonus_category_Y = classifier.predict_categories(self.bonuses)
        bonus_subcategory_Y = classifier.predict_subcategories(self.bonuses)
        for i in xrange(len(self.bonuses)):
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
            yaml.safe_dump(map(lambda x: x.to_dict(), self.tossups), f,
                           default_flow_style=False,
                           encoding=None)
            f.write("# BONUSES\n")
            f.write("# %d bonuses total\n" % len(self.bonuses))
            yaml.safe_dump(map(lambda x: x.to_dict(), self.bonuses), f,
                           default_flow_style=False,
                           encoding=None)

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
            # edge case for switching from tossups to bonuses
            # we use -1 as a short circuit to say "use the Bonuses marker instead"
            if (self.num_tossups != -1 and
                    len(tossups) + 1 >= self.num_tossups and
                    self.bonus_leadin_re.search(l) and
                    current_tossup.has_content()):
                parsing_tossups = False

            if parsing_tossups:
                if self.tossup_text_re.search(l):
                    # assume finding a new tossup means we're done with the old one
                    if current_tossup.has_content():
                        tossups.append(current_tossup)
                    current_tossup = Tossup(len(tossups) + 1)
                    current_tossup.text = self.tossup_text_re.sub("", l, count=1)
                    current_tossup.answer = ""
                elif self.tossup_answer_re.search(l):
                    current_tossup.answer = self.tossup_answer_re.sub("", l, count=1)
                else:
                    if re.search(r'^bonus(es)?$', l, re.I):
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
                if self.bonus_leadin_re.search(l):
                    if len(bonuses) == 0 and current_tossup.has_content():
                        tossups.append(current_tossup)
                        current_tossup = Tossup(len(tossups) + 1)
                    if current_bonus.has_content():
                        bonuses.append(current_bonus)
                    current_bonus = Bonus(len(bonuses) + 1,
                                          leadin=self.bonus_leadin_re.sub("", l, count=1))
                elif self.bonuspart_text_re.search(l):
                    current_bonus.texts += [self.bonuspart_text_re.sub("", l, count=1)]
                elif self.bonuspart_answer_re.search(l):
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

        for i in xrange(len(tossups)):
            tossups[i].tournament = self.tournament
            tossups[i].round = self.round
        for i in xrange(len(bonuses)):
            bonuses[i].tournament = self.tournament
            bonuses[i].round = self.round

        self.tossups = tossups
        self.bonuses = bonuses
        return (tossups, bonuses)
