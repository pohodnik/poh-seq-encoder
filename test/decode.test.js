import { test } from "node:test";
import assert from "node:assert/strict";
import { decodePositiveIntegerSeq } from "../src/index.js";

test("decode: empty string returns []", () => {
  assert.deepEqual(decodePositiveIntegerSeq(""), []);
  assert.deepEqual(decodePositiveIntegerSeq(null), []);
  assert.deepEqual(decodePositiveIntegerSeq(undefined), []);
});

test("decode: non-string throws", () => {
  assert.throws(() => decodePositiveIntegerSeq(42), /Expected a string/);
  assert.throws(() => decodePositiveIntegerSeq([]), /Expected a string/);
});

test("decode: wrong number of parts throws", () => {
  assert.throws(() => decodePositiveIntegerSeq("42"), /Invalid encoded format/);
  assert.throws(() => decodePositiveIntegerSeq("42:192"), /Invalid encoded format/);
  assert.throws(
    () => decodePositiveIntegerSeq("42:192:a:b"),
    /Invalid encoded format/,
  );
});

test("decode: invalid first throws", () => {
  assert.throws(() => decodePositiveIntegerSeq("-1:192:x"), /Invalid first/);
  assert.throws(() => decodePositiveIntegerSeq("abc:192:x"), /Invalid first/);
});

test("decode: invalid zero throws", () => {
  assert.throws(
    () => decodePositiveIntegerSeq("1:100:x"),
    /Invalid zeroUnicodeIndex/,
  );
  assert.throws(
    () => decodePositiveIntegerSeq("1:abc:x"),
    /Invalid zeroUnicodeIndex/,
  );
});

test("decode: single-element works", () => {
  assert.deepEqual(decodePositiveIntegerSeq("42:192:"), [42]);
});
