import sanitizeHtml from 'sanitize-html';

export function cleanSpecial(str) {
  let newStr = str.replace(/Â/g, "");
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
