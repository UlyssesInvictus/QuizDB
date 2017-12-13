from bs4 import BeautifulSoup, Comment
import re

DEFAULT_VALID_TAGS = ['em', 'strong', 'b', 'u', 'i', 'sup', 'sub', 'ol', 'li', 'p']


def sanitize(html, valid_tags=DEFAULT_VALID_TAGS):
    soup = BeautifulSoup(html, 'lxml')
    for comment in soup.findAll(text=lambda text: isinstance(text, Comment)):
        comment.extract()
    for tag in soup.findAll(True):
        if tag.name not in valid_tags:
            tag.hidden = True

    sanitized = soup.renderContents().decode('utf8')

    # remove any left over tags that we contain valid content, but we want to remove
    sanitized = re.sub("<p>", "", sanitized)
    sanitized = re.sub("</p>", "", sanitized)
    sanitized = re.sub("<br />", "", sanitized)
    sanitized = re.sub("</li>", "", sanitized)
    sanitized = re.sub("</ol>", "", sanitized)
    # sometimes these tags are used for numbering, so comment/uncomment as needed
    sanitized = re.sub("<ol.*?>", "", sanitized)
    # sanitized = re.sub("<li>", "", sanitized)

    # and some stupid "white space" that's not really white space
    sanitized = re.sub(u"\u200b", "", sanitized)

    return sanitized


def is_valid_content(s, strippable_lines_res=[]):

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

    for r in strippable_lines_res:
        if re.search(r, s):
            return False

    return True
