/**
 * RLE-кодирование строки.
 * Счётчики пишутся десятичными цифрами после символа.
 * Одиночные символы пишутся без счётчика.
 *
 * @param {string} str - Исходная строка.
 * @returns {string} RLE-сжатая строка.
 *
 * @example
 * rleEncodeOptimized("aaabbc"); // "a3b2c"
 */
export function rleEncodeOptimized(str) {
  const len = str.length;
  if (len === 0) return "";
  if (len === 1) return str;

  const result = [];
  let count = 1;
  let prevChar = str[0];

  for (let i = 1; i < len; i++) {
    const char = str[i];
    if (char === prevChar) {
      count++;
    } else {
      result.push(prevChar);
      if (count > 1) result.push(count);
      prevChar = char;
      count = 1;
    }
  }
  result.push(prevChar);
  if (count > 1) result.push(count);

  return result.join("");
}

/**
 * RLE-декодирование строки, полученной из {@link rleEncodeOptimized}.
 *
 * @param {string} str - RLE-сжатая строка.
 * @returns {string} Исходная строка.
 *
 * @example
 * rleDecodeOptimized("a3b2c"); // "aaabbc"
 */
export function rleDecodeOptimized(str) {
  const len = str.length;
  if (len === 0) return "";

  const result = [];
  let i = 0;

  while (i < len) {
    const char = str[i++];
    let count = 0;

    while (i < len) {
      const code = str.charCodeAt(i);
      if (code >= 48 && code <= 57) {
        count = count * 10 + (code - 48);
        i++;
      } else {
        break;
      }
    }

    result.push(char.repeat(count === 0 ? 1 : count));
  }

  return result.join("");
}
