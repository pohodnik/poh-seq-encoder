/**
 * Начало безопасного диапазона code points.
 * Все закодированные символы имеют code point >= S_OFFSET.
 *
 * Значение: 192 (U+00C0).
 */
export const S_OFFSET = 192;

/**
 * Разделитель заголовка в закодированной строке.
 *
 * Значение: ":" (code point 58).
 */
export const S_DIV = ":";

/**
 * Включает отладочные логи в encodePositiveIntegerSeq.
 * Не включайте в production — это тормозит и печатает огромные массивы.
 */
export const DEBUG = false;
