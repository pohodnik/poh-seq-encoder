import {
  encodePositiveIntegerSeq,
  decodePositiveIntegerSeq,
} from "../src/index.js";

const N = 100_000;

function makeSeries() {
  const arr = new Array(N);
  let v = 5_000_000;
  for (let i = 0; i < N; i++) {
    v += (i % 7) - 3;
    arr[i] = v;
  }
  return arr;
}

const data = makeSeries();
console.log(`Sequence length: ${N}`);

let t = performance.now();
const enc = encodePositiveIntegerSeq(data);
const encTime = performance.now() - t;

t = performance.now();
const dec = decodePositiveIntegerSeq(enc);
const decTime = performance.now() - t;

console.log(`encode: ${encTime.toFixed(2)} ms`);
console.log(`decode: ${decTime.toFixed(2)} ms`);
console.log(`raw size: ${data.join(",").length} chars`);
console.log(`enc size: ${enc.length} chars`);
console.log(`ratio: ${(enc.length / data.join(",").length).toFixed(4)}`);
console.log(`match: ${JSON.stringify(dec) === JSON.stringify(data)}`);
