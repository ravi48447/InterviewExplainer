#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  formatInterviewArticle,
  interviewAnswerSize,
} from "./lib/interview-article.mjs";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const domainRoot = path.join(repoRoot, "content/go-fresher");
const moduleRoot = path.join(domainRoot, "go-json-http-basics");
const topicOrder = [
  "json-marshal-unmarshal",
  "json-struct-tags",
  "json-omitempty",
  "json-number-and-interface",
  "http-get-post",
  "reading-response-body",
  "http-server-basics",
  "comparisons",
];
const topicTitles = {
  "json-marshal-unmarshal": "Marshaling and Unmarshaling JSON",
  "json-struct-tags": "JSON Struct Tags and Input Rules",
  "json-omitempty": "Optional and Zero JSON Fields",
  "json-number-and-interface": "JSON Numbers and Dynamic Values",
  "http-get-post": "HTTP Client Requests",
  "reading-response-body": "HTTP Response Bodies and Errors",
  "http-server-basics": "HTTP Servers and JSON Handlers",
  comparisons: "Choosing JSON and HTTP APIs",
};

const p = (...parts) => parts.join("\n\n");
const go = (source) => {
  const unformatted = `${source.trim().replaceAll("§", "\`")}\n`;
  const formatted = execFileSync("gofmt", { input: unformatted, encoding: "utf8" }).trimEnd();
  return `\`\`\`go\n${formatted}\n\`\`\``;
};
const mermaid = (source) => `\`\`\`mermaid\n${source.trim()}\n\`\`\``;
const lessons = [];

lessons.push(
  {
    topic: "json-marshal-unmarshal",
    question: "What do json.Marshal and json.Unmarshal do in Go?",
    title: "Converting between Go values and JSON",
    direct: "json.Marshal converts a supported Go value into JSON bytes, while json.Unmarshal parses one JSON value into a non-nil Go pointer. Both return errors that callers must check.",
    testing: "The two conversion directions, pointer requirement, exported-field rule, and error handling.",
    quick: [
      "json.Marshal turns a Go value into []byte containing JSON.",
      "json.Unmarshal parses JSON bytes into the value behind a non-nil pointer.",
      "Only exported struct fields participate in the default struct mapping.",
      "Both operations can fail, so always check the returned error.",
      "A typed struct gives safer results than map[string]any when the shape is known.",
    ],
    speaking: p(
      "- `json.Marshal` and `json.Unmarshal` are the basic in-memory conversions in Go's `encoding/json` package. Marshal starts with a Go value and returns JSON as `[]byte`. Unmarshal starts with JSON bytes and fills a Go destination supplied by pointer, so the package can change the caller's value.",
      "- The mapping follows Go types. Structs become JSON objects, slices become arrays, strings and booleans keep their JSON forms, and numeric fields become JSON numbers. For structs, only exported fields are considered. Tags such as `json:\"user_id\"` can choose the object key, but tags do not make an unexported field visible.",
      "- For example, marshaling `User{ID: 7, Name: \"Mina\"}` can produce `{" + "\"id\":7,\"name\":\"Mina\"}" + "`. Unmarshaling those bytes into `var user User` requires `json.Unmarshal(data, &user)`. Passing `user` instead of `&user`, malformed JSON, or an incompatible value produces an error rather than a useful result.",
      "- These functions operate on a complete byte slice. That is convenient for small payloads and tests, but it means the full representation is held in memory. A `json.Decoder` or `json.Encoder` is a better boundary for an `io.Reader`, an HTTP body, or a stream containing several values.",
      "- I use a concrete destination type whenever the contract is known because field types document and check the expected shape. I reserve dynamic maps for genuinely variable objects. The complete rule is: choose the target shape, perform the conversion in the correct direction, and treat the returned error as part of the result."
    ),
    overviewTitle: "JSON conversion has a direction and a destination",
    overview: "Marshaling reads a Go value and creates a new byte slice. Unmarshaling reads bytes and mutates an existing destination through a pointer. That direction explains why only Unmarshal needs a pointer and why decoding into a typed struct exposes shape errors earlier.",
    deepTitle: "Follow one value across the boundary",
    deep: p(
      "A JSON document has objects, arrays, strings, numbers, booleans, and null. Go has many more concrete types, so `encoding/json` applies documented mappings. An exported struct field is a candidate object member; a slice is an array; a map with supported keys is an object; a nil pointer or interface becomes null.",
      "During Unmarshal, the destination decides the conversion. A JSON number can enter an `int` field only when it represents a valid integer in range. A JSON string cannot silently become that integer. Unmarshal may report a type error after processing other fields, so code must not use a partially populated value when the call returns an error.",
      "The pointer is the writable address. `&user` allows allocation and assignment below that address, while a non-pointer cannot be changed and causes `InvalidUnmarshalError`. Reusing a non-zero destination also deserves care because decoding can merge or replace different kinds of values; fresh request structs avoid stale state.",
      "At an application boundary, decoding is only syntax and type conversion. Required fields, accepted ranges, and relationships still need validation after a successful parse. Encoding also needs an error path, even when today's struct seems simple, because a later custom marshaler or unsupported field can fail."
    ),
    visualType: "flow_diagram",
    visualTitle: "The two JSON directions",
    visual: mermaid(`flowchart LR
  G[Typed Go value] -->|json.Marshal| B[JSON bytes]
  B -->|json.Unmarshal into pointer| D[Typed Go destination]
  G -. unsupported value .-> E[error]
  B -. invalid or incompatible JSON .-> E`),
    codeTitle: "Round-trip a typed value",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	ID   int    §json:"id"§
	Name string §json:"name"§
}

func main() {
	data, err := json.Marshal(User{ID: 7, Name: "Mina"})
	if err != nil { panic(err) }
	var decoded User
	if err := json.Unmarshal(data, &decoded); err != nil { panic(err) }
	fmt.Printf("%s -> %+v\\n", data, decoded)
}`),
    codeNote: "The destination is a pointer, and both conversion errors are handled before the values are used.",
    followups: ["Why does Unmarshal require a pointer?", "What happens to unexported struct fields?", "When would a Decoder be a better choice?"],
  },
  {
    topic: "json-marshal-unmarshal",
    question: "Which Go values cannot be marshaled to JSON?",
    title: "Unsupported JSON values and cycles",
    direct: "Channels, functions, and complex numbers are unsupported JSON values, while NaN, infinities, and cyclic object graphs also fail. json.Marshal returns a typed error; it does not solve cycles automatically.",
    testing: "Whether unsupported types and unsupported runtime values are distinguished and errors remain visible.",
    quick: [
      "Channels, functions, and complex values return json.UnsupportedTypeError.",
      "NaN and positive or negative infinity return json.UnsupportedValueError.",
      "Cyclic pointers cannot be represented in JSON and produce an error.",
      "An unsupported value hidden inside a nested exported field can fail the whole marshal.",
      "Check the error before writing or storing the returned bytes.",
    ],
    speaking: p(
      "- JSON can represent only objects, arrays, strings, numbers, booleans, and null, so not every Go value has a default encoding. `json.Marshal` returns `*json.UnsupportedTypeError` for channel, function, and complex-number values because JSON has no standard representation for those types.",
      "- Some supported Go types can still contain an unsupported value. Floating-point `NaN`, positive infinity, and negative infinity are not valid JSON numbers, so Marshal returns `*json.UnsupportedValueError`. A pointer, map, slice, interface, or struct graph that eventually points back to itself is cyclic; JSON is a tree-shaped value, and Marshal reports an error instead of looping forever.",
      "- For example, a `Node` whose `Next` points to itself cannot be marshaled as a nested object. The application must choose a real wire representation, such as node IDs and edges, a bounded tree without parent links, or a custom DTO that omits the back-reference. Replacing a cycle with arbitrary recursion limits would hide information rather than define the contract.",
      "- Unexported unsupported fields are not considered by the default struct encoding, but relying on that to conceal process state is poor API design. A response type should deliberately contain serializable data rather than mutexes, open files, callbacks, or internal graph links. Custom `MarshalJSON` methods can define another representation, and their errors are also returned.",
      "- The boundary is therefore a schema decision, not a serializer trick. I create a transport type containing valid JSON concepts, normalize exceptional floats according to the product rule, break graph identity into IDs where needed, and always handle Marshal's error before committing an HTTP status or persisting bytes."
    ),
    overviewTitle: "Representability is different from Go validity",
    overview: "A value may be perfectly valid inside a Go process yet have no JSON meaning. The serializer needs a finite tree of representable leaves. Transport structs make that requirement visible and keep runtime-only fields out of the wire contract.",
    deepTitle: "Classify failures before designing a repair",
    deep: p(
      "UnsupportedTypeError describes a type with no default JSON form, such as `chan int`. UnsupportedValueError describes a particular value that cannot be emitted, including exceptional floats and cycles. `errors.As` can distinguish them when an application needs different diagnostics, although most APIs should return one safe encoding failure to clients and log the internal cause.",
      "Cycles often appear in otherwise ordinary models: a child stores its parent, linked nodes loop, or ORM records reference one another. JSON object nesting cannot preserve object identity. A DTO can encode `{nodes:[...], edges:[...]}` or use identifiers, letting the receiver rebuild relationships explicitly.",
      "Marshal builds the complete result before returning, which is helpful here: a failure does not return a partially valid document to the caller. An Encoder writes to an `io.Writer`, so a late custom-marshaler error may arrive after earlier bytes were written. HTTP handlers that require an alternate error status can marshal to a buffer first.",
      "Tests should exercise realistic nested values, not only a zero-value struct. Add cases for custom marshalers, maximum values, exceptional floats when calculations can create them, and any graph conversion layer. The successful test validates the chosen wire schema; the failing test proves errors are not ignored."
    ),
    visualType: "comparison_table",
    visualTitle: "Why Marshal rejects a value",
    visual: "| Category | Examples | Normal repair |\n|---|---|---|\n| Unsupported type | channel, function, complex | omit runtime state or define a DTO |\n| Unsupported value | NaN, +Inf, -Inf | validate or choose a documented representation |\n| Cyclic graph | self-link, parent back-link | encode IDs and relationships |\n| Custom method failure | domain-specific marshal error | handle and surface the error safely |",
    codeTitle: "Observe a cyclic-value error",
    source: go(`package main

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Node struct { Value int §json:"value"§; Next *Node §json:"next,omitempty"§ }

func main() {
	n := &Node{Value: 1}
	n.Next = n
	_, err := json.Marshal(n)
	var valueErr *json.UnsupportedValueError
	fmt.Println(err != nil, errors.As(err, &valueErr))
}`),
    codeNote: "The self-reference is legal Go but not a finite JSON tree, so Marshal returns an UnsupportedValueError.",
    followups: ["How would you encode a graph with cycles?", "Can json.Marshal encode NaN?", "Why might an Encoder be harder to recover from after a late error?"],
  },
  {
    topic: "json-marshal-unmarshal",
    question: "How do you decode exactly one JSON value from a request body?",
    title: "Strict single-value JSON decoding",
    direct: "Use a json.Decoder on the body, apply strict options, decode the expected value, then decode once more and require io.EOF. One successful Decode alone does not reject a trailing second JSON value.",
    testing: "Decoder streaming, strict unknown fields, and the often-missed trailing-value boundary.",
    quick: [
      "json.Decoder reads JSON from an io.Reader and has its own buffer.",
      "DisallowUnknownFields rejects object keys missing from the destination struct.",
      "The first Decode validates only the first complete JSON value.",
      "A second Decode must return io.EOF when exactly one value is allowed.",
      "Limit an untrusted request body before decoding it.",
    ],
    speaking: p(
      "- An HTTP endpoint usually accepts one JSON document, while `json.Decoder` is also designed for streams containing several consecutive JSON values. I create the decoder from the bounded request body, enable `DisallowUnknownFields` for a closed request schema, and decode into a fresh typed struct.",
      "- For example, one successful first `Decode` does not mean the input ended. The bytes `{" + "\"name\":\"Ada\"} {\"name\":\"Eve\"}" + "` contain two valid JSON values, and the first call can return nil after reading only the first logical value. To enforce the endpoint contract, call Decode again into a disposable value and require `io.EOF`; nil means an unexpected second value, and another error means invalid trailing content.",
      "- The decoder buffers input and may read beyond the requested value, so callers should not assume the underlying reader sits exactly at a token boundary. For a genuine stream, reuse that same decoder and call Decode repeatedly until EOF. For one request document, the second-decode check converts stream behavior into a single-value rule.",
      "- Strict decoding is not complete validation. It catches unknown object keys, but required strings may still be empty, numbers may still be outside domain ranges, and omitted fields can look like zero values. After syntax and shape succeed, validate those business rules separately and return a clear client error.",
      "- Finally, protect server memory with `http.MaxBytesReader` or another explicit limit before decoding. The combined boundary is: bounded bytes, known fields where appropriate, exactly one JSON value, then domain validation. That is much stronger than calling Decode once and trusting whatever populated the struct."
    ),
    overviewTitle: "Decoder speaks streams; the endpoint defines one document",
    overview: "The decoder cannot guess whether another value is valid input or unwanted trailing data. The caller supplies that policy by decoding until EOF. Unknown-field rejection and domain validation solve different layers of the same boundary.",
    deepTitle: "Build the input gate in four stages",
    deep: p(
      "First cap the bytes. `MaxBytesReader` is designed for server request bodies and reports a typed error when reads exceed its limit. This protects parsing work but does not choose an application timeout; request context and server settings handle time boundaries.",
      "Second configure the decoder before reading. `DisallowUnknownFields` applies when the destination is a struct and reports keys that match no non-ignored exported field. Classic `encoding/json` otherwise ignores those keys, which helps compatibility but can conceal a misspelled client field.",
      "Third parse the destination and prove the stream ended. JSON permits trailing whitespace, so an EOF after whitespace is valid. Another successfully decoded value is not. The decoder's buffering is why this should be checked through the decoder rather than reading the original Body separately.",
      "Fourth validate meaning. A decoder cannot know that an email is required or a quantity must be positive. Keep these errors separate enough for logs and tests, but expose stable JSON error responses without leaking internals. Test valid input, unknown fields, a second JSON value, malformed syntax, oversize bodies, and invalid domain data."
    ),
    visualType: "flow_diagram",
    visualTitle: "One-document request gate",
    visual: mermaid(`flowchart LR
  B[Bound body size] --> C[Configure Decoder]
  C --> D[Decode typed value]
  D --> E[Second Decode]
  E -->|io.EOF| V[Validate domain rules]
  E -->|value or error| R[Reject trailing input]`),
    codeTitle: "Reject unknown fields and trailing values",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"
)

