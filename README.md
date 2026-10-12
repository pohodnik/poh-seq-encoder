# seq-encoder

Compact encoding for sequences of non-negative integers using **delta encoding**
and **RLE over the Unicode BMP**. Designed for telemetry, GPS tracks, time series
and any data where consecutive values change by small amounts.

- 🪶 Zero runtime dependencies
- ⚡ O(n) encode and decode
- 🧮 Works in any JavaScript runtime with `String.fromCodePoint` (Node 18+, all modern browsers)
- 🖥️ CLI included
- 📘 TypeScript types included
- 🧪 100% test coverage of public API

## Installation

```bash
npm install poh-seq-encoder
```

## Usage

### Library

```js
import {
  encodePositiveIntegerSeq,
  decodePositiveIntegerSeq,
} from "poh-seq-encoder";

const lat = [5322314, 5322313, 5322313, 5322314, 5322315];
const encoded = encodePositiveIntegerSeq(lat);
// "5322314:193:ÀÁÂ..."

const decoded = decodePositiveIntegerSeq(encoded);
// [5322314, 5322313, 5322313, 5322314, 5322315]
```

### CLI

```bash
# encode from arguments
seq encode 1 2 3 4 5

# decode
seq decode "1:192:ÀÁÂÃÄ"

# round-trip check
seq roundtrip 1 2 3 4 5 6 7 8 9

# stats
seq encode -s -f numbers.json

# from stdin
echo "[1,2,3,4,5]" | seq encode -i
```

Aliases: `seq-encode`, `seq-decode`.

## How it works

1. **Delta encoding**: последовательность заменяется на разности `numbers[i] - numbers[i-1]`.
2. **Unicode mapping**: все diff'ы сдвигаются в диапазон code points ≥ `U+00C0` (192).
   Сдвиг выбирается так, чтобы минимальный diff попал ровно в `U+00C0` (или выше,
   если `minDif >= 0`).
3. **RLE**: последовательность code points сжимается run-length encoding.
   Счётчики пишутся десятичными цифрами после символа.

Формат результата: `first:zeroUnicodeIndex:rle`

## API

### `encodePositiveIntegerSeq(numbers)`

Кодирует массив неотрицательных целых чисел.

- `numbers: number[]` — массив неотрицательных целых чисел, длина ≥ 1
- Returns: `string`
- Throws:
  - `TypeError` если вход не массив, пуст, или содержит нецелые/отрицательные значения
  - `Error` если данные выходят за пределы BMP (`U+FFFF`)

### `decodePositiveIntegerSeq(str)`

Декодирует строку, полученную из `encodePositiveIntegerSeq`.

- `str: string`
- Returns: `number[]`
- Throws:
  - `TypeError` если вход не строка
  - `Error` если формат строки некорректен

### Вспомогательные

- `rleEncodeOptimized(str): string`
- `rleDecodeOptimized(str): string`
- `S_OFFSET`, `S_DIV` — константы формата

## CLI

| Команда | Описание |
|---|---|
| `seq encode [numbers...]` | Кодирует последовательность |
| `seq decode <string>` | Декодирует строку |
| `seq roundtrip [numbers...]` | Кодирует и проверяет декодирование |
| `seq info [numbers...]` | Статистика сжатия |

| Опция | Описание |
|---|---|
| `-f, --file <path>` | Читать из файла (JSON или CSV) |
| `-i, --stdin` | Читать из stdin |
| `-j, --json` | Вход — JSON-массив |
| `-c, --csv` | Вход — CSV |
| `-o, --out <path>` | Записать в файл |
| `-s, --stats` | Показать статистику сжатия |
| `-v, --version` | Версия пакета |
| `-h, --help` | Справка |

## Format guarantees

- Все code points в закодированной строке **≥ 192** (`U+00C0`).
- Символы **не пересекаются** с ASCII-цифрами `0..9` (48–57), поэтому RLE-счётчики
  не конфликтуют с данными.
- Разделитель `:` (58) также не пересекается с данными.

## Constraints

- Данные должны влезать в BMP: `zeroUnicodeIndex + maxDif ≤ 0xFFFF`.
- Для разностей > ~65300 `encode` бросит ошибку.

## Testing

```bash
npm test               # node:test
npm run test:types     # tsc --noEmit
npm run test:all       # both
```

## Benchmark

```bash
npm run bench
```

## License

MIT
