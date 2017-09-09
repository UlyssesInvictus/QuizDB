import sanitizeHtml from 'sanitize-html';

export function cleanSpecial(str) {
  return str.replace(/Â/g, "");
}

export function cleanString(str) {
  let newStr = cleanSpecial(str);
  newStr = sanitizeHtml(newStr, {
    allowedTags: [ 'b', 'i', 'em', 'strong', 'u' ]
  });
  return newStr;
}
