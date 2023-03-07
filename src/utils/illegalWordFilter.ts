// 過濾字詞
const illegalWordMap = new Map([
  ["@everyone", "everyone"],
  ["@here", "here"],
]);
const illegalWordFilter = (text: string) => {
  for (const [key, value] of illegalWordMap) {
    text = text.replaceAll(key, value);
  }
  return text;
};

export default illegalWordFilter;