type Input struct { Name string §json:"name"§ }

func decodeOne(text string) error {
	dec := json.NewDecoder(strings.NewReader(text))
	dec.DisallowUnknownFields()
	var in Input
	if err := dec.Decode(&in); err != nil { return err }
	var extra any
	if err := dec.Decode(&extra); err != io.EOF {
		if err == nil { return fmt.Errorf("more than one JSON value") }
		return fmt.Errorf("trailing data: %w", err)
	}
	fmt.Println(in.Name)
	return nil
}

func main() {
	if err := decodeOne(§{\"name\":\"Ada\"}§); err != nil { panic(err) }
	fmt.Println(decodeOne(§{\"name\":\"Ada\"} {}§) != nil)
}`),
    codeNote: "The second call is the single-document check; DisallowUnknownFields does not perform that job.",
    followups: ["Why is one successful Decode not enough?", "What does DisallowUnknownFields not validate?", "Why should the same Decoder inspect trailing input?"],
  },
);

function wordCount(value) {
  return String(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function metaDescription(value) {
  const plain = value.replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();
  return plain.length <= 210 ? plain : `${plain.slice(0, 207).trimEnd()}...`;
}

function metaTitle(value) {
  const suffix = " | Go interview";
  const limit = 80 - suffix.length;
  return `${value.length <= limit ? value : value.slice(0, limit).trimEnd()}${suffix}`;
}

function curateTopic(topicSlug, specs) {
  if (specs.length !== 3) throw new Error(`${topicSlug}: expected exactly three lessons, found ${specs.length}.`);
  const file = path.join(moduleRoot, topicSlug, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  const retained = document.questions.slice(0, 3);
  if (retained.length !== 3) throw new Error(`${topicSlug}: q001-q003 are missing.`);
  document.topic = topicTitles[topicSlug];
  document.topicSlug = topicSlug;
  document.questions = specs.map((spec, index) => {
    const previous = retained[index];
    const suffix = `q00${index + 1}`;
    if (!previous.id.endsWith(suffix)) throw new Error(`${topicSlug}: expected ${suffix}, found ${previous.id}.`);
    if (!previous.slug) throw new Error(`${topicSlug}: ${suffix} has no route slug.`);
    const speaking = formatInterviewArticle(spec.speaking);
    const sections = [
      { type: "key_points", title: "Quick revision", items: spec.quick },
      { type: "speakable_answer", title: "Interview answer", answerSize: interviewAnswerSize(speaking), content: speaking },
      { type: "overview", title: spec.overviewTitle, content: spec.overview },
      { type: "deep_explanation", title: spec.deepTitle, content: spec.deep },
      { type: spec.visualType, title: spec.visualTitle, content: spec.visual },
      { type: "code_example", title: spec.codeTitle, content: `${spec.source}\n${spec.codeNote}` },
    ];
    const totalWords = [spec.direct, speaking, spec.overview, spec.deep, spec.visual, spec.codeNote]
      .map(wordCount)
      .reduce((sum, count) => sum + count, 0);
    return {
      ...previous,
      question: spec.question,
      title: spec.title,
      direct_answer: spec.direct,
      layout_type: "concept-explanation",
      difficulty: "easy",
      importance: "high",
      reading_time_minutes: Math.max(5, Math.ceil(totalWords / 200)),
      last_updated: "2026-09-07",
      interviewer_intent: { testing: spec.testing },
      answer: { sections },
      followup_questions: spec.followups,
      order: index + 1,
      seo: {
        ...previous.seo,
        metaTitle: metaTitle(spec.title),
        metaDescription: metaDescription(spec.direct),
      },
    };
  });
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

function curateModuleDocuments() {
  const configPath = path.join(moduleRoot, "_config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  Object.assign(config, {
    title: "Go JSON and HTTP Basics",
    description: "Typed and dynamic JSON, strict decoding, HTTP client ownership, safe bodies, handlers, server policy, and test boundaries",
    topics: topicOrder.map((slug) => ({ slug, title: topicTitles[slug] })),
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
    intro: "Learn the encoding/json and net/http contracts behind everyday Go services: typed conversion, tags, optional values, exact numbers, bounded requests and responses, reusable clients, correct JSON handlers, explicit server limits, and focused httptest boundaries. The module contains 24 distinct lessons with runnable examples.",
  });
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  const revision = {
    title: "Go JSON and HTTP Basics — Revision",
    estimatedMinutes: 20,
    status: "gold-standard",
    questionCount: 24,
    lastUpdated: "2026-09-07",
    sections: [
      {
        id: "json-contract",
        title: "JSON is a typed boundary",
        body: "Marshal converts supported Go values to bytes; Unmarshal populates a non-nil pointer. Exported fields and tags define the object shape. Classic encoding/json accepts case-insensitive field matches and ignores unknown keys by default, while a configured Decoder can reject unknown keys and a second Decode requiring io.EOF can enforce one document.",
      },
      {
        id: "presence-numbers",
        title: "Preserve meaning, not just syntax",
        body: "omitempty uses classic empty-value rules; omitzero uses IsZero or the Go zero value. Pointers preserve supplied zero versus missing-or-null, while a custom optional type can keep all three states. Dynamic numbers become float64 unless Decoder.UseNumber retains json.Number for checked conversion.",
      },
      {
        id: "client-lifecycle",
        title: "HTTP clients own exchanges",
        body: "Reuse http.Client and Transport values, create a Request per call, and propagate context. A non-2xx status is not a Go transport error. After a successful Do, close the non-nil response body; consume expected bounded bodies fully so persistent connections can be reused when possible.",
      },
      {
        id: "server-lifecycle",
        title: "Handlers commit one response",
        body: "A Handler reads and validates its Request, sets response headers before the final status or first Write, writes one consistent JSON body, and returns. Dedicated ServeMux and Server values expose route ownership, timeouts, and graceful Shutdown. Recorder tests isolate handlers; test servers cover real client and transport behavior.",
      },
    ],
  };
  fs.writeFileSync(path.join(moduleRoot, "_revision.json"), `${JSON.stringify(revision, null, 2)}\n`);

  const indexPath = path.join(domainRoot, "_index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const module = index.modules.find((entry) => entry.moduleSlug === "go-json-http-basics");
  if (!module) throw new Error("Go M10 go-json-http-basics is missing from _index.json.");
  Object.assign(module, {
    title: "Go JSON and HTTP Basics",
    topics: topicOrder,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
    intro: "Twenty-four focused Go JSON and HTTP interview lessons cover the contracts freshers use in real services: exported fields and tags, unsupported values, strict single-document decoding, omitempty and omitzero, presence and number precision, reusable clients, timeouts, bounded response bodies, HTTP status handling, JSON handler commit order, explicit server policy, and httptest choices. Every retained q001-q003 route contains an independent teaching section and a runnable example.",
  });
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
}

const byTopic = new Map(topicOrder.map((topic) => [topic, []]));
function run() {
  if (lessons.length !== 24) throw new Error(`Expected 24 lessons, found ${lessons.length}.`);
  for (const lesson of lessons) {
    const bucket = byTopic.get(lesson.topic);
    if (!bucket) throw new Error(`Unexpected topic ${lesson.topic}.`);
    bucket.push(lesson);
  }
  for (const topic of topicOrder) curateTopic(topic, byTopic.get(topic));
  curateModuleDocuments();
  console.log("Curated Go M10 go-json-http-basics: 24 retained gold lessons; removed q004/q005 shells from eight topics.");
}

lessons.push(
  {
    topic: "http-server-basics",
    question: "How does an http.Handler process a request in Go?",
    title: "The Go HTTP handler contract",
    direct: "An http.Handler implements ServeHTTP(ResponseWriter, *Request), reads the request it needs, writes headers, status, and body through ResponseWriter, then returns to finish the request.",
    testing: "Handler interface, request and response ownership, method routing, and completion boundary.",
    quick: [
      "http.Handler has one method: ServeHTTP(http.ResponseWriter, *http.Request).",
      "HandlerFunc adapts a matching function into a Handler.",
      "The Request carries method, URL, headers, body, and context.",
      "The ResponseWriter builds status, response headers, and body.",
      "Do not use ResponseWriter or read Body after ServeHTTP returns.",
    ],
    speaking: p(
      "- Go's server abstraction is `http.Handler`, an interface with `ServeHTTP(http.ResponseWriter, *http.Request)`. A normal function with that signature can become a Handler through `http.HandlerFunc`, which is why `mux.HandleFunc` accepts concise endpoint functions.",
      "- The Request describes the incoming exchange: method, path, query, headers, body, and context. The handler reads the input it needs, usually before starting the response. For server requests, Body is always non-nil and the server closes it; the handler normally does not need to close it.",
      "- The ResponseWriter is where the handler sets response headers, chooses a status, and writes bytes. For example, a `/health` handler can reject methods other than GET with 405, set `Content-Type`, then encode a small JSON object. Returning from ServeHTTP signals that the request is finished.",
      "- ResponseWriter and Request.Body must not be used after or concurrently with completion of ServeHTTP. If background work is needed, copy only the safe values it needs and do not let it write the original response later. The incoming request context is canceled when the client disconnects in supported cases or when ServeHTTP returns.",
      "- A handler is therefore a boundary with clear ownership: parse bounded input, validate it, call application logic with the request context, and construct one response before returning. Separating domain work from HTTP details also makes the handler easy to test with `httptest.NewRequest` and `httptest.NewRecorder`."
    ),
    overviewTitle: "One call owns one request-response exchange",
    overview: "The server chooses a handler, calls ServeHTTP, and considers the exchange complete when it returns. Request values flow inward; status, headers, and bytes flow outward through ResponseWriter.",
    deepTitle: "Keep protocol work at the edge",
    deep: p(
      "A ServeMux selects a handler from request method, host, and path according to its registered patterns. The handler should still enforce and test the intended method, especially when using patterns that do not include one.",
      "Read and validate the request before writing the response when practical. Once a final status or body byte is sent, many failures can no longer be changed into a clean client error. Cautious ordering also avoids protocol differences around reading a request body after responding.",
      "Pass `r.Context()` into database and downstream operations. It communicates that work belongs to this request. Do not store the request itself beyond the call or use the ResponseWriter from a newly launched goroutine after return.",
      "Handler tests can call the function directly with a recorder and synthetic request. Integration tests can use a full httptest server when routing, client behavior, or real HTTP serialization is part of the question."
    ),
    visualType: "sequence_diagram",
    visualTitle: "Handler request lifecycle",
    visual: mermaid(`sequenceDiagram
  participant C as Client
  participant S as Server/Mux
  participant H as Handler
  C->>S: HTTP request
  S->>H: ServeHTTP(w, r)
  H->>H: read, validate, run logic
  H-->>S: headers + status + body; return
  S-->>C: HTTP response`),
    codeTitle: "Test a handler without opening a port",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
)

func health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet { w.WriteHeader(http.StatusMethodNotAllowed); return }
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

func main() {
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	health(rec, req)
	resp := rec.Result()
	defer resp.Body.Close()
	fmt.Println(resp.StatusCode, resp.Header.Get("Content-Type"))
}`),
    codeNote: "NewRecorder captures the ResponseWriter contract, while Result exposes the response the client would observe.",
    followups: ["Who closes a server request body?", "When is the incoming request context canceled?", "Why should background work not retain ResponseWriter?"],
  },
  {
    topic: "http-server-basics",
    question: "How do you write a correct JSON response from a Go HTTP handler?",
    title: "JSON response headers, status, and errors",
    direct: "Set Content-Type before committing the response, choose the final status before writing body bytes, and emit one consistent JSON shape for success or errors. The first Write otherwise commits 200.",
    testing: "Commit ordering, JSON media type, error consistency, and late encoding failure boundary.",
    quick: [
      "Set Content-Type to application/json before WriteHeader or Write.",
      "The first Write commits StatusOK if no final status was written.",
      "Only one final 2xx–5xx status can be sent.",
      "http.Error writes text/plain, not a JSON error document.",
      "Marshal into a buffer first when encoding can fail and status must remain changeable.",
    ],
    speaking: p(
      "- A correct JSON response is mostly about ordering. Set `Content-Type: application/json` first, decide the final HTTP status, call `WriteHeader` when it is not 200, then write or encode the JSON body. If Write is called first, net/http implicitly commits `200 OK`, and later header or status changes normally have no effect.",
      "- For example, a create handler can validate input, build a response value, set the content type, call `WriteHeader(http.StatusCreated)`, and encode it. An error path should use the same JSON error schema—perhaps `{" + "\"error\":\"invalid_name\"}" + "`—rather than `http.Error`, which produces a text/plain response.",
      "- `json.NewEncoder(w).Encode` writes directly to the response and appends a newline. It is convenient when the value is known to encode safely. But if a custom marshaler or unsupported value fails after a final status has been committed, the handler cannot replace it with a clean 500 response.",
      "- When encoding failure is realistic and the status matters, call `json.Marshal` first. If it succeeds, set headers and status and write the complete bytes; if it fails, produce the JSON error before anything is committed. Buffering costs memory, so streaming is still useful for large or intentionally streamed responses with a defined failure protocol.",
      "- I keep one response helper that accepts a status and serializable value, and a separate safe error helper. Tests assert status, media type, and decoded body for every branch. That makes response consistency a property of code rather than a convention people must remember."
    ),
    overviewTitle: "HTTP output has a commit point",
    overview: "Headers and status are mutable only until the final response is committed. JSON encoding placed after that point can report an error to the server, but it may be too late to report a different status to the client.",
    deepTitle: "Prepare before committing when recovery matters",
    deep: p(
      "ResponseWriter.Header returns the pending header map. Once a final WriteHeader or the first Write occurs, later normal changes do not alter the response. Explicit WriteHeader is mainly needed for non-200 responses.",
      "A reusable JSON helper can marshal the value first, then set Content-Type, write the status, and write bytes. It should decide how to handle the unlikely final Write error, which can mean the client disconnected after the response was committed.",
      "Error bodies benefit from stable machine-readable codes and human-readable messages, but should not reveal parser internals or secrets. Use status to classify the HTTP result and JSON fields for application detail.",
      "Handler tests must inspect the recorder's Result rather than only its body. A body can look correct while an implicit 200 or wrong media type makes the protocol wrong."
    ),
    visualType: "flow_diagram",
    visualTitle: "Safe response commit order",
    visual: mermaid(`flowchart LR
  V[Validate and build value] --> M[Marshal if recovery needed]
  M --> H[Set Content-Type]
  H --> S[Write final status]
  S --> B[Write JSON bytes]
  V -. error before commit .-> E[Write JSON error]`),
    codeTitle: "Commit only after JSON encoding succeeds",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
)

func writeJSON(w http.ResponseWriter, status int, value any) {
	b, err := json.Marshal(value)
	if err != nil { b = []byte(§{"error":"encoding_failed"}§); status = http.StatusInternalServerError }
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(b)
}

func main() {
	rec := httptest.NewRecorder()
	writeJSON(rec, http.StatusCreated, map[string]int{"id": 7})
	resp := rec.Result()
	defer resp.Body.Close()
	fmt.Println(resp.StatusCode, resp.Header.Get("Content-Type"), rec.Body.String())
}`),
    codeNote: "Marshal happens before the final status, so an encoding error can still select a JSON 500 response.",
    followups: ["What status does the first Write imply?", "Why is http.Error inconsistent for a JSON API?", "When is direct Encoder streaming still appropriate?"],
  },
  {
    topic: "http-server-basics",
    question: "Why use an explicit ServeMux and http.Server in a Go service?",
    title: "Owning routes, timeouts, and graceful shutdown",
    direct: "An explicit ServeMux avoids global route state, while http.Server owns addresses and timeout boundaries and supports graceful Shutdown. The convenience ListenAndServe form leaves those policies implicit.",
    testing: "Default-mux boundaries, server timeout fields, ListenAndServe return behavior, and graceful shutdown.",
    quick: [
      "A dedicated ServeMux keeps route ownership local and testable.",
      "Passing nil as a handler uses http.DefaultServeMux.",
      "Server timeouts are zero by default unless configured.",
      "ReadHeaderTimeout, ReadTimeout, WriteTimeout, and IdleTimeout cover different phases.",
      "Shutdown stops new work and waits for active connections within its context.",
    ],
    speaking: p(
      "- The package-level `http.HandleFunc` and `http.ListenAndServe(addr, nil)` are convenient for examples, but nil selects the global `http.DefaultServeMux`. A dedicated `http.NewServeMux` keeps registrations owned by one service, prevents test and package collisions, and can be passed directly into handler tests.",
      "- An explicit `http.Server` groups the network address, handler, and operational limits. Its zero value is valid, but zero or negative read and write timeout values generally mean no timeout. Typical services deliberately set `ReadHeaderTimeout`, and choose `ReadTimeout`, `WriteTimeout`, and `IdleTimeout` according to request and streaming behavior.",
      "- For example, a service builds a mux, registers `/health`, constructs `Server{Addr: \":8080\", Handler: mux, ReadHeaderTimeout: 5*time.Second, IdleTimeout: 60*time.Second}`, and starts it. ListenAndServe always returns a non-nil error; after Shutdown, that normal result is `http.ErrServerClosed` and should not be logged as a crash.",
      "- Server-level timeouts are broad connection boundaries, not full business deadlines. Handlers still use request context and per-operation limits. A WriteTimeout may conflict with long streaming responses, while ReadTimeout includes the body and cannot express endpoint-specific upload rates.",
      "- Graceful Shutdown closes listeners, closes idle connections, and waits for active ones to become idle until its context ends. I give shutdown its own finite context, reject only unexpected serve errors, and separately coordinate background workers or hijacked connections that Server.Shutdown does not manage automatically."
    ),
    overviewTitle: "The server object is the operational boundary",
    overview: "Mux owns routing, Server owns connection policy, handlers own request-specific work, and the shutdown coordinator owns process lifetime. Keeping these responsibilities explicit makes tests and production behavior agree.",
    deepTitle: "Apply limits at the layer that can understand them",
    deep: p(
      "ReadHeaderTimeout limits how long header parsing may take and is a common protection for public servers. ReadTimeout covers the entire request read including body. Handler code can add `MaxBytesReader` because it knows the allowed body size for a particular endpoint.",
      "WriteTimeout limits response writes according to Server's connection deadlines. Long-lived streaming needs a tailored design rather than copying ordinary JSON endpoint values. IdleTimeout limits waiting for the next keep-alive request and falls back to ReadTimeout when left zero.",
      "Shutdown does not abruptly cut active handlers. Its context limits how long the process waits, but cancellation of that shutdown context does not itself guarantee every application goroutine stops. Services need explicit ownership for queues, consumers, and upgraded connections.",
      "Tests can build the mux without listening and verify routes through a recorder. Lifecycle tests can serve on a test listener, begin a controlled request, call Shutdown, and prove the active work gets its allowed completion window."
    ),
    visualType: "architecture_diagram",
    visualTitle: "Server responsibility layers",
    visual: mermaid(`flowchart TD
  P[Process lifecycle] --> S[http.Server]
  S --> M[Dedicated ServeMux]
  M --> H[Handlers]
  S --> T[Connection timeouts]
  H --> R[Request context and body limit]
  P -->|Shutdown context| S`),
    codeTitle: "Configure an explicit server without listening",
    source: go(`package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"time"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) { fmt.Fprint(w, "ok") })
	server := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second, IdleTimeout: 60 * time.Second}
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	server.Handler.ServeHTTP(rec, req)
	fmt.Println(rec.Code, rec.Body.String(), server.ReadHeaderTimeout)
}`),
    codeNote: "The explicit mux and server policies can be inspected and tested without binding a real application port.",
    followups: ["What handler is used when ListenAndServe receives nil?", "Which timeout covers request headers?", "Why is ErrServerClosed often a normal result?"],
  },
);

lessons.push(
  {
    topic: "comparisons",
    question: "When should you use json.Marshal, Encoder, Unmarshal, or Decoder?",
    title: "Choosing buffered or streaming JSON APIs",
    direct: "Marshal and Unmarshal work with complete byte slices; Encoder and Decoder connect JSON to io.Writer and io.Reader streams. Choose from ownership, document boundaries, memory, and error-recovery needs.",
    testing: "Symmetric API pairs, newline and buffering behavior, and honest streaming trade-offs.",
    quick: [
      "Marshal returns complete JSON bytes; Unmarshal consumes complete JSON bytes.",
      "Encoder writes to an io.Writer and Encode appends a newline.",
      "Decoder reads from an io.Reader and can process sequential JSON values.",
      "Decoder buffers and may read beyond the requested value.",
      "One-document protocols must enforce their own end boundary with Decoder.",
    ],
    speaking: p(
      "- `json.Marshal` and `json.Unmarshal` are the complete-buffer pair. Marshal creates `[]byte`, and Unmarshal validates and consumes a byte slice as one JSON value. They are simple for small request objects, stored documents, tests, and cases where encoding must finish before an HTTP status is committed.",
      "- `json.Encoder` and `json.Decoder` are the stream pair. Encoder writes to an `io.Writer`; each Encode writes one JSON value followed by a newline. Decoder reads from an `io.Reader`, has its own buffer, and can decode consecutive values or traverse tokens in a large array.",
      "- For example, a newline-delimited stream can loop over records and call Encode once per record, while its consumer calls Decode until `io.EOF`. A normal REST endpoint expecting one object should not interpret that stream behavior as permission for a second document; it decodes once, then requires EOF.",
      "- Streaming avoids one extra complete byte slice, but it does not guarantee constant memory because the decoded destination may still be large. It also changes error recovery: an Encoder can fail after earlier bytes have reached the writer, whereas Marshal either returns complete bytes or an error to its caller.",
      "- I choose the API that matches the surrounding interface. Byte ownership and atomic preparation favor Marshal/Unmarshal. Readers, writers, or intentional sequences favor Encoder/Decoder. In both cases I define size, number of documents, strictness, validation, and error handling instead of assuming the method name supplies those policies."
    ),
    overviewTitle: "The data source does not define the protocol",
    overview: "A Reader can contain one document or many, and a byte slice can contain a large document. The API controls buffering and I/O shape; the caller still defines document count, size, and schema rules.",
    deepTitle: "Compare boundaries, not just memory claims",
    deep: p(
      "Unmarshal is strict about trailing non-whitespace after its single value. Decoder is stream-oriented, so one Decode can leave another value for later. That difference is crucial at HTTP boundaries and easy to miss in otherwise correct code.",
      "Encoder's newline is valid whitespace after a JSON value and useful for record streams. It may be observable in exact-byte tests or signatures, so Marshal gives more direct byte control when formatting matters.",
      "Decoder may read beyond one requested value into its private buffer. Continue using the same Decoder for the stream, and use Buffered only for a carefully designed mixed protocol. Do not resume from the underlying reader assuming no lookahead occurred.",
      "Benchmark only after correctness. For many small HTTP objects, clarity and recovery before commit matter more than eliminating one byte slice. For genuinely large streams, incremental protocol and backpressure design matter much more. Current Go documentation calls this import the v1 package; `encoding/json/v2` changes defaults such as name matching and omitempty semantics, so a migration needs an explicit contract review rather than copied assumptions."
    ),
    visualType: "comparison_table",
    visualTitle: "JSON API pairs",
    visual: "| API | Input/output | Document behavior | Useful boundary |\n|---|---|---|---|\n| Marshal | Go value → `[]byte` | one complete value | prepare before commit |\n| Unmarshal | `[]byte` → Go value | rejects trailing non-space | small complete input |\n| Encoder | Go value → Writer | Encode writes value + newline | output stream |\n| Decoder | Reader → Go value | supports sequential values | input stream |",
    codeTitle: "Decode a deliberate JSON value stream",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"
)

type Item struct { ID int §json:"id"§ }

func main() {
	dec := json.NewDecoder(strings.NewReader(§{\"id\":1}\n{\"id\":2}\n§))
	for {
		var item Item
		err := dec.Decode(&item)
		if err == io.EOF { break }
		if err != nil { panic(err) }
		fmt.Println(item.ID)
	}
}`),
    codeNote: "Repeated Decode is correct because this input is intentionally a sequence rather than one HTTP document.",
    followups: ["Does Encoder.Encode append a newline?", "Why can Decoder consume beyond one value?", "Which API makes pre-commit encoding failure easier to handle?"],
  },
  {
    topic: "comparisons",
    question: "What is the difference between http.Get, http.Post, and Client.Do?",
    title: "HTTP convenience functions versus custom requests",
    direct: "http.Get and http.Post use DefaultClient for common fixed request shapes. NewRequestWithContext plus a reusable Client.Do supports caller context, custom methods, headers, bodies, and client policy.",
    testing: "Convenience wrapper limits, DefaultClient timeout boundary, and why Do is not automatically lower level or safer.",
    quick: [
      "http.Get and http.Post are wrappers around DefaultClient methods.",
      "DefaultClient is usable but has no overall timeout by default.",
      "Client.Do sends a fully constructed Request.",
      "Use NewRequestWithContext for cancellation and custom headers or methods.",
      "All successful forms return a response body the caller must close.",
    ],
    speaking: p(
      "- `http.Get` and `http.Post` are package-level conveniences that use `http.DefaultClient`. They make tiny examples concise: Get accepts a URL, while Post also accepts a content type and body reader. Their response and error rules are the same client rules, including the need to inspect status and close a successful response body.",
      "- `Client.Do` accepts a prepared Request and is the general form. `http.NewRequestWithContext` can attach caller cancellation, any HTTP method, headers such as Authorization or Accept, and a body. A named client can provide a timeout, redirect policy, cookies, and a custom Transport.",
      "- For example, posting JSON with an Authorization header needs a Request because the `http.Post` signature has nowhere to supply that header. The code creates one request, sets both Content-Type and Authorization, then sends it through the long-lived API client.",
      "- Convenience is not automatically wrong. A one-off tool using a surrounding context with its own controls may be fine, but `DefaultClient` has a zero overall Timeout. Library code should avoid silently imposing or mutating global policy, and service integrations benefit from an injected client that can be tested.",
      "- I use the convenience functions only when their exact fixed shape and global client policy are appropriate. For application integrations, NewRequestWithContext plus a reused Client is usually clearer because request-specific and shared policy are both visible. Whichever form is used, status, bounded body processing, and Close remain required."
    ),
    overviewTitle: "Convenience removes configuration points",
    overview: "The wrappers save construction code by choosing DefaultClient and a fixed request shape. Do exposes the Request and Client separately, which is what enables explicit lifetime, headers, methods, and test injection.",
    deepTitle: "Choose who owns HTTP policy",
    deep: p(
      "Package functions are suitable at the outer edge of a small program where global defaults are intentional. Deep library helpers should not depend on mutable process-wide behavior because callers cannot isolate timeouts, proxies, or tests cleanly.",
      "A client stored in an integration type owns shared policy. A Request built per call owns method, URL, context, headers, and body. This separation prevents an authorization header from leaking into unrelated operations and preserves connection reuse.",
      "Do itself does not validate a 2xx status or decode JSON. Moving from Get to Do unlocks configuration, not automatic correctness. The same response lifecycle applies after either call.",
      "Tests with httptest can assert that the custom form really sent the intended method, header, and body. A compile-successful request can still be wrong at the protocol level, so observe what the handler receives."
    ),
    visualType: "comparison_table",
    visualTitle: "HTTP request APIs",
    visual: "| Need | `http.Get` / `http.Post` | Request + `Client.Do` |\n|---|---|---|\n| global DefaultClient | always | optional |\n| custom method | no | yes |\n| caller context | not in package function signature | yes |\n| arbitrary headers | no | yes |\n| response cleanup/status checks | required | required |",
    codeTitle: "Send headers with Client.Do",
    source: go(`package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
)

func main() {
	s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { fmt.Fprintln(w, r.Method, r.Header.Get("Authorization")) }))
	defer s.Close()
	req, err := http.NewRequest(http.MethodPut, s.URL, nil)
	if err != nil { panic(err) }
	req.Header.Set("Authorization", "Bearer test-token")
	resp, err := s.Client().Do(req)
	if err != nil { panic(err) }
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil { panic(err) }
	fmt.Printf("%d %s", resp.StatusCode, body)
}`),
    codeNote: "A custom method and header require an explicit Request; the test server observes the actual protocol message.",
    followups: ["Which client do package-level Get and Post use?", "Can http.Post set an Authorization header directly?", "Does Client.Do consider 404 a Go error?"],
  },
  {
    topic: "comparisons",
    question: "When should you use httptest.NewRecorder or httptest.NewServer?",
    title: "Handler tests versus HTTP integration tests",
    direct: "Use NewRecorder with a synthetic Request for fast handler-level checks, and NewServer when the real client, transport, routing, serialization, or network boundary is part of the behavior being tested.",
    testing: "Testing-layer choice, what each helper includes, and realistic assertions without unnecessary networking.",
    quick: [
      "NewRecorder captures writes made by one handler invocation.",
      "httptest.NewRequest creates a server-style request for handler tests.",
      "NewServer starts a loopback server; Go 1.27's NewTestServer is the preferred test-bound helper.",
      "Recorder tests isolate handler logic; server tests include a real Client and Transport path.",
      "Choose the smallest boundary that includes the behavior under test.",
    ],
    speaking: p(
      "- `httptest.NewRecorder` creates a ResponseWriter implementation that records status, headers, and body. Combined with `httptest.NewRequest`, it lets a test call one Handler directly. This is fast and precise for method checks, validation, JSON response shape, and status/header ordering.",
      "- `httptest.NewServer` starts an actual HTTP server on a local loopback address. A real Client sends serialized HTTP through its Transport, so this boundary covers routing, request construction, headers, response-body ownership, redirects, and client decoding. The caller must close this server when finished.",
      "- For example, a handler unit test can pass malformed JSON to a recorder and assert 400 plus an `application/json` error. A client integration test can point an API client at NewServer and prove it sends Authorization, treats 404 as a status error, and closes or decodes the response.",
      "- A recorder is not a full network simulation. It may not expose every protocol behavior, optional ResponseWriter interface, timeout, connection, or client concern. In Go 1.27 and later, `NewTestServer(t, handler)` is the preferred test-bound helper: it uses an in-memory network by default, registers test cleanup, and reports handler panics through the test. The runnable lesson keeps `NewServer` so it also works on Go 1.26.",
      "- I choose the narrowest faithful boundary: recorder for handler behavior, server for interactions between client and server or behavior owned by net/http. Then I assert observable protocol results—status, headers, body, method, path—rather than private implementation calls. A few broader tests can protect assembly while the larger fast suite keeps each handler branch easy to diagnose."
    ),
    overviewTitle: "Test the owner of the behavior",
    overview: "Handler decisions belong in direct tests; transport and integration decisions require a client-server exchange. Both helpers are in-memory-friendly and avoid dependence on external services, but they cover different layers.",
    deepTitle: "Build a small HTTP testing pyramid",
    deep: p(
      "Most endpoint cases can use one table against a Handler: valid input, malformed JSON, invalid values, method mismatch, and application errors. Recorder.Result gives the response view, including generated headers.",
      "A smaller set of server tests exercises the assembled mux and client. On Go 1.27+, NewTestServer is normally the first choice; NewServer remains useful for standalone examples and older toolchains. Either boundary catches wrong paths, missing headers, bad base-URL joining, and assumptions about status or body cleanup that a direct handler call cannot reveal.",
      "Dependencies behind handlers should have fakes or focused test doubles, not a real database merely because httptest is present. Conversely, do not mock net/http so deeply that request serialization is never tested.",
      "Tests must close response bodies and servers just like production code. Cleanup is part of the behavior and prevents the test suite itself from hiding resource-lifetime bugs."
    ),
    visualType: "comparison_table",
    visualTitle: "Pick the test boundary",
    visual: "| Question | Recorder + Request | Test Server |\n|---|---:|---:|\n| handler status/body | best fit | possible |\n| route assembly | limited | yes |\n| Client/Transport behavior | no | yes |\n| connection/body lifecycle | no | yes |\n| speed and isolation | highest | broader boundary |",
    codeTitle: "Exercise both handler and client boundaries",
    source: go(`package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func hello(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusAccepted); fmt.Fprint(w, "hello") }

func main() {
	rec := httptest.NewRecorder()
	hello(rec, httptest.NewRequest(http.MethodGet, "/", nil))
	fmt.Println("handler:", rec.Code)
	s := httptest.NewServer(http.HandlerFunc(hello))
	defer s.Close()
	resp, err := s.Client().Get(s.URL)
	if err != nil { panic(err) }
	defer resp.Body.Close()
	fmt.Println("server:", resp.StatusCode)
}`),
    codeNote: "The first assertion boundary is one function call; the second sends a real HTTP request through the test client's Transport.",
    followups: ["What does ResponseRecorder capture?", "When is a test server necessary?", "Why should tests also close response bodies?"],
  },
);

lessons.push(
  {
    topic: "http-get-post",
    question: "How do you make GET and POST requests with Go's http.Client?",
    title: "Sending HTTP requests and checking responses",
    direct: "Use a reusable http.Client, create or call the suitable request method, handle transport errors, close the response body, and inspect StatusCode because an HTTP error response is not a Go error.",
    testing: "The complete client lifecycle and separation of transport failure from HTTP status.",
    quick: [
      "Reuse one http.Client instead of constructing a client per request.",
      "Get and Post are conveniences; NewRequest plus Do supports headers and context.",
      "A nil Do error can still accompany a 404 or 500 response.",
      "When err is nil, close resp.Body after reading it.",
      "Set an appropriate timeout and bound response-body processing.",
    ],
    speaking: p(
      "- Go's HTTP client flow has two layers: build a request and send it through an `http.Client`. `client.Get` and `client.Post` are short conveniences for simple cases. `http.NewRequestWithContext` followed by `client.Do` is the normal form when I need cancellation, custom headers, methods such as PUT, or a reusable helper.",
      "- The returned error describes client policy or failure to speak HTTP, such as a connection, protocol, redirect, or timeout problem. A server response with status 404 or 500 is still a successfully exchanged HTTP response, so `err` can be nil. Application code must inspect `resp.StatusCode` and decide which range is acceptable.",
      "- For example, a JSON POST marshals a request value, creates a request using a bytes reader, sets `Content-Type: application/json`, and calls Do. If Do succeeds, the response body is non-nil and belongs to the caller. It must be closed, and successful endpoints usually decode or read it before returning.",
      "- A convenience call using `http.DefaultClient` has no overall client timeout because its Timeout is zero. Production code should choose a client timeout and often a request-specific context deadline. Response data is untrusted, so reading or decoding also needs a size policy rather than unlimited `io.ReadAll`.",
      "- I keep a configured client on a service or package, reuse it across calls, and make status handling explicit. That pattern preserves connection pooling and makes tests simple with `httptest.Server`: transport error, unsuccessful HTTP status, invalid body, and valid response are four separate outcomes."
    ),
    overviewTitle: "Success has two checks",
    overview: "The network exchange must succeed, then the response status must satisfy the application's protocol. Treating `err == nil` as business success skips the second check and can decode an error document as if it were normal data.",
    deepTitle: "Trace ownership from request to response",
    deep: p(
      "A request owns its outgoing body, and the Transport closes that body even when sending fails. A successful Do transfers a response whose Body the caller must close. Keep that ownership visible in one function so early returns cannot leak it.",
      "The client follows configured redirect, cookie, and transport policy. Client.Timeout covers connection time, redirects, and reading the response body. A request context can express the shorter lifetime of one operation or cancellation from its caller.",
      "Status policy belongs to the API integration. Some clients accept only 2xx; others treat 304 or a particular 409 as meaningful. Read a bounded error body when useful, but never report raw remote content as a trusted internal error without sanitizing it.",
      "Use an injected base URL and client in tests. An httptest server can assert method, header, and decoded request, then return controlled statuses and JSON without calling an external service."
    ),
    visualType: "flow_diagram",
    visualTitle: "HTTP client decision path",
    visual: mermaid(`flowchart LR
  R[Build request] --> D[Client.Do]
  D -->|Go error| T[Transport or policy failure]
  D -->|response| C[Close body later]
  C --> S{Status accepted?}
  S -- No --> H[HTTP-level failure]
  S -- Yes --> J[Bounded decode]`),
    codeTitle: "POST JSON to a test server",
    source: go(`package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.Header.Get("Content-Type") != "application/json" { http.Error(w, "bad request", 400); return }
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, §{"ok":true}§)
	}))
	defer server.Close()
	client := &http.Client{Timeout: time.Second}
	req, err := http.NewRequest(http.MethodPost, server.URL, bytes.NewBufferString(§{"name":"Mira"}§))
	if err != nil { panic(err) }
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil { panic(err) }
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil { panic(err) }
	fmt.Println(resp.StatusCode, string(body))
}`),
    codeNote: "The local test server makes method, header, status, body ownership, and client reuse visible without external network access.",
    followups: ["Does a 500 response make Client.Do return an error?", "Who closes a successful response body?", "When is NewRequest plus Do preferable to http.Post?"],
  },
  {
    topic: "http-get-post",
    question: "How do context deadlines and http.Client timeouts differ?",
    title: "Bounding an HTTP request's lifetime",
    direct: "Client.Timeout places an overall limit on that client's requests, while a request context carries caller cancellation or a per-operation deadline. The earlier cancellation normally ends the request and body read.",
    testing: "Timeout scope, zero defaults, context propagation, and cancellation cleanup.",
    quick: [
      "http.Client.Timeout includes connection, redirects, and response-body reading.",
      "A zero Client.Timeout means no overall client timeout.",
      "An outgoing request context controls connection, send, headers, and body reading.",
      "Use context.WithTimeout for an operation-specific deadline and call cancel.",
      "The effective lifetime is bounded by whichever configured cancellation happens first.",
    ],
    speaking: p(
      "- `http.Client.Timeout` is a simple whole-request limit attached to a reusable client. It includes time spent connecting, following redirects, and reading the response body, and its timer can interrupt a body read after `Do` has returned. A zero value means no overall client timeout.",
      "- A request context represents the lifetime inherited from the caller. `http.NewRequestWithContext` connects that context to obtaining a connection, sending the request, reading response headers, and reading the body. If an incoming handler is canceled, passing its context onward lets the downstream call stop too.",
      "- For example, a service client may have a ten-second safety timeout, while one autocomplete operation creates a 150-millisecond context. That request stops at the shorter context deadline. Another batch operation can use the same client with a different context rather than constructing a new client solely to change one deadline.",
      "- Timeouts are not a substitute for every transport setting or body-size bound. The client's overall Timeout may be too blunt for long streaming responses, where a context and more specific Transport timeouts can fit better. A deadline also cannot undo work the remote service has already committed; retry behavior requires idempotency rules.",
      "- I configure a non-zero safety policy for ordinary service clients, propagate caller context, add a narrower deadline only when the operation owns one, and always invoke the returned CancelFunc. Tests use a server that waits on `r.Context().Done()` so cancellation is verified rather than assumed."
    ),
    overviewTitle: "Client policy and call policy compose",
    overview: "The client provides a reusable safety ceiling; context expresses this call's ownership and cancellation chain. They solve related but different configuration needs and can be used together.",
    deepTitle: "Cancellation spans the response body",
    deep: p(
      "A common misconception is that the timeout ends when response headers arrive. Both Client.Timeout and the outgoing request context cover reading the body. A slow or endless body can therefore end with a context or timeout error during Decode or Read.",
      "Context values should not carry optional timeout knobs. Pass a context as the first parameter, derive a child with a deadline where ownership is clear, and defer cancel immediately to release timer resources even when work finishes early.",
      "For streaming APIs, a fixed overall timeout may intentionally be zero because the stream is long-lived. That does not mean unbounded operation: the caller context, heartbeat protocol, idle/read logic, and bounded message sizes become the relevant controls.",
      "Test deadline behavior deterministically with synchronization rather than tiny sleeps. A test handler can block until its request context closes, while the client request uses a comfortably short context and asserts an error matching context deadline behavior."
    ),
    visualType: "comparison_table",
    visualTitle: "Overlapping cancellation scopes",
    visual: "| Scope | Begins | Covers | Ends |\n|---|---|---|---|\n| Client.Timeout | before sending | connect, redirects, headers, body | configured duration |\n| Request context | caller/request creation | full outgoing request and response | cancel or deadline |\n| Effective request | send begins | whichever scope remains active | first cancellation |",
    codeTitle: "Cancel one call without replacing the client",
    source: go(`package main

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"time"
)

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		<-r.Context().Done()
	}))
	defer server.Close()
	client := &http.Client{Timeout: time.Second}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, server.URL, nil)
	if err != nil { panic(err) }
	_, err = client.Do(req)
	fmt.Println(err != nil)
}`),
    codeNote: "The request-specific context expires before the client's broader safety timeout and cancels the server-side request context.",
    followups: ["Does Client.Timeout include reading the body?", "What does a zero client timeout mean?", "Why call a CancelFunc even when work finishes first?"],
  },
  {
    topic: "http-get-post",
    question: "Why should Go programs reuse http.Client and Transport values?",
    title: "HTTP client reuse and custom requests",
    direct: "An http.Client's Transport keeps connection pools and is safe for concurrent use, so clients should be long-lived. Create requests per call, but reuse the configured client and usually its Transport.",
    testing: "Connection pooling, concurrency safety, configuration ownership, and request-level customization.",
    quick: [
      "http.Client values are safe for concurrent use.",
      "The Transport normally owns cached persistent connections.",
      "Create one client per policy, not one per request.",
      "Create a fresh Request for each operation and set its headers and context.",
      "Do not mutate a shared Transport while requests are using it.",
    ],
    speaking: p(
      "- An `http.Client` is designed to be reused. Its Transport usually stores connection pools, including idle TCP connections that can serve later requests to the same destination. Recreating a client and Transport for every call throws away that state, increases connection and TLS setup, and can waste sockets under load.",
      "- Clients are safe for concurrent use by multiple goroutines. A service can keep one client configured for a downstream API and create a new `http.Request` for each operation. The request carries its own method, URL, body, context, and headers, while the client supplies shared redirect, cookie, timeout, and transport policy.",
      "- For example, an `InventoryClient` can hold `baseURL` and `*http.Client`. Its methods construct requests with the caller's context and add authorization or content headers before calling Do. Tests replace the base URL with an httptest server and inject its client without changing production call logic.",
      "- Reuse does not mean mutating live shared configuration. Transport fields should be configured before requests begin; changing them concurrently is unsafe. Separate clients may be appropriate for genuinely different authentication, proxy, redirect, or timeout policies, and those clients can still share a deliberately configured Transport when safe.",
      "- Response behavior completes the pooling story. Callers close response bodies, and reading them to EOF supports reuse of persistent connections. I therefore make a client a dependency with a clear lifetime, create requests per call, and keep body cleanup and status checks in the same method."
    ),
    overviewTitle: "Reuse policy; recreate messages",
    overview: "Client and Transport hold policy and connection state. Request and Response represent one exchange. Giving those objects different lifetimes makes pooling efficient without leaking per-call headers or contexts across operations.",
    deepTitle: "Put ownership in a small service client",
    deep: p(
      "A package-level DefaultClient is usable, but an explicit dependency makes timeout and transport behavior visible. A service constructor can accept `*http.Client`, use a safe default when nil, and avoid hidden global mutation in tests.",
      "Authentication usually belongs on each Request or in a custom RoundTripper wrapper. Modifying `DefaultTransport` globally couples unrelated packages. A wrapper can clone the request before changing headers so caller-owned data is not mutated unexpectedly.",
      "Connection reuse still depends on destination, protocol, server policy, and response-body handling; it is not guaranteed for every exchange. The design goal is to allow the Transport to reuse connections rather than forcing a new pool each time.",
      "Load tests should observe connection counts and latency, while unit tests focus on method, URL, headers, cancellation, status, and body decoding. A reusable client is both a performance decision and a clean dependency boundary."
    ),
    visualType: "architecture_diagram",
    visualTitle: "Object lifetimes in an HTTP integration",
    visual: mermaid(`flowchart TD
  S[Service client] --> C[Long-lived http.Client]
  C --> T[Long-lived Transport and pools]
  S --> R1[Request per call]
  S --> R2[Request per call]
  R1 --> C
  R2 --> C`),
    codeTitle: "Inject and reuse a configured client",
    source: go(`package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
)

