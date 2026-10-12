import { S_OFFSET, S_DIV, DEBUG } from "./constants.js";
import { rleEncodeOptimized } from "./rle.js";

/**
 * Кодирует последовательность неотрицательных целых чисел в строку.
 *
 * Формат результата: `first:zeroUnicodeIndex:rle`
 *   - `first` — первое значение последовательности
 *   - `zeroUnicodeIndex` — code point, соответствующий diff = 0
 *   - `rle` — RLE-сжатая строка diff'ов, отображённых в Unicode BMP
 *
 * @param {number[]} numbers - Массив неотрицательных целых чисел (длина >= 1).
 * @returns {string} Закодированная строка.
 *
 * @throws {TypeError} Если вход не массив, пуст, или содержит нецелые/отрицательные значения.
 * @throws {Error} Если данные выходят за пределы BMP (U+FFFF).
 *
 * @example
 * encodePositiveIntegerSeq([1, 2, 3, 4, 5]); // "1:192:ÀÁÂÃÄ"
 */
export function encodePositiveIntegerSeq(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError(`Expected an array, got ${typeof numbers}`);
  }
  if (numbers.length === 0) {
    throw new TypeError(`Empty array`);
  }
  if (!Number.isInteger(numbers[0]) || numbers[0] < 0) {
    throw new TypeError(`Invalid first: ${numbers[0]}`);
  }

  const res = [];
  const first = numbers[0];
  let last = first;
  let minDif = Infinity;
  let maxDif = -Infinity;

  for (let i = 1; i < numbers.length; i++) {
    const normalized = numbers[i];

    if (!Number.isInteger(normalized) || normalized < 0) {
      throw new TypeError(
        `Expected non-negative integer at index ${i}, got ${normalized}`,
      );
    }

    const diff = normalized - last;

    if (diff > maxDif) maxDif = diff;
    if (diff < minDif) minDif = diff;

    res.push(diff);
    last = normalized;
  }

  // Гарантируем zeroUnicodeIndex >= S_OFFSET даже для монотонно возрастающих данных.
  const zeroUnicodeIndex = S_OFFSET + Math.max(0, -minDif);

  if (zeroUnicodeIndex + maxDif > 0xffff) {
    throw new Error(`Data exceeds BMP: ${zeroUnicodeIndex + maxDif}`);
  }

  const chars = res.map((diff) =>
    String.fromCodePoint(zeroUnicodeIndex + diff),
  );

  if (DEBUG) {
    console.log("encodePositiveIntegerSeq", {
      chars,
      res,
      minDif,
      maxDif,
      zeroUnicodeIndex,
    });
  }

  return [first, zeroUnicodeIndex, rleEncodeOptimized(chars.join(""))].join(
    S_DIV,
  );
}
