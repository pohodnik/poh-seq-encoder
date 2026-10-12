import { test } from "node:test";
import assert from "node:assert/strict";
import { rleEncodeOptimized, rleDecodeOptimized } from "../src/index.js";

test("rle: empty", () => {
  assert.equal(rleEncodeOptimized(""), "");
  assert.equal(rleDecodeOptimized(""), "");
});

test("rle: single", () => {
  assert.equal(rleEncodeOptimized("a"), "a");
  assert.equal(rleDecodeOptimized("a"), "a");
});

test("rle: no repeats", () => {
  assert.equal(rleEncodeOptimized("abc"), "abc");
  assert.equal(rleDecodeOptimized("abc"), "abc");
});

test("rle: simple repeats", () => {
  assert.equal(rleEncodeOptimized("aaabbc"), "a3b2c");
  assert.equal(rleDecodeOptimized("a3b2c"), "aaabbc");
});

test("rle: run of 100+", () => {
  const enc = rleEncodeOptimized("a".repeat(123));
  assert.equal(enc, "a123");
  assert.equal(rleDecodeOptimized(enc), "a".repeat(123));
});

test("rle: high BMP chars", () => {
  const s =
    String.fromCodePoint(0x00c0).repeat(50) +
    String.fromCodePoint(0x00c1).repeat(30);
  assert.equal(rleDecodeOptimized(rleEncodeOptimized(s)), s);
});
