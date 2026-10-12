import { test } from "node:test";
import assert from "node:assert/strict";
import { encodePositiveIntegerSeq } from "../src/index.js";

test("encode: empty array throws", () => {
  assert.throws(() => encodePositiveIntegerSeq([]), /Empty array/);
});

test("encode: non-array throws", () => {
  assert.throws(() => encodePositiveIntegerSeq("nope"), /Expected an array/);
  assert.throws(() => encodePositiveIntegerSeq(null), /Expected an array/);
});

test("encode: negative first throws", () => {
  assert.throws(() => encodePositiveIntegerSeq([-1, 2, 3]), /Invalid first/);
});

test("encode: non-integer first throws", () => {
  assert.throws(() => encodePositiveIntegerSeq([1.5, 2, 3]), /Invalid first/);
});

test("encode: non-integer in middle throws", () => {
  assert.throws(
    () => encodePositiveIntegerSeq([1, 2.5, 3]),
    /Expected non-negative integer at index 1/,
  );
});

test("encode: negative in middle throws", () => {
  assert.throws(
    () => encodePositiveIntegerSeq([1, -1, 3]),
    /Expected non-negative integer at index 1/,
  );
});

test("encode: single element works", () => {
  const out = encodePositiveIntegerSeq([42]);
  assert.equal(typeof out, "string");
  assert.match(out, /^42:192:/);
});

test("encode: constant sequence", () => {
  const out = encodePositiveIntegerSeq([5, 5, 5, 5]);
  assert.match(out, /^5:192:/);
});

test("encode: monotonic increasing keeps zero at S_OFFSET", () => {
  const out = encodePositiveIntegerSeq([1, 100, 200]);
  assert.match(out, /^1:192:/);
});

test("encode: monotonic decreasing raises zero", () => {
  const out = encodePositiveIntegerSeq([100, 50, 0]);
  assert.match(out, /^100:242:/);
});

test("encode: exceeds BMP throws", () => {
  assert.throws(
    () => encodePositiveIntegerSeq([0, 65344]),
    /Data exceeds BMP/,
  );
});
