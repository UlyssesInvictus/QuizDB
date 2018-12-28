from utils import sanitize


class Tossup:

    def __init__(self, number, text=None, answer=None,
                 category="", subcategory="",
                 tournament="", round=""):
        self.number = number
        self.text = text
        self.answer = answer
        self.category = category
        self.subcategory = subcategory
        self.tournament = tournament
        self.round = round

    def has_content(self):
        return self.text is not None or self.answer is not None

    # OK should be renamed to like "to_output" since this also formats stuff
    # but mark that as TODO
    def to_dict(self):
        return {
            "number": self.number,
            "formatted_text": self.text.strip(),
            "formatted_answer": self.answer.strip(),
            "text": sanitize(self.text.strip(), valid_tags=[]),
            "answer": sanitize(self.answer.strip(), valid_tags=[]),
            "category": self.category,
            "subcategory": self.subcategory,
            "tournament": self.tournament,
            "round": self.round
        }

    def __str__(self):
        return str(self.to_dict())

    def is_valid(self):
        return (self.text is not None and self.text.strip() != "" and
                self.answer is not None and self.answer.strip() != "")

    def content(self):
        return self.text + " ANSWER: " + self.answer
