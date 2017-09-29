class Bonus:

    def __init__(self, number, leadin="", texts=None, answers=None,
                 category="", subcategory=""):
        self.number = number
        self.leadin = leadin
        self.texts = texts
        self.answers = answers
        self.category = category
        self.subcategory = subcategory

        if texts is None:
            self.texts = []
        if answers is None:
            self.answers = []

    def has_content(self):
        if len(self.texts) == 0 and len(self.answers) == 0:
            return False

        return self.texts[0].strip() != "" or self.answers[0].strip() != ""

    def to_dict(self):
        return {
            "number": self.number,
            "leadin": self.leadin,
            "texts": self.texts,
            "answers": self.answers,
            "category": self.category,
            "subcategory": self.subcategory
        }

    def __str__(self):
        return str(self.to_dict())

    def is_valid(self):
        return (self.leadin.strip() != "" and
                len(self.texts) == 3 and
                len(self.answers) == 3 and
                all(text.strip() != "" for text in self.texts) and
                all(answer.strip() != "" for answer in self.answers))