type API struct { BaseURL string; Client *http.Client }
func (a API) Get(ctx context.Context) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, a.BaseURL, nil)
	if err != nil { return "", err }
	resp, err := a.Client.Do(req)
	if err != nil { return "", err }
	defer resp.Body.Close()
	b, err := io.ReadAll(resp.Body)
	return string(b), err
}

func main() {
	s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { fmt.Fprint(w, "ready") }))
	defer s.Close()
	api := API{BaseURL: s.URL, Client: s.Client()}
	for i := 0; i < 2; i++ { value, err := api.Get(context.Background()); if err != nil { panic(err) }; fmt.Println(value) }
}`),
    codeNote: "Both operations create their own Request but share one test client's transport and connection pool.",
    followups: ["Are http.Client values safe for concurrent use?", "What state does a Transport retain?", "When might two APIs need separate clients?"],
  },
);

lessons.push(
  {
    topic: "reading-response-body",
    question: "Why must a Go HTTP client close the response body?",
    title: "Response body ownership and connection reuse",
    direct: "After a successful Client.Do, the caller owns a non-nil response body and must close it. Reading to EOF and closing lets the Transport reuse HTTP/1 connections when possible.",
    testing: "Body ownership, EOF and close behavior, early-exit cleanup, and bounded draining.",
    quick: [
      "If Client.Do returns nil error, resp.Body is non-nil.",
      "The caller must close the response body when finished.",
      "Reading to EOF and closing supports HTTP/1 keep-alive reuse.",
      "Defer Close immediately after the successful Do check in a small function.",
      "Do not drain an unlimited untrusted body merely to save a connection.",
    ],
    speaking: p(
      "- A successful `http.Client.Do` returns a Response with a non-nil Body, and the caller becomes responsible for closing it. The body represents a live stream from the transport, not just a byte field. Forgetting cleanup can retain connections and file-descriptor resources until much later.",
      "- For HTTP/1 persistent connections, the Transport may be unable to reuse the connection unless the body is read to EOF and closed. Normal successful code decodes or reads the expected body completely, checks the read error, then closes it. In a short function, `defer resp.Body.Close()` immediately after the successful Do check protects later error returns.",
      "- For example, a JSON client can check status, decode one small response object from Body, and return. If it rejects a status before normal decoding, it may read a small bounded error payload or discard a bounded remainder before closing. It should not copy an attacker-controlled multi-gigabyte body solely to preserve one keep-alive connection.",
      "- Current Transport implementations can try to finish a limited amount asynchronously when Close is called, but the public contract still says callers should read to EOF and close for reuse. Reuse is an optimization, whereas bounded memory and timely cancellation are correctness and safety requirements.",
      "- I keep body lifetime inside the method that made the request, never return a decoded value while leaving a hidden stream open, and preserve read or decode errors. The practical rule is close every successful response, consume expected bounded bodies fully, and choose a safe early-exit policy for unexpected responses."
    ),
    overviewTitle: "A response is a stream plus metadata",
    overview: "Status and headers arrive before the entire body. Do returning successfully means the exchange reached a response; it does not mean the body has been consumed, decoded, or released.",
    deepTitle: "Handle normal and early-return paths separately",
    deep: p(
      "On the normal path, decode the expected representation until completion, check that operation's error, and let a deferred Close release the body. A JSON Decoder may stop after one value, so a protocol expecting exact EOF can perform its own boundary check.",
      "On an error-status path, the body can contain useful diagnostics but remains untrusted. Read only a documented maximum, close it, and build a typed error containing status and a safe message. If the remaining body is large, sacrificing that connection is preferable to unbounded draining.",
      "Close errors are uncommon for response reads and often secondary to a prior read error, but code that writes to or depends on special body implementations may need an explicit policy. The central non-negotiable step is that Close is reached on every successful Do path.",
      "Connection-reuse tests are transport-level and can be brittle; unit tests should first prove the body gets closed on success, status failure, and decode failure using a tracked ReadCloser or controlled test server."
    ),
    visualType: "flow_diagram",
    visualTitle: "Response body lifecycle",
    visual: mermaid(`flowchart LR
  D[Client.Do succeeds] --> O[Caller owns Body]
  O --> S{Expected response?}
  S -- Yes --> E[Read or decode to completion]
  S -- No --> B[Read only bounded diagnostics]
  E --> C[Close]
  B --> C
  C --> R[Transport may reuse connection]`),
    codeTitle: "Read and close a bounded test response",
    source: go(`package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
)

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { fmt.Fprint(w, "small body") }))
	defer server.Close()
	resp, err := server.Client().Get(server.URL)
	if err != nil { panic(err) }
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, 1024))
	if err != nil { panic(err) }
	fmt.Println(string(body))
}`),
    codeNote: "The limit protects memory and the deferred Close covers every later return in this small operation.",
    followups: ["Why does reading to EOF matter for HTTP/1 reuse?", "Should a client always drain an unlimited error body?", "When does the caller own resp.Body?"],
  },
  {
    topic: "reading-response-body",
    question: "How do you safely read or decode an HTTP response body in Go?",
    title: "Bounded response-body decoding",
    direct: "Check the status and media type, place a size limit around the body, decode into the expected type, verify the document boundary when required, and always close the original response body.",
    testing: "Resource limits, typed decoding, media/status checks, and decoder boundary behavior.",
    quick: [
      "Inspect StatusCode before treating the body as success data.",
      "Validate Content-Type when the protocol requires JSON.",
      "Use io.LimitReader or another explicit response-size limit.",
      "Decode into a typed struct and check the Decode error.",
      "Close resp.Body even when status or decoding fails.",
    ],
    speaking: p(
      "- An HTTP body is remote input, so safe processing begins before decoding. After Do succeeds, I arrange for Close, check whether the status is accepted, and confirm the response media type when the API contract requires JSON. A 200 response containing HTML from a proxy should not be treated as a valid JSON success.",
      "- I then bound the bytes. `io.LimitReader` can expose at most a chosen number of bytes to `io.ReadAll` or `json.Decoder`, but by itself it does not report that additional bytes existed. Reading limit plus one and checking the length is a simple way to reject an oversized response rather than silently truncate it.",
      "- For example, a client expecting a small `User` object can read at most 1 MiB plus one byte, reject anything larger, then call `json.Unmarshal` on the complete bounded bytes. This gives exact single-document validation because Unmarshal rejects non-whitespace trailing data and avoids treating a second JSON value as valid.",
      "- Streaming Decoder is better when values are intentionally streamed or reading directly is important. For one response document, the caller should still enforce exactly one value, just as for a request. Strict unknown-field policy is a compatibility decision; response consumers often tolerate additive fields but still validate required values.",
      "- I report transport, status, size, media-type, and decode failures distinctly enough to diagnose them, while keeping the external error safe. Successful parsing is followed by domain validation. This sequence prevents an unlimited read, an error page decoded as data, or a partially understood document from entering application logic."
    ),
    overviewTitle: "Metadata narrows what the body is allowed to mean",
    overview: "Status tells whether the body is on the success path, Content-Type identifies the representation, a byte limit bounds cost, and the destination type defines shape. Each check removes one category of ambiguity before business logic sees the value.",
    deepTitle: "Choose buffered or streaming by protocol",
    deep: p(
      "A bounded full read is often simplest for small API documents. It makes the actual size known, allows Unmarshal to enforce one complete value, and lets callers include a sanitized snippet in status errors without leaving the stream half-consumed.",
      "A Decoder avoids assembling a separate full byte slice and supports sequential JSON values. It still allocates destination data, buffers ahead, and needs a caller-defined size and end-of-document policy. Streaming does not mean automatically safe or constant memory.",
      "Content-Type parameters are valid, so parse the media type rather than comparing the header to one exact string when strict checking is required. `application/json; charset=utf-8` still has the JSON media type.",
      "Tests should return wrong status, absent or wrong media type, malformed JSON, an exact-limit body, an over-limit body, two values, and valid JSON with invalid domain data. Each case targets a distinct boundary."
    ),
    visualType: "flow_diagram",
    visualTitle: "Safe response decode order",
    visual: mermaid(`flowchart LR
  R[Response] --> S[Check status]
  S --> M[Check media type]
  M --> L[Read up to limit + 1]
  L -->|too large| X[Reject]
  L --> U[Unmarshal typed value]
  U --> V[Validate meaning]`),
    codeTitle: "Reject a response larger than the limit",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
)

type Reply struct { Name string §json:"name"§ }

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.Header().Set("Content-Type", "application/json"); fmt.Fprint(w, §{"name":"Mira"}§) }))
	defer server.Close()
	resp, err := server.Client().Get(server.URL)
	if err != nil { panic(err) }
	defer resp.Body.Close()
	const limit = 1024
	b, err := io.ReadAll(io.LimitReader(resp.Body, limit+1))
	if err != nil { panic(err) }
	if len(b) > limit { panic("response too large") }
	var reply Reply
	if err := json.Unmarshal(b, &reply); err != nil { panic(err) }
	fmt.Println(reply.Name)
}`),
    codeNote: "Reading one byte beyond the limit distinguishes an exact-limit document from truncated oversized input.",
    followups: ["Why read limit plus one byte?", "Does json.Decoder remove the need for a size limit?", "How should Content-Type parameters be handled?"],
  },
  {
    topic: "reading-response-body",
    question: "How do transport errors, HTTP status errors, and JSON errors differ?",
    title: "Separating HTTP client failure layers",
    direct: "A transport error means no usable exchange completed, an HTTP status error is an application decision about a real response, and a JSON error means the received representation could not be decoded as expected.",
    testing: "Accurate failure classification, body ownership at each layer, and useful typed errors.",
    quick: [
      "Client.Do errors cover policy, connection, protocol, and timeout failures.",
      "A 4xx or 5xx response normally arrives with nil Go error.",
      "Status failures can still carry a useful bounded response body.",
      "JSON syntax or type failures happen while processing a response body.",
      "Retry rules depend on operation semantics and failure class, not one generic error.",
    ],
    speaking: p(
      "- An HTTP integration can fail at different layers, and combining them into 'request failed' loses important meaning. A non-nil error from `Client.Do` normally describes policy or inability to complete the HTTP exchange: DNS, connection, TLS, timeout, redirect policy, or protocol failure.",
      "- If Do returns a response with nil error, HTTP worked. The server may still answer 404, 409, 429, or 500. Those statuses are not Go errors; the client maps them into its own domain error after reading a small bounded error representation and closing the body.",
      "- A third failure occurs after an accepted status when the body is malformed JSON, has a wrong field type, exceeds the limit, or violates domain validation. For example, a 200 containing `{" + "\"count\":\"many\"}" + "` cannot populate an integer field. Calling that a transport error would point debugging and retry logic in the wrong direction.",
      "- Retry decisions need this separation. A context deadline may or may not be safe to retry depending on whether the remote operation committed. A 429 can include retry guidance, a 400 normally requires changing the request, and malformed success JSON signals a contract or deployment problem. Idempotency and attempt limits remain required.",
      "- I return typed or wrapped errors that preserve operation and cause, plus status when one exists, without leaking a huge remote body. Tests force one case from each layer. That makes logs, metrics, user messages, and retry policy reflect what actually failed."
    ),
    overviewTitle: "Each later layer proves the earlier one succeeded",
    overview: "An HTTP status exists only after a response was exchanged. A body-decode error exists only after a response and chosen status path. This ordering tells code which metadata is available and who owns cleanup.",
    deepTitle: "Design errors around available evidence",
    deep: p(
      "On a Do error, the response can normally be ignored; the special redirect-policy case may return a response whose body is already closed. Wrap the error with the operation while preserving it for `errors.Is` and timeout inspection.",
      "On an unacceptable status, capture the numeric code and perhaps a structured remote error code. Limit and sanitize text because upstream HTML, secrets, or attacker input should not become an unbounded log message.",
      "On decode failure, retain content type, status, and a wrapped parse error. Do not continue with a partially populated struct. Domain-validation failures belong beside decoding in the representation layer but should remain distinguishable when clients can correct them.",
      "Metrics can then count transport availability, status classes, contract-decode failures, and validation failures separately. A rise in each category points to a different owner and response."
    ),
    visualType: "flow_diagram",
    visualTitle: "Where an HTTP call can fail",
    visual: mermaid(`flowchart LR
  D[Client.Do] -->|error| T[Transport/policy]
  D -->|response| S{Accepted status?}
  S -- No --> H[HTTP status]
  S -- Yes --> J{JSON valid?}
  J -- No --> P[Representation]
  J -- Yes --> V{Domain valid?}
  V -- No --> B[Business validation]
  V -- Yes --> O[Success]`),
    codeTitle: "Return status and decode failures separately",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
)

