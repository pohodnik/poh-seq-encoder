#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import {
  encodePositiveIntegerSeq,
  decodePositiveIntegerSeq,
} from "../src/index.js";

const USAGE = `
seq — compact encoder for sequences of non-negative integers

Usage:
  seq encode [options] [<numbers>...]
  seq decode [options] <string>
  seq roundtrip [options] <numbers>...
  seq info [options] <numbers>...

Options:
  -f, --file <path>    Read input from file instead of arguments
  -i, --stdin          Read input from stdin
  -j, --json           Treat input as JSON array (default when reading file/stdin)
  -c, --csv            Treat input as comma-separated values
  -o, --out <path>     Write output to file instead of stdout
  -s, --stats          Print compression stats (raw vs encoded bytes)
  -v, --version        Print version
  -h, --help           Show this help

Examples:
  seq encode 1 2 3 4 5
  seq encode -f numbers.json
  echo "[1,2,3,4,5]" | seq encode -i
  seq decode "42:192:À"
  seq roundtrip 1 2 3 4 5
  seq info -f numbers.json
`.trim();

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "-f":
      case "--file":
        args.file = argv[++i];
        break;
      case "-i":
      case "--stdin":
        args.stdin = true;
        break;
      case "-j":
      case "--json":
        args.json = true;
        break;
      case "-c":
      case "--csv":
        args.csv = true;
        break;
      case "-o":
      case "--out":
        args.out = argv[++i];
        break;
      case "-s":
      case "--stats":
        args.stats = true;
        break;
      case "-v":
      case "--version":
        args.version = true;
        break;
      case "-h":
      case "--help":
        args.help = true;
        break;
      default:
        args._.push(a);
    }
  }
  return args;
}

function readStdin() {
  try {
    return readFileSync(0, "utf8").trim();
  } catch {
    return "";
  }
}

function parseNumbers(args, positional) {
  let raw;

  if (args.stdin) {
    raw = readStdin();
  } else if (args.file) {
    raw = readFileSync(args.file, "utf8").trim();
  } else if (positional.length > 0) {
    return positional.map((s) => {
      const n = Number(s);
      if (!Number.isFinite(n)) throw new Error(`Invalid number: ${s}`);
      return n;
    });
  } else {
    throw new Error("No input provided. Use arguments, --file, or --stdin.");
  }

  if (args.csv || (!args.json && raw.includes(",") && !raw.startsWith("["))) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    return parts.map((s) => {
      const n = Number(s);
      if (!Number.isFinite(n)) throw new Error(`Invalid number: ${s}`);
      return n;
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON input must be an array of numbers");
  }

  return parsed.map((n) => {
    if (!Number.isFinite(n)) throw new Error(`Invalid number: ${n}`);
    return n;
  });
}

function writeOutput(args, text) {
  if (args.out) {
    writeFileSync(args.out, text, "utf8");
    process.stderr.write(`Written to ${args.out}\n`);
  } else {
    process.stdout.write(text + "\n");
  }
}

function printStats(numbers, encoded) {
  const rawSize = JSON.stringify(numbers).length;
  const encSize = encoded.length;
  const ratio = rawSize / encSize;
  const savings = (1 - encSize / rawSize) * 100;

  console.error("--- stats ---");
  console.error(`items         : ${numbers.length}`);
  console.error(`raw bytes     : ${rawSize}`);
  console.error(`encoded bytes : ${encSize}`);
  console.error(`ratio         : ${ratio.toFixed(2)}x`);
  console.error(`savings       : ${savings.toFixed(1)}%`);
}

function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0) {
    console.error(USAGE);
    process.exit(1);
  }

  if (argv[0] === "-v" || argv[0] === "--version") {
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    console.log(pkg.version);
    process.exit(0);
  }

  if (argv[0] === "-h" || argv[0] === "--help") {
    console.log(USAGE);
    process.exit(0);
  }

  const command = argv[0];
  const args = parseArgs(argv.slice(1));

  if (args.version) {
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    console.log(pkg.version);
    process.exit(0);
  }

  if (args.help) {
    console.log(USAGE);
    process.exit(0);
  }

  try {
    switch (command) {
      case "encode": {
        const numbers = parseNumbers(args, args._);
        const encoded = encodePositiveIntegerSeq(numbers);
        writeOutput(args, encoded);
        if (args.stats) printStats(numbers, encoded);
        break;
      }

      case "decode": {
        const input = args.stdin
          ? readStdin()
          : args.file
            ? readFileSync(args.file, "utf8").trim()
            : args._[0];

        if (!input) throw new Error("No input provided.");
        const decoded = decodePositiveIntegerSeq(input);
        writeOutput(args, JSON.stringify(decoded));

        if (args.stats) {
          console.error("--- stats ---");
          console.error(`items         : ${decoded.length}`);
          console.error(`encoded bytes : ${input.length}`);
          console.error(`raw bytes     : ${JSON.stringify(decoded).length}`);
        }
        break;
      }

      case "roundtrip": {
        const numbers = parseNumbers(args, args._);
        const encoded = encodePositiveIntegerSeq(numbers);
        const decoded = decodePositiveIntegerSeq(encoded);

        const ok =
          decoded.length === numbers.length &&
          decoded.every((v, i) => v === numbers[i]);

        if (args.stats) printStats(numbers, encoded);

        console.log(ok ? "✅ roundtrip OK" : "❌ roundtrip FAILED");
        if (!ok) {
          for (let i = 0; i < Math.max(decoded.length, numbers.length); i++) {
            if (decoded[i] !== numbers[i]) {
              console.error(
                `  mismatch[${i}]: expected ${numbers[i]}, got ${decoded[i]}`,
              );
              break;
            }
          }
          process.exit(2);
        }
        break;
      }

      case "info": {
        const numbers = parseNumbers(args, args._);
        const encoded = encodePositiveIntegerSeq(numbers);
        printStats(numbers, encoded);
        console.log("--- preview ---");
        console.log(encoded.slice(0, 200) + (encoded.length > 200 ? "…" : ""));
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        console.error(USAGE);
        process.exit(1);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
