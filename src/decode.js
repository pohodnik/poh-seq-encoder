import { S_OFFSET, S_DIV } from "./constants.js";
import { rleDecodeOptimized } from "./rle.js";

/**
 * Декодирует строку, полученную из {@link encodePositiveIntegerSeq}.
 *
 * @param {string} str - Закодированная строка.
 * @returns {number[]} Массив неотрицательных целых чисел.
 *
 * @throws {TypeError} Если вход не строка.
 * @throws {Error} Если формат строки некорректен.
 *
 * @example
 * decodePositiveIntegerSeq("1:192:ÀÁÂÃÄ"); // [1, 2, 3, 4, 5]
 */
export function decodePositiveIntegerSeq(str) {
  if (str === "" || str == null) return [];

  if (typeof str !== "string") {
    throw new TypeError(`Expected a string, got ${typeof str}`);
  }

  const parts = str.split(S_DIV);

  if (parts.length !== 3) {
    throw new Error(
      `Invalid encoded format: expected "first:zero:rle", got ${parts.length} parts`,
    );
  }

  const [firstStr, zeroStr, encodedSeq] = parts;
  const first = Number(firstStr);
  const zero = Number(zeroStr);

  if (!Number.isInteger(first) || first < 0) {
    throw new Error(`Invalid first: ${firstStr}`);
  }
  if (!Number.isInteger(zero) || zero < S_OFFSET) {
    throw new Error(`Invalid zeroUnicodeIndex: ${zeroStr}`);
  }

  const seq = rleDecodeOptimized(encodedSeq);
  const res = [first];
  let last = first;

  for (let i = 0; i < seq.length; i++) {
    const n = seq[i].codePointAt(0);
    last = last + n - zero;
    res.push(last);
  }

  return res;
}