type Reply struct { Count int §json:"count"§ }
func fetch(client *http.Client, url string) error {
	resp, err := client.Get(url)
	if err != nil { return fmt.Errorf("transport: %w", err) }
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK { return fmt.Errorf("HTTP status %d", resp.StatusCode) }
	var reply Reply
	if err := json.NewDecoder(resp.Body).Decode(&reply); err != nil { return fmt.Errorf("decode JSON: %w", err) }
	return nil
}

func main() {
	s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(502); fmt.Fprint(w, §{"error":"upstream"}§) }))
	defer s.Close()
	fmt.Println(fetch(s.Client(), s.URL))
}`),
    codeNote: "The local server completes HTTP with status 502, so fetch reports a status failure rather than a transport or JSON failure.",
    followups: ["Can a response be returned with a non-nil Do error?", "Which failures are safe to retry?", "Why limit an upstream error body?"],
  },
);

lessons.push(
  {
    topic: "json-omitempty",
    question: "What does omitempty do in a Go JSON struct tag?",
    title: "What omitempty considers empty",
    direct: "In classic encoding/json, omitempty removes a field when its Go value is false, zero, nil, or a zero-length array, slice, map, or string. It affects encoding, not input validation.",
    testing: "The documented empty set, common struct and array surprises, and the difference between omission and validation.",
    quick: [
      "omitempty is a marshaling rule; it does not validate incoming JSON.",
      "It omits false, numeric zero, nil pointers or interfaces, and length-zero collections or strings.",
      "A non-nil empty slice is omitted because its length is zero.",
      "A normal struct value is not empty merely because all its fields are zero.",
      "Use a pointer when zero must be emitted differently from missing.",
    ],
    speaking: p(
      "- In classic `encoding/json`, the `omitempty` tag option tells Marshal to leave out a field when its Go value is considered empty. Empty means `false`, numeric zero, a nil pointer or interface, or an array, slice, map, or string whose length is zero. The option changes output only; it does not make a field optional during decoding or perform validation.",
      "- For example, `Count int` tagged `json:\"count,omitempty\"` disappears when Count is zero, and `Labels []string` with the same option disappears for both nil and a non-nil zero-length slice. A non-empty slice remains. This can make compact responses, but it also removes the distinction between 'explicitly zero' and 'not sent.'",
      "- A common surprise is a struct-valued field. A normal struct does not have a length and is not one of the classic empty categories, so a zero-valued nested struct is still encoded. A pointer to that struct can be nil and therefore omitted. Fixed arrays are omitted only when their length is zero, not merely because every element contains zero.",
      "- The wire meaning matters more than saving bytes. If zero means a valid count a client must see, `omitempty` on that integer is wrong. If omission means 'use the server default,' it may be exactly right. For update requests, pointers or explicit optional types often communicate presence more clearly.",
      "- I decide field by field: can a consumer safely treat missing and empty as the same state? If yes, omitempty is convenient. If no, I preserve presence explicitly. That keeps a serialization option from silently changing the business meaning of the API."
    ),
    overviewTitle: "Omission merges two observable states",
    overview: "The important effect is not smaller JSON; it is that a consumer can no longer see an empty value as a member. Before adding omitempty, decide whether absent and empty carry the same contract meaning.",
    deepTitle: "Trace emptiness by Go kind",
    deep: p(
      "Booleans and numbers are empty at false and zero. Strings, arrays, slices, and maps use length zero. Pointers and interfaces use nil. These rules belong to classic `encoding/json`; they do not call a custom `IsZero` method for omitempty.",
      "Nil and empty collections deserve attention. Without omitempty, a nil slice encodes as null while a non-nil empty slice encodes as `[]`. With omitempty, both have length zero or nil state and disappear, collapsing three possible JSON shapes into absence.",
      "Nested structs frequently expose mistaken assumptions. `time.Time{}` is still a struct value and is normally emitted with omitempty. `*time.Time` can be nil, or current Go code can use `omitzero` when zero-value semantics are desired.",
      "Tests should assert exact object membership rather than search strings casually. Decode the output into `map[string]json.RawMessage` and check whether each key exists for zero, empty, nil, and non-empty examples."
    ),
    visualType: "comparison_table",
    visualTitle: "Classic omitempty decisions",
    visual: "| Go field value | Omitted? | Reason |\n|---|---:|---|\n| `0`, `false`, `\"\"` | yes | empty scalar |\n| `nil` pointer or interface | yes | nil |\n| empty slice/map/array | yes | length zero |\n| zero-valued struct | no | structs are not classic empty values |\n| non-empty collection | no | length is positive |",
    codeTitle: "See which zero fields remain",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
)

