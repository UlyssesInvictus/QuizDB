import sanitizeHtml from 'sanitize-html';

export function cleanSpecial(str) {
  let newStr = str.replace(/Â/g, "");
  newStr = newStr.replace(/&quot;/g, "");
  return newStr;
}

export function cleanString(str) {
  let newStr = cleanSpecial(str);
  newStr = sanitizeHtml(newStr, {
    allowedTags: [ 'b', 'i', 'em', 'strong', 'u' ]
  });
  return newStr;
}

export function extractTossupText(tossup) {
  return cleanSpecial(tossup.text) + " \n\n" + cleanSpecial(tossup.answer) + "\n\n";
}

export function extractBonusText(bonus) {
  let content = cleanSpecial(bonus.leadin) + " \n\n";
  [0, 1, 2].forEach(index => {
    content += " \n\n";
    content += cleanSpecial(bonus.texts[index]);
    content += " \n\n";
    content += cleanSpecial(bonus.answers[index]);
    content += " \n\n";
  });
  return content;
}
