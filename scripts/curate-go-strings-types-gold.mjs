#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content/go-fresher/go-strings-types");

function go(source) {
  return `\`\`\`go\n${source.trim()}\n\`\`\``;
}

const topicSpecs = {
  "string-immutability": {
    title: "String Immutability",
    questions: [
      {
        question: "What does it mean that strings are immutable in Go?",
        title: "String immutability in Go",
        direct: "A Go string is an immutable sequence of bytes: after a string value is created, its bytes cannot be changed through that value. Indexing returns one byte but cannot be assigned to or addressed. Code creates a new string for a changed result, often by converting to `[]byte` for byte-oriented data or `[]rune` for Unicode code-point edits, then converting back.",
        points: [
          "A string stores a fixed sequence of bytes.",
          "`s[i]` reads one byte but cannot appear on the left of an assignment.",
          "A string may contain arbitrary bytes, not only valid UTF-8.",
          "Build a changed value instead of mutating the original.",
          "Choose bytes or runes according to the data being changed.",
        ],
        spoken: "- A Go string is an immutable sequence of bytes. `len(s)` reports the number of bytes, and `s[i]` reads the byte at one index, but code cannot assign to `s[i]` or take its address. Assigning a new string to the variable is allowed because that replaces the variable's value; it does not modify the old string.\n\n- Immutability makes string values safe to share as values and suitable for map keys. It does not guarantee that the bytes are valid UTF-8. Source string literals are UTF-8, but a string created from network or file bytes may contain any byte sequence, so Unicode-sensitive code should validate when the boundary requires valid text.\n\n- For example, converting `\"go\"` to `[]byte`, changing the first byte, and converting back creates `\"Go\"` while the original remains `\"go\"`. For non-ASCII text, editing a byte can break an encoding, so converting to `[]rune` is safer when the operation is defined on Unicode code points.\n\n- Immutability is a semantic rule rather than a promise about one internal allocation. The compiler may optimize conversions when no observable mutation is possible, but the program must behave as if the resulting string never changes. I treat strings as text or immutable bytes and create explicit new values for transformations.",
        overviewTitle: "The variable may change; the string value does not",
        overview: "A variable is a storage location that can be assigned repeatedly. A string value is the byte sequence held on one assignment. `name = strings.ToUpper(name)` points the variable at a newly produced value; it does not edit the previous sequence in place.\n\nThis distinction prevents aliases from observing hidden string mutation. Mutable work belongs in a byte slice, rune slice, builder, or another buffer whose ownership is explicit. Conversion back to string establishes the immutable result expected by string APIs.",
        visual: {
          type: "flow_diagram",
          title: "Transform instead of mutating",
          content: "```mermaid\nflowchart LR\n  A[original immutable string] --> B[convert to bytes or runes]\n  B --> C[modify owned mutable data]\n  C --> D[convert to new string]\n  A -. remains unchanged .-> E[original readers]\n```",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    original := "go"
    changed := []byte(original)
    changed[0] = 'G'
    result := string(changed)
    fmt.Println(original, result)
}`),
        exampleTitle: "Create a changed string through owned bytes",
        exampleNote: "The output is `go Go`. Mutating the byte slice does not change the original string value.",
        testing: "Whether immutability is separated from variable reassignment, UTF-8 validity, and compiler allocation choices.",
        commonMistake: "Trying to assign to a string index or assuming every indexed byte is one complete character.",
        depthSignal: "Explain why byte and rune transformations serve different kinds of input.",
      },
      {
        question: "How do you safely modify text stored in a Go string?",
        title: "Changing strings with bytes or runes",
        direct: "Create a mutable representation, change it, and build a new string. Use `[]byte` when positions and replacements are defined in encoded bytes, such as ASCII protocol data; use `[]rune` when they are defined in Unicode code points. Neither automatically understands user-perceived grapheme clusters, so text-editor-style operations may need a Unicode segmentation library.",
        points: [
          "Convert to `[]byte` for byte-oriented or known ASCII changes.",
          "Convert to `[]rune` for Unicode code-point changes.",
          "Convert the modified slice back to a new string.",
          "A rune is not always one user-perceived character.",
          "Validate UTF-8 when malformed external input is not allowed.",
        ],
        spoken: "- Strings cannot be edited directly, so the first step is to decide what one editable unit means. If the data is an ASCII identifier or binary protocol field, bytes are the correct units. If the operation replaces Unicode code points, `[]rune` prevents a multi-byte UTF-8 encoding from being split accidentally.\n\n- For example, the word `\"café\"` contains five bytes but four runes. Changing byte index three would touch only part of `é`, while `runes[3] = 'e'` replaces the complete code point and produces `\"cafe\"`. The rune conversion decodes the string, and converting back encodes the result as UTF-8.\n\n- Code-point safety is not the same as full human-language safety. A visible symbol may contain a base rune plus combining marks, or several runes joined into one emoji. Reversing or slicing runes can separate those units. Applications that edit user-perceived characters need grapheme segmentation and often normalization rules beyond the standard conversion.\n\n- Conversions create a clear mutable ownership boundary. For many replacements, standard functions such as `strings.ReplaceAll`, `strings.Map`, or `strings.ToUpper` express the operation directly and avoid manual indexing. I choose the highest-level operation that matches the text rule, then use bytes or runes only when index-level control is required.",
        overviewTitle: "Choose the unit before choosing the algorithm",
        overview: "The same visual text can be viewed as encoded bytes, Unicode code points, or grapheme clusters. Each layer answers a different question. Network framing often needs bytes. Case mapping and code-point filtering operate above bytes. Cursor movement in a text editor needs grapheme boundaries.\n\nGo's built-in string and rune tools cover the first two layers. They intentionally do not promise locale-aware words or user-perceived characters. Naming the layer prevents an algorithm that appears correct on ASCII from corrupting wider input.",
        visual: {
          type: "comparison_table",
          title: "Pick the transformation unit",
          content: "| Unit | Go representation | Good for | Important boundary |\n|---|---|---|---|\n| Encoded byte | `[]byte` | ASCII, protocols, raw data | Can split UTF-8 |\n| Unicode code point | `[]rune` | Code-point replacement/filtering | Can split grapheme clusters |\n| Grapheme cluster | External segmentation | Visible editing operations | Locale and normalization still matter |",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    text := "café"
    runes := []rune(text)
    runes[3] = 'e'
    fmt.Println(text, string(runes))
}`),
        exampleTitle: "Replace one Unicode code point",
        exampleNote: "The output is `café cafe`. The original stays unchanged and the multi-byte `é` is replaced as one rune.",
        testing: "Whether the learner chooses bytes, code points, or grapheme clusters from the actual text requirement.",
        commonMistake: "Treating a byte index as a character index or claiming a rune always equals one visible character.",
        depthSignal: "Name the grapheme-cluster boundary without overcomplicating ordinary code-point work.",
      },
      {
        question: "Why can repeated string concatenation be inefficient in Go?",
        title: "Efficient string construction",
        direct: "Because strings are immutable, each growing result from `result += part` may require allocating storage and copying all bytes accumulated so far. In a loop this can create repeated work. Use `strings.Builder` for text-only construction, `bytes.Buffer` when byte-oriented APIs are involved, or `strings.Join` when all pieces already exist. Simple concatenation remains clearest for a few fixed parts.",
        points: [
          "A growing immutable result may be allocated and copied repeatedly.",
          "Use `strings.Builder` for incremental string construction.",
          "Use `strings.Join` when the pieces are already collected.",
          "Use `bytes.Buffer` when byte slices or I/O methods shape the work.",
          "Keep `+` for small fixed expressions where clarity wins.",
        ],
        spoken: "- Concatenating a few fixed strings is normal and readable. The concern appears when a loop repeatedly grows one immutable result. Each new result must contain all previous bytes plus the new part, so the program may allocate and copy an increasing prefix many times. Compilers can optimize some expressions, but code should not depend on eliminating an unbounded growth pattern.\n\n- `strings.Builder` owns a mutable byte buffer behind a string-focused API. Its zero value is ready to use, `WriteString` and `WriteRune` append content, and `String` produces the accumulated text. If the approximate final size is known, `Grow` can reduce reallocations. A non-zero Builder must not be copied because copies could share internal state incorrectly.\n\n- For example, building comma-separated labels in a loop can write the separator only after the first item and then append each label. If the labels already live in a slice, `strings.Join(labels, \",\")` is even simpler and should usually be preferred.\n\n- `bytes.Buffer` is useful when the same construction participates in `io.Writer` or byte APIs. Benchmarks decide performance-sensitive cases, but the semantic choice is straightforward: fixed small expression uses `+`; known pieces use `Join`; incremental text uses `Builder`; incremental bytes use `Buffer`.",
        overviewTitle: "Match construction to how pieces arrive",
        overview: "The cost problem is cumulative copying, not the plus operator by itself. A compiler can combine simple expressions efficiently. A loop whose final size grows with input needs one owner that can reuse capacity.\n\nBuilders and buffers provide that owner. They also make the mutation phase local: callers receive the final immutable string after construction rather than sharing a writable representation. Never copy a Builder after writing has begun; pass its pointer when helper functions must contribute.",
        visual: {
          type: "comparison_table",
          title: "Choose a string construction tool",
          content: "| Input shape | Clear tool | Why |\n|---|---|---|\n| Two or three fixed parts | `+` | Direct and readable |\n| Existing slice of parts | `strings.Join` | Separator handling is built in |\n| Parts arrive incrementally | `strings.Builder` | Reuses growing text storage |\n| Byte and `io.Writer` workflow | `bytes.Buffer` | Works naturally with byte APIs |",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "strings"
)

func joinLabels(labels []string) string {
    var builder strings.Builder
    for index, label := range labels {
        if index > 0 {
            builder.WriteString(", ")
        }
        builder.WriteString(label)
    }
    return builder.String()
}

func main() {
    fmt.Println(joinLabels([]string{"go", "web", "api"}))
}`),
        exampleTitle: "Build text incrementally without repeated prefixes",
        exampleNote: "The output is `go, web, api`. One Builder owns the mutable construction state until the final string is returned.",
        testing: "Whether construction strategy follows input shape rather than a blanket ban on string concatenation.",
        commonMistake: "Replacing every small `+` expression with a Builder or copying a Builder after it has been used.",
        depthSignal: "Explain cumulative copying and distinguish `Builder`, `Join`, and `bytes.Buffer`.",
      },
    ],
  },

  "rune-vs-byte": {
    title: "Rune versus Byte",
    questions: [
      {
        question: "What is the difference between a byte and a rune in Go?",
        title: "Bytes, runes, and Unicode code points",
        direct: "`byte` is an alias for `uint8` and represents one raw byte; `rune` is an alias for `int32` and conventionally represents one Unicode code point. UTF-8 encodes one rune using one to four bytes. Use bytes for encoded data and protocols, and runes when an operation is defined on Unicode code points—not as a guarantee of one visible character.",
        points: [
          "`byte` is an alias for `uint8`.",
          "`rune` is an alias for `int32` and commonly holds a Unicode code point.",
          "UTF-8 uses one to four bytes for one valid rune.",
          "String indexing reads a byte; ranging decodes runes.",
          "One grapheme visible to a user may contain several runes.",
        ],
        spoken: "- A byte is an eight-bit unsigned integer because `byte` aliases `uint8`. It is the natural unit for files, network packets, encoded text, and arbitrary binary data. A rune aliases `int32` and is Go's conventional value for one Unicode code point, such as `'A'`, `'é'`, or `'界'`.\n\n- A Go string stores bytes, usually UTF-8 for text. ASCII code points use one byte, while many other code points use two, three, or four. Therefore `text[i]` returns a byte and may represent only one fragment of a rune. A `for range` loop decodes successive UTF-8 sequences and yields rune values.\n\n- For example, `é` has code point U+00E9 and is encoded as bytes C3 A9 in UTF-8. Printing `[]byte(\"é\")` shows two numbers, while `[]rune(\"é\")` contains one rune. Both views are correct; they answer different questions.\n\n- A rune is still not necessarily one visible character. Combining marks and joined emoji can use multiple code points. I use bytes when exact encoding and offsets matter, runes for code-point classification or transformation, and a grapheme library when the product requirement is what a person sees as one character.",
        overviewTitle: "Three layers hide behind the word character",
        overview: "A byte is a storage unit. A code point is an abstract Unicode value. UTF-8 maps a code point onto one to four bytes. A grapheme cluster groups one or more code points into a user-perceived symbol.\n\nGo names the first two layers directly through byte and rune aliases. That makes encoding decisions visible, but the programmer must still choose the layer that matches the requirement. Counting bytes, code points, and visible graphemes can legitimately produce three different answers.",
        visual: {
          type: "diagram",
          title: "One rune encoded as two bytes",
          content: "```mermaid\nflowchart LR\n  A[Unicode code point U+00E9] --> B[rune value 233]\n  B --> C[UTF-8 encoding]\n  C --> D[byte 0xC3]\n  C --> E[byte 0xA9]\n```",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    text := "é"
    fmt.Printf("bytes=% x count=%d\n", []byte(text), len([]byte(text)))
    fmt.Printf("runes=%U count=%d\n", []rune(text), len([]rune(text)))
}`),
        exampleTitle: "View one code point through both representations",
        exampleNote: "The output shows bytes `c3 a9` but one rune, U+00E9. The two counts describe encoding units and code points respectively.",
        testing: "Whether byte storage, code points, UTF-8 encoding, and grapheme clusters are kept distinct.",
        commonMistake: "Using byte and character interchangeably or promising that every rune is one visible symbol.",
        depthSignal: "Trace one non-ASCII code point through its UTF-8 byte sequence.",
      },
      {
        question: "Why does `len(\"café\")` return 5 in Go?",
        title: "String length counts UTF-8 bytes",
        direct: "`len` returns the number of bytes in a Go string. In UTF-8, `c`, `a`, and `f` use one byte each, while `é` uses two, so `len(\"café\")` is 5. `utf8.RuneCountInString` or `len([]rune(s))` counts decoded code points and returns 4 for this exact normalized spelling, but neither counts grapheme clusters in every language case.",
        points: [
          "`len(string)` always reports bytes.",
          "ASCII code points occupy one UTF-8 byte.",
          "`é` occupies two UTF-8 bytes in this spelling.",
          "Use `utf8.RuneCountInString` to count decoded runes.",
          "Rune count is not a universal visible-character count.",
        ],
        spoken: "- The built-in `len` describes a string's storage sequence, so its unit is bytes. The literal `\"café\"` is UTF-8: `c`, `a`, and `f` contribute one byte each, while U+00E9 contributes two bytes. The total is therefore five even though a reader sees four letters.\n\n- To count decoded Unicode code points, use `utf8.RuneCountInString(text)` or convert to `[]rune` and take its length. The UTF-8 package avoids allocating a rune slice when only the count is needed. For this literal, both rune-count methods produce four.\n\n- For example, printing the byte indexes from `range` produces 0, 1, 2, and 3 for the rune starts; after the two-byte `é`, the next index would advance by two. The final byte length is still five. These byte offsets are useful for slicing the original UTF-8 string at known rune boundaries.\n\n- Counting runes is not identical to counting visible symbols. `e` followed by a combining accent contains two runes but may render like precomposed `é`, which is one rune. Input normalization and grapheme segmentation are separate product decisions. I state the desired unit—bytes, code points, or graphemes—before selecting a count.",
        overviewTitle: "Length needs a named unit",
        overview: "`len` is O(1) because a string value carries its byte length. Rune counting must decode the sequence and therefore scans the bytes. That difference is another reason the language does not make `len` mean Unicode characters.\n\nA decomposed and precomposed spelling can render similarly while having different byte and rune counts. Equality also sees different bytes unless text is normalized deliberately. Storage, Unicode identity, and visual presentation are separate layers.",
        visual: {
          type: "diagram",
          title: "Five bytes, four code points",
          content: "```mermaid\nflowchart LR\n  A[c -> 1 byte] --> T[total 5 bytes]\n  B[a -> 1 byte] --> T\n  C[f -> 1 byte] --> T\n  D[é -> 2 bytes] --> T\n  T --> R[4 decoded runes]\n```",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "unicode/utf8"
)

func main() {
    text := "café"
    fmt.Println(len(text))
    fmt.Println(utf8.RuneCountInString(text))
    for index, value := range text {
        fmt.Printf("%d:%U ", index, value)
    }
    fmt.Println()
}`),
        exampleTitle: "Compare byte length, rune count, and range indexes",
        exampleNote: "The first two lines are `5` and `4`. Range indexes are byte offsets for the start of each decoded rune.",
        testing: "Whether byte length, linear rune counting, and visible-character boundaries are distinguished.",
        commonMistake: "Using `len` as a Unicode character count or assuming `len([]rune(s))` handles grapheme clusters.",
        depthSignal: "Explain why byte length is constant-time while rune counting scans the encoding.",
      },
      {
        question: "How does Go handle invalid UTF-8 while ranging over a string?",
        title: "Invalid UTF-8 during string iteration",
        direct: "A Go string may contain invalid UTF-8. When `range` encounters an invalid encoding, it yields the Unicode replacement rune U+FFFD and advances by one byte. The `unicode/utf8` package can check validity before processing. Converting an invalid string to `[]rune` follows the same replacement behaviour, so preserve `[]byte` when exact malformed bytes must remain distinguishable.",
        points: [
          "Strings can contain any bytes, including invalid UTF-8.",
          "Range emits U+FFFD for an invalid encoding.",
          "An invalid sequence advances one byte in that iteration.",
          "Use `utf8.ValidString` when valid text is a requirement.",
          "Keep bytes when exact invalid data must be preserved or diagnosed.",
        ],
        spoken: "- Go does not require every string to contain valid UTF-8. A string can hold arbitrary bytes received from a file, socket, or conversion. When a `range` loop decodes the string and encounters an invalid encoding, the value produced is the replacement rune U+FFFD, and that iteration advances one byte. Processing then continues.\n\n- This behaviour keeps iteration safe and deterministic, but it loses the distinction between different malformed bytes at the rune layer. A literal valid encoding of U+FFFD and a bad byte can both yield the replacement rune, though their range widths differ. The `utf8.DecodeRuneInString` result includes a byte width, and `utf8.ValidString` answers whether the whole input is valid.\n\n- For example, a string built from bytes `A`, `0xff`, and `B` has length three. Ranging yields `A`, U+FFFD, and `B` at byte indexes zero, one, and two. Validation returns false. The original byte slice still exposes the exact `0xff` value.\n\n- At a text boundary I normally reject, repair, or clearly document invalid UTF-8 before Unicode processing. At a diagnostic or protocol boundary I keep raw bytes so evidence is not replaced. The requirement decides whether replacement is acceptable; `range` should not be mistaken for validation.",
        overviewTitle: "Decoding is tolerant; validation is explicit",
        overview: "Range guarantees forward progress even on malformed data by consuming one byte for an invalid encoding and producing RuneError. That makes loops terminate without complex error branches. It does not certify the original sequence.\n\nValidation belongs at boundaries that promise Unicode text. If malformed bytes must be reported precisely, inspect bytes or use decoding functions that return widths. Once converted to runes, several different invalid inputs may share the same replacement value.",
        visual: {
          type: "comparison_table",
          title: "Decode a malformed three-byte string",
          content: "| Byte index | Source byte | Range result | Width |\n|---:|---:|---|---:|\n| 0 | `0x41` | `A` | 1 |\n| 1 | `0xFF` | `U+FFFD` | 1 |\n| 2 | `0x42` | `B` | 1 |",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "unicode/utf8"
)

func main() {
    text := string([]byte{'A', 0xff, 'B'})
    fmt.Println(utf8.ValidString(text), len(text))
    for index, value := range text {
        fmt.Printf("%d:%U ", index, value)
    }
    fmt.Println()
}`),
        exampleTitle: "Validate and then observe tolerant decoding",
        exampleNote: "Validation is false. Range still yields `A`, U+FFFD, and `B`, advancing one byte over the invalid value.",
        testing: "Whether tolerant range decoding is distinguished from UTF-8 validation and byte preservation.",
        commonMistake: "Assuming successful range iteration proves that the original bytes were valid UTF-8.",
        depthSignal: "Use both RuneError and width to explain why raw malformed bytes can be lost at the rune layer.",
      },
    ],
  },

  "string-iteration": {
    title: "String Iteration",
    questions: [
      {
        question: "What is the difference between indexing and ranging over a Go string?",
        title: "String indexing versus range",
        direct: "Indexing a string with `s[i]` reads the byte at byte index `i`. Ranging with `for index, r := range s` decodes UTF-8, producing the byte index where each rune begins and the rune value itself. Indexing is appropriate for bytes or known ASCII; range is the standard choice for Unicode code-point processing and replaces invalid encodings with U+FFFD.",
        points: [
          "`s[i]` returns one byte.",
          "Range decodes one rune per iteration.",
          "The range index is a byte offset, not a rune counter.",
          "Invalid UTF-8 yields U+FFFD and advances one byte.",
          "Use the representation that matches the algorithm's unit.",
        ],
        spoken: "- String indexing and ranging expose different views of the same bytes. `s[i]` returns the byte stored at one byte offset and performs no UTF-8 decoding. It is useful for delimiters in an ASCII protocol, exact encodings, and algorithms whose units are bytes. Indexing outside `0` through `len(s)-1` panics.\n\n- A range loop decodes UTF-8. Its first value is the byte offset of the current rune's first byte, and its second value is the decoded rune. For ASCII those indexes look consecutive; after a multi-byte rune, the next index skips by that encoding width. If decoding fails, range emits U+FFFD and advances one byte.\n\n- For example, ranging over `\"a界b\"` reports indexes 0, 1, and 4 because `界` occupies three UTF-8 bytes. Indexing the same string exposes five individual bytes. Neither view is more correct; the algorithm determines which view is meaningful.\n\n- I use range for classification, case mapping, and other code-point work. I use byte indexing for ASCII-only formats after that assumption is guaranteed or for raw data. When code needs both rune values and slices of the original text, range byte offsets provide safe UTF-8 boundaries for valid input.",
        overviewTitle: "One sequence, two iteration contracts",
        overview: "Indexing promises constant-time access to the stored byte sequence. Range promises sequential decoding into code points. Because UTF-8 is variable-width, random access to the nth rune requires scanning from a known boundary; a byte offset alone cannot be treated as a rune position.\n\nRange does not allocate a rune slice. Converting to `[]rune` is useful when repeated code-point indexing or reordering is required, with the additional memory cost of storing decoded int32 values.",
        visual: {
          type: "comparison_table",
          title: "Range offsets for `a界b`",
          content: "| Iteration | Byte index | Rune | UTF-8 width |\n|---:|---:|---|---:|\n| 1 | 0 | `a` | 1 |\n| 2 | 1 | `界` | 3 |\n| 3 | 4 | `b` | 1 |",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    text := "a界b"
    fmt.Println("bytes", len(text))
    for index, value := range text {
        fmt.Printf("%d:%c ", index, value)
    }
    fmt.Println()
}`),
        exampleTitle: "Observe byte offsets in a range loop",
        exampleNote: "The indexes are 0, 1, and 4. They locate rune starts in the original five-byte string.",
        testing: "Whether iteration variables, UTF-8 width, and byte-index panics are understood exactly.",
        commonMistake: "Calling the range index a character number or using arbitrary byte indexes as Unicode boundaries.",
        depthSignal: "Explain why range can decode without allocating `[]rune`.",
      },
      {
        question: "How can you find rune positions and byte offsets in a Go string?",
        title: "Rune positions and byte offsets",
        direct: "Use range when both the decoded rune and its starting byte offset are needed, and maintain a separate counter when a code-point position is also required. The range index slices the original string at rune boundaries; the counter labels decoded positions. Convert to `[]rune` only when repeated random access by rune position is worth the allocation.",
        points: [
          "Range provides the starting byte offset of each decoded rune.",
          "Maintain a separate counter for a zero-based rune position.",
          "Use byte offsets to slice the original UTF-8 string safely at boundaries.",
          "Use `[]rune` for repeated code-point indexing or mutation.",
          "Neither approach automatically finds grapheme-cluster positions.",
        ],
        spoken: "- A Go range loop already supplies the byte offset where each decoded rune begins. If an interface needs both a user-facing code-point position and an original-string offset, add a separate integer counter that increments once per iteration. The two values diverge as soon as a rune uses more than one UTF-8 byte.\n\n- For example, in `\"go界\"`, the rune positions are zero, one, and two, while the byte offsets are zero, one, and two; after the three-byte final rune, the ending byte offset is five. With a multi-byte rune earlier in the text, later offsets jump. Saving a matched range index allows slicing before that rune without re-encoding.\n\n- Converting to `[]rune` makes `runes[n]` code-point indexing easy, but the conversion scans and allocates. It also disconnects positions from the original byte offsets unless code encodes prefixes again. For one sequential search, range is simpler and more memory-efficient.\n\n- Code must define what position means in its API. A parser may require a byte offset, diagnostics may want line and code-point columns, and a text editor needs grapheme clusters. I return or label units explicitly so a caller never mistakes a byte offset for a visible-character count.",
        overviewTitle: "Carry two counters only when the API needs both units",
        overview: "Range's index is deliberately tied to the original string representation, making it suitable for slicing and protocol offsets. A manually incremented counter describes the number of decoded runes already observed. Keeping both is inexpensive during one scan.\n\nRandom code-point lookup has no constant-time byte calculation in variable-width UTF-8. A rune slice trades memory and a decoding pass for direct rune indexing. For grapheme positions, use segmentation rather than adding more assumptions to either index.",
        visual: {
          type: "comparison_table",
          title: "Choose the position representation",
          content: "| Needed result | Best starting point | Cost |\n|---|---|---|\n| One sequential scan | `range` | No rune-slice allocation |\n| Original substring boundary | Range byte index | Direct string slicing |\n| Code-point ordinal | Separate range counter | One increment per rune |\n| Repeated rune indexing | `[]rune` | Decode and allocate |\n| Visible-symbol position | Grapheme segmentation | Additional Unicode logic |",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    text := "a界bc"
    position := 0
    for offset, value := range text {
        if value == 'b' {
            fmt.Println("rune position", position)
            fmt.Println("byte offset", offset)
            fmt.Println("suffix", text[offset:])
        }
        position++
    }
}`),
        exampleTitle: "Track a code-point position beside the byte offset",
        exampleNote: "For `b`, the rune position is 2 and the byte offset is 4. The offset safely slices the original string into suffix `bc`.",
        testing: "Whether a string-position API names byte offsets, code-point positions, or grapheme positions explicitly.",
        commonMistake: "Returning a range index as a character position without documenting that it is measured in bytes.",
        depthSignal: "Compare the one-pass range approach with the allocation and benefits of a rune slice.",
      },
      {
        question: "How do you reverse a Unicode string safely in Go?",
        title: "Reversing strings by rune",
        direct: "To reverse by Unicode code points, convert the string to `[]rune`, swap runes from both ends, and convert the slice back to string. Reversing bytes corrupts multi-byte UTF-8. Rune reversal still does not preserve grapheme clusters such as combining sequences or joined emoji, so user-visible text reversal requires grapheme segmentation rather than only `[]rune`.",
        points: [
          "Do not reverse UTF-8 text byte by byte.",
          "Decode to `[]rune` for code-point reversal.",
          "Swap the left and right runes until the indexes meet.",
          "Convert the finished rune slice to a new string.",
          "Use grapheme segmentation when visible symbols must stay intact.",
        ],
        spoken: "- Reversing a string byte by byte is valid only when the data's units are bytes, such as guaranteed ASCII. UTF-8 uses variable-width encodings, so byte reversal changes the order inside a multi-byte rune and usually creates invalid text. Code-point reversal begins by decoding the string into `[]rune`.\n\n- Two indexes then move inward, swapping the rune at the left with the rune at the right. Converting the final slice back to string re-encodes each rune as UTF-8. The time complexity is linear, and the rune slice uses additional memory proportional to the number of code points.\n\n- For example, reversing `\"Go界\"` as runes produces `\"界oG\"`; the Chinese code point remains intact. Reversing the raw bytes would place its three encoding bytes in the wrong order. A stack-based solution is unnecessary because the rune slice already supports indexed swaps.\n\n- This algorithm is safe at the code-point layer, not the grapheme layer. A base letter followed by a combining accent can be separated, and a joined emoji can be reordered internally. If the product means visual characters, split into grapheme clusters with an appropriate Unicode library and reverse those clusters. The phrase “Unicode-safe” should always name which layer is preserved.",
        overviewTitle: "Reverse complete units, never fragments",
        overview: "The two-pointer algorithm is independent of encoding; correctness depends on the chosen element type. A byte slice makes each encoded byte an element. A rune slice makes each decoded code point an element. A grapheme segmenter makes each user-perceived symbol an element.\n\nThe rune solution is a good interview baseline because it demonstrates UTF-8 awareness and stays within the standard library. The grapheme boundary is the important production qualification, not a reason to return to byte reversal.",
        visual: {
          type: "comparison_table",
          title: "Two-pointer rune reversal",
          content: "| Step | Left rune | Right rune | Rune slice |\n|---:|---|---|---|\n| Start | `G` | `界` | `[G o 界]` |\n| Swap | `界` | `G` | `[界 o G]` |\n| Stop | indexes meet | | `[界 o G]` |",
        },
        code: go(String.raw`package main

import "fmt"

func reverseRunes(text string) string {
    values := []rune(text)
    for left, right := 0, len(values)-1; left < right; left, right = left+1, right-1 {
        values[left], values[right] = values[right], values[left]
    }
    return string(values)
}

func main() {
    fmt.Println(reverseRunes("Go界"))
}`),
        exampleTitle: "Reverse code points with two pointers",
        exampleNote: "The output is `界oG`. Each UTF-8 code point remains correctly encoded after the reversal.",
        testing: "Whether reversal units, complexity, and the grapheme boundary are all stated correctly.",
        commonMistake: "Reversing raw bytes or claiming rune reversal preserves every user-perceived character.",
        depthSignal: "State the O(n) time and space cost and the exact Unicode layer preserved.",
      },
    ],
  },

  "strings-package": {
    title: "The strings Package",
    questions: [
      {
        question: "When should you use `strings.Fields` instead of `strings.Split`?",
        title: "Fields versus Split",
        direct: "Use `strings.Fields` to split text around runs of Unicode whitespace while discarding leading, trailing, and repeated empty gaps. Use `strings.Split` when one exact separator defines the format and empty fields may carry meaning. `Split` does not trim pieces, and splitting on an empty separator produces UTF-8 sequences for individual code points according to the package contract.",
        points: [
          "`Fields` splits on one or more Unicode whitespace characters.",
          "`Fields` discards leading, trailing, and repeated whitespace gaps.",
          "`Split` uses one exact separator string.",
          "`Split` preserves empty fields created by adjacent separators.",
          "Choose by the input format, not by which output looks convenient once.",
        ],
        spoken: "- `strings.Fields` treats text as whitespace-separated words. It finds runs of characters for which Unicode defines whitespace and returns only non-empty fields. Leading and trailing whitespace disappear, and several spaces, tabs, or newlines between words behave as one boundary.\n\n- `strings.Split` treats one exact string as the delimiter. It preserves empty fields caused by adjacent or edge delimiters because those positions can be meaningful in a format. For example, splitting `\"a,,c\"` on comma returns `a`, an empty field, and `c`; using Fields would not parse commas at all.\n\n- For example, `Fields(\"  Go\\tweb\\nAPI  \")` returns three words without empty strings. `Split(\"  Go  \", \" \")` returns empties for the repeated spaces. Calling `TrimSpace` before `Split` removes only the edge whitespace and still leaves internal empty fields.\n\n- I use Fields for human-entered whitespace-separated input and exact Split for delimited formats whose grammar really is that simple. CSV needs a CSV parser because quoting, escaping, and newlines make plain splitting incorrect. The key boundary is whether repeated delimiters are noise or actual empty values.",
        overviewTitle: "Whitespace tokenization and delimiter parsing are different jobs",
        overview: "Fields applies a character classification and collapses runs. Split searches for exact separator occurrences and reports every segment between them. These contracts intentionally disagree on empty output because they model different data.\n\nA format may outgrow both. CSV, shell syntax, URLs, and escaped key-value files have grammars that cannot be parsed reliably by one string separator. Use the format-specific package rather than layering trimming and replacement until one sample passes.",
        visual: {
          type: "comparison_table",
          title: "How the two functions treat boundaries",
          content: "| Input and operation | Result | Meaning |\n|---|---|---|\n| `Fields(\" a  b \")` | `[a b]` | Whitespace runs collapse |\n| `Split(\"a,,b\", \",\")` | `[a \"\" b]` | Empty middle field preserved |\n| `Split(\",a,\", \",\")` | `[\"\" a \"\"]` | Edge fields preserved |\n| `Fields(\" \\t \")` | `[]` | No non-whitespace field |",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "strings"
)

func main() {
    fmt.Printf("%q\n", strings.Fields("  Go\tweb\nAPI  "))
    fmt.Printf("%q\n", strings.Split("a,,c", ","))
}`),
        exampleTitle: "Observe collapsed whitespace and preserved empty fields",
        exampleNote: "Fields returns `[\"Go\" \"web\" \"API\"]`; Split returns `[\"a\" \"\" \"c\"]`.",
        testing: "Whether tokenization rules and empty-field semantics are chosen from the real input format.",
        commonMistake: "Parsing CSV with Split or deleting meaningful empty fields by switching to Fields.",
        depthSignal: "Explain why adjacent separators are data in one contract and noise in the other.",
      },
      {
        question: "Which `strings` functions are useful for searching and trimming text?",
        title: "Searching, cutting, and trimming strings",
        direct: "Use `strings.Contains` for substring presence, `HasPrefix` and `HasSuffix` for anchored checks, and `Index` when the byte position is needed. `Cut` splits once and reports whether a separator was found. `TrimSpace` removes surrounding Unicode whitespace, while `Trim`, `TrimPrefix`, and `TrimSuffix` have different cut-set or exact-boundary contracts and should not be treated as interchangeable.",
        points: [
          "Use `Contains` for presence and `Index` when its byte offset is needed.",
          "Use `HasPrefix` or `HasSuffix` for anchored checks.",
          "Use `Cut` when splitting around the first separator and checking presence.",
          "`TrimSpace` removes surrounding Unicode whitespace.",
          "`Trim` removes a cut set of runes, not one exact substring.",
        ],
        spoken: "- The `strings` package provides small operations with intentionally different contracts. `Contains` answers whether a substring occurs. `Index` returns the byte offset of its first occurrence or -1. `HasPrefix` and `HasSuffix` require the match at one boundary, so they communicate protocol markers and filename-style checks more clearly than a general search.\n\n- `Cut(text, separator)` is useful for one key-value boundary. It returns the text before, the text after, and a Boolean indicating whether the separator existed. That Boolean distinguishes `\"mode=\"` from `\"mode\"`; blindly splitting and indexing can lose that difference or panic. Related `CutPrefix` and `CutSuffix` make exact optional boundary removal explicit.\n\n- Trimming needs equal care. `TrimSpace` removes leading and trailing Unicode whitespace. `Trim(text, \"ab\")` removes any leading or trailing `a` or `b` rune, not the exact substring `\"ab\"`. For an exact marker, use `TrimPrefix` or `TrimSuffix` and decide whether absence is acceptable.\n\n- For example, parsing `\" mode = debug \"` can trim the whole line, cut once on `=`, and trim both parts. This is suitable for a tiny controlled format. A real configuration grammar still needs validation for empty keys, duplicates, comments, and escapes. These functions make each text boundary visible but do not replace a parser.",
        overviewTitle: "Select by position and failure information",
        overview: "Search functions differ on whether they return a Boolean, an offset, or separated pieces. Boundary functions differ on whether the target is an exact string, a set of runes, or Unicode whitespace. Matching the function to the rule reduces manual slicing and accidental panics.\n\nMost returned indexes are byte offsets because Go strings are byte sequences. A match returned by a strings function is safe to use for slicing around that exact byte substring. It should not be relabeled as a rune position.",
        visual: {
          type: "comparison_table",
          title: "Choose the exact operation",
          content: "| Requirement | Function | Result detail |\n|---|---|---|\n| Is substring present? | `Contains` | Boolean |\n| Where does it start? | `Index` | Byte offset or -1 |\n| Remove exact leading marker | `TrimPrefix` / `CutPrefix` | New text; Cut also reports match |\n| Split once and detect absence | `Cut` | Before, after, found |\n| Remove surrounding whitespace | `TrimSpace` | Unicode whitespace removed |\n| Remove any edge rune from a set | `Trim` | Cut-set semantics |",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "strings"
)

func main() {
    line := strings.TrimSpace(" mode = debug ")
    key, value, found := strings.Cut(line, "=")
    fmt.Println(strings.TrimSpace(key), strings.TrimSpace(value), found)
    fmt.Println(strings.HasPrefix("go.mod", "go"), strings.Contains("gopher", "ph"))
}`),
        exampleTitle: "Parse one explicit text boundary",
        exampleNote: "The first output is `mode debug true`. Cut reports the separator instead of requiring a fragile length check.",
        testing: "Whether search position, exact boundary, cut-set, whitespace, and missing-separator semantics remain distinct.",
        commonMistake: "Using `Trim` as though its second argument were an exact prefix or suffix.",
        depthSignal: "Mention that Index returns a byte offset and Cut preserves whether the separator was present.",
      },
      {
        question: "How should `strings.Builder` be used in Go?",
        title: "Using strings.Builder correctly",
        direct: "Declare a zero-value `strings.Builder`, append text with `WriteString`, `WriteRune`, or `Write`, and call `String` for the result. Call `Grow` only when a useful size estimate exists. Do not copy a non-zero Builder; pass a pointer to helpers if needed. Use it for incremental text construction, while `strings.Join` is simpler when every piece already exists.",
        points: [
          "The zero value of `strings.Builder` is ready to use.",
          "Append with `WriteString`, `WriteRune`, or `Write`.",
          "`Grow` may reduce reallocations when size is predictable.",
          "A non-zero Builder must not be copied.",
          "Use `Join` instead when a slice of final pieces already exists.",
        ],
        spoken: "- `strings.Builder` is a mutable construction object whose purpose is producing one string efficiently. Its zero value is ready, so ordinary code writes `var b strings.Builder`, appends pieces, and calls `b.String()`. Write methods return counts and, by current contract, a nil error, which lets Builder participate in formatting and writer-style helpers.\n\n- `Grow(n)` reserves space for at least another `n` bytes when the final size can be estimated. It is an optimization, not a correctness requirement, and a negative argument panics. `Reset` discards accumulated content. The most important usage rule is that a Builder must not be copied after the first write, because copies can share its internal buffer in unsupported ways.\n\n- For example, a helper can accept `*strings.Builder` and append one HTML-free label at a time. The caller keeps one owner. If helpers need independent results, each gets its own Builder. When all strings are already in a slice with one separator, `strings.Join` removes the manual loop and is usually clearer.\n\n- Builder is text-focused; `bytes.Buffer` is often more natural when code consumes or produces byte slices and uses reader methods. I do not put a reused Builder into a long-lived shared object without explicit synchronization. Construct locally, return the immutable string, and let the temporary builder disappear.",
        overviewTitle: "One mutable owner produces one immutable result",
        overview: "Builder centralizes capacity and appends so growing text does not recreate every prefix at the source level. The zero-value design keeps local use simple. Pointer-passing maintains one owner when construction spans helpers.\n\nThe no-copy rule applies after use, so storing Builder as a casually copied struct field is risky. A short local lifetime also makes concurrency simple: each operation owns its builder, and only the resulting string crosses the boundary.",
        visual: {
          type: "flow_diagram",
          title: "Builder ownership lifecycle",
          content: "```mermaid\nflowchart LR\n  A[zero-value Builder] --> B[optional Grow]\n  B --> C[WriteString or WriteRune]\n  C --> C\n  C --> D[String result]\n  D --> E[immutable value returned]\n  C -. never copy non-zero builder .-> F[unsupported alias]\n```",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "strings"
)

func addLabel(builder *strings.Builder, label string) {
    if builder.Len() > 0 {
        builder.WriteString(" | ")
    }
    builder.WriteString(label)
}

func main() {
    var builder strings.Builder
    builder.Grow(20)
    addLabel(&builder, "Go")
    addLabel(&builder, "API")
    fmt.Println(builder.String())
}`),
        exampleTitle: "Keep one Builder owner across helpers",
        exampleNote: "The output is `Go | API`. The helper receives a pointer instead of copying the non-zero Builder.",
        testing: "Whether Builder's zero value, growth, ownership, and alternative tools are understood.",
        commonMistake: "Copying a Builder after writing, or using one where Join expresses an already-collected slice more clearly.",
        depthSignal: "Connect the no-copy rule to buffer ownership and keep the Builder's lifetime local.",
      },
    ],
  },

  "strconv-package": {
    title: "The strconv Package",
    questions: [
      {
        question: "How do you parse integers from strings in Go?",
        title: "Parsing integers with strconv",
        direct: "Use `strconv.Atoi` for a base-10 value in the platform `int` range. Use `strconv.ParseInt` or `ParseUint` when signedness, base, or bit size must be explicit. Always handle the returned error; invalid syntax and out-of-range values fail rather than silently producing a trustworthy number. Trim whitespace first only when the input contract intentionally allows it.",
        points: [
          "`Atoi` parses base-10 text into `int`.",
          "`ParseInt` returns `int64` and accepts base and bit-size controls.",
          "Base zero recognizes standard prefixes such as `0x`.",
          "The bit size defines the accepted range, not the returned Go type.",
          "Handle syntax and range errors before using the result.",
        ],
        spoken: "- `strconv.Atoi` is the convenient choice when input is a normal decimal integer and the program wants an `int`. It is equivalent to decimal `ParseInt` with the platform integer size, followed by conversion. It returns both a value and an error, so code must not discard the error for external input.\n\n- `ParseInt(text, base, bitSize)` offers control. Base 10 accepts decimal; base 0 recognizes prefixes such as `0b`, `0`, and `0x` according to integer-literal-style rules. The bit size can be 0, 8, 16, 32, or 64 and restricts the accepted range. The function still returns `int64`; code converts after a successful range-checked parse. `ParseUint` handles unsigned input.\n\n- For example, parsing an HTTP port with `ParseUint(value, 10, 16)` rejects negative numbers, non-decimal syntax, and values above 65535. Application validation can then reject zero if zero has no meaning. Parsing and domain validation are two different checks.\n\n- These functions do not treat surrounding spaces as harmless. If a form contract permits spaces, call `strings.TrimSpace` explicitly so the policy is visible. On error, `strconv` may also return a boundary value, but that value must not be treated as successful input. I branch on the error first and add context at the boundary.",
        overviewTitle: "Parsing answers syntax and representation; validation answers meaning",
        overview: "The parser determines whether text represents a number in the selected base and range. It cannot decide whether that number is a valid port, age, page size, or business identifier. Separate those phases so error messages stay specific.\n\nBit size prevents a later narrowing conversion from silently changing the value. Parse directly for the destination range, then convert after success. Base zero is useful for language-like numeric input but usually too permissive for a decimal-only user field.",
        visual: {
          type: "flow_diagram",
          title: "Safe integer input pipeline",
          content: "```mermaid\nflowchart LR\n  A[raw text] --> B[optional documented trim]\n  B --> C[ParseInt or ParseUint with base + bits]\n  C --> D{parse error?}\n  D -- Yes --> E[reject with context]\n  D -- No --> F[domain range and meaning checks]\n  F --> G[convert to destination type]\n```",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "strconv"
)

func parsePort(text string) (uint16, error) {
    value, err := strconv.ParseUint(text, 10, 16)
    if err != nil {
        return 0, fmt.Errorf("port %q: %w", text, err)
    }
    if value == 0 {
        return 0, fmt.Errorf("port must be positive")
    }
    return uint16(value), nil
}

func main() {
    port, err := parsePort("8080")
    fmt.Println(port, err)
}`),
        exampleTitle: "Parse directly into the valid representation range",
        exampleNote: "The output is `8080 <nil>`. Syntax and uint16 range are checked by strconv; the function separately enforces a positive domain value.",
        testing: "Whether base, signedness, bit size, parse errors, and domain validation are treated separately.",
        commonMistake: "Discarding the parse error or parsing at 64 bits before narrowing unchecked to a smaller integer.",
        depthSignal: "Explain that bit size controls accepted range although ParseInt and ParseUint return 64-bit results.",
      },
      {
        question: "How do you convert numbers to strings in Go?",
        title: "Formatting numbers as text",
        direct: "Use `strconv.Itoa` for a decimal `int`, `strconv.FormatInt` or `FormatUint` when the integer width or base matters, and `strconv.FormatFloat` for controlled floating-point text. Do not use `string(number)` for decimal digits: converting an integer to string encodes it as one Unicode code point, so `string(65)` is `\"A\"`, not `\"65\"`.",
        points: [
          "`Itoa` formats an `int` in base 10.",
          "`FormatInt` and `FormatUint` support bases 2 through 36.",
          "`FormatFloat` controls notation, precision, and source bit size.",
          "`string(integer)` represents one Unicode code point.",
          "Use `fmt.Sprintf` when text combines several differently formatted values.",
        ],
        spoken: "- Number-to-text conversion is formatting, so the function must know the desired notation. `strconv.Itoa(n)` returns decimal text for an `int`. `FormatInt(value, base)` and `FormatUint` handle other widths and bases; the base ranges from 2 through 36. These functions avoid a format string when only one basic value is being converted.\n\n- Integer-to-string language conversion has a different meaning. `string(65)` encodes Unicode code point 65 and produces `\"A\"`. It does not spell the decimal digits. This historical conversion is easy to misuse, and `go vet` reports suspicious integer-to-string conversions in common cases. Use `strconv` for numeric text and `utf8.AppendRune` or explicit rune conversion when a code point is truly intended.\n\n- For example, `Itoa(65)` is `\"65\"`, `FormatInt(65, 2)` is `\"1000001\"`, and `string(rune(65))` is `\"A\"`. Each result is correct for a different contract. `FormatFloat` similarly needs a format, precision, and bit size because decimal floating-point presentation is a policy choice.\n\n- `fmt.Sprintf` is clearer when one sentence combines labels, widths, and several value types. For a hot loop converting one primitive, strconv avoids parsing a format string and communicates the exact conversion. I pick the function from the desired external representation, never from a superficial type cast.",
        overviewTitle: "A code point and a decimal representation are unrelated conversions",
        overview: "An integer can represent a quantity, bit pattern, enum, or Unicode code point. The compiler cannot infer which textual meaning the application wants. `strconv` names numeric representation; integer-to-string conversion names code-point encoding.\n\nFormatting bases are useful for diagnostics, protocols, and identifiers but are not locale-aware. Thousands separators, currencies, and human locale rules need a presentation layer rather than manual insertion around strconv output.",
        visual: {
          type: "comparison_table",
          title: "The value 65 under different text contracts",
          content: "| Expression | Contract | Result |\n|---|---|---|\n| `strconv.Itoa(65)` | Decimal integer | `\"65\"` |\n| `strconv.FormatInt(65, 2)` | Base-two integer | `\"1000001\"` |\n| `string(rune(65))` | Unicode code point | `\"A\"` |\n| `fmt.Sprintf(\"id=%d\", 65)` | Formatted message | `\"id=65\"` |",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "strconv"
)

func main() {
    fmt.Println(strconv.Itoa(65))
    fmt.Println(strconv.FormatInt(65, 2))
    fmt.Println(string(rune(65)))
}`),
        exampleTitle: "Compare decimal, binary, and code-point text",
        exampleNote: "The outputs are `65`, `1000001`, and `A`. Each operation states a different representation explicitly.",
        testing: "Whether numeric formatting is kept distinct from integer-to-Unicode conversion.",
        commonMistake: "Using `string(n)` when decimal digits are required, or converting a parsed 64-bit result before checking its range.",
        depthSignal: "State why go vet warns about suspicious integer-to-string conversions.",
      },
      {
        question: "How should Boolean and floating-point strings be parsed in Go?",
        title: "Parsing booleans and floating-point values",
        direct: "Use `strconv.ParseBool` for the accepted Boolean spellings and `strconv.ParseFloat` with bit size 32 or 64 for floating-point text. Handle `*strconv.NumError` through the returned error rather than assuming invalid input becomes zero. Decide separately whether whitespace, NaN, infinities, or application ranges are permitted, because syntactic parsing does not enforce the full domain contract.",
        points: [
          "`ParseBool` accepts a documented fixed set of true and false spellings.",
          "`ParseFloat` uses bit size 32 or 64 and returns `float64`.",
          "A 32-bit parse returns a value representable as `float32`.",
          "Parsing errors include syntax and range failures.",
          "Validate NaN, infinity, and domain ranges after successful parsing.",
        ],
        spoken: "- `strconv.ParseBool` does not accept every natural-language Boolean word. It recognizes a documented set including `1`, `t`, `T`, several forms of `true`, and corresponding zero or false forms. If an API wants `yes/no`, that is an application grammar and should be translated explicitly rather than assumed to be part of strconv.\n\n- `ParseFloat(text, bitSize)` accepts floating-point syntax and returns a `float64`. With bit size 32, the result can be converted to `float32` without changing the represented value selected by the parse. Range and syntax problems are returned as errors, commonly through `*strconv.NumError`.\n\n- For example, a percentage parser can call `ParseFloat(text, 64)`, reject an error, then require a finite value between zero and one hundred. Parsing `NaN` can succeed because it is valid floating-point text, yet a percentage containing NaN would violate the domain and break ordinary comparisons. Infinite values need the same deliberate policy.\n\n- Surrounding whitespace is not silently removed, so trim only when the input contract permits it. I keep parsing and validation separate: strconv answers whether the representation is valid for the numeric type, while application checks answer whether that value makes sense for this field.",
        overviewTitle: "A valid floating-point token may still be invalid business data",
        overview: "Numeric syntax includes values that ordinary domain ranges rarely want. NaN is unordered, positive and negative infinity are unbounded, and a syntactically valid finite number can still exceed a percentage or coordinate limit. The parse result is only the first gate.\n\nBoolean parsing also expresses a protocol choice. Using ParseBool is helpful when its documented grammar matches the boundary. A custom small switch is clearer when the product intentionally uses different words.",
        visual: {
          type: "flow_diagram",
          title: "Float input has two validation gates",
          content: "```mermaid\nflowchart LR\n  A[text] --> B[ParseFloat syntax + representation]\n  B --> C{error?}\n  C -- Yes --> D[invalid numeric text]\n  C -- No --> E[finite and domain range checks]\n  E --> F{allowed?}\n  F -- No --> G[valid number, invalid field value]\n  F -- Yes --> H[use value]\n```",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "math"
    "strconv"
)

func parsePercent(text string) (float64, error) {
    value, err := strconv.ParseFloat(text, 64)
    if err != nil {
        return 0, err
    }
    if math.IsNaN(value) || math.IsInf(value, 0) || value < 0 || value > 100 {
        return 0, fmt.Errorf("percentage must be finite and between 0 and 100")
    }
    return value, nil
}

func main() {
    value, err := parsePercent("87.5")
    fmt.Println(value, err)
}`),
        exampleTitle: "Validate meaning after a successful float parse",
        exampleNote: "The output is `87.5 <nil>`. NaN, infinity, and out-of-range finite values are rejected by the domain layer.",
        testing: "Whether strconv grammar, error handling, floating-point special values, and application rules stay separate.",
        commonMistake: "Checking only the parse error and allowing NaN or infinity into a domain that assumes ordered finite values.",
        depthSignal: "Explain the bit-size result rule and why ParseBool is a fixed grammar rather than natural-language interpretation.",
      },
    ],
  },

  "type-conversion-vs-assertion": {
    title: "Type Conversion versus Assertion",
    questions: [
      {
        question: "What is the difference between a type conversion and a type assertion in Go?",
        title: "Type conversions versus type assertions",
        direct: "A conversion `T(x)` produces a value of type `T` when the language permits conversion from the static type of `x`; it is checked from known types at compile time, though representation changes can lose information. A type assertion `x.(T)` applies only to an interface expression and checks at runtime whether its dynamic value has concrete type `T` or implements interface `T`.",
        points: [
          "Conversion syntax is `T(x)` and starts from a statically known source type.",
          "Assertion syntax is `x.(T)` and requires `x` to have interface type.",
          "Numeric conversions may truncate or otherwise change represented values.",
          "Use the two-result assertion to handle a possible mismatch safely.",
          "Neither operation is the same as parsing text such as `\"42\"` into a number.",
        ],
        spoken: "- A conversion asks the language to represent a statically typed value as another permitted type. The syntax is `T(x)`. For example, `float64(count)` converts an integer value for floating-point arithmetic, and `[]byte(text)` converts a string's contents into a byte slice. Whether that conversion is legal is determined from the source and destination types during compilation.\n\n- A type assertion starts with an interface value. `value.(string)` asks at runtime whether the dynamic value stored in the interface has the concrete type string. When the target is another interface, it asks whether the dynamic type implements that interface. `result, ok := value.(T)` reports failure without panicking; the one-result form panics on mismatch.\n\n- For example, converting `int64(300)` to `uint8` is legal but produces 44 because only the low eight bits remain. Asserting an `any` value containing `int64(300)` to `uint8` does not perform that conversion; it fails because the dynamic concrete type is `int64`. Code must first assert `int64`, then deliberately convert if the range policy allows it.\n\n- Parsing is a third operation. `int(\"42\")` is not a numeric parse, so text uses `strconv.Atoi` or a related function. I name the operation precisely: conversion changes a permitted representation, assertion discovers an interface's dynamic type, and parsing interprets external text.",
        overviewTitle: "Three operations answer three different questions",
        overview: "Conversion asks whether one typed value can be represented as another type. Assertion asks what concrete or behavioural value an interface currently contains. Parsing asks whether bytes or text follow an external grammar. Similar-looking end types do not make these operations interchangeable.\n\nConversions can be statically legal while semantically unsafe, especially when narrowing numbers. Assertions can be statically possible while failing at runtime. Parsing can fail because input syntax or range is invalid. Each boundary needs its own error or validation strategy.",
        visual: {
          type: "comparison_table",
          title: "Conversion, assertion, and parsing",
          content: "| Operation | Form | Main check | Failure boundary |\n|---|---|---|---|\n| Type conversion | `T(x)` | Source may convert to T | Compile error if forbidden; value may lose information |\n| Type assertion | `x.(T)` | Interface dynamic type matches T | `ok == false` or panic |\n| Text parsing | `strconv.Parse...` | Text follows numeric grammar and range | Returned error |",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    source := int64(300)
    converted := uint8(source)

    var open any = source
    asserted, ok := open.(int64)
    _, wrongType := open.(uint8)

    fmt.Println(converted)
    fmt.Println(asserted, ok, wrongType)
}`),
        exampleTitle: "Compare a narrowing conversion with two assertions",
        exampleNote: "The conversion produces 44. The `int64` assertion succeeds, while the `uint8` assertion fails rather than converting the value.",
        testing: "Whether conversion, runtime interface inspection, parsing, and possible information loss are distinct.",
        commonMistake: "Expecting an assertion to convert the dynamic value or expecting a numeric cast to parse decimal text.",
        depthSignal: "Use one value to show a legal lossy conversion and a failed assertion to the destination type.",
      },
      {
        question: "What happens during numeric type conversion in Go?",
        title: "Numeric conversions and information loss",
        direct: "Go requires explicit conversion between distinct numeric types. Integer narrowing keeps the value modulo the destination width through sign extension and truncation rules, floating-to-integer conversion discards the fractional part toward zero, and integer-to-float conversion may round when the float lacks precision. A non-constant conversion can succeed even when information changes, so validate ranges before narrowing external or domain-critical values.",
        points: [
          "Distinct numeric types normally require explicit conversion.",
          "Narrow integer conversions can discard high-order bits.",
          "Floating-to-integer conversion discards the fractional part toward zero.",
          "Large integers may round when converted to floating point.",
          "Constants must be representable where a typed assignment or conversion requires it.",
        ],
        spoken: "- Go makes conversions between distinct numeric types explicit so the source shows where representation may change. The syntax compiles when the language permits the pair, but a successful runtime conversion does not promise mathematical equality. A smaller integer type cannot represent every larger value, and a floating type cannot represent every large integer exactly.\n\n- For integer conversion, the value is extended to implicit infinite precision with its sign and then truncated to the destination width, after which it is interpreted as the destination type. That is why `uint8(300)` becomes 44. Floating-to-integer conversion discards the fraction toward zero, so `int(-3.9)` is -3. Integer-to-float and float-to-float conversions may round.\n\n- For example, an API can parse a quantity into `int64`, check that it is between zero and 255, and only then convert to `uint8`. Converting first and validating afterward is too late because 256 has already become zero and could look valid. A typed constant that cannot fit the destination is rejected by the compiler, which catches literal mistakes earlier.\n\n- I use explicit bounds checks when narrowing data from files, APIs, databases, or calculations. For ordinary widening where every source value is representable, the conversion documents arithmetic intent. For money and exact identifiers, I avoid floating point when rounding would violate the domain.",
        overviewTitle: "Legality is not the same as losslessness",
        overview: "The compiler verifies that a conversion category is allowed. The programmer verifies that the particular runtime value preserves the required meaning. Those checks differ because runtime values are not always known during compilation.\n\nValidate in the wider source type before narrowing. After truncation, several original values can map to the same destination value, so the evidence needed for a correct range decision has been destroyed.",
        visual: {
          type: "comparison_table",
          title: "Why validating after conversion is too late",
          content: "| Stage | Value | Interpretation |\n|---|---:|---|\n| Source `int64` | 300 | Outside uint8 range |\n| Narrow to 8 bits | 44 | High bits discarded |\n| Validate converted value | 44 | Looks valid but is wrong input |\n| Correct order | Check 0..255 first | Reject 300 before conversion |",
        },
        code: go(String.raw`package main

import "fmt"

func toByte(value int64) (byte, error) {
    if value < 0 || value > 255 {
        return 0, fmt.Errorf("%d is outside byte range", value)
    }
    return byte(value), nil
}

func main() {
    good, goodErr := toByte(200)
    bad, badErr := toByte(300)
    fmt.Println(good, goodErr)
    fmt.Println(bad, badErr != nil)
}`),
        exampleTitle: "Check range before narrowing",
        exampleNote: "The valid input becomes 200. The value 300 is rejected instead of silently becoming 44.",
        testing: "Whether explicit syntax, truncation, rounding, constants, and domain validation are understood separately.",
        commonMistake: "Narrowing first and then checking a value whose original high bits have already been lost.",
        depthSignal: "Explain one integer and one floating-point information-loss rule.",
      },
      {
        question: "How do conversions between `string`, `[]byte`, and `[]rune` differ?",
        title: "String, byte-slice, and rune-slice conversions",
        direct: "`[]byte(s)` exposes the string's encoded bytes in a mutable slice, while `[]rune(s)` decodes it into Unicode code points. `string(bytes)` uses the byte slice contents as the new string's bytes, even if invalid UTF-8; `string(runes)` UTF-8-encodes each rune, replacing invalid code-point values as specified. Treat converted mutable slices as independent owned data even when the compiler can optimize a copy invisibly.",
        points: [
          "`[]byte(s)` represents the original encoded bytes.",
          "`[]rune(s)` decodes code points and maps invalid UTF-8 to U+FFFD.",
          "`string(bytes)` can contain arbitrary bytes, including invalid UTF-8.",
          "`string(runes)` encodes rune values as UTF-8.",
          "Choose bytes for exact data and runes for code-point operations.",
        ],
        spoken: "- A conversion to `[]byte` views the string as encoded storage. The resulting slice contains one element per byte and can be changed without changing the original immutable string. Converting that slice back to string uses its bytes as the new string contents; Go strings allow invalid UTF-8, so no validation is implied.\n\n- A conversion to `[]rune` decodes UTF-8 and creates one element per Unicode code point. Invalid byte encodings become the replacement rune. Converting runes back builds UTF-8 for each rune value. This representation is useful for code-point indexing and mutation but uses more memory and no longer preserves the exact malformed input bytes.\n\n- For example, `[]byte(\"é\")` contains two values, while `[]rune(\"é\")` contains one. Changing the rune to `'e'` produces valid text. Changing one of the two original bytes could produce a malformed string, which may be correct for a byte-level test but not for user text.\n\n- The language semantics keep mutable slices from altering an existing string even if an optimizer avoids a physical copy in cases where the difference cannot be observed. I choose the conversion from the algorithm's unit and avoid repeated whole-string conversions inside loops when one pass or a builder can do the work.",
        overviewTitle: "Conversion either preserves bytes or decodes meaning",
        overview: "Byte conversion keeps the exact encoding units and therefore preserves malformed data. Rune conversion interprets those units as UTF-8 and produces Unicode values, applying replacement on decoding errors. The choice determines what information remains available.\n\nReturning to string creates an immutable byte sequence. Code should not depend on memory aliasing between strings and slices; only unsafe operations can bypass the normal guarantee and require a different level of proof.",
        visual: {
          type: "diagram",
          title: "Two paths out of a string",
          content: "```mermaid\nflowchart LR\n  A[string bytes] --> B[[]byte: preserve encoding units]\n  A --> C[[]rune: decode UTF-8]\n  B --> D[mutate exact bytes]\n  C --> E[mutate code points]\n  D --> F[new string from bytes]\n  E --> G[new UTF-8 string from runes]\n```",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    text := "é"
    bytes := []byte(text)
    runes := []rune(text)
    runes[0] = 'e'
    fmt.Printf("bytes=% x runes=%U changed=%s original=%s\n", bytes, runes, string(runes), text)
}`),
        exampleTitle: "Preserve encoding bytes or decode one rune",
        exampleNote: "The byte view contains `c3 a9`; the rune view contains one changed code point. The original remains `é`.",
        testing: "Whether exact-byte preservation, UTF-8 decoding, invalid input, and ownership semantics are understood.",
        commonMistake: "Converting malformed data to runes before diagnostics, or assuming a byte slice contains one element per character.",
        depthSignal: "Explain which conversion can preserve invalid UTF-8 and why observable string immutability still holds.",
      },
    ],
  },

  "fmt-sprintf": {
    title: "Formatting with fmt",
    questions: [
      {
        question: "What is the difference between `fmt.Printf`, `fmt.Sprintf`, and `fmt.Fprintf`?",
        title: "Choosing a fmt formatting destination",
        direct: "All three apply a format string to arguments, but their destinations differ: `Printf` writes to standard output, `Sprintf` returns the formatted string, and `Fprintf` writes to a supplied `io.Writer`. Use `Sprintf` when text must become a value, `Fprintf` when the caller owns the destination, and avoid hard-coded `Printf` inside reusable library logic unless console output is its actual contract.",
        points: [
          "`Printf` formats to standard output.",
          "`Sprintf` returns a string.",
          "`Fprintf` writes to an `io.Writer` and returns byte count plus error.",
          "The same verbs and argument rules apply across the three functions.",
          "Choose the destination explicitly at the API boundary.",
        ],
        spoken: "- The `fmt` formatting family separates formatting from destination. `Printf` sends formatted output to standard output and returns the byte count plus any write error. `Sprintf` returns the resulting string, so it has no destination write error. `Fprintf` accepts an `io.Writer`, writes there, and returns count and error.\n\n- For example, a command-line `main` function may call `Printf` for user output. A function building an error label can use `Sprintf`. A report renderer should often accept an `io.Writer` and call `Fprintf`, allowing the caller to choose a file, buffer, HTTP response, or test destination. This keeps reusable logic independent of process-global output.\n\n- `fmt.Appendf` offers the same formatting style while appending to a byte slice, which can be useful in buffer-oriented code. For one primitive conversion, `strconv` is usually more direct. For fixed strings without formatting, ordinary writes avoid a format string entirely.\n\n- Formatting does not make output logging-safe, HTML-safe, SQL-safe, or shell-safe. Escaping and structured logging are separate responsibilities. I choose among these functions by destination and return contract, then choose a domain-specific encoder when output enters a syntax that requires escaping.",
        overviewTitle: "Formatting is one stage; destination and encoding are others",
        overview: "A format string decides textual representation. Printf fixes the destination to stdout. Sprintf holds the bytes as a returned immutable string. Fprintf delegates destination ownership through `io.Writer`. None of those choices defines escaping for another language.\n\nSeparating stages makes functions testable. A writer-based renderer can write into `bytes.Buffer` in a test and a file in production. An HTML template or JSON encoder should own its syntax rather than receiving manually formatted untrusted content.",
        visual: {
          type: "comparison_table",
          title: "Same formatting, different destination",
          content: "| Function | Destination | Main result | Typical use |\n|---|---|---|---|\n| `fmt.Printf` | Standard output | byte count, error | CLI display |\n| `fmt.Sprintf` | Returned string | string | Build a label or message value |\n| `fmt.Fprintf` | Supplied `io.Writer` | byte count, error | Reusable renderer |\n| `fmt.Appendf` | Supplied byte slice | extended slice | Byte-buffer construction |",
        },
        code: go(String.raw`package main

import (
    "bytes"
    "fmt"
    "io"
)

func writeGreeting(destination io.Writer, name string) error {
    _, err := fmt.Fprintf(destination, "Hello, %s!", name)
    return err
}

func main() {
    var output bytes.Buffer
    _ = writeGreeting(&output, "Mina")
    label := fmt.Sprintf("bytes=%d", output.Len())
    fmt.Printf("%s %s\n", output.String(), label)
}`),
        exampleTitle: "Use each destination deliberately",
        exampleNote: "Fprintf writes into the caller's buffer, Sprintf builds a label, and only the final Printf targets standard output.",
        testing: "Whether formatting, destination ownership, write errors, and output escaping are distinguished.",
        commonMistake: "Printing directly inside reusable code or assuming formatted text is automatically escaped for its eventual context.",
        depthSignal: "Connect Fprintf's io.Writer parameter to both testability and destination flexibility.",
      },
      {
        question: "What do common `fmt` formatting verbs mean in Go?",
        title: "Common fmt verbs and format mistakes",
        direct: "Use `%v` for a default value, `%+v` for field names in structs, `%#v` for Go-syntax-style output, `%T` for the concrete type, `%q` for quoted text, `%s` for strings or byte slices, `%d` for decimal integers, and `%x` for hexadecimal. A mismatched verb produces a `%!` diagnostic in output, and `go vet` catches many constant-format mistakes before runtime.",
        points: [
          "`%v`, `%+v`, and `%#v` expose increasing representation detail.",
          "`%T` prints the operand's concrete type.",
          "`%q` quotes strings and runes in an escaped form.",
          "`%s`, `%d`, and `%x` express string, decimal, and hexadecimal intent.",
          "Run `go vet` to catch many format/argument mismatches.",
        ],
        spoken: "- A format verb states how an argument should be represented. `%v` asks for the default form. For structs, `%+v` includes field names, and `%#v` aims at a Go-syntax representation. `%T` reports the concrete type, which is especially useful when an interface holds an unexpected value.\n\n- Text often uses `%s`, while `%q` adds Go-style quoting and escapes so empty strings, spaces, and control characters become visible. Decimal integers use `%d`; `%x` and `%X` show hexadecimal. Width and precision refine presentation, such as `%6.2f`, but they do not validate a domain value.\n\n- For example, printing a record with `%v`, `%+v`, and `%#v` produces three useful debugging levels, while `%q` distinguishes `\" go\\n\"` from ordinary display. Passing a string to `%d` does not convert it to a number; fmt emits a diagnostic beginning with `%!d`, which can easily leak into logs or responses.\n\n- `go vet` analyzes calls whose format strings are known and reports many wrong verbs, missing arguments, and wrapper mistakes. Dynamic format strings still need tests and careful ownership. I use `strconv` for machine numeric conversion, structured log attributes for production logs, and fmt verbs for controlled human-readable formatting.",
        overviewTitle: "A verb selects representation, not conversion or validation",
        overview: "Fmt receives already typed arguments. It formats them under verb rules and reports mismatches inside the output rather than returning a formatting error for every wrong verb. This design makes development diagnostics visible, while static analysis catches many mistakes earlier.\n\nRepresentation choice affects privacy and stability. `%+v` or `%#v` can reveal internal fields and should not define a public wire contract. JSON, templates, and structured logging provide stronger schema and escaping guarantees for those boundaries.",
        visual: {
          type: "comparison_table",
          title: "Useful format views",
          content: "| Verb | Meaning | Example purpose |\n|---|---|---|\n| `%v` | Default value | General display |\n| `%+v` | Default plus struct field names | Debug a record |\n| `%#v` | Go-syntax-style representation | Detailed diagnostics |\n| `%T` | Concrete type | Inspect interface content |\n| `%q` | Quoted and escaped text/rune | Reveal whitespace |\n| `%d` / `%x` | Decimal / hexadecimal integer | Numeric representation |",
        },
        code: go(String.raw`package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func main() {
    user := User{Name: "Mina", Age: 24}
    fmt.Printf("%v\n", user)
    fmt.Printf("%+v\n", user)
    fmt.Printf("%#v\n", user)
    fmt.Printf("%T %q %x\n", user, "go\n", 255)
}`),
        exampleTitle: "Compare default, named, syntax, type, quote, and hex forms",
        exampleNote: "Every verb matches its argument type, so go vet accepts the calls and the output contains no `%!` diagnostics.",
        testing: "Whether formatting intent, diagnostics, conversion, static analysis, and public serialization are separated.",
        commonMistake: "Expecting `%d` to parse numeric text or exposing `%#v` as a stable API response format.",
        depthSignal: "Explain both runtime `%!` diagnostics and the compile-time assistance provided by go vet.",
      },
      {
        question: "How do `Stringer` and custom formatting work with the `fmt` package?",
        title: "Stringer, error, and custom fmt formatting",
        direct: "For string-compatible verbs, fmt can use an operand's `error` method or `String() string` method; `%#v` can use `GoString() string`, and a type implementing `fmt.Formatter` receives complete control through `Format`. These hooks should be concise, non-panicking, and free of sensitive data. A `String` method on a string-based type must convert to the underlying string before formatting to avoid recursive calls.",
        points: [
          "`fmt.Stringer` requires `String() string`.",
          "The `error` interface supplies `Error() string` for compatible string formatting.",
          "`GoStringer` customizes `%#v` through `GoString()`.",
          "`fmt.Formatter` handles flags, width, precision, and the verb directly.",
          "Convert a string-based receiver before Sprintf to avoid recursion.",
        ],
        spoken: "- The fmt package checks formatting interfaces before falling back to default representation. For string-valid verbs, a value implementing `error` can provide `Error() string`, and a value implementing `fmt.Stringer` can provide `String() string`. `%#v` has a separate `GoStringer` hook. `fmt.Formatter` is the advanced option because its `Format` method receives state, flags, width, precision, and the selected verb.\n\n- For example, a `UserID` type can implement `String` to display an identifiable but safe form. Then `%s` or `%v` uses that method. The method should be deterministic and avoid database calls, locks with surprising contention, or secrets, because formatting occurs in logs, errors, and debugging paths where failures are especially harmful.\n\n- A classic recursion mistake happens with a defined string type: `func (id UserID) String() string { return fmt.Sprintf(\"<%s>\", id) }`. Formatting `id` as `%s` calls `String` again forever. Converting first—`string(id)`—removes the method set from the formatted operand and produces the intended result.\n\n- Custom Formatter is justified when flags or precision have domain meaning; otherwise Stringer is easier to understand. Neither hook should become a wire format accidentally. JSON, database, and protocol encoders need explicit stable contracts even when the same type has a friendly String method.",
        overviewTitle: "Formatting dispatches through a small behaviour contract",
        overview: "Fmt examines the operand and verb, then gives specialized formatting hooks a chance to produce output. This is ordinary interface-based substitution: a type opts into behaviour by its method set without registering with fmt.\n\nThe hook sits on diagnostic paths, so robustness matters. Keep it bounded, avoid recursively formatting the same receiver type, and redact information that should not enter logs. Use explicit encoders for machine contracts rather than relying on a display method.",
        visual: {
          type: "flow_diagram",
          title: "Simplified formatting dispatch",
          content: "```mermaid\nflowchart TD\n  A[fmt receives operand + verb] --> B{implements Formatter?}\n  B -- Yes --> C[call Format]\n  B -- No --> D{%#v and GoStringer?}\n  D -- Yes --> E[call GoString]\n  D -- No --> F{string-compatible verb and error/Stringer?}\n  F -- Yes --> G[call Error or String]\n  F -- No --> H[default formatting rules]\n```",
        },
        code: go(String.raw`package main

import "fmt"

type UserID string

func (id UserID) String() string {
    return fmt.Sprintf("user<%s>", string(id))
}

func main() {
    id := UserID("u-42")
    fmt.Printf("%s %v %T\n", id, id, id)
}`),
        exampleTitle: "Avoid recursive formatting on a string-based type",
        exampleNote: "Converting `id` to plain string inside `String` prevents fmt from calling the same method again.",
        testing: "Whether fmt's interface hooks, recursion risk, privacy, and machine-format boundary are understood.",
        commonMistake: "Formatting the receiver as itself inside String, causing unbounded recursion.",
        depthSignal: "Describe when Formatter is justified beyond the simpler Stringer contract.",
      },
    ],
  },

  "comparisons": {
    title: "Comparisons",
    questions: [
      {
        question: "How are strings compared in Go?",
        title: "String equality and ordering",
        direct: "Go strings are comparable with `==`, `!=`, `<`, `<=`, `>`, and `>=`. Equality requires identical byte sequences, and ordering is lexicographic by byte values. The comparison is case-sensitive, does not normalize Unicode, and does not apply locale-aware collation, so visually similar or canonically equivalent text can compare unequal.",
        points: [
          "String equality compares the complete byte sequences.",
          "Ordering is lexicographic by bytes.",
          "Comparison is case-sensitive.",
          "Unicode normalization is not performed automatically.",
          "Locale-aware user sorting requires a collation solution beyond operators.",
        ],
        spoken: "- Go string operators compare the bytes stored in the values. Two strings are equal only when they have the same length and identical bytes. Ordering compares bytes lexicographically, so it gives a stable language-defined order suitable for keys and deterministic technical sorting. It is not a natural-language dictionary order.\n\n- Case remains significant: `\"Go\" != \"go\"`. Unicode normalization is also not automatic. A precomposed `é` and an `e` followed by a combining accent may render alike but have different byte sequences and therefore compare unequal. The language does not know whether an application wants normalization, case folding, or locale-specific collation.\n\n- For example, a map keyed by usernames treats different byte spellings as different keys. If the product requires case-insensitive normalized identities, it should compute and store a documented canonical key while retaining the display spelling separately. Applying only `strings.ToLower` is not a complete answer for every script or locale.\n\n- Direct comparison is ideal for protocol tokens, identifiers with an exact encoding contract, hashes represented in one canonical form, and ordinary exact values. For human-facing search and sorting, I define normalization, folding, and collation requirements explicitly and use appropriate Unicode tooling before comparing.",
        overviewTitle: "Operators compare representation, not linguistic meaning",
        overview: "Byte-wise comparison is simple, deterministic, and consistent with string map keys. It avoids hidden locale state and gives every program the same result for the same bytes. That predictability is valuable for protocols and storage.\n\nHuman text equivalence is contextual. Normalization can align canonically equivalent sequences; case folding can align selected case variants; collation can order words for a locale. These are transformations or algorithms layered above the string operators.",
        visual: {
          type: "comparison_table",
          title: "Exact bytes versus visual similarity",
          content: "| Pair | Byte-equal? | Reason |\n|---|---:|---|\n| `\"Go\"`, `\"Go\"` | Yes | Identical bytes |\n| `\"Go\"`, `\"go\"` | No | Case changes one byte |\n| precomposed `é`, decomposed `e + accent` | No | Different UTF-8 sequences |\n| normalized canonical keys | Depends on chosen policy | Transformation occurs before equality |",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    precomposed := "é"
    decomposed := "e\u0301"
    fmt.Println("Go" == "go")
    fmt.Println(precomposed == decomposed)
    fmt.Printf("% x\n% x\n", []byte(precomposed), []byte(decomposed))
}`),
        exampleTitle: "Compare two visually similar Unicode spellings",
        exampleNote: "Both comparisons are false. The hexadecimal output shows different UTF-8 byte sequences for the two forms of `é`.",
        testing: "Whether exact representation comparison is separated from normalization, folding, and collation.",
        commonMistake: "Assuming string ordering is locale-aware or that visually equal Unicode text always has equal bytes.",
        depthSignal: "Give a concrete identity design that stores a canonical key separately from display text.",
      },
      {
        question: "When should you use `strings.EqualFold` for case-insensitive comparison?",
        title: "Case-insensitive comparison with EqualFold",
        direct: "Use `strings.EqualFold` when two UTF-8 strings should be compared using Unicode simple case folding. It is clearer and generally more correct than lowercasing both strings merely for equality. It does not perform Unicode normalization, full multi-character folding, or locale-specific matching, so security identifiers and natural-language search still need an explicit canonicalization policy.",
        points: [
          "`EqualFold` applies Unicode simple case folding for equality.",
          "It avoids allocating two lowercased strings just for comparison.",
          "It handles more than ASCII case pairs.",
          "It does not normalize canonically equivalent byte sequences.",
          "It is not locale-aware or a complete security canonicalization rule.",
        ],
        spoken: "- `strings.EqualFold(a, b)` answers whether two UTF-8 strings are equal under Unicode simple case folding. It communicates case-insensitive intent directly and avoids creating lowercase copies only to compare them. For ordinary case-insensitive command words or labels, it is usually a better first choice than `strings.ToLower(a) == strings.ToLower(b)`.\n\n- Simple folding groups code points in case-equivalence classes, so the behaviour goes beyond ASCII. It deliberately does not implement every linguistic transformation. For example, the package documents that `EqualFold(\"ß\", \"ss\")` is false because that would require full folding across a different number of code points.\n\n- For example, `EqualFold(\"Go\", \"gO\")` is true, while exact equality is false. A precomposed and decomposed accented spelling remains different unless the application normalizes both first. Locale-sensitive cases, such as product-specific Turkish text handling, require a policy beyond simple folding.\n\n- I use EqualFold for comparison, not as a stored canonical key by itself. Authentication names, filesystem-like identifiers, and database uniqueness need one documented normalization and case policy applied consistently at every layer. EqualFold is a useful predicate, but it cannot replace those storage and security decisions.",
        overviewTitle: "Case folding is one transformation layer",
        overview: "Lowercasing transforms each input into another string, while EqualFold evaluates case equivalence directly. The predicate is efficient and avoids exposing one lowercase result as though it were a universal canonical spelling.\n\nNormalization and locale are independent axes. Text can differ by canonical Unicode composition even after case is ignored, and a locale can define expectations beyond Unicode simple folding. Choose each layer because the domain requires it.",
        visual: {
          type: "comparison_table",
          title: "What EqualFold does and does not promise",
          content: "| Pair or requirement | EqualFold result/support |\n|---|---|\n| `Go` versus `gO` | true |\n| `AB` versus `ab` | true |\n| `ß` versus `ss` | false; not full multi-character folding |\n| Precomposed versus decomposed accent | No normalization |\n| Locale-specific collation | Not provided |",
        },
        code: go(String.raw`package main

import (
    "fmt"
    "strings"
)

func main() {
    fmt.Println(strings.EqualFold("Go", "gO"))
    fmt.Println(strings.EqualFold("AB", "ab"))
    fmt.Println(strings.EqualFold("ß", "ss"))
}`),
        exampleTitle: "Observe simple case-fold boundaries",
        exampleNote: "The outputs are true, true, and false. EqualFold intentionally does not expand `ß` into two letters.",
        testing: "Whether simple folding, allocation, normalization, locale, and persistent identity policies are distinguished.",
        commonMistake: "Treating EqualFold as Unicode normalization or a complete canonicalization strategy for account identifiers.",
        depthSignal: "Explain why a comparison predicate is different from choosing a stored canonical key.",
      },
      {
        question: "When should you use a `string` instead of `[]byte` in Go?",
        title: "Choosing string or byte slice",
        direct: "Use `string` for immutable text, comparable identifiers, map keys, and APIs that should not expose mutation. Use `[]byte` for mutable buffers, binary data, streaming I/O, and protocols where exact bytes matter. Conversion is explicit and may cost allocation and copying, so keep data in its natural representation through a pipeline instead of switching repeatedly.",
        points: [
          "Strings are immutable, comparable, and valid map keys.",
          "Byte slices are mutable and may share backing arrays.",
          "A string can still contain arbitrary non-UTF-8 bytes.",
          "I/O APIs commonly use byte slices to reuse caller-provided buffers.",
          "Convert once near a representation boundary when possible.",
        ],
        spoken: "- A string communicates an immutable sequence of bytes and supports equality, ordering, and map-key use. It is the natural representation for text values, names, paths as interpreted by string APIs, and identifiers whose callers should not mutate shared contents. Valid UTF-8 is a separate contract; string itself can hold arbitrary bytes.\n\n- A byte slice communicates mutable byte-oriented storage. It is appropriate for network reads, file buffers, encoders, cryptographic inputs, compressed data, and construction that changes in place. Slices are not comparable except with nil, and assigning one slice to another can leave both views sharing the same backing array.\n\n- For example, an HTTP body arrives as bytes because I/O fills buffers and the payload might not be text. After content type and encoding are validated, application code may convert one field to string for lookup or display. Keeping the whole pipeline as repeated byte-to-string-to-byte conversions adds work and obscures ownership.\n\n- Conversion semantics prevent normal mutation of a byte slice from changing an existing string, but a runtime cost may exist. I choose the representation from mutability, operations, and boundary meaning. Text processing usually remains string-based; binary and reusable buffer processing remains byte-based until a deliberate conversion point.",
        overviewTitle: "Type choice communicates ownership and permitted operations",
        overview: "String says the value cannot be edited through this reference and may participate in value comparison. Byte slice says callers can index, mutate, append, and possibly share capacity. Those promises matter more than whether the current bytes happen to spell readable text.\n\nConversions are bridges, not neutral casts. Keeping a stable representation through each stage reduces copying and makes ownership easier to review. Convert where the domain changes—for example, after decoding a protocol field into application text.",
        visual: {
          type: "comparison_table",
          title: "Representation trade-offs",
          content: "| Property | `string` | `[]byte` |\n|---|---|---|\n| Mutable through value | No | Yes |\n| Comparable / map key | Yes | No |\n| May contain invalid UTF-8 | Yes | Yes |\n| Natural for reusable I/O buffers | No | Yes |\n| Aliasing after assignment | Immutable observation | May share backing array |\n| Main role | Text or immutable bytes | Binary or mutable buffer |",
        },
        code: go(String.raw`package main

import "fmt"

func main() {
    identifier := "user-42"
    owners := map[string]string{identifier: "Mina"}

    buffer := []byte("draft")
    buffer[0] = 'D'

    fmt.Println(owners[identifier])
    fmt.Println(string(buffer))
}`),
        exampleTitle: "Use immutable text as a key and bytes as a buffer",
        exampleNote: "The string works directly as a map key, while the byte slice supports in-place mutation before conversion at the display boundary.",
        testing: "Whether the choice follows mutability, comparability, I/O shape, and conversion boundaries.",
        commonMistake: "Using string for a frequently mutated buffer or converting between string and bytes repeatedly inside a processing loop.",
        depthSignal: "Mention that UTF-8 validity is independent of both types and that slice assignment may preserve aliasing.",
      },
    ],
  },
};

function metaDescription(directAnswer) {
  const plain = directAnswer.replace(/[`*_]/g, "");
  return plain.length <= 157 ? plain : `${plain.slice(0, 154).trimEnd()}...`;
}

function makeQuestion(original, spec, topicQuestions) {
  const sections = [
    {
      type: "key_points",
      title: "Quick revision",
      items: spec.points,
    },
    {
      type: "speakable_answer",
      title: "Interview answer",
      answerSize: spec.answerSize ?? "compact",
      content: spec.spoken,
    },
    {
      type: "overview",
      title: spec.overviewTitle,
      content: spec.overview,
    },
  ];

  if (spec.visual) sections.push(spec.visual);
  sections.push({
    type: "code_example",
    title: spec.exampleTitle,
    content: `${spec.code}\n${spec.exampleNote}`,
  });

  return {
    ...original,
    question: spec.question,
    title: spec.title,
    direct_answer: spec.direct,
    layout_type: spec.layout ?? (original.order === 1 ? "concept-explanation" : "interview-practice"),
    difficulty: spec.difficulty ?? "easy",
    importance: spec.importance ?? (original.order === 1 ? "high" : "medium"),
    reading_time_minutes: spec.readingTime ?? 6,
    interviewer_intent: {
      testing: spec.testing,
      common_mistake: spec.commonMistake,
      to_stand_out: spec.depthSignal,
    },
    answer: { sections },
    followup_questions: topicQuestions
      .filter((entry) => entry.question !== spec.question)
      .slice(0, 3)
      .map((entry) => entry.question),
    seo: {
      metaTitle: `${spec.title} | Go interview question | InterviewExplainer`,
      metaDescription: metaDescription(spec.direct),
    },
  };
}

for (const [topicSlug, topic] of Object.entries(topicSpecs)) {
  const file = path.join(contentRoot, topicSlug, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (document.questions.length < topic.questions.length) {
    throw new Error(`${topicSlug}: needs at least ${topic.questions.length} source IDs`);
  }

  const retained = document.questions.slice(0, topic.questions.length);
  document.topic = topic.title;
  document.questions = retained.map((question, index) =>
    makeQuestion(question, topic.questions[index], topic.questions),
  );
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Curated ${document.questions.length} answers in ${topicSlug}`);
}