type Detail struct { Code int §json:"code"§ }
type Reply struct {
	Count  int      §json:"count,omitempty"§
	Labels []string §json:"labels,omitempty"§
	Detail Detail   §json:"detail,omitempty"§
}

func main() {
	b, err := json.Marshal(Reply{})
	if err != nil { panic(err) }
	fmt.Println(string(b))
}`),
    codeNote: "Count and Labels disappear, while the zero-valued Detail struct remains as an object.",
    followups: ["Does omitempty omit a zero-valued struct?", "How are nil and empty slices affected?", "When is omitempty wrong for an integer?"],
  },
  {
    topic: "json-omitempty",
    question: "What is the difference between omitempty and omitzero in Go JSON tags?",
    title: "Choosing empty-value or zero-value omission",
    direct: "omitempty uses classic JSON-package empty rules, while omitzero uses a field's IsZero method when present or the Go zero value otherwise. If both options appear, either condition can omit the field.",
    testing: "Current omitzero behavior, IsZero customization, and the practical difference for structs and collections.",
    quick: [
      "omitempty tests the package's classic empty-value definition.",
      "omitzero calls IsZero() bool when the field type provides it.",
      "Without IsZero, omitzero compares against the Go zero value.",
      "A zero struct can be omitted by omitzero even though omitempty keeps it.",
      "With both options, satisfying either rule omits the field.",
    ],
    speaking: p(
      "- `omitempty` and `omitzero` answer different questions in current `encoding/json`. Classic omitempty asks whether a value belongs to the package's empty set: false, zero, nil, or length zero. Omitzero asks whether the field is its Go zero value, with one extension: if its type provides `IsZero() bool`, that method decides.",
      "- The difference is clearest for structs. A zero-valued struct is not empty under classic omitempty, so it normally appears. It is a zero Go value, so omitzero can remove it. A type can also define a domain-specific `IsZero`, such as treating a sentinel date as unset, though that method becomes part of serialization behavior and needs tests.",
      "- Collections show the opposite kind of distinction. A non-nil empty slice has length zero, so omitempty removes it. It is not the zero value of a slice—the zero value is nil—so omitzero alone keeps that empty slice and emits `[]`. This lets an API distinguish 'allocated but empty' from 'unset' if that distinction is intentional.",
      "- When both options appear in a tag, the package omits the field if either test succeeds. That can ease migrations but is often harder for readers than choosing the option that matches the contract. Both affect marshaling only; they do not track whether an input member was supplied sent.",
      "- I use omitzero when Go zero semantics are the real rule, especially for struct values or modern scalar conventions, and omitempty when JSON emptiness or zero-length collections are the real rule. Then I test nil, empty, zero, and non-zero values to lock down the public shape."
    ),
    overviewTitle: "Empty and zero overlap but are not identical",
    overview: "Numbers and booleans overlap under both rules, while structs and non-nil empty slices expose the difference. `IsZero` makes omitzero extensible; that flexibility should express a stable domain meaning rather than surprise callers.",
    deepTitle: "Compare values that split the rules",
    deep: p(
      "A zero struct has every field at its zero value. Go recognizes that complete struct as the type's zero value, so omitzero removes it. Classic omitempty never classified general structs as empty, so it remains in the object.",
      "For slices and maps, nil is the Go zero value, whereas `make([]T, 0)` and `make(map[K]V)` create non-nil empty values. Omitzero can preserve those explicit empty containers. Omitempty uses length, so it removes nil and non-nil empty containers alike.",
      "An `IsZero() bool` method lets a named type define its own zero test. Keep it pure, quick, and unsurprising because serialization may call it repeatedly. A surprising IsZero can make fields vanish based on hidden state.",
      "Compatibility matters when changing tags. Adding either option can remove members clients previously received. Golden JSON tests and API-schema review are appropriate even though the Go change is only a few characters."
    ),
    visualType: "comparison_table",
    visualTitle: "Values that separate the two options",
    visual: "| Value | `omitempty` | `omitzero` |\n|---|---:|---:|\n| numeric zero | omit | omit |\n| zero-valued struct | keep | omit |\n| nil slice | omit | omit |\n| non-nil empty slice | omit | keep |\n| custom type reporting IsZero | classic rule | omit |",
    codeTitle: "Compare a zero struct and an empty slice",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
)

type Point struct { X, Y int }
type Sample struct {
	Old Point §json:"old,omitempty"§
	New Point §json:"new,omitzero"§
	Items []int §json:"items,omitzero"§
}

func main() {
	b, err := json.Marshal(Sample{Items: make([]int, 0)})
	if err != nil { panic(err) }
	fmt.Println(string(b))
}`),
    codeNote: "The zero Old struct remains, the zero New struct disappears, and the non-nil empty Items slice remains.",
    followups: ["How does IsZero affect omitzero?", "Why does a non-nil empty slice split the rules?", "What happens if both tag options are present?"],
  },
  {
    topic: "json-omitempty",
    question: "How can Go distinguish a missing JSON field from an explicit zero or null?",
    title: "Preserving field presence in JSON input",
    direct: "Use pointers when missing must differ from an explicit zero, and use a custom optional type when missing, null, and a concrete value are three distinct states. Ordinary value fields collapse absence into zero.",
    testing: "Presence modeling for create and patch inputs rather than misusing omission tags.",
    quick: [
      "An omitted ordinary field keeps the Go zero value.",
      "A pointer distinguishes absent-or-null from a supplied zero value.",
      "Pointers alone do not distinguish missing from explicit JSON null.",
      "A custom UnmarshalJSON wrapper can record present, null, and value separately.",
      "omitempty and omitzero control output, not input presence.",
    ],
    speaking: p(
      "- Decoding into an ordinary field loses presence information. If `Count int` is absent, it remains zero; if the JSON explicitly contains `\"count\": 0`, it also becomes zero. That is fine when missing means the default, but it is insufficient for validation and partial updates.",
      "- A pointer adds one useful distinction. With `Count *int`, a supplied zero produces a non-nil pointer to zero, while an omitted member leaves nil. Standard decoding of JSON null also sets the pointer to nil, so a pointer combines missing and null rather than representing all three states.",
      "- For example, a PATCH request may define missing as 'leave the stored count unchanged,' zero as 'set the count to zero,' and null as 'clear the count.' A small optional wrapper can record whether its `UnmarshalJSON` method was called, whether the bytes were `null`, and the decoded value. That makes the update operation unambiguous.",
      "- The trade-off is complexity. Pointers require nil checks, and custom optional types add code and may need matching MarshalJSON behavior. They should be used only where presence changes meaning; ordinary values remain clearer for required fields that are validated after decoding or for defaults applied consistently.",
      "- Output options do not solve this input problem. `omitempty` and `omitzero` decide whether Marshal emits a field; they do not tell Unmarshal to remember absence. I model the states the endpoint actually supports, validate them explicitly, and test missing, null, zero, and non-zero inputs separately."
    ),
    overviewTitle: "Choose the number of states the contract needs",
    overview: "A value field gives one zero state, a pointer gives value versus absent-or-null, and an optional wrapper can give missing versus null versus value. More states improve precision but also increase code, so the API meaning should drive the choice.",
    deepTitle: "Presence is data in partial updates",
    deep: p(
      "Create requests often require a member and then validate its value. A pointer can prove it appeared, though a custom validation layer may provide a clearer required-field error. Read responses generally know their data already and can use straightforward values.",
      "PATCH requests are where presence becomes an operation. Missing commonly means no change, a concrete value means replace, and null may mean clear. Applying zero values without tracking presence can accidentally erase stored data whenever a client sends only one unrelated field.",
      "A custom optional type works because UnmarshalJSON runs only when the member is present. It can set `Set=true`, recognize null, and otherwise decode a value. The surrounding update code reads those flags rather than guessing from the value.",
      "Document whether null is accepted. Reject it when the domain has no clearing operation instead of quietly treating it as missing. A four-case table test is the smallest reliable proof of the chosen semantics."
    ),
    visualType: "comparison_table",
    visualTitle: "Input-state models",
    visual: "| Go destination | missing | `null` | `0` |\n|---|---|---|---|\n| `int` | 0 | unchanged/0 | 0 |\n| `*int` | nil | nil | pointer to 0 |\n| optional wrapper | not set | set + null | set + value 0 |",
    codeTitle: "Keep zero distinct from missing",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
)

