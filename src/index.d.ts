/**
 * Compact encoder for sequences of non-negative integers
 * using delta encoding and RLE over the Unicode BMP.
 *
 * @packageDocumentation
 */

/**
 * Начало безопасного диапазона code points.
 * Все закодированные символы имеют code point >= S_OFFSET.
 *
 * Значение: 192 (U+00C0).
 */
export declare const S_OFFSET: 192;

/**
 * Разделитель заголовка в закодированной строке.
 * Значение: ":" (code point 58).
 */
export declare const S_DIV: ":";

/**
 * Кодирует последовательность неотрицательных целых чисел в строку.
 *
 * Формат результата: `first:zeroUnicodeIndex:rle`.
 *
 * @param numbers - Массив неотрицательных целых чисел (длина >= 1).
 * @returns Закодированная строка.
 * @throws {TypeError} Если вход не массив, пуст, или содержит нецелые/отрицательные значения.
 * @throws {Error} Если данные выходят за пределы BMP (U+FFFF).
 *
 * @example
 * ```ts
 * encodePositiveIntegerSeq([1, 2, 3, 4, 5]); // "1:192:ÀÁÂÃÄ"
 * ```
 */
export declare function encodePositiveIntegerSeq(numbers: number[]): string;

/**
 * Декодирует строку, полученную из {@link encodePositiveIntegerSeq}.
 *
 * @param str - Закодированная строка.
 * @returns Массив неотрицательных целых чисел.
 * @throws {TypeError} Если вход не строка.
 * @throws {Error} Если формат строки некорректен.
 *
 * @example
 * ```ts
 * decodePositiveIntegerSeq("1:192:ÀÁÂÃÄ"); // [1, 2, 3, 4, 5]
 * ```
 */
export declare function decodePositiveIntegerSeq(str: string): number[];

/**
 * RLE-кодирование строки.
 * Счётчики пишутся десятичными цифрами после символа.
 * Одиночные символы пишутся без счётчика.
 *
 * @example
 * ```ts
 * rleEncodeOptimized("aaabbc"); // "a3b2c"
 * ```
 */
export declare function rleEncodeOptimized(str: string): string;

/**
 * RLE-декодирование строки, полученной из {@link rleEncodeOptimized}.
 *
 * @example
 * ```ts
 * rleDecodeOptimized("a3b2c"); // "aaabbc"
 * ```
 */
export declare function rleDecodeOptimized(str: string): string;
