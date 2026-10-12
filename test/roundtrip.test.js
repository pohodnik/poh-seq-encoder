import { test } from "node:test";
import assert from "node:assert/strict";
import {
  encodePositiveIntegerSeq,
  decodePositiveIntegerSeq,
} from "../src/index.js";

const roundtrip = (arr) => {
  const enc = encodePositiveIntegerSeq(arr);
  const dec = decodePositiveIntegerSeq(enc);
  assert.deepEqual(dec, arr, `roundtrip failed for ${JSON.stringify(arr)}`);
  return enc;
};

test("roundtrip: ascending", () => roundtrip([1, 2, 3, 4, 5, 6, 7, 8, 9]));
test("roundtrip: repeated", () =>
  roundtrip([1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]));
test("roundtrip: constant", () => roundtrip([7, 7, 7, 7, 7, 7]));
test("roundtrip: increasing", () => roundtrip([1, 10, 100, 1000, 10000]));
test("roundtrip: decreasing", () => roundtrip([10000, 1000, 100, 10, 1]));
test("roundtrip: alternating", () => roundtrip([100, 50, 100, 50, 100]));
test("roundtrip: single", () => roundtrip([42]));
test("roundtrip: zeros", () => roundtrip([0, 0, 0, 0]));
test("roundtrip: timestamps", () =>
  roundtrip([1790772926, 1790772927, 1790772928, 1790772929]));

test("roundtrip: GPS lat scaled", () =>
  roundtrip([5322314, 5322313, 5322313, 5322314, 5322314, 5322315]));

test("roundtrip: 1000 synthetic points", () => {
  const arr = [];
  let v = 1000;
  for (let i = 0; i < 1000; i++) {
    v += (i % 5) - 2;
    if (v < 0) v = 0;
    arr.push(v);
  }
  roundtrip(arr);
});

test("roundtrip: max diff within BMP", () => roundtrip([0, 65343]));
