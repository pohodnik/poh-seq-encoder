import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { unlinkSync, writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEQ = join(__dirname, "..", "bin", "seq.js");

const run = (args, input) => {
  const res = spawnSync(process.execPath, [SEQ, ...args], {
    input,
    encoding: "utf8",
  });
  return {
    stdout: (res.stdout || "").trim(),
    stderr: (res.stderr || "").trim(),
    status: res.status,
  };
};

const tmpFile = (content) => {
  const path = join(tmpdir(), `seq-test-${Date.now()}-${Math.random()}.txt`);
  if (content !== undefined) writeFileSync(path, content, "utf8");
  return path;
};

test("cli: encode from args — format check", () => {
  const { stdout, status } = run(["encode", "1", "2", "3", "4", "5"]);
  assert.equal(status, 0);
  assert.match(stdout, /^1:192:.+$/);
});

test("cli: encode → decode via file (UTF-8 safe)", () => {
  const tmp = tmpFile();
  try {
    const { status: encStatus } = run(["encode", "-o", tmp, "1", "2", "3", "4", "5"]);
    assert.equal(encStatus, 0);
    const { stdout: decOut, status: decStatus } = run(["decode", "-f", tmp]);
    assert.equal(decStatus, 0);
    assert.equal(decOut, "[1,2,3,4,5]");
  } finally {
    try { unlinkSync(tmp); } catch {}
  }
});

test("cli: roundtrip via args", () => {
  const { stdout, status } = run(["roundtrip", "1", "2", "3", "4", "5"]);
  assert.equal(status, 0);
  assert.match(stdout, /roundtrip OK/);
});

test("cli: stdin json — format check", () => {
  const { stdout, status } = run(["encode", "-i"], "[1,2,3,4,5]");
  assert.equal(status, 0);
  assert.match(stdout, /^1:192:.+$/);
});

test("cli: csv via stdin — format check", () => {
  const { stdout, status } = run(["encode", "-i", "-c"], "1,2,3,4,5");
  assert.equal(status, 0);
  assert.match(stdout, /^1:192:.+$/);
});

test("cli: unknown command exits non-zero", () => {
  const { status, stderr } = run(["nonsense"]);
  assert.equal(status, 1);
  assert.match(stderr, /Unknown command/);
});

test("cli: no input throws", () => {
  const { status, stderr } = run(["encode"]);
  assert.equal(status, 1);
  assert.match(stderr, /No input provided/);
});

test("cli: version prints something", () => {
  const { stdout, status } = run(["--version"]);
  assert.equal(status, 0);
  assert.match(stdout, /^\d+\.\d+\.\d+$/);
});
