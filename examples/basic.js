import {
  encodePositiveIntegerSeq,
  decodePositiveIntegerSeq,
} from "../src/index.js";

const lat = [
  5322314, 5322313, 5322313, 5322314, 5322314, 5322315, 5322315, 5322316,
  5322317, 5322319, 5322320, 5322320, 5322321, 5322321, 5322321,
];

const enc = encodePositiveIntegerSeq(lat);
const dec = decodePositiveIntegerSeq(enc);

console.log("original :", lat.join(","));
console.log("encoded  :", enc);
console.log("decoded  :", dec.join(","));
console.log("match    :", JSON.stringify(lat) === JSON.stringify(dec));
console.log("raw bytes:", lat.join(",").length);
console.log("enc bytes:", enc.length);
console.log("ratio    :", (enc.length / lat.join(",").length).toFixed(2));
