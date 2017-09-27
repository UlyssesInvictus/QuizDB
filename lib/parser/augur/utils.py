from bs4 import BeautifulSoup, Comment
import re

DEFAULT_VALID_TAGS = ['em', 'strong', 'b', 'u', 'i', 'sup', 'sub']


def sanitize(html, valid_tags=DEFAULT_VALID_TAGS):
    soup = BeautifulSoup(html, 'lxml')
    for comment in soup.findAll(text=lambda text: isinstance(text, Comment)):
        comment.extract()
    for tag in soup.findAll(True):
        if tag.name not in valid_tags:
            tag.hidden = True

    return soup.renderContents().decode('utf8')


def is_valid_content(s):

    # using this weird code structure b/c it's easier to add new conditions this way

    # sanity check, since most valid content is longer than this
    if len(s) <= 5:
        return False

    # get rid of pointless section headers
    if s in ['Extra, Extras']:
        return False

    # handle common <Author> formatting
    # disabled b/c it's returning false positives on html
    # if re.search('^(<.*>|&lt;.*&gt;)', s):
    #     return False

    return True