type Patch struct { Count *int §json:"count"§ }

func main() {
	for _, input := range []string{§{}§, §{\"count\":0}§, §{\"count\":3}§} {
		var patch Patch
		if err := json.Unmarshal([]byte(input), &patch); err != nil { panic(err) }
		if patch.Count == nil { fmt.Println("missing-or-null") } else { fmt.Println(*patch.Count) }
	}
}`),
    codeNote: "The pointer preserves explicit zero, while this simple model intentionally treats missing and null alike.",
    followups: ["Why does *int not distinguish missing from null?", "When is a custom optional type justified?", "Do omitempty tags record input presence?"],
  },
);

lessons.push(
  {
    topic: "json-number-and-interface",
    question: "What Go types are produced when JSON is decoded into any?",
    title: "Default dynamic JSON types",
    direct: "Decoding JSON into any produces bool, float64, string, []any, map[string]any, or nil. This flexible shape requires type checks and makes numeric assumptions especially important.",
    testing: "The exact default dynamic mapping and why typed structs are safer for known schemas.",
    quick: [
      "JSON booleans become bool and strings become string.",
      "JSON numbers become float64 by default.",
      "Arrays become []any and objects become map[string]any.",
      "JSON null becomes nil.",
      "Use a typed struct when the schema is known.",
    ],
    speaking: p(
      "- When the destination is `any`, `encoding/json` must choose concrete Go types without a schema. It maps JSON booleans to `bool`, numbers to `float64`, strings to `string`, arrays to `[]any`, objects to `map[string]any`, and null to nil.",
      "- Nested values follow the same rule recursively. An object containing an array becomes a map whose array entry holds `[]any`, and each element has its own dynamic concrete type. Code must use type assertions or a type switch before operations; directly asserting the wrong shape panics.",
      "- For example, decoding `{" + "\"active\":true,\"scores\":[4,5]}" + "` yields a map. `active` contains a bool, while each score is a float64 even though the JSON spelling has no decimal point. Treating a score as `int` with `value.(int)` is therefore incorrect.",
      "- Dynamic decoding is useful for pass-through tools, loosely structured metadata, and inspection code. It sacrifices compile-time field names, validation, convenient numeric types, and documentation. `json.RawMessage` can be a better middle ground when only one part of an otherwise typed envelope varies.",
      "- I decode stable application contracts into structs and use `any` only where variability is genuinely part of the contract. At that boundary I handle every expected concrete type explicitly, reject unexpected shapes, and choose `UseNumber` if the original numeric text or large-integer precision matters. This keeps dynamic traversal local instead of making unrelated business code repeatedly guess the value's runtime type."
    ),
    overviewTitle: "The JSON grammar supplies the runtime type",
    overview: "Without a destination schema, the package has one canonical Go representation for each JSON kind. The result is traversable, but correctness moves from the compiler into runtime checks performed by application code.",
    deepTitle: "Walk a dynamic value safely",
    deep: p(
      "Begin with a type switch at the root. A JSON document can be a scalar as well as an object or array, so assuming `map[string]any` before checking can panic. Each nested value needs the same treatment.",
      "Numbers deserve their own policy. Default float64 is convenient for general JSON numbers but cannot exactly hold every large integer. A Decoder configured with UseNumber changes only numbers stored inside interface values to `json.Number`; typed numeric fields still follow their declared types.",
      "RawMessage postpones decoding rather than making it fully dynamic. An envelope can decode its `type` field and retain the payload bytes, then choose a concrete struct for that variant. This gives type safety after one explicit dispatch decision.",
      "Tests should include a top-level scalar, null, nested arrays, unexpected shapes, and boundary numbers. Dynamic code is safe only when its accepted shape is as deliberate as a struct would have been."
    ),
    visualType: "concept_map",
    visualTitle: "JSON kinds to dynamic Go types",
    visual: "| JSON kind | Go value inside `any` |\n|---|---|\n| boolean | `bool` |\n| number | `float64` |\n| string | `string` |\n| array | `[]any` |\n| object | `map[string]any` |\n| null | `nil` |",
    codeTitle: "Inspect dynamic concrete types",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	var value any
	if err := json.Unmarshal([]byte(§{\"active\":true,\"scores\":[4,5]}§), &value); err != nil { panic(err) }
	object := value.(map[string]any)
	scores := object["scores"].([]any)
	fmt.Printf("%T %T %T\\n", object["active"], scores, scores[0])
}`),
    codeNote: "The integer-looking score is a float64 because the destination did not provide a numeric type.",
    followups: ["Why is value.(int) wrong for a default dynamic number?", "When is json.RawMessage useful?", "What does JSON null become?"],
  },
  {
    topic: "json-number-and-interface",
    question: "Why can decoding JSON numbers into float64 lose integer precision?",
    title: "Preserving JSON numbers with UseNumber",
    direct: "float64 exactly represents integers only through 2^53, so larger JSON integers can round during dynamic decoding. Decoder.UseNumber retains the numeric text as json.Number for checked conversion later.",
    testing: "The actual precision boundary, UseNumber scope, and checked Int64 or Float64 conversion.",
    quick: [
      "Dynamic JSON numbers become float64 by default.",
      "float64 cannot exactly represent every integer above 2^53.",
      "Decoder.UseNumber stores dynamic numbers as json.Number.",
      "Call Int64 or Float64 and handle the conversion error.",
      "A typed int64 field is preferable when the schema is known and integral.",
    ],
    speaking: p(
      "- JSON has one number syntax, but Go needs a concrete representation. When decoding into `any`, classic `encoding/json` chooses `float64`. A float64 has 53 bits of integer precision, so it represents every integer only up to 2^53 exactly. Larger adjacent integers can round to the same floating-point value.",
      "- This matters for identifiers, counters, and monetary minor units that happen to arrive through a dynamic map. For example, `9007199254740993` cannot be represented exactly as float64 and may become `9007199254740992`. Converting that rounded float back to int64 does not restore the lost digit.",
      "- A `json.Decoder` can call `UseNumber` before Decode. Numbers stored in interface values then become `json.Number`, which preserves their original decimal text. The program can call `Int64` for an integer contract or `Float64` for a floating contract and must handle conversion errors such as a fraction passed to Int64 or an out-of-range value.",
      "- UseNumber is not a complete arbitrary-precision system. `json.Number` is a string wrapper with parsing helpers; Int64 still has range limits, and Float64 still follows floating-point behavior. Applications needing larger integers or exact decimals can parse the text with `math/big` or a decimal type chosen by the domain.",
      "- If the schema is known, decoding straight into an `int64`, `uint64`, or custom numeric type is clearer and validates the intended representation. I reach for UseNumber when the surrounding object must stay dynamic but numbers cannot be casually rounded."
    ),
    overviewTitle: "Precision can be lost before the cast",
    overview: "The damaging step is decoding the token into float64. Once rounded, later integer conversion cannot recover the source spelling. UseNumber postpones the numeric decision so code can choose a checked target.",
    deepTitle: "Keep syntax until the domain chooses a type",
    deep: p(
      "A JSON token such as `1`, `1.0`, or `1e3` is valid number text. The destination decides whether those spellings fit an integer, floating, decimal, or arbitrary-precision model. Dynamic float64 decoding makes that decision early.",
      "UseNumber retains the token as `json.Number`. Its Int64 method accepts valid base-10 integer text within int64 range; Float64 parses floating syntax. Both return errors, which belong next to domain range checks rather than being ignored.",
      "Typed structs avoid many assertions and make intent visible. An `int64` field rejects fractional input and overflow. A string ID is often even better when arithmetic is meaningless and other ecosystems may not preserve 64-bit JSON integers.",
      "Boundary tests should include 2^53, 2^53+1, int64 limits, a fraction, exponent notation, and malformed text where custom parsing is used. Printing numbers is not enough; compare exact expected values."
    ),
    visualType: "flow_diagram",
    visualTitle: "Two dynamic number paths",
    visual: mermaid(`flowchart LR
  J[JSON number text] -->|default any decode| F[float64]
  F --> R[possible rounding]
  J -->|Decoder.UseNumber| N[json.Number text]
  N -->|checked Int64/Float64| V[chosen numeric type]`),
    codeTitle: "Keep a large integer exact",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

func main() {
	dec := json.NewDecoder(strings.NewReader(§{\"id\":9007199254740993}§))
	dec.UseNumber()
	var object map[string]any
	if err := dec.Decode(&object); err != nil { panic(err) }
	n := object["id"].(json.Number)
	id, err := n.Int64()
	if err != nil { panic(err) }
	fmt.Println(id)
}`),
    codeNote: "The token remains json.Number until the checked int64 conversion, so the exact integer is retained.",
    followups: ["What is the largest consecutive integer exactly representable by float64?", "Does UseNumber provide unlimited precision?", "When should an ID be a JSON string?"],
  },
  {
    topic: "json-number-and-interface",
    question: "When should Go decode JSON into a struct, map[string]any, or json.RawMessage?",
    title: "Choosing a destination for fixed and dynamic JSON",
    direct: "Use a struct for a known contract, map[string]any for genuinely open objects, and RawMessage to delay one variable subtree until a discriminator or later stage selects its concrete type.",
    testing: "Trade-offs among typed, fully dynamic, and selectively delayed decoding.",
    quick: [
      "Structs provide named fields, declared types, and straightforward validation.",
      "map[string]any accepts open shapes but requires runtime assertions.",
      "json.RawMessage preserves raw JSON bytes for delayed decoding.",
      "A typed envelope plus RawMessage suits tagged variants.",
      "Do not use dynamic maps merely to avoid defining a small contract type.",
    ],
    speaking: p(
      "- The destination type is an API-design choice. A struct is best when the JSON shape is known: field names and types are visible, invalid conversions produce errors, and later code avoids repeated assertions. It is the normal choice for request, response, and configuration contracts.",
      "- `map[string]any` fits objects whose keys are intentionally open, such as user-defined metadata or an inspection tool. Its flexibility moves work to runtime: every value needs a type check, numbers default to float64 unless UseNumber is enabled, and required members need manual validation.",
      "- `json.RawMessage` is a useful middle path. It is raw encoded JSON stored as bytes and can delay decoding one field. For example, an event envelope can decode `type` normally and keep `payload` raw, then unmarshal that payload into `UserCreated` or `OrderPaid` after the discriminator is known.",
      "- RawMessage is not automatically validated against the eventual domain shape and its bytes should be treated as owned data, not a magical typed value. Delayed decoding can also postpone failures, so the layer that chooses the variant must handle and test them. Fully dynamic maps remain appropriate when no finite variant list exists.",
      "- I choose the most specific type the contract honestly supports: struct for fixed data, typed envelope plus RawMessage for a known family of variants, and map only for open data. That balance preserves flexibility where it belongs without spreading unchecked values through the application."
    ),
    overviewTitle: "Dynamic scope should be as small as possible",
    overview: "Most real payloads are not entirely fixed or entirely unknown. A typed envelope can keep routing and version fields safe while one RawMessage isolates the part whose type depends on those fields.",
    deepTitle: "Decode in two stages when shape has a discriminator",
    deep: p(
      "First decode an envelope containing the discriminator and a RawMessage payload. Validate that the discriminator is recognized. Then decode only the payload into the corresponding concrete struct and run that variant's validation.",
      "This approach avoids decoding the entire document into nested maps and then rebuilding typed values by hand. It also avoids speculative unmarshaling into every possible type, which can accept overlapping shapes incorrectly.",
      "For pass-through systems, RawMessage can preserve a subtree for later emission. Remember that custom transformations, signature checks, and canonicalization may care about byte-level details; semantic JSON equality is not always byte equality.",
      "Tests need one valid case per variant plus unknown type, malformed payload, and a payload valid JSON but invalid for the selected type. The dispatch table itself becomes a small, auditable schema registry."
    ),
    visualType: "flow_diagram",
    visualTitle: "Typed envelope, delayed payload",
    visual: mermaid(`flowchart LR
  J[Event JSON] --> E[Decode type + RawMessage]
  E --> D{type}
  D -->|user.created| U[Decode UserCreated]
  D -->|order.paid| O[Decode OrderPaid]
  D -->|unknown| X[Reject or preserve by policy]`),
    codeTitle: "Dispatch a RawMessage payload",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
)

type Envelope struct { Type string §json:"type"§; Data json.RawMessage §json:"data"§ }
type UserCreated struct { ID int §json:"id"§ }

func main() {
	input := []byte(§{\"type\":\"user.created\",\"data\":{\"id\":9}}§)
	var event Envelope
	if err := json.Unmarshal(input, &event); err != nil { panic(err) }
	if event.Type != "user.created" { panic("unsupported event") }
	var data UserCreated
	if err := json.Unmarshal(event.Data, &data); err != nil { panic(err) }
	fmt.Println(event.Type, data.ID)
}`),
    codeNote: "Only the variant payload is delayed; the discriminator remains a typed field from the first decode.",
    followups: ["What numeric type appears in map[string]any by default?", "Does RawMessage validate a domain payload?", "Why is a typed envelope safer than one fully dynamic map?"],
  },
);

lessons.push(
  {
    topic: "json-struct-tags",
    question: "How do JSON struct tags and exported fields control encoding in Go?",
    title: "Designing JSON object fields with struct tags",
    direct: "The default JSON object contains exported struct fields. A json tag can rename a field, add options, or exclude it with -, but it cannot expose a lowercase field.",
    testing: "Export visibility, tag syntax, rename and exclusion behavior, and API-contract intent.",
    quick: [
      "Only exported struct fields are encoded by default.",
      "json:\"user_id\" changes the JSON member name.",
      "json:\"-\" always excludes the field.",
      "Options follow the name after a comma, such as json:\"name,omitempty\".",
      "A tag does not make an unexported field serializable.",
    ],
    speaking: p(
      "- Struct tags define how an exported Go struct field appears at the JSON boundary. Without a tag, the field's Go name is used. A tag such as `json:\"user_id\"` gives it a stable wire name, while `json:\"-\"` removes it from the default encoding and decoding rules.",
      "- Visibility comes first: the field must be exported, which means its Go identifier begins with an uppercase letter. Writing a JSON tag on `password string` does not expose it; the package ignores that unexported field. This sometimes produces `{}` without an error, so response DTOs should be tested rather than assumed.",
      "- For example, a User struct can tag ID as `json:\"id\"`, DisplayName as `json:\"display_name\"`, and Secret as `json:\"-\"`. It then produces keys `id` and `display_name`, never `Secret`. The Go names remain idiomatic while the external contract follows the API's naming convention.",
      "- Tags are part of the wire contract. Renaming a tag can break clients even when the Go code still compiles. Duplicate or conflicting promoted fields can also be ignored under the package's field-selection rules, so deeply embedded response models deserve focused tests.",
      "- I normally separate database or domain models from public response shapes when exposure rules matter. That avoids accidentally serializing a newly exported internal field and makes versioned names deliberate. Tags are excellent mapping metadata, but they do not replace visibility, validation, or an explicit API design."
    ),
    overviewTitle: "Three filters choose a JSON field",
    overview: "A field first has to be exported, then survive struct-field selection, then follow its JSON tag. Thinking in that order explains why a lowercase tagged field stays absent and why `-` wins over an otherwise eligible field.",
    deepTitle: "Treat the struct as a wire schema",
    deep: p(
      "The default name is the exported Go field identifier, which is often not the preferred public style. A tag supplies the object member name without weakening Go naming. An empty tag name such as `json:\",omitempty\"` keeps the default name while adding an option.",
      "Tags act in both directions. A renamed field is emitted under that name and incoming objects are matched against it. The exclusion tag prevents both ordinary encoding and decoding. This is useful for secrets, but a dedicated DTO makes accidental exposure harder than relying on exclusions scattered across a rich model.",
      "Embedded structs add field-selection rules. At the least-nested level, tagged fields are preferred over untagged candidates; one surviving candidate is selected, while ambiguous candidates can all be ignored without an error. Flattening important API fields through several embeddings therefore needs contract tests.",
      "A robust test marshals one representative value, asserts exact public keys, checks that sensitive fields are absent, then unmarshals expected input. That verifies the schema users see, not merely that Marshal returned nil."
    ),
    visualType: "flow_diagram",
    visualTitle: "Field eligibility pipeline",
    visual: mermaid(`flowchart LR
  F[Struct field] --> X{Exported?}
  X -- No --> I[Ignored]
  X -- Yes --> T{json tag}
  T -- - --> I
  T -- name/options --> J[JSON member]
  T -- absent --> N[Go field name]`),
    codeTitle: "Control names and exclusions",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	ID          int    §json:"id"§
	DisplayName string §json:"display_name"§
	Secret      string §json:"-"§
	note        string
}

func main() {
	b, err := json.Marshal(User{ID: 3, DisplayName: "Kai", Secret: "x", note: "hidden"})
	if err != nil { panic(err) }
	fmt.Println(string(b))
}`),
    codeNote: "Secret is explicitly excluded and note is unexported, so neither becomes part of the JSON object.",
    followups: ["Can a struct tag expose a lowercase field?", "What does json:\"-\" do during decoding?", "Why might an API use a separate response struct?"],
  },
  {
    topic: "json-struct-tags",
    question: "How does json.Unmarshal match object keys to struct fields?",
    title: "JSON key matching and unknown fields",
    direct: "Classic encoding/json prefers an exact field or tag-name match but also accepts case-insensitive matches. Unknown object keys are ignored by default, and unexported fields are never valid destinations.",
    testing: "Exact and folded matching, default unknown-field behavior, and compatibility consequences.",
    quick: [
      "Incoming keys match the JSON tag name or the exported field name.",
      "An exact match is preferred over a case-insensitive match.",
      "Unknown object keys are ignored by default.",
      "Unexported fields are not populated.",
      "Use Decoder.DisallowUnknownFields when the input contract should be closed.",
    ],
    speaking: p(
      "- When classic `encoding/json` decodes an object into a struct, it compares each incoming key with the name that field would use during marshaling: either its JSON tag name or its exported Go field name. An exact match wins, but the package also accepts a case-insensitive match for compatibility.",
      "- That means a field tagged `json:\"user_id\"` is primarily addressed by `user_id`, while a plain `Name` field can accept `Name` and differently cased forms. Code should still document and emit one canonical spelling; permissive input matching is not a reason to produce inconsistent APIs.",
      "- Unknown keys are ignored by default. For example, decoding `{" + "\"name\":\"Mira\",\"admin\":true}" + "` into a struct containing only `Name` succeeds and discards `admin`. This can support forward compatibility, but it can also hide a typo such as `naem` and leave the destination's `Name` at its zero value.",
      "- Unexported fields remain outside the mapping even if they carry tags. Also, successful decoding does not prove required fields were present: an absent string and an explicitly empty string both become `\"\"` in an ordinary string field. Pointers or a custom optional type can preserve presence when the distinction matters.",
      "- I choose the unknown-key policy at the ownership boundary. A service accepting a tightly controlled command often enables `DisallowUnknownFields`; an event consumer designed for producers to add fields may intentionally ignore them. In both cases, I validate required and domain-specific values after decoding."
    ),
    overviewTitle: "Matching is permissive; meaning is still your job",
    overview: "Unmarshal finds an eligible field and converts the value. It does not declare every unknown key invalid and does not know which zero values are unacceptable. Input policy and domain validation remain explicit application stages.",
    deepTitle: "Separate compatibility from correctness",
    deep: p(
      "Ignoring unknown members makes an older consumer tolerant when a newer producer adds data. That property is valuable in evolving messages. At command-style API boundaries, however, a silent spelling error can make the server perform a different operation from the one the client intended.",
      "Case-insensitive matching is another historical convenience of classic `encoding/json`. Exact tags remain the public contract and should be used in examples, schemas, and tests. Applications needing stricter naming cannot obtain full case-sensitive enforcement merely by enabling DisallowUnknownFields because alternate case may still match an existing field.",
      "Destination reuse can further obscure results. If a struct already contains a value and a later JSON object omits that key, the old field can remain. Decode each independent request into a fresh value unless merge behavior is intentionally part of the operation.",
      "Contract tests should cover the canonical spelling, a truly unknown key, an omitted required field, null, and a wrong JSON type. Those cases expose separate decisions: matching, compatibility, presence, nullability, and conversion."
    ),
    visualType: "comparison_table",
    visualTitle: "Classic struct-key outcomes",
    visual: "| Incoming key | Destination | Default result |\n|---|---|---|\n| exact tag or field name | exported matching field | populated |\n| different case | exported folded match | usually populated |\n| unknown name | no matching field | ignored |\n| name of unexported field | inaccessible field | ignored |",
    codeTitle: "Contrast permissive and strict input",
    source: go(`package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

type User struct { Name string §json:"name"§ }

func main() {
	input := §{\"name\":\"Mira\",\"admin\":true}§
	var permissive User
	if err := json.Unmarshal([]byte(input), &permissive); err != nil { panic(err) }
	dec := json.NewDecoder(strings.NewReader(input))
	dec.DisallowUnknownFields()
	var strict User
	err := dec.Decode(&strict)
	fmt.Println(permissive.Name, err != nil)
}`),
    codeNote: "Unmarshal accepts and discards admin; the configured Decoder rejects it as an unknown field.",
    followups: ["Are JSON field matches case-sensitive in classic encoding/json?", "Why can ignored fields help compatibility?", "Does strict decoding prove required fields exist?"],
  },
  {
    topic: "json-struct-tags",
    question: "How should a Go API reject unknown fields and validate required JSON fields?",
    title: "Strict shape checks and domain validation",
    direct: "Configure a Decoder to reject unknown keys, enforce a single JSON value, then validate required fields and ranges in Go. These are separate checks because decoding alone does not know business requirements.",
    testing: "A layered input boundary rather than confusing syntax, shape, presence, and domain rules.",
    quick: [
      "DisallowUnknownFields rejects unmatched keys for struct destinations.",
      "Decode again and require io.EOF to reject a second JSON value.",
      "Use pointers when missing must differ from an explicit zero value.",
      "Validate required fields, ranges, and relationships after decoding.",
      "Return stable client errors without exposing internal details.",
    ],
    speaking: p(
      "- JSON acceptance has layers. The decoder first checks syntax and conversion into the selected Go type. `DisallowUnknownFields` adds a closed-shape rule for struct destinations, and a second Decode requiring `io.EOF` adds the rule that the request contains exactly one JSON value.",
      "- Requiredness is separate. If `Name string` is omitted, the field is simply empty, exactly as if the client sent an empty string. When presence itself matters, a pointer such as `*int` can distinguish missing or null from a supplied integer, although null and missing both normally yield nil and may need a custom optional type when those must differ.",
      "- For example, a create-user request can reject an unknown `is_admin` key, require a non-blank name, and require an age within an agreed range. The first rule protects the accepted object shape, while the last two are domain validation. Keeping them explicit produces clearer tests and avoids treating every decode error as the same problem.",
      "- Strictness has a compatibility trade-off. Rejecting unknown fields catches misspellings for clients you control, but it also prevents an older consumer from tolerating a harmless field added by a newer producer. Public event schemas may intentionally stay permissive; command endpoints often benefit from being strict.",
      "- I implement the boundary as one small decode-and-validate function and test each failure class. HTTP code can map malformed JSON, oversize input, unknown fields, and invalid values to a stable 400 response while logging the specific internal cause. That gives clients a predictable contract without pretending the JSON package performs business validation."
    ),
    overviewTitle: "One request crosses four gates",
    overview: "Byte limits control resources, decoding controls syntax and Go conversion, strict options control object shape, and validation controls meaning. A request is accepted only after all four gates, but each gate reports a different kind of fault.",
    deepTitle: "Model presence deliberately",
    deep: p(
      "Ordinary value fields collapse absence into their zero value. That is ideal when omission truly means the default, but wrong for partial updates or fields where zero is meaningful. A pointer adds a presence bit: nil means no supplied value, while a non-nil pointer can contain zero.",
      "Null introduces another design question. Standard pointer decoding maps both an absent member and explicit null to nil. If a PATCH operation must distinguish 'leave unchanged' from 'clear this value,' define an optional wrapper that records whether UnmarshalJSON was invoked and what it received.",
      "Error responses should themselves obey the API contract. Use `application/json`, a stable machine-readable code, and a safe message. Do not return raw parser errors if they expose implementation details clients should not depend on; keep those details in logs with request context.",
      "A table-driven test can feed an empty body, malformed syntax, unknown key, second document, missing required field, explicit zero, and a valid request. Checking both status and response JSON ensures the boundary stays strict after future refactors."
    ),
    visualType: "flow_diagram",
    visualTitle: "Layered request validation",
    visual: mermaid(`flowchart TD
  A[Bounded bytes] --> B[JSON syntax and types]
  B --> C[Known object fields]
  C --> D[Exactly one value]
  D --> E[Required and domain rules]
  E --> F[Trusted request value]`),
    codeTitle: "Decode and validate a create request",
    source: go(`package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"strings"
)

type CreateUser struct { Name string §json:"name"§; Age *int §json:"age"§ }

func parse(text string) (CreateUser, error) {
	dec := json.NewDecoder(strings.NewReader(text))
	dec.DisallowUnknownFields()
	var in CreateUser
	if err := dec.Decode(&in); err != nil { return in, err }
	var extra any
	if err := dec.Decode(&extra); err != io.EOF { return in, errors.New("expected one JSON value") }
	if strings.TrimSpace(in.Name) == "" { return in, errors.New("name is required") }
	if in.Age == nil || *in.Age < 0 { return in, errors.New("valid age is required") }
	return in, nil
}

func main() {
	u, err := parse(§{\"name\":\"Ada\",\"age\":0}§)
	fmt.Println(u.Name, *u.Age, err)
}`),
    codeNote: "The pointer records that age was supplied even when its valid value is zero; validation remains separate from decoding.",
    followups: ["Does DisallowUnknownFields reject trailing JSON?", "How can a pointer preserve field presence?", "When is ignoring unknown fields preferable?"],
  },
);

run();
