import G6 from "@antv/g6";


/**
 * 格式化字符串
 * @param str 原始字符串
 * @param maxWidth 最大宽度
 * @param fontSize 字体大小
 * @return 处理后的结果
 */
const fittingString = (str: string, maxWidth: number, fontSize: number): string => {
  const ellipsis = "...";
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = /[\u4E00-\u9FA5]+/; // 区分中文字符和字母

  for (let i = 0; i < str.length; i++) {
    const letter = str[i];
    if (currentWidth > maxWidth - ellipsisLength) break;

    if (pattern.test(letter)) {
      // 中文字符
      currentWidth += fontSize;
    } else {
      // 根据字体大小获取单个字母的宽度
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }

    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substring(0, i)}${ellipsis}`;
      break;
    }
  }

  return res;
};
export default fittingString;
