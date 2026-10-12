import {
  encodePositiveIntegerSeq,
  decodePositiveIntegerSeq,
  rleEncodeOptimized,
  rleDecodeOptimized,
  S_OFFSET,
  S_DIV,
} from "../src/index.js";

// ✅ Валидные вызовы
const encoded: string = encodePositiveIntegerSeq([1, 2, 3]);
const decoded: number[] = decodePositiveIntegerSeq("1:192:À");
const rleEnc: string = rleEncodeOptimized("aaabb");
const rleDec: string = rleDecodeOptimized("a3b2");
const off: 192 = S_OFFSET;
const div: ":" = S_DIV;

// ❌ Невалидные вызовы — должны подсветиться в редакторе
// @ts-expect-error — строка не массив
encodePositiveIntegerSeq("1,2,3");
// @ts-expect-error — число не строка
decodePositiveIntegerSeq(123);
// @ts-expect-error — string[] не number[]
encodePositiveIntegerSeq(["1", "2"]);

// Подавляем unused-предупреждения
void encoded;
void decoded;
void rleEnc;
void rleDec;
void off;
void div;
