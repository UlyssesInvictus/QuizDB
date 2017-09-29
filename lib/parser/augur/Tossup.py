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
            "text": unicode(self.text),
            "answer": unicode(self.answer),
            "category": self.category,
            "subcategory": self.subcategory
        }

    def __str__(self):
        return str(self.to_dict())

    def is_valid(self):
        return (self.text.strip() != "" and
                self.answer.strip() != "")
