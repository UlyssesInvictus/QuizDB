from utils import sanitize


class Tossup:

    def __init__(self, number, text="", answer="",
                 category="", subcategory=""):
        self.number = number
        self.text = text
        self.answer = answer
        self.category = category
        self.subcategory = subcategory

    def has_content(self):
        return self.text.strip() != "" or self.answer.strip() != ""

    def to_dict(self):
        return {
            "number": self.number,
            "formatted_text": self.text,
            "formatted_answer": self.answer,
            "text": sanitize(self.text, valid_tags=[]),
            "answer": sanitize(self.answer, valid_tags=[]),
            "category": self.category,
            "subcategory": self.subcategory
        }

    def __str__(self):
        return str(self.to_dict())

    def is_valid(self):
        return (self.text.strip() != "" and
                self.answer.strip() != "")
