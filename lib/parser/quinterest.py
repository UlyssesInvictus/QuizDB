from bs4 import BeautifulSoup as bs
import json


class Tossup:
    def __init__(self, text="", answer="", number=0, tournament="",
                 year=0, category="", subcategory="", round="",
                 quinterest_id=0, difficulty=0):
        self.text = text
        self.answer = answer
        self.number = number
        self.tournament = tournament
        self.category = category
        self.subcategory = subcategory
        self.round = round
        self.quinterest_id = quinterest_id
        self.difficulty = difficulty
        self.year = year

    def to_json(self):
        question_dict = vars(self)
        question_dict['text'] = question_dict['text'].replace('\n', ' ')
        return question_dict


class Bonus:
    def __init__(self, leadin="", texts=[], answers=[], number=0,
                 tournament="", year=0, category="", subcategory="", round="",
                 quinterest_id=0, difficulty=0):
        self.leadin = leadin
        self.texts = texts
        self.answers = answers
        self.number = number
        self.tournament = tournament
        self.category = category
        self.subcategory = subcategory
        self.round = round
        self.quinterest_id = quinterest_id
        self.difficulty = difficulty
        self.year = year

    def to_json(self):
        question_dict = vars(self)
        for i in range(len(question_dict['texts'])):
            text = question_dict['texts'][i]
            question_dict['texts'][i] = text.replace('\n', ' ')
        return question_dict

def try_access_string(split_string):
    try:
        s = split_string[1]
    except Exception as e:
        s = ""
    return s

def tossup_from_row(row):
    question_sections = row.find_all('p')
    question_info = question_sections[0].contents[0].text.split('|')
    question_info = [info.strip() for info in question_info]
    try:
        round = question_info[3].split(': ')[1]
    except Exception as e:
        round = ""
    try:
        number = question_info[4].split(': ')[1]
    except Exception as e:
        number = 0
    q = Tossup(tournament=question_info[1],
               year=question_info[2],
               round=round,
               number=number,
               category=question_info[5] if len(question_info) > 5 else "",
               subcategory=question_info[6] if len(question_info) > 6 else "",
               difficulty=question_info[7] if len(question_info) > 7 else 0,
               text='',
               answer='')
    quinterest_id = question_sections[0].contents[1].text
    q.quinterest_id = quinterest_id.split('ID: ')[1]
    q.text = try_access_string(question_sections[1].text.split('Question: '))
    q.answer = try_access_string(question_sections[2].text.split('ANSWER: '))
    return q


def bonus_from_row(row):
    question_sections = row.find_all('p')
    question_info = question_sections[0].contents[0].text.split('|')
    question_info = [info.strip() for info in question_info]
    try:
        round = question_info[3].split(': ')[1]
    except Exception as e:
        round = ""
    try:
        number = question_info[4].split(': ')[1]
    except Exception as e:
        number = 0
    q = Bonus(tournament=question_info[1],
              year=question_info[2],
              round=round,
              number=number,
              category=question_info[5] if len(question_info) > 5 else "",
              subcategory=question_info[6] if len(question_info) > 6 else "",
              difficulty=question_info[7] if len(question_info) > 7 else 0,
              texts=[],
              answers=[])
    quinterest_id = question_sections[0].contents[1].text
    q.quinterest_id = quinterest_id.split('ID: ')[1]
    q.leadin = try_access_string(question_sections[1].text.split('Question: '))
    q.texts += [try_access_string(question_sections[2].text.split('[10] '))]
    q.answers += [try_access_string(question_sections[3].text.split('ANSWER: '))]
    q.texts += [try_access_string(question_sections[4].text.split('[10] '))]
    q.answers += [try_access_string(question_sections[5].text.split('ANSWER: '))]
    q.texts += [try_access_string(question_sections[6].text.split('[10] '))]
    q.answers += [try_access_string(question_sections[7].text.split('ANSWER: '))]
    return q


def parseQuinterest():
    f = open('/Users/raynorkuang/Desktop/quizDB_small.htm')

    print "file opened"
    soup = bs(f, "lxml")
    print "soup loaded"
    f.close()

    questions = {
        'tossups': [],
        'bonuses': []
    }

    rows = soup.find_all('div', class_='row')
    print len(rows)
    f = open('parse_log.txt', 'w')
    counter = 0
    for r in rows:
        counter += 1
        if (counter % 50 == 0):
            print "Processed " + str(counter) + " questions"
        question_sections = r.find_all('p')
        try:
            if len(question_sections) > 3:
                if len(question_sections) >= 10:
                    print counter
                    print question_sections[0]
                    print len(question_sections)
                    assert(False)
                assert(len(question_sections) < 10)
                questions['bonuses'].append(bonus_from_row(r))
            else:
                questions['tossups'].append(tossup_from_row(r))
        except Exception as e:
            print counter, e
            f.write("Error parsing: ")
            f.write(r.text)
            f.write("\n")
    f.close()
    return questions


def dump_to_json(questions, filename):
    f = open(filename, 'w')
    tossups = [t.to_json() for t in questions['tossups']]
    bonuses = [t.to_json() for t in questions['bonuses']]
    json.dump(tossups + bonuses, f, indent=4,
              sort_keys=True)
    f.close()


def main():
    dump_to_json(parseQuinterest(), 'quinterest_small.json')


if __name__ == "__main__":
    main()
