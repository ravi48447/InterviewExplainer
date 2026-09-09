#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/api-consumption-basics/json-parsing-python/complete-qa.json",
);

const presentations = {
  "python-parse-and-generate-json": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define JSON as text rather than a Python object store",
        stage: "JSON is a text format",
        spokenText: "Python's `json` module converts between JSON text and ordinary Python values. It does not save arbitrary Python objects exactly as they are. Decoding creates new dictionaries, lists, strings, numbers, Booleans, or `None`; encoding chooses JSON text that another language can read.",
      },
      {
        cue: "Choose loads or load from the source boundary",
        stage: "Use loads for text",
        spokenText: "Use `json.loads(text)` when JSON is already in memory as a string, bytes, or bytearray. Use `json.load(file)` when an open readable file-like object is the source. Both decode one JSON document; the difference is where the input comes from.",
      },
      {
        cue: "Choose dumps or dump from the destination boundary",
        stage: "Use dumps to return text",
        spokenText: "Use `json.dumps(value)` when the caller needs a JSON string. Use `json.dump(value, file)` to write JSON text to an open writable file-like object. The encoder returns or writes text, not raw network bytes, so a binary protocol still needs an explicit encoding such as UTF-8.",
      },
      {
        cue: "Show the common JSON-to-Python type mappings",
        stage: "Types map by simple rules",
        spokenText: "A JSON object becomes a Python `dict`, an array becomes `list`, strings remain `str`, whole numbers normally become `int`, decimal numbers normally become `float`, and `true`, `false`, and `null` become `True`, `False`, and `None`. Python-only values such as `datetime`, `set`, or a custom class need a documented representation.",
        support: {
          type: "comparison",
          title: "Common values on each side of the boundary",
          items: [
            { label: "object", value: "dict", detail: "JSON names are strings.", tone: "blue" },
            { label: "array", value: "list", detail: "Tuple identity is not preserved.", tone: "blue" },
            { label: "true / false", value: "True / False", detail: "JSON and Python use different spelling.", tone: "green" },
            { label: "null", value: "None", detail: "A present null is still different from a missing key.", tone: "orange" },
          ],
        },
      },
      {
        cue: "Separate valid JSON syntax from valid application data",
        stage: "Parse first, validate next",
        spokenText: "Malformed JSON raises `json.JSONDecodeError`, but successful decoding proves only that the text is valid JSON. The result could still be a list when the API promised an object, or contain a string where a number is required. Parse at the boundary, then check the exact fields and types before using the value.",
        support: {
          type: "code",
          title: "Decode and check the promised shape",
          language: "python",
          code: "data = json.loads(text)\nif not isinstance(data, dict):\n    raise ValueError(\"expected a JSON object\")\nif not isinstance(data.get(\"name\"), str):\n    raise ValueError(\"name must be a string\")",
          caption: "Parsing answers whether the text is JSON; these checks answer whether it is the JSON this function accepts.",
        },
        recallRule: "Loads and load decode; dumps and dump encode; validation is a separate step after decoding.",
      },
    ],
  },
  "api-consumption-basics-json-parsing-python-when-to-use": {
    answerSize: "standard",
    beats: [
      {
        cue: "Reduce four function names to direction and boundary",
        stage: "Make two small decisions",
        spokenText: "The four JSON functions come from two choices. First choose the direction: `load` functions decode JSON into Python, while `dump` functions encode Python into JSON. Then choose the boundary: the name ending in `s` works with an in-memory string-like value, while the shorter name works with a file-like stream.",
        support: {
          type: "comparison",
          title: "Match the function to the input or output",
          items: [
            { label: "JSON text → Python", value: "loads", detail: "Pass a string, bytes, or bytearray.", tone: "blue" },
            { label: "file → Python", value: "load", detail: "Pass an open readable file-like object.", tone: "green" },
            { label: "Python → JSON text", value: "dumps", detail: "Receive a Python string.", tone: "blue" },
            { label: "Python → file", value: "dump", detail: "Pass an open writable text file-like object.", tone: "green" },
          ],
        },
      },
      {
        cue: "Show the decoding choice with one in-memory and one stream source",
        stage: "Load means decode",
        spokenText: "Use `json.loads(response_text)` when raw JSON text is already in memory. Use `json.load(config_file)` when the source is an open file or `StringIO`. Both return a Python value. The file form makes the I/O boundary visible and avoids a separate `read()` call when a stream already exists.",
      },
      {
        cue: "Show the encoding choice with one returned and one written result",
        stage: "Dump means encode",
        spokenText: "Use `json.dumps(settings)` when a function should return JSON text. Use `json.dump(settings, destination)` when it should write that text to a file-like object. `dumps` returns `str`, not `bytes`, and `dump` expects a destination that accepts text.",
      },
      {
        cue: "Avoid decoding a body that the HTTP library already decoded",
        stage: "Know what value you have",
        spokenText: "Requests `response.json()` already returns a Python value. Calling `json.loads(response.json())` tries to decode that dictionary or list as if it were JSON text and usually raises a type error. Either use `response.json()` or decode `response.text`; do not perform both operations on the same body.",
      },
      {
        cue: "Keep document framing separate from the JSON conversion function",
        stage: "One call writes one document",
        spokenText: "Repeatedly calling `json.dump()` into the same file does not automatically create a valid sequence of JSON records. Choose one JSON array or a documented format such as JSON Lines. The example uses all four functions once and shows that each choice changes only the I/O boundary, not the meaning of the decoded value.",
        support: {
          type: "code",
          title: "Use all four functions at their natural boundary",
          language: "python",
          code: "source = StringIO('{\"limit\": 20}')\nsettings = json.load(source)\ntext = json.dumps(settings)\ncopy = json.loads(text)\njson.dump(copy, destination)",
          caption: "The source and destination objects choose load/dump; in-memory text chooses loads/dumps.",
        },
        recallRule: "No s means a stream; s means a string-like value. Load decodes, and dump encodes.",
      },
    ],
  },
  "api-consumption-basics-json-parsing-python-common-mistake": {
    answerSize: "standard",
    beats: [
      {
        cue: "Separate JSON grammar from the API's data contract",
        stage: "Valid JSON may still be wrong",
        spokenText: "The decoder checks JSON syntax and performs basic type conversion. It does not prove that the top level is an object, that required fields exist, or that a value satisfies a business rule. A valid payload such as `[1, 2]` is still wrong when the client expects an object with a numeric `price`.",
      },
      {
        cue: "Validate containers, fields, types, and business rules in order",
        stage: "Use three validation gates",
        spokenText: "First catch malformed JSON. Next check the expected container and field types. Finally apply business rules such as `price >= 0` or an allowed currency code. Keeping these gates separate produces clearer errors and stops bad data near the API boundary instead of letting it fail later.",
        support: {
          type: "trace",
          title: "From response text to a safe application value",
          items: [
            { label: "Grammar", value: "does it parse?", detail: "Invalid syntax becomes a decode error.", tone: "blue" },
            { label: "Shape", value: "right fields and types?", detail: "Check the container and contract.", tone: "orange" },
            { label: "Meaning", value: "allowed value?", detail: "Apply ranges and business rules.", tone: "green" },
          ],
        },
      },
      {
        cue: "Preserve the difference between an omitted field and an explicit null",
        stage: "Missing differs from null",
        spokenText: "`{}` omits `middle_name`, while `{\"middle_name\": null}` sends the field with a null value. During an update, omission may mean 'leave it unchanged' and null may mean 'clear it'. `data.get(\"middle_name\")` returns `None` for both, so check `\"middle_name\" in data` when that difference matters.",
      },
      {
        cue: "Choose portable forms for values JSON does not define",
        stage: "Python-only types need a form",
        spokenText: "JSON has no built-in value for `datetime`, `Decimal`, `set`, raw bytes, or an application object. Convert each one to a documented form, such as an ISO 8601 timestamp or a decimal string. JSON object names are strings, and tuples decode as lists, so encoding is not a perfect Python round trip.",
      },
      {
        cue: "Keep exact numbers exact and strict output portable",
        stage: "Numbers need a clear policy",
        spokenText: "For money or other exact decimals, `json.loads(text, parse_float=Decimal)` avoids converting a JSON decimal through binary floating point. When generating JSON for other systems, `allow_nan=False` rejects `NaN` and infinity instead of emitting non-standard tokens. The complete example combines parsing, shape checks, type checks, and a range rule.",
        support: {
          type: "code",
          title: "Keep a JSON price exact and validate it",
          language: "python",
          code: "data = json.loads(text, parse_float=Decimal)\nif not isinstance(data, dict) or not isinstance(data.get(\"price\"), Decimal):\n    raise ValueError(\"price must be a JSON decimal number\")\nif data[\"price\"] < 0:\n    raise ValueError(\"price cannot be negative\")",
          caption: "The decoder preserves decimal text, while the application checks the required shape and allowed range.",
        },
        recallRule: "Parse the grammar, validate the shape, then validate the business meaning without losing missing-versus-null information.",
      },
    ],
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, presentation] of Object.entries(presentations)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${targetSlug} question, found ${matches.length}`);
  }
  const speakable = matches[0].answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!speakable) throw new Error(`Missing speakable_answer section for ${targetSlug}`);
  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error(`Curated ${curated} of ${document.questions.length} questions`);
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated Interview Answer presentations for ${curated} Python JSON questions`);
