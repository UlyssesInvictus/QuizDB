import codecs
import re
from utils import sanitize, is_valid_content

TOSSUP_TEXT_REGEX = re.compile(r'^\s*(\(\d*\)|\d*\.?|question)\s*', re.I)
TOSSUP_ANSWER_REGEX = re.compile(r'^\s*a(ns(wer)?)?:?.*', re.I)
BONUS_LEADIN_REGEX = re.compile(r'^\s*(\(\d*\)|\d*\.?|question)\s*', re.I)
BONUSPART_TEXT_REGEX = "text"
BONUSPART_ANSWER_REGEX = re.compile(r'^\s*a(ns(wer)?)?:?.*', re.I)


class Packet:

    def __init__(self, filename, tournament, round):
        self.filename = filename
        self.tournament = tournament
        self.round = round

    def load_html(self):
        with codecs.open(self.filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        prepared_lines = []
        for l in lines:
            split_lines = re.split('<br\s*/?>', l)
            for split_line in split_lines:
                sanitized_line = sanitize(split_line).strip()
                if is_valid_content(sanitized_line):
                    prepared_lines.append(sanitized_line)
        return prepared_lines

    def parse_packet(self):
        lines = self.load_html()

        tossups = []
        current_tossup_text = ""
        current_tossup_answer = ""
        # assume we start with tossups first, since that's what almost
        # every packet structure looks like
        parsing_tossups = True

        bonuses = []
        current_bonus_leadin = ""
        current_bonus_texts = []
        current_bonus_answers = []

        for l in lines:
            if parsing_tossups:
                if self.tossup_text_re.search(l):
                    # assume finding a new tossup means we're done with the old one
                    # tossups.push(Tossup(TODO))
                    current_tossup_text = self.tossup_text_re.sub(l, "")
                    current_tossup_answer = ""
                elif self.tossup_answer_re.search(l):
                    current_tossup_answer = self.tossup_answer_re.sub(l, "")
                else:
                    if re.search(r'^bonus(es)?$', l, re.I):
                        # tossups.push(Tossup(TODO))
                        parsing_tossups = False
                    # this assumes everything between the current answer and the beginning of the
                    # next tossup is wortwhile answer text
                    # this will catch some junk in the middle occasionally, but we should
                    # handle that by stripping it in the preparation stuff, and this approach
                    # allows us to handle bad packet loading that turns paragraphs into multilines
                    elif current_tossup_answer != "":
                        current_tossup_answer += (" " + l)
                    else:
                        current_tossup_text += (" " + l)
            else:
                if self.bonus_leadin_re.search(l):
                    # TODO: read this from a global / user input config settings
                    if len(tossups) >= 20:
                        parsing_tossups = False
                        # tossups.push(Tossup(TODO))
        return (tossups, bonuses)
