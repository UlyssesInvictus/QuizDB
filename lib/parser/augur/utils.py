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

# series of common reformatting tricks needed
def reformat_line(s):
    # handle common case of bold font being wrapped around the answer number as well
    formatted_s = re.sub("<strong>(\d+\.?\s*)", r"\1<strong>", s)

    # NOTE: this is all JS because it's all done client side currently
    # I'm hesitant to replace any actual parsed content in case the replacement is wrong
    # But may decide it's better to just do this all backend side eventually
    # let newStr = str.replace(/Â/g, "");
    # newStr = newStr.replace(/&quot;/g, "");
    # newStr = newStr.replace(/猴/g, "f");
    # newStr = newStr.replace(/睌/g, "f");
    # newStr = newStr.replace(/猼/g, "f");
    # newStr = newStr.replace(/✴/g, "fi");
    # newStr = newStr.replace(/⢄/g, "ft");
    # newStr = newStr.replace(/Ã¶/g, "ö");
    # newStr = newStr.replace(/Ã©/g, "é");
    # newStr = newStr.replace(/送/g, "fi");
    # newStr = newStr.replace(/畔/g, "f");
    # newStr = newStr.replace(/㱀/g, "f");
    # newStr = newStr.replace(/Ã¼/g, "ü");
    # newStr = newStr.replace(/Ã±/g, "ñ");
    # newStr = newStr.replace(/㻈/g, "f");
    # newStr = newStr.replace(/Ã¨/g, "è");
    # newStr = newStr.replace(/Ã¸/g, "ü");
    # newStr = newStr.replace(/ぺ/g, "ft");

    return formatted_s

def is_valid_content(s, strippable_lines_res=[]):

    # using this weird code structure b/c it's easier to add new conditions this way

    # sanity check, since most valid content is longer than this
    # (Disabled for now, since this seems to not actually harm things if we include short lines)
    # if len(s) <= 5:
    #     return False

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
