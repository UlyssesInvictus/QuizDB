const fillerWords = [
  "novel",
  "character",
  "book",
  "play",
  "story",
  "author",
  "epic",
  "text",
  "work",
  "film",
  "year",
  "one",
  "protagonist",
  "man",
  "woman",
  "king",
  "queen",
  "war",
  "conflict",
  "point",
  "points",
  "that",
  "election",
  "section",
  "poem",
  "hero",
  "figure"
];

export function isFillerWord(str) {
  return fillerWords.some((word) => {
    return word.includes(str) || str.includes(word);
  });
}

export function stripStopWords(str) {
  let newStr = str;
  fillerWords.forEach(word => {
    newStr = newStr.replace(new RegExp(` ${word} `, 'gi'), " ");
  });
  return newStr;
}
