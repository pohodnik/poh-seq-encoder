import { test } from "node:test";
import assert from "node:assert/strict";
import {
  encodePositiveIntegerSeq,
  decodePositiveIntegerSeq,
} from "../src/index.js";

test("edge: exactly at BMP limit", () => {
  const arr = [0, 0xffff - 192];
  const enc = encodePositiveIntegerSeq(arr);
  assert.deepEqual(decodePositiveIntegerSeq(enc), arr);
});

test("edge: one over BMP limit throws", () => {
  assert.throws(
    () => encodePositiveIntegerSeq([0, 0xffff - 191]),
    /Data exceeds BMP/,
  );
});

test("edge: long zero-diff run", () => {
  const arr = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  assert.deepEqual(decodePositiveIntegerSeq(encodePositiveIntegerSeq(arr)), arr);
});

test("edge: negative diff near S_OFFSET boundary", () => {
  const arr = [1000, 0, 0, 0];
  assert.deepEqual(decodePositiveIntegerSeq(encodePositiveIntegerSeq(arr)), arr);
});

test("edge: encode([]) throws, decode('') returns []", () => {
  assert.throws(() => encodePositiveIntegerSeq([]), /Empty array/);
  assert.deepEqual(decodePositiveIntegerSeq(""), []);
});
