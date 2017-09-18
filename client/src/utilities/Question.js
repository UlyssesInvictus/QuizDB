import sanitizeHtml from 'sanitize-html';
import { isPresent } from './String';

export function cleanSpecial(str) {
  let newStr = str.replace(/Â/g, "");
  newStr = newStr.replace(/&quot;/g, "");
  // assuming these specific chinese characters are never actually intentional...
  newStr = newStr.replace(/猴/g, "f");
  newStr = newStr.replace(/睌/g, "f");
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

export function extractActualAnswer(answer) {
  const regMatch = answer.match(/<b>.*<\/b>/) || answer.match(/<strong>.*<\/strong>/);
  return regMatch ? regMatch[0] : null;
}

export function generateWikiLink(question, index = null) {
  const wikiPrefix = 'https://en.wikipedia.org/w/index.php?search=';
  let url, answer, formattedAnswer;
  if (question.type === "tossup") {
    url = question.wikipedia_url;
    answer = question.answer;
    formattedAnswer = question.formatted_answer;
  } else {
    url = question.wikipedia_urls[index];
    answer = question.answers[index];
    formattedAnswer = question.formatted_answers[index];
  }

  if (isPresent(url)) {
    return url;
  } else if (extractActualAnswer(formattedAnswer)) {
    const actualAnswer = sanitizeHtml(extractActualAnswer(formattedAnswer), { allowedTags: [] });
    return `${wikiPrefix}${encodeURI(actualAnswer)}`;
  } else {
    return `${wikiPrefix}${encodeURI(answer)}`;
  }
}
