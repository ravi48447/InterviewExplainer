#!/usr/bin/env node
/**
 * curate-frontend-browser-dom-final.mjs — apply the final pattern to the remaining
 * browser-dom-basics, javascript-async-basics, and javascript-fundamentals topics.
 */

import { applyTopic } from "./curate-frontend-final-pattern.mjs";

let total = 0;

// ---------- browser-dom-basics ----------

total += applyTopic({
  moduleSlug: "browser-dom-basics",
  topicSlug: "cookies-basics",
  topicTitle: "Cookies Basics",
  anchors: [
    {
      slug: "browser-dom-basics-cookies-basics-cookie-mechanics",
      slugName: "browser cookies",
      question: "How do cookies actually work — the attributes, the rules, and when not to use them?",
      title: "Cookie Mechanics",
      direct:
        "A cookie is a name-value record the SERVER sets via Set-Cookie and the browser attaches to MATCHING requests via the Cookie header — per-domain key-value state riding on every request. The attributes ARE the security model: HttpOnly (JS can't read it — document.cookie returns nothing for it), Secure (HTTPS only), SameSite (Lax default: blocks cross-site POSTs — the CSRF defense; Strict: never sends cross-site; None requires Secure), Domain/Path (scope — Domain broadens to subdomains, host-only without it), Max-Age/Expires (session cookie if absent). The __Host- prefix demands Secure + Path=/ + no Domain — the tamper-proof form. Limits: ~4KB per cookie, ~50 per domain, sent on EVERY matching request — the reason tokens-bigger-than-sessions don't belong in cookies.",
      summary:
        "Set-Cookie creates, Cookie returns, and the attributes (HttpOnly, Secure, SameSite, Domain, Max-Age) are the security model.",
      mistake:
        "Treating cookies as server-controlled client storage (they're readable and writable by the client unless HttpOnly) and storing large data in them.",
      profile: "mechanism",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "http",
      speakable:
        "The lifecycle, verified:\n\n```http\n# 1. SERVER SETS — response header (can send multiple Set-Cookie lines)\nSet-Cookie: session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1800\n\n# 2. BROWSER STORES — applies policy: domain match, path match, lifetime, flags\n\n# 3. BROWSER RETURNS — on every matching request, automatically\nCookie: session=abc123\n```\n\nThe attribute map (each one answers 'what does it stop?'):\n- HttpOnly → stops document.cookie from reading it (XSS token theft mitigation)\n- Secure → stops transmission over plain HTTP\n- SameSite=Lax (default) → stops the cookie riding on cross-site POSTs — the CSRF defense that made SameSite the norm; Strict additionally drops it on top-level cross-site NAVIGATION (rarely wanted — breaks login-following-a-link)\n- Domain=.example.com → sends on ALL subdomains (host-only cookie without it — the subdomain-division reason NOT to set Domain casually)\n- Max-Age=1800 → 30-minute lifetime; no expiry attributes → SESSION cookie (dies with the browser session)\n\nThe prefix forms (the senior detail): __Host- requires Secure, Path=/, and NO Domain — a cookie that can't be scoped broadly or set insecurely (subdomain-tamper-proof session cookie); __Secure- requires just Secure. Prefer __Host-session for session cookies on supporting browsers.\n\nThe 'don't use cookies' side (when localStorage or server storage wins): ~4KB per cookie, ~50 per domain, and EVERY matching request carries them — a large auth payload taxes every static asset request; and anything JS must READ frequently (preferences, non-sensitive UI state) is simpler in localStorage with a typed wrapper. Cookies remain the right tool when the SERVER owns the state and requests must carry it automatically (sessions, CSRF double-submit pairs, partitioned analytics).",
      flow:
        "flowchart LR\n    SRV[server] -->|Set-Cookie + attributes| B[browser stores under policy]\n    B -->|Cookie header on matching requests| SRV\n    HT[HttpOnly] -->|blocks| JS[document.cookie read — XSS mitigation]\n    SS[SameSite Lax] -->|blocks| CSRF[cross-site POST attach]\n    SEC[Secure] -->|blocks| PLAIN[plain HTTP send]\n    MA[Max-Age] --> LIFE[persistent vs session cookie]\n    HOST[__Host- prefix] --> LOCK[Secure + Path=/ + no Domain — tamper-proof]\n    LIMITS[4KB, 50/domain, every request] --> ALT[large or JS-read data → localStorage/server]",
      deep:
        "The SameSite CSRF mechanism (why the default changed): a cross-site <form action=bank POST> or fetch carries cookies per policy — SameSite=Lax withholds the cookie on cross-site POSTs, so the forged request arrives UNAUTHENTICATED and the server rejects it; Lax still sends on safe top-level navigations (GET links — you stay logged in following a link). This is a browser-enforced default defense complementing token-based CSRF checks (double-submit: server sets a random cookie + expects the same value in a header — JS reads the non-HttpOnly cookie and echoes it, which a cross-site attacker can't do without reading your origin's cookies).\n\nSameSite=None's real meaning (the trap): None exists for LEGITIMATE cross-site contexts (third-party embeds, payment redirects) and REQUIRES Secure — the error message everyone hits ('SameSite=None without Secure will be rejected') means: on Chrome/Safari modern builds, a None cookie without Secure is DROPPED entirely. Partitioned cookies (CHIPS) add a partition key so third-party cookies stop being a cross-site tracker — the privacy-model change where 'same cookie, different storage per top-level site' becomes the default path for embedded use.",
      code: "Set-Cookie: __Host-session=abc; Path=/; Secure; HttpOnly; SameSite=Lax",
    },
  ],
});

total += applyTopic({
  moduleSlug: "browser-dom-basics",
  topicSlug: "comparisons",
  topicTitle: "Browser Dom Comparisons",
  anchors: [
    {
      slug: "browser-dom-basics-comparisons-storage-vs-storage",
      slugName: "browser storage and transport comparisons",
      question: "localStorage vs sessionStorage vs cookies vs IndexedDB — and HTTP vs HTTPS: how do you choose?",
      title: "Storage And Transport Choices",
      direct:
        "Storage decision by DATA TYPE and LIFETIME: localStorage (persistent, ~5MB, string-only, same-origin, synchronous, JS-full-access — non-sensitive client state like theme/preferences) vs sessionStorage (same but per-TAB lifetime — wizard steps, transient drafts) vs cookies (~4KB, automatic transport to server, HttpOnly option — SERVER-OWNED state like sessions) vs IndexedDB (large structured async storage — offline caches, mail-size datasets; the only one with indexes and transactions). The security line that decides it: anything an XSS script can read, treat as PUBLIC — auth tokens go in HttpOnly cookies (or short-lived in-memory + refresh), never localStorage. HTTPS is not a choice: TLS encrypts transport, verifies server identity, and enables the secure-context APIs (service workers, geolocation, crypto.subtle).",
      summary:
        "Pick storage by data type, lifetime, and who owns it; treat everything JS-readable as public; HTTPS/TLS for all production transport.",
      mistake:
        "Storing auth tokens in localStorage (XSS-readable) and using cookies for large data, or building on APIs that silently need a secure context.",
      profile: "comparison",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The decision table, verified:\n\n```text\nDATA TYPE                      → STORAGE\nserver session state           → HttpOnly + Secure cookie (auto transport, JS-blind)\npreferences, theme, onboarding → localStorage (persistent, same-origin)\nwizard step, per-tab draft      → sessionStorage (dies with the tab)\noffline data, large datasets     → IndexedDB (async, indexed, transactional)\nauth token in an SPA            → in-memory access + HttpOnly refresh cookie\n```\n\nThe mechanics that drive the table:\n- localStorage: ~5MB per origin, strings only (JSON.stringify for objects), SYNCHRONOUS (blocks the main thread on large reads — keep it small), survives browser restarts, shared across tabs of the origin.\n- sessionStorage: same API, per-TAB-and-origin scope AND lifetime — closing the tab clears it; opening a duplicate tab starts a NEW store (the behavior that surprises people).\n- cookies: ~4KB/~50 per domain, attached to matching requests automatically, HttpOnly can hide them from JS — the only storage the SERVER can own securely.\n- IndexedDB: async (Promise/event API), schema+indexes+transactions, MBs-to-GBs, structured-clone values (not just strings) — the storage behind offline-first apps; localStorage is not its small sibling, it's a different tool.\n\nThe security line (say this unprompted): localStorage and cookies WITHOUT HttpOnly are fully readable by any script on the page — one XSS vulnerability exposes them. So: access tokens short-lived in MEMORY, refresh token in an HttpOnly SameSite cookie, and treat any localStorage value as if it will be read aloud someday. HTTPS/TLS is the transport floor: it's what makes Secure cookies, service workers, and the Web Crypto API meaningful — non-secure contexts silently disable a whole API family.",
      flow:
        "flowchart TD\n    Q{who owns the data?} -->|server / must ride requests| C[cookie: HttpOnly Secure SameSite]\n    Q -->|client, persistent| L[localStorage]\n    Q -->|client, per-tab lifetime| S[sessionStorage]\n    Q -->|large / offline / structured| I[IndexedDB: async, transactions]\n    T[auth tokens] --> M[in-memory access + HttpOnly refresh]\n    XSS[any JS-readable storage] --> PUB[treat as public under XSS]\n    TLS[HTTPS] --> SEC[secure context APIs: SW, crypto, geolocation]",
      deep:
        "Same-origin is the boundary (and what breaks it): storage is partitioned by ORIGIN (scheme + host + port) — http://localhost:3000 and http://localhost:3001 are DIFFERENT origins with different storage; opening a page over file:// has origin 'null' (historically opaque); and third-party iframe access is subject to partitioning — modern browsers partition iframe storage per top-level site (storage partitioning), which ends the old 'shared localStorage across embeds' techniques.\n\nThe eviction and quota model (production detail): localStorage persists but is subject to eviction under storage pressure in some contexts (and 'Clear site data' wipes it — never treat it as a durable database); IndexedDB asks the quota system for space and async persistence can be requested (navigator.storage.persist()) to opt out of aggressive eviction — the choice that matters for offline-first apps.\n\nThe transport comparison (HTTP vs HTTPS as an interview pair): HTTP is plaintext — readable and modifiable by every hop (ISP, wifi, proxies); TLS gives confidentiality (encrypted), integrity (tamper-evident), and server authentication (certificate chain) — plus the secure-context platform (service workers, push, Web Crypto, getUserMedia). HSTS pins the upgrade (the browser refuses http:// for the domain after first https:// visit), preloading ships the list in the browser. Cookies' Secure flag is one part; the page itself being HTTPS-only is the platform decision.",
      code: "localStorage.setItem('theme', JSON.stringify({ mode: 'dark' }));",
    },
  ],
});

total += applyTopic({
  moduleSlug: "browser-dom-basics",
  topicSlug: "dom-tree-and-manipulation",
  topicTitle: "Dom Tree And Manipulation",
  anchors: [
    {
      slug: "browser-dom-basics-dom-tree-and-manipulation-dom-manipulation",
      slugName: "DOM manipulation",
      question: "How do you traverse and manipulate the DOM safely — and what does each operation actually cost?",
      title: "Dom Manipulation",
      direct:
        "The DOM is a live tree of nodes: traversal (parentElement/children vs childNodes — elements vs ALL nodes including text; closest(selector) walks UP; querySelector(All) searches DOWN), reads (getBoundingClientRect, offsetHeight — LAYOUT: each read can force a reflow), and writes (classList over className for incremental changes; append/prepend/insertAdjacentHTML; createElement + properties over innerHTML for STRUCTURE). The cost model: reads flush pending layout (forced synchronous layout), writes batch dirtily — the read-then-write loop ('layout thrashing': read, write, read, write → reflow per cycle) is fixed by batching reads first, then all writes, or using a DocumentFragment. innerHTML re-parses and can inject markup (XSS with untrusted strings); textContent for plain text; template elements for inert HTML.",
      summary:
        "Traversal APIs (children vs childNodes, closest, querySelector), reads cost layout while writes batch, and innerHTML's re-parse + XSS risk.",
      mistake:
        "Interleaving layout reads and writes (layout thrashing) and building markup with innerHTML from untrusted strings.",
      profile: "implementation",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The API map, verified:\n\n```js\n// TRAVERSAL\nel.closest('.card');           // UP to the nearest matching ancestor\nel.parentElement;\nel.children;                    // Elements only\nel.childNodes;                  // ALL nodes — includes text + comments!\n\n// QUERY DOWN\ndocument.querySelector('.item');\nel.querySelectorAll(':scope > li');   // :scope = search from HERE, direct children\n\n// BUILD\nconst li = document.createElement('li');\nli.className = 'item';\nli.textContent = userInput;         // SAFE for text — no parsing\nlist.append(li);                    // also prepend, before, after, replaceWith\n\n// INSERT HTML (parses a string — content must be trusted!)\nel.insertAdjacentHTML('beforeend', markup);\n\n// BATCH appends — one reflow, not N\nconst frag = document.createDocumentFragment();\nfor (const item of data) frag.append(buildRow(item));\nlist.append(frag);                  // single DOM entry\n```\n\nThe cost model (the interview core): DOM WRITES mark layout dirty but batch; layout READS (offsetHeight, getBoundingClientRect, getComputedStyle) FLUSH pending changes to give a correct answer. The thrashing loop — read height, write style, read height again — forces a reflow EVERY cycle; the fix is phase discipline: collect ALL reads, then apply ALL writes. Frameworks do this for you (React batches DOM changes and applies them in one pass — one of the reasons virtual-DOM diffing pays).\n\nThe safety line: innerHTML/insertAdjacentHTML PARSE markup — a user string inside becomes live elements (<img onerror=...>). textContent for text, property assignment for attributes that shouldn't parse (a.src, not a.setAttribute with a crafted value), <template> for authored static markup, and sanitize any user HTML explicitly.",
      flow:
        "flowchart LR\n    TR[traverse: closest up, children elements, querySelector down] --> OP\n    W[write: classList, append, style] -->|marks dirty, batches| D[dirty layout]\n    R[read: offsetHeight, rect, computed] -->|needs truth| FLUSH[forces reflow NOW]\n    R --> W --> R2[read again] --> THRASH[reflow per cycle — thrashing]\n    FIX[all reads THEN all writes] --> ONE[one reflow]\n    FRAG[DocumentFragment] -->|N children, 1 insertion| ONE\n    IH[innerHTML with untrusted string] --> XSS[parsed and executed — sanitize or textContent]",
      deep:
        "What a reflow/repaint actually is (the two-phase model): layout (reflow) computes geometry — position and size of every affected box, cascading through the tree; paint (repaint) rasterizes pixels — fill, borders, text. Layout is the expensive phase (tree-wide cascades); paint is bounded to the damaged region. Transform/opacity changes SKIP layout entirely (compositor-only) — the reason animation guidance is 'animate transform and opacity, not top/left/width'; will-change: transform hints the compositor and can promote a layer.\n\nThe live-HTMLCollection trap (a real bug class): document.getElementsByClassName / el.children return a LIVE collection that UPDATES as the DOM changes — iterating and REMOVING inside the same loop skips elements (indexes shift under you). Two fixes: copy to a static array first (Array.from(el.children)) or iterate DOWNWARD. querySelectorAll returns a static NodeList — the asymmetry worth knowing.\n\nThe structured-clone alternative to innerHTML (modern API): element.replaceChildren(...nodes) sets children in one call (the clean 'clear and rebuild' without innerHTML); before/after/replaceWith are the surgical insertion points; and compareDocumentPosition/contains answer order/containment queries without walking manually. The general principle all these encode: the DOM's native batch operations (fragment, replaceChildren, insertAdjacentHTML for bulk) beat per-node insertion loops — and reading the platform's own batching is exactly what the virtual-DOM revolution was re-implementing.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "browser-dom-basics",
  topicSlug: "dom-tree-and-traversal",
  topicTitle: "Dom Tree And Traversal",
  anchors: [
    {
      slug: "browser-dom-basics-dom-tree-and-traversal-dom-tree-model",
      slugName: "the DOM tree model",
      question: "What IS the DOM — node types, the document/element/text split, and how the browser builds it?",
      title: "Dom Tree Model",
      direct:
        "The DOM (Document Object Model) is the browser's LIVE, in-memory object representation of the HTML document — a tree of NODES the scripts can read and mutate, where mutations reflect on screen. Node types: Document (the root handle, document), Element (the tags — p, div; the type you style and query), Text (the character data inside — a text node, not a string property), plus Comment/DocumentType/DocumentFragment. Building: HTML parser reads bytes → tokens → builds the tree incrementally (that's why script placement blocks — a classic script element halts parsing to execute, the reason defer/async exist); CSSOM builds alongside; layout+paint consume both. Everything else — querySelector, event listeners, React refs — is a VIEW over this node tree.",
      summary:
        "The DOM is a live node tree: Document root, Element tags, Text children — built incrementally by the parser and mutable by scripts.",
      mistake:
        "Treating the DOM as the HTML source text (it's a live object model), and expecting childNodes to contain only elements.",
      profile: "definition",
      stage: "fundamentals",
      priority: "frequent",
      language: "js",
      speakable:
        "The model, verified:\n\n```js\ndocument.nodeType;         // 9 — DOCUMENT\nel.nodeType;               // 1 — ELEMENT\nel.firstChild.nodeType;    // 3 — TEXT (the whitespace between tags is a node!)\n\n// The classic firstChild surprise:\n//   <ul>\\n  <li>...     — firstChild is the TEXT node '\\n  '\n//   el.firstElementChild skips text — the one you usually mean\n\n// the split that matters for building UI:\ndocument.querySelector('.card');  // ELEMENT node — has classes, style, listeners\nel.textContent = 'hi';            // replaces the TEXT node inside\n```\n\nThe build order (why scripts block): the parser reads bytes → tokens → tree nodes AS IT GOES; a classic <script> HALTS parsing until it executes (the next tag isn't in the tree yet — the reason scripts used to live at the body end); defer = parse fully, execute in order before DOMContentLoaded; async = execute whenever loaded, order not guaranteed (the analytics-script flag); type=module defaults to defer.\n\nThe LIVE part (the property interviewers probe): the tree is an object graph that changes — appendChild MOVES a node (a node can't be two places), innerHTML= REPLACES children, and mutations fire MutationObserver/mutation records. React does NOT bypass this tree — it stages changes in a virtual tree and applies the minimal set of these same node operations.",
      flow:
        "flowchart LR\n    BYTES[HTML bytes] --> TOK[tokens] --> NODES[nodes — tree grows incrementally]\n    NODES --> SCRIPT{classic script tag}\n    SCRIPT -->|halts parse, executes now| BLOCK[the blocking reason for defer async]\n    D[Document node = root] --> E[Element nodes = tags]\n    E --> T[Text nodes — whitespace counts]\n    E --> C[Comment nodes]\n    CSS[CSSOM builds alongside] --> LP[layout + paint read both]\n    LIVE[mutations by scripts] --> RENDER[reflect on next frame]",
      deep:
        "The two-tree reality (what 'the DOM' usually means, precisely): the DOM is the authoritative structure tree; the browser ALSO builds an accessibility tree (roles/names/states for assistive tech — the semantic layer that semantic HTML populates for free) and a render tree (DOM + CSSOM merged; display: none nodes are absent from it, visibility: hidden nodes are present but unpainted — the question 'what's the difference' that separates candidates).\n\nWhitespace nodes and tree surgery: a newline between elements is a TEXT node — firstChild vs firstElementChild, childNodes vs children, and nodeType checks are the discipline. The tree-surgery APIs move rather than copy: append/insertBefore RELOCATE (remove the old reference first if you need a copy — cloneNode(true) for deep copies), replaceWith/replaceChildren are the surgical forms, and DocumentFragment is a detached parent for batch building (inserting the fragment inserts its CHILDREN — the fragment itself never enters the tree).\n\nThe parsing edge that matters for SPAs: the browser's parser is stateful — document.write mid-parse and malformed nesting trigger error-recovery (the 'unexpected' moves the browsers make per the HTML5 parsing algorithm, like rescuing a <p> left open). Also: innerHTML on a <script> element family — parsed <script> nodes from innerHTML do NOT execute (a parser guard that makes innerHTML 'safer' than it looks for scripts, but NOT safe from event-handler attributes and URL-based vectors). And DOMContentLoaded fires when the tree is built (pre-deferred scripts run first); load waits for sub-resources — the lifecycle event pair every perf question starts from.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "browser-dom-basics",
  topicSlug: "event-bubbling-and-capturing",
  topicTitle: "Event Bubbling And Capturing",
  anchors: [
    {
      slug: "browser-dom-basics-event-bubbling-and-capturing-event-phases",
      slugName: "event propagation",
      question: "What are the three event phases — and how do you use capturing, bubbling, stopPropagation, and preventDefault correctly?",
      title: "Event Phases",
      direct:
        "An event travels in three phases: CAPTURING (root → target's parent — 'the descent'), TARGET (the event reaches the element), BUBBLING (target → root — 'the ascent', where handlers run by default). addEventListener(type, fn, useCapture) — the third arg chooses phase; the default false = bubble phase. The tools and their differences: stopPropagation() halts further TRAVEL (no other handlers on other elements run) — rarely the right tool; preventDefault() blocks the browser's DEFAULT action (form submit navigates, link follows href) without touching propagation; event.target (the deepest node hit) vs event.currentTarget (the element this handler is attached to). Event DELEGATION is the payoff of bubbling: one listener on a container handles every current and future child by checking e.target.closest(selector).",
      summary:
        "Capture descends, target fires, bubble ascends; stopPropagation stops travel, preventDefault stops the default action; delegation uses bubbling.",
      mistake:
        "Confusing stopPropagation with preventDefault, and e.target (where it happened) with e.currentTarget (where the handler runs).",
      profile: "mechanism",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The phases and the tools, verified:\n\n```js\n// PHASES: capture (root → parent of target) → target → bubble (target → root)\ndocument.addEventListener('click', fn, true);   // capture phase\nlist.addEventListener('click', fn);              // bubble phase (default)\n\n// DELEGATION — the bubbling payoff: ONE listener for all rows, present or future\nlist.addEventListener('click', (e) => {\n  const row = e.target.closest('tr[data-id]');     // find the relevant ancestor\n  if (!row || !list.contains(row)) return;         // guard: outside → ignore\n  console.log('clicked row', row.dataset.id);       // e.target may be an inner span\n});\n// wins: 1 listener instead of N (memory + add/remove churn),\n// and rows added LATER are covered — no re-binding\n\n// THE TWO 'STOP' TOOLS — different axes\nform.addEventListener('submit', (e) => {\n  e.preventDefault();       // stop the DEFAULT action (navigate) — event still travels\n});\nel.addEventListener('click', (e) => e.stopPropagation());  // stop TRAVEL — other elements' handlers never run\n```\n\nThe e.target vs e.currentTarget distinction (the detail interviews probe): target = the DEEPEST node where the event originated (the span inside the button); currentTarget = the element whose HANDLER is executing (always the listener's element — changes meaning as the event travels through the container's handler). In a delegated listener you check/derive from target and act on the row it belongs to.\n\nWhen capturing is actually needed (the rare but real cases): intercepting BEFORE a child's handler (analytics that must record first, 'shield' overlays), focus/blur — which DON'T bubble (capture or the focusin/focusout bubbling twins), and library-level teardown patterns. For everything else, bubble + delegation is the idiom.",
      flow:
        "flowchart TD\n    C[capture: window → document → ... → parent] --> T[target: handlers on the element]\n    T --> B[bubble: parent → ... → document → window]\n    DEF[default: listener without 3rd arg] --> B\n    CAP[3rd arg true] --> C\n    S1[stopPropagation] -->|stops| TRAVEL[no further elements' handlers]\n    S2[preventDefault] -->|stops| ACTION[the browser default — navigation, submit]\n    D[delegation on container] -->|e.target.closest + contains| ONE[one listener covers all children — present and future]",
      deep:
        "Why delegation needs BOTH closest and contains (the correctness detail): e.target can be an inner icon of a button OR a padding gap OUTSIDE any row — closest(selector) walks up from target and returns null at the top if nothing matches, but if the listener's container is nested in ANOTHER matching ancestor, closest can return an element OUTSIDE your container. The guard `container.contains(row)` guarantees the found row is one of YOURS. Skipping the guard is the subtle delegation bug — clicks on page areas that share a selector trigger your handler.\n\nThe events that don't bubble (a real API-design split): focus, blur, load, scroll-on-element, mouseenter/leave — the spec gives bubbling twins for the ones teams actually need (focusin/focusout, mouseover/out). The others are handled by capturing — or by the 'reach the parent' trick (scroll doesn't bubble, but a container's scroll listener on the container itself catches it; document scrolling is a different pipeline — 'scroll on window').\n\nThe once and passive flags (the modern third-arg family): { once: true } self-removes after first run (transient one-shot UI); { passive: true } promises the handler won't preventDefault — the browser can scroll WITHOUT waiting for your listener (the mobile scroll-perf fix; wheel/touchstart listeners should be passive unless they genuinely block). { capture: true, once: true } is the library-grade teardown pattern. signal: abortController gives listener REMOVAL at scale — one abort() unbinds everything bound with that signal (the cleanup answer for SPAs).",
    },
  ],
});

total += applyTopic({
  moduleSlug: "browser-dom-basics",
  topicSlug: "scenario-based",
  topicTitle: "Browser Dom Scenario Based",
  anchors: [
    {
      slug: "browser-dom-basics-scenario-based-dom-scenarios",
      slugName: "browser and DOM scenarios",
      question: "A page feels janky and the dev tools show long tasks — how do you diagnose and fix rendering performance?",
      title: "Rendering Perf Scenario",
      direct:
        "The sequence: (1) MEASURE first — DevTools Performance panel: record the interaction, find the long tasks (>50ms) and read their breakdown (scripting / layout / paint). (2) Classify the culprit — SCRIPT (long JS: unbatched work in event handlers, layout thrashing read/write interleaves, O(n) work on every keystroke), LAYOUT (forced synchronous reflows — fix reads-then-writes batching and min-width: 0), PAINT/COMPOSITE (large-element repaints, animated top/left instead of transform). (3) The structural fixes: debounce/throttle high-frequency handlers (scroll, resize, input) and do the work in requestAnimationFrame (frame-aligned) or requestIdleCallback (non-urgent); batch DOM writes with fragments; virtualize long lists; content-visibility: auto skips offscreen rendering. The rule: user input → 50ms task → 60fps budget (16.7ms/frame) — and never fight the measured truth with guesses.",
      summary:
        "Measure with the Performance panel, classify the long task (script/layout/paint), then debounce, batch, align to rAF, and virtualize.",
      mistake:
        "Optimizing without profiling (guessing the bottleneck), and doing heavy synchronous work directly in scroll/input handlers.",
      profile: "debugging",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The diagnostic loop, with the fixes mapped to causes:\n\n```js\n// 1. THROTTLE the high-frequency events (scroll, resize)\nlet ticking = false;\nwindow.addEventListener('scroll', () => {\n  if (ticking) return;\n  ticking = true;\n  requestAnimationFrame(() => {         // at most once per FRAME\n    updateHeader(document.documentElement.scrollTop);\n    ticking = false;\n  });\n}, { passive: true });                   // don't block the browser's scroll\n\n// 2. DEBOUNCE the trailing work (search-as-you-type)\nfunction debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}\ninput.addEventListener('input', debounce(runSearch, 250));\n// fire AFTER the burst — the user finished typing\n\n// 3. BATCH DOM — reads first, then writes (kills thrashing)\nconst heights = rows.map(r => r.offsetHeight);   // ALL reads\nrows.forEach((r, i) => r.style.height = heights[i] + 'px'); // ALL writes\n```\n\nThe classification table (what the Performance recording shows you):\n- LONG SCRIPT tasks → heavy JS: move work off the interaction (debounce/throttle), chunk with rAF/idle, or move big loops to a worker for CPU work.\n- LAYOUT spikes (purple) → forced synchronous layout: read/write interleaving (fix: batch by phase); oversized layouts (fix: smaller subtrees, content-visibility: auto for offscreen sections, contain: layout).\n- PAINT/composite (green) → animated layout properties (top/left/width animate = layout per frame — animate transform/opacity ONLY), huge images (fix: sized, lazy, decodes decoupled with loading=lazy + proper dimensions).\n- RECALCULATED STYLES, deep selectors → expensive selectors (fix: class-based, flat selectors).\n\nThe budgets to quote: a user interaction must feel instant under ~100ms; a frame is 16.7ms at 60fps (long tasks >50ms block the main thread — the RAIL budget); INP (Interaction to Next Paint) is the modern field metric — measure the REAL users, not just your fast laptop.",
      flow:
        "flowchart TD\n    J[jank report] --> REC[Performance panel: record the interaction]\n    REC --> LT[long tasks > 50ms — read the breakdown]\n    LT -->|scripting| SC[debounce throttle, chunk rAF, worker, virtualize]\n    LT -->|layout| LO[batch reads then writes, min-width 0, contain, content-visibility]\n    LT -->|paint composite| PC[animate transform opacity only, size images, lazy load]\n    HIGHF[scroll resize input handlers] --> PASS[passive + rAF throttle + debounce]\n    GUESS[optimizing without recording] --> X[fixing the wrong thing]",
      deep:
        "The main-thread model behind every fix (the 'why it works'): the browser interleaves JS execution, style recalc, layout, paint, and composite on ONE main thread — a task that overruns the frame budget (16.7ms) drops frames; reads that force a layout flush mid-task make JS itself PAY for the layout. rAF defers your callback to the frame's start (aligned with the pipeline's natural rhythm — the correct place for visual state changes), requestIdleCallback runs in frame LEFTOVERS (the correct place for analytics, pre-computation, non-urgent bookkeeping), and a Worker moves CPU work to another thread entirely — its results must still be posted back to the main thread to touch the DOM (the DOM is single-threaded by design).\n\nVirtualization and content-visibility (the scale answers): rendering 10,000 DOM nodes costs style+layout+paint on all of them; virtualization renders the VISIBLE slice plus buffers and absolutely-positions rows by scroll math — the standard for lists above a few hundred rows; content-visibility: auto (with contain-intrinsic-size as the placeholder) tells the browser to SKIP rendering offscreen subtrees while keeping the scrollbar geometry — the CSS-only middle ground. IntersectionObserver (NOT scroll listeners) is the correct visibility primitive — scroll events fire constantly and cost main-thread work; the observer runs off-thread and calls you only on transitions.\n\nThe metric shift worth naming (interview currency): FMP/TTI gave way to Core Web Vitals — LCP (loading: main content painted, ~2.5s), CLS (visual stability: layout shift — reserve space for images/embeds, don't insert content above the viewport on load), INP (interaction responsiveness — the FID replacement, ~200ms). Each maps to fixes: LCP → preload the hero image, don't lazy-load ABOVE the fold (loading=lazy on the LCP image is a classic self-inflicted wound), server-render; CLS → width/height attributes (aspect-ratio boxes), font-display swap with metrics-matched fallbacks; INP → the whole batching story above.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "browser-dom-basics",
  topicSlug: "storage-localstorage-cookies",
  topicTitle: "Storage Localstorage Cookies",
  anchors: [
    {
      slug: "browser-dom-basics-storage-localstorage-cookies-storage-pick",
      slugName: "browser storage options",
      question: "When do you reach for localStorage, sessionStorage, cookies, or IndexedDB — with the code and the traps?",
      title: "Storage In Practice",
      direct:
        "Pick by OWNER + LIFETIME + SIZE: localStorage for persistent same-origin client state (~5MB, strings, synchronous); sessionStorage for per-tab transient state (dies with the tab); cookies (~4KB, auto-attached to requests, HttpOnly possible) for SERVER-OWNED state; IndexedDB for large/structured/offline data (async, transactions, indexes). Code traps: localStorage is string-only (JSON.stringify/parse — and parse of NULL throws: wrap in try/catch, quota errors throw QuotaExceededError — wrap writes); storage events fire in OTHER tabs (the cross-tab sync channel: setItem in one tab, the 'storage' event fires in the others — never in the writing tab); cookies have no JS object API (document.cookie is a serialized string; use a wrapper or server headers).",
      summary:
        "The four storages with their APIs, the string/JSON and quota traps, and the storage-event cross-tab channel.",
      mistake:
        "Un-guarded JSON.parse of stored values (null throws), and assuming the storage event fires in the tab that wrote it.",
      profile: "implementation",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The code with the traps handled, verified:\n\n```js\n// localStorage — persistent, string-only, synchronous\nconst save = (key, val) => {\n  try {\n    localStorage.setItem(key, JSON.stringify(val));\n  } catch (e) {\n    // QuotaExceededError or private-mode rejection — never assume writes succeed\n    console.warn('persist failed', e);\n  }\n};\nconst load = (key, fallback) => {\n  try {\n    const raw = localStorage.getItem(key);\n    return raw === null ? fallback : JSON.parse(raw);   // parse AFTER null check\n  } catch {\n    return fallback;                                    // corrupted value ≠ crash\n  }\n};\n\n// sessionStorage — identical API, per-TAB lifetime\nsessionStorage.setItem('wizard-step', '2');\n\n// CROSS-TAB SYNC — the free message channel\nwindow.addEventListener('storage', (e) => {\n  // fires in OTHER tabs of the same origin when a key changes:\n  // e.key, e.oldValue, e.newValue — logout in one tab can react everywhere\n  if (e.key === 'theme') applyTheme(e.newValue);\n});\n// NOTE: does NOT fire in the tab that WROTE the value.\n\n// cookies — no object API: document.cookie is a serialized string\n(document.cookie = 'theme=dark; path=/; max-age=31536000; samesite=lax');\n// real cookie SETTING belongs on Set-Cookie response headers when possible\n```\n\nThe selection logic (say it as a decision): server-owned + rides requests → cookie (HttpOnly when the server owns it); client-owned + survives restarts → localStorage; client-owned + tab-scoped → sessionStorage; big or offline or queryable → IndexedDB (async — Promise wrapper or idb-keyval; transactions keep multi-key writes consistent).\n\nThe event details worth knowing: the storage event also fires for sessionStorage changes within the SAME tab's OTHER iframes/contexts — the sync boundary is the browsing-context tree, not just cross-tab; and the broadcast is one-way (writer excluded) — the reason a 'sync now' pattern pairs setItem with a manual dispatch in the writing tab.",
      flow:
        "flowchart TD\n    D{data owner + lifetime + size} -->|server, rides requests| C[cookie — HttpOnly Secure SameSite]\n    D -->|client, persistent, small| L[localStorage — JSON + try catch]\n    D -->|client, tab lifetime| S[sessionStorage]\n    D -->|large / offline / structured| I[IndexedDB — async, transactions]\n    W[setItem in tab A] --> EV[storage event in tabs B..N — NOT in A]\n    Q[quota exceeded or private mode] --> TRY[writes throw — guard always]\n    PAR[JSON.parse of null raw] --> CRASH[throws — null-check first]",
      deep:
        "Why the guard patterns exist (the failure modes): localStorage in private/incognito Safari LEGACY and quota-constrained embeds can throw on SET (QuotaExceededError) — the API is synchronous and unforgiving; values written by an OLDER app version can fail JSON.parse (schema drift — the versioned-envelope pattern { v: 2, data } lets you migrate or discard gracefully); and localStorage is SHARED by everything on the origin including any XSS payload — the 'treat as public' rule again, plus a rogue script can corrupt keys your app expects.\n\nThe storage event as a channel (and its limits): it carries key/oldValue/newValue and fires cross-tab same-origin — a genuine 'logout everywhere' / 'theme sync' channel with zero infrastructure; but it does NOT fire when document has no other listener-eligible contexts, and it serializes through the event loop (not instant). BroadcastChannel is the richer sibling (named channels, structured-clone messages, no storage involved) — the right answer when the message isn't a persisted value; postMessage covers window/iframe/worker boundaries; a SharedWorker gives one shared hub (the pre-BroadcastChannel pattern).\n\nThe IndexedDB shape (why it's 'a real database'): object stores (not tables) with optional keyPath (auto-increment), indexes for queryable fields, and TRANSACTIONS scoping multi-store operations (all-or-nothing) — the properties that make offline-first apps (and the service-worker cache+IDB pair behind installable apps) possible. The cost: everything is async and event-based (the Promise-wrapper requirement), versioning migrations run in onupgradeneeded, and the debugging story is DevTools' Application panel — know it exists; 'localStorage for everything' is the answer that fails at scale.",
    },
  ],
});

// ---------- javascript-async-basics ----------

total += applyTopic({
  moduleSlug: "javascript-async-basics",
  topicSlug: "modules-import-export",
  topicTitle: "Modules Import Export",
  anchors: [
    {
      slug: "javascript-async-basics-modules-import-export-es-modules",
      slugName: "ES modules",
      question: "How do ES modules work — exports/imports, live bindings, and the ESM vs CommonJS split?",
      title: "Es Modules",
      direct:
        "An ES module is a file with module scope: exports (named: export const x / import { x }; default: export default / import AnyName) form a STATIC interface — the import/export names are resolved at PARSE time (before execution), which enables tree-shaking, and imports are LIVE BINDINGS (the imported name points AT the exporter's variable — later mutations of a let export are visible to importers; reassignment of an import is a TypeError). Module evaluation: dependencies are fetched/parsed first, then bodies execute depth-first in dependency order — once per program (a module's top-level code runs a single time — the singleton effect). CommonJS (require) is dynamic, value-COPIES at require time, loads synchronously (Node), and caches — the interop rules (default = module.exports, .default/.named on namespace) are the dual-package friction.",
      summary:
        "Static import/export interfaces, live bindings vs CommonJS value copies, and the once-per-program evaluation model.",
      mistake:
        "Expecting a copied value instead of a live binding, and assuming import reassignment or cyclic imports behave like require.",
      profile: "mechanism",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The interface, verified:\n\n```js\n// counter.js — named exports (the API surface)\nexport const LIMIT = 10;\nexport let count = 0;              // a MUTABLE export — live for importers\nexport function inc() { count++; }\n\n// app.js\nimport { count, inc, LIMIT } from './counter.js';\ninc(); inc();\nconsole.log(count);                // 2 — LIVE binding: count is the SAME variable\n// count = 5;                      // TypeError — imports are read-only views\nimport api, { LIMIT as MAX } from './mod.js';  // default + renamed named import\nimport * as ns from './mod.js';    // namespace: ns.LIMIT, ns.default\n```\n\nThe live-binding mechanics (the interview core): import { count } does NOT copy a value — it creates a read-only alias to the EXPORTER's binding. That's why a mutated let export is visible to importers, and why importing modules can observe state changes the exporter makes. CommonJS is the opposite: require copies the value AT REQUIRE TIME — later changes to module.exports.count in the exporter are invisible. (This is why hot-reloading and circular deps behave differently across the systems.)\n\nThe evaluation model (the ordering rules): imports are HOISTED (executed before the importing body, in dependency order, once per module). Circular imports are ALLOWED but the module in the cycle whose body hasn't finished evaluating exposes a PARTIAL interface (the values not yet assigned read as undefined — not an error, a warning-grade trap). The single-evaluation property is the standard 'module singleton': top-level state (a connection, a registry, a config read) initialized in a module body is shared by every importer.\n\nThe static-analysis payoff (why ESM won): because names are known at parse time — before a line runs — bundlers can eliminate unused exports (tree-shaking: import { used } from a module with 50 exports ships the used graph only) and statically check unresolvable imports. require's dynamic string paths make both impossible.",
      flow:
        "flowchart LR\n    P[parse module] --> S[static import export names resolved]\n    S --> F[fetch + parse dependencies]\n    F --> E[execute bodies depth-first ONCE each]\n    EX[export let count] --> LB[live binding: importers see updates]\n    REQ[require] --> VC[value COPY at require time]\n    CYC[circular import] --> PART[partial interface — unfinished body reads undefined]\n    STAT[static names] --> TS[tree-shaking by bundlers]\n    TL[top-level runs once] --> SINGLE[singleton state across importers]",
      deep:
        "The dual-package interop (the friction worth knowing cold): ESM importing CommonJS — the CJS module.exports becomes the DEFAULT export (import cjs from 'pkg' or the .default on the namespace); NAMED exports from CJS are detected heuristically (Node's cjs-module-lexer static analysis — usually works for `exports.name = ...` patterns, fails for computed exports: import { x } then fails and the fix is default + destructure: `import pkg from 'cjs'; const { x } = pkg;`). CJS requiring ESM — historically a TypeError (require of ESM); Node 22+ ships require(esm) for sync-ish loading of non-top-level-await modules — the migration-era detail.\n\nThe async edge of ESM (why top-level await matters): ESM execution is ASYNC-capable — top-level await pauses the module graph's evaluation until resolution (every importer waits: it's an await at the module boundary); CommonJS has no equivalent (require is synchronous by contract). That single feature reshapes config-loading patterns (import config from './read-env.js' that awaits a file) and is the reason some CJS packages simply cannot be imported statically.\n\nThe loading pipelines (browser vs bundler vs Node): browsers use <script type=module> with URL specifiers (file extensions REQUIRED — no extensionless resolution), CORS, and MIME enforcement (a .js served as text/plain is rejected); bundlers collapse the graph and apply tree-shaking + scope hoisting (inlining module bodies into one scope when safe — removing the wrapper functions); Node (>= 22 default type: module via .mjs/package type) resolves node_modules + extensionless — the resolution DIFFERENCE is the everyday dual-world bug ('works in Node, breaks in the browser' and vice versa). import.meta.url, import.meta.env (bundler-injected), dynamic import() (a PROMISE — the lazy/route-based code-splitting primitive) round out the API surface interviews expect.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "javascript-async-basics",
  topicSlug: "scenario-based",
  topicTitle: "Async Scenario Based",
  anchors: [
    {
      slug: "javascript-async-basics-scenario-based-async-failure-playbook",
      slugName: "async debugging scenarios",
      question: "An async flow fails — a promise never settles, a race corrupts state, an error vanishes — what's your playbook?",
      title: "Async Failure Playbook",
      direct:
        "The three classic failures with their signatures: (1) NEVER SETTLES — a promise pending forever: a missing resolve in a wrapped callback, an event that never fires (listener added after emission), a fetch with no timeout (server hung) — fix: wrap in Promise.race with a timeout rejection, and audit callback-based wrappers for the paths that never resolve. (2) RACES — two async writes land out of order (slow first request resolves LAST and overwrites fresh state): fix with an epoch/sequence token (ignore stale responses), AbortController to CANCEL the loser, or a sequential queue. (3) SWALLOWED ERRORS — a .then without a .catch, an awaited call inside a try that's caught too broadly, a floating promise whose rejection becomes unhandled (Node: the process can crash; browser: console only) — fix: always return/await the chain (no floating promises), add .catch at the composition ROOT, and rethrow with context instead of swallowing. The diagnostic tools: unhandledrejection listener in place during dev, async stack traces (DevTools 'async' checkbox), and logging the PROMISE state (pending vs settled) at boundaries.",
      summary:
        "Diagnose the three async failure classes — never-settling promises, ordering races, swallowed rejections — with timeouts, cancellation tokens, and root-level catches.",
      mistake:
        "Treating a pending promise as 'slow' without a timeout, and floating promises whose rejections nobody handles.",
      profile: "debugging",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The playbook, one fix per failure class:\n\n```js\n// 1. NEVER SETTLES → race it against a timeout (make the hang visible)\nconst withTimeout = (p, ms, label) =>\n  Promise.race([\n    p,\n    new Promise((_, reject) =>\n      setTimeout(() => reject(new Error('timeout: ' + label)), ms)),\n  ]);\nconst user = await withTimeout(fetchUser(id), 5000, 'fetchUser');\n// audit checklist: every wrapped callback has a resolve AND reject path;\n// listeners added BEFORE the event can fire; the promise isn't dropped.\n\n// 2. RACE — stale response wins → epoch token + cancellation\nlet searchEpoch = 0;\ninput.addEventListener('input', async (e) => {\n  const my = ++searchEpoch;                    // this request's ticket\n  const ctrl = new AbortController();          // and its cancel handle\n  currentCtrl?.abort();                        // cancel the PREVIOUS run\n  currentCtrl = ctrl;\n  try {\n    const res = await fetch('/search?q=' + e.target.value, { signal: ctrl.signal });\n    if (my !== searchEpoch) return;            // stale: a newer run started\n    renderResults(await res.json());           // only NEWEST data renders\n  } catch (err) {\n    if (err.name === 'AbortError') return;      // cancelled — not an error\n    showError(err);                             // real errors surface\n  }\n});\n\n// 3. SWALLOWED ERRORS → no floating promises; catch at the ROOT\nasync function save() {\n  try {\n    await validate();\n    await persist();                 // awaited — errors reach THIS catch\n  } catch (err) {\n    report(err);                     // rethrow or handle — never silence\n    throw new Error('save failed: ' + err.message, { cause: err });\n  }\n}\n// global safety net during dev:\nwindow.addEventListener('unhandledrejection', (e) => {\n  telemetry.error(e.reason);         // find the floating promise's origin\n});\n```\n\nThe diagnostic discipline: FIRST classify which of the three it is (never settles / wrong order / missing error), because the fixes differ — a timeout can't fix a race, and cancellation can't fix a swallowed catch. Then instrument boundaries: log the state (pending/settled) and the epoch before and after each await; DevTools async stack traces connect the throw site to the awaiting frame (the 'where did this come from' answer for async).\n\nThe prevention patterns worth naming: ALWAYS wire both resolve and reject in hand-rolled promise wrappers (the callback-API-with-no-error-path is the #1 never-settles source); sequence with a queue when order IS the requirement; and the { cause } option chains the original error — the modern replacement for string-concatenating error messages.",
      flow:
        "flowchart TD\n    H[async bug] --> C{classify}\n    C -->|pending forever| P1[missing resolve path / hung peer / event missed]\n    C -->|wrong order| P2[race: stale overwrites fresh]\n    C -->|error vanished| P3[floating promise / empty catch]\n    P1 --> F1[race against timeout + audit wrapper paths]\n    P2 --> F2[epoch token + AbortController — only newest wins]\n    P3 --> F3[await everything, catch at root, rethrow with cause]\n    TOOLS[unhandledrejection listener, async stack traces, boundary logging]",
      deep:
        "Why unhandled rejections are more dangerous than they look (the platform contract): a promise rejection with no handler is not 'just a console line' — Node's default is process crash (unhandledRejection → exit since Node 15), and browsers fire the unhandledrejection EVENT (the last-chance observer — preventDefault stops the console error but the pattern to fix is the floating promise). await makes handling natural (try/catch works), which is why 'async functions all the way down' is also an error-propagation strategy, not just syntax.\n\nThe cancellation model (the modern API): AbortController/AbortSignal is THE cancellation primitive — fetch takes signal; a listener takes { signal } (auto-remove); Promise.withResolvers + signal listeners compose it into any async work; and AbortSignal.any() combines signals (the 'cancel if EITHER fires' composition). The reason cancellation matters for correctness (not just politeness): an uncancelled request is still in flight and WILL resolve — the epoch guard alone leaves the stale write possible; abort() actually stops the work, and an aborted fetch REJECTS with AbortError — the reason the catch must distinguish it from real errors.\n\nThe ordering primitive that beats both (when order is the requirement): a promise CHAIN is a queue — `tail = tail.then(work)` serializes work while returning per-task promises; a proper async queue/semaphore (p-limit) bounds concurrency; and structured concurrency (Promise.all as a SCOPE — all settle or the scope fails) is the pattern that keeps related tasks from outliving their parent — the concept behind Promise.allSettled (never short-circuits — the right tool for independent fan-out where one failure shouldn't kill the batch), Promise.any (first success), and the reason Promise.all rejects fast on FIRST failure by design.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "javascript-async-basics",
  topicSlug: "spread-and-rest",
  topicTitle: "Spread And Rest",
  anchors: [
    {
      slug: "javascript-async-basics-spread-and-rest-spread-rest",
      slugName: "spread and rest syntax",
      question: "Spread and rest — same syntax, two roles: how do they work and where do the shallow-copy traps bite?",
      title: "Spread And Rest",
      direct:
        "The same three dots in two roles: REST (function parameters/declarations — 'collect the REST into an array': function f(a, ...rest)) and SPREAD (expressions/arguments — 'expand an iterable here': [...arr], { ...obj }, f(...args)). The spread copy is SHALLOW — one level: [...obj.items] copies the ARRAY, but nested objects are SHARED references (copy.items[0] === orig.items[0] — mutating a nested object through the copy mutates the original). Object spread MERGES right-to-left ({ ...defaults, ...overrides } — later keys win; undefined values OVERRIDE too — the gotcha), and spread on objects enumerates OWN ENUMERABLE properties (prototype and Symbol non-enumerables are dropped). Arrays: spread flattens ONE level of iterables; object spread is a DISTINCT syntax (not iterable — it reads own props), so [...{a:1}] THROWS (not iterable) while {...[10,20]} indexes.",
      summary:
        "Rest collects (parameters), spread expands (calls/literals), the copy is shallow, and object merge order decides the winner.",
      mistake:
        "Assuming deep copy from spread (nested references are shared), and being surprised that undefined overrides defaults in object merge.",
      profile: "mechanism",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The two roles, verified:\n\n```js\n// REST — gathers the leftovers (in DECLARATIONS)\nfunction tag(strings, ...values) {   // values = array of the rest\n  return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');\n}\nconst [head, ...tail] = [1, 2, 3, 4];    // destructuring rest\n\n// SPREAD — expands an iterable/object (in EXPRESSIONS)\nconst merged = [...left, ...right];              // arrays: concat, one level\nconst extended = { ...defaults, ...overrides };   // objects: later wins\nfn(...args);                                    // call: expand as arguments\n\n// THE SHALLOW-COPY TRAP — one level only\nconst orig = { profile: { name: 'A' }, tags: ['x'] };\nconst copy = { ...orig };\ncopy.profile.name = 'B';\norig.profile.name;            // 'B'!! — nested object is SHARED\n// the fix for one extra level:\nconst deep2 = { ...orig, profile: { ...orig.profile } };\n// arbitrary depth: structuredClone(orig) — the modern deep copy\n```\n\nThe merge-order rule (the design tool): object spread applies sources LEFT to RIGHT — { ...a, ...b } means b WINS key conflicts. That single rule builds the override pattern: defaults first, user config second, explicit options last ({ ...defaults, ...user, force: true }). The two traps: undefined IS a value that OVERRIDES ({ ...{ x: 1 }, x: undefined }.x === undefined — the 'why did my default vanish' bug; the fix is conditional spread { ...(cond && { x: 1 }) } or a nullish-clean pass), and getters evaluate during spread (a source with a getter that logs will fire).\n\nThe iterable contract (what spread accepts): arrays, strings (spread = code points — the emoji-safe string split), Maps/Sets, generators (lazy pipelines), and any object with Symbol.iterator — but NOT plain objects in ARRAY/ARGUMENT spread ([...{ a: 1 }] throws 'not iterable'; object spread is a separate own-properties operation). This is exactly the duck-typing boundary the array-like (arguments, NodeList) conversion rides on: [...document.querySelectorAll('li')] works BECAUSE NodeList iterates.",
      flow:
        "flowchart LR\n    DOTS['...'] -->|in declarations| REST[collect the rest into an array]\n    DOTS2['...'] -->|in expressions| SPREAD[expand in place]\n    SPREAD --> ARR[arrays: one level of iterables]\n    SPREAD --> OBJ[objects: own enumerable props, right-to-left merge]\n    COPY[spread copy] --> SHALLOW[one level — nested objects SHARED]\n    DEEP[structuredClone] --> FULL[real deep copy]\n    UNDEF[undefined overrides in merge] --> FIX[conditional spread: ...(cond && { k: v })]\n    ITER[Symbol.iterator] --> WHAT[iterable? then ...arr works]\n    NOTIT[plain object] --> THROW[not iterable — {...obj} is separate syntax]",
      deep:
        "Why spread is one-level (the engine truth): spread invokes the iterator/own-keys machinery ONCE for the target structure — the values it copies are REFERENCES to whatever the source contains; there's no recursion, so the shallow boundary is intrinsic. That's why the React update idiom spells nested state changes explicitly (setUser({ ...user, profile: { ...user.profile, name: 'B' } }) — every level you want to 'change' must get a new object; libraries (immer) exist precisely to write deep updates in mutable syntax and produce the same structural sharing — with the same reference-equality-based skip optimizations).\n\nRest parameters vs arguments (the replacement story): rest gives a REAL array (methods, map/sort work), omits named params, and works in arrow functions — arguments is array-LIKE (no methods without conversion), contains ALL args (including named), exists only in non-arrow functions, and binds per-execution (not lexical). The interplay: function f(a, ...rest) + f(...args) is a lossless forwarder EXCEPT f.length reports only pre-rest arity (a metadata detail with real effects on curry/arity-based libraries).\n\nThe spec edges that come up in senior rounds: spread on a Set/array DEDUPES (the [...new Set(arr)] idiom — spread is where iterable → array conversion meets Set's uniqueness); object spread respects ENUMERABILITY — Object.defineProperty'd non-enumerable props are silently dropped (a serialization gotcha); property ORDER for integer-like keys is ascending-numeric first, then insertion order for string/symbol keys (the spread-into-plain-object round-trip can REORDER keys vs the source — visible in JSON.stringify diffs); and { ...null } is legal and yields {} (null/undefined sources are ignored in object spread, THROW in array spread when iterated — the asymmetry worth one sentence in an interview).",
    },
  ],
});

total += applyTopic({
  moduleSlug: "javascript-async-basics",
  topicSlug: "template-literals",
  topicTitle: "Template Literals",
  anchors: [
    {
      slug: "javascript-async-basics-template-literals-tagged-templates",
      slugName: "template literals and tagged templates",
      question: "What do template literals offer beyond interpolation — tagged templates, multi-line strings, and the XSS line?",
      title: "Tagged Templates",
      direct:
        "Backticks give: multi-line strings (real newlines, no \\n), ${expr} interpolation (any EXPRESSION, not just variables — calls, ternaries, nested templates), and TAGGED templates — tag`...` calls a function with the string parts and the interpolated values (the mechanism behind gql`...`, styled.div`...`, and html`...` safe-rendering libraries — the tag RECEIVES raw structure instead of a pre-joined string, which is what makes context-aware interpolation possible). Tag contract: (strings, ...values) where strings is frozen with a .raw property (raw escape sequences un-processed — String.raw`C:\\new\\test`). The security line: template literals have NO built-in sanitization — `<div>${userInput}</div>` into innerHTML is the same XSS hole as concatenation; safety comes from textContent, sanitizers, or a tag function that escapes interpolations (html`` libraries).",
      summary:
        "Backticks = multi-line + expression interpolation + tagged templates (structure-aware tags); interpolation is NOT sanitization.",
      mistake:
        "Treating ${} interpolation as safe HTML building (it is concatenation with a nicer face), and hand-rolling escaping instead of calling the tag/library that owns it.",
      profile: "mechanism",
      stage: "fundamentals",
      priority: "frequent",
      language: "js",
      speakable:
        "The three capabilities, verified:\n\n```js\n// 1. MULTI-LINE + interpolation (any expression)\nconst summary = `Order #${order.id}: ${items.length} items,\ntotal $${(order.total / 100).toFixed(2)} — ${order.paid ? 'PAID' : 'DUE'}`;\n// nested templates compose:\nconst row = `<tr>${rows.map(r => `<td>${r.name}</td>`).join('')}</tr>`;\n\n// 2. TAGGED TEMPLATES — a function call with structure\nfunction upper(strings, ...values) {\n  // strings: ['user ', ' logged in'] — frozen, with .raw\n  return strings.reduce((acc, s, i) =>\n    acc + s + String(values[i] ?? '').toUpperCase(), '');\n}\nupper`user ${name} logged in`;   // 'user ADA logged in'\n\n// 3. String.raw — the escape-preserving tag\nconst path = String.raw`C:\\new\\test`;   // backslashes survive literally\n```\n\nWhy tags matter (the real-world mechanism): a tag sees the string CHUNKS and the VALUES separately — BEFORE they're joined. That's the difference between structure and soup: styled-components assigns hash names to static parts; gql`...` parses the query (and flags duplicate interpolations of variables); safe html`` libraries ESCAPE each value by position (user data escaped, markup passed separately) — impossible with a plain string because concatenation has already destroyed the boundary between 'my markup' and 'their data'.\n\nThe XSS line (the interview's security question): `<div>${comment}</div>` is EXACTLY as dangerous as '<div>' + comment — interpolation does NOT sanitize. The discipline: user data goes through textContent, a sanitizer (DOMPurify), or a structure-aware tag; NEVER into innerHTML raw. The general rule for building HTML in JS: build with DOM APIs (createElement/textContent) or pass markup and data as SEPARATE interpolations to a tag that knows which is which.",
      flow:
        "flowchart LR\n    BT[backtick string] --> ML[true multi-line, no escapes]\n    BT --> INT['${}' any expression — nested calls, ternaries, templates]\n    TAG['tag`...`'] --> PARTS[receives frozen strings array + values]\n    PARTS --> LIB[gql, styled, safe-html — structure-aware libs]\n    RAW[String.raw] --> ESC[escape sequences preserved]\n    UNSAFE['`<div>${user}` → innerHTML'] --> XSS[same as concatenation — NOT sanitized]\n    SAFE[textContent / sanitizer / escaping tag] --> OK",
      deep:
        "The exact tag contract (the spec details): strings.raw holds the UNPROCESSED escapes (\\n as two characters, not a newline — String.raw returns it verbatim) — the tag chooses which view to read; the strings array is FROZEN (mutable tags must copy) and carries the values as a SEPARATE rest parameter — a tag with values.length N always gets strings.length N+1 (the interleaved structure). Follow .raw (the interpolated template literal cache) exists because parsing the same tagged template repeatedly is wasteful — engines can cache per (tag, strings-identity); the observable consequence: a tag receiving the same static parts twice may receive the SAME strings object (identity === between calls) — a caching hook real libraries exploit.\n\nWhere tags genuinely beat functions (the design pattern): a function receives already-joined data — the boundary between literal and data is lost. The tag receives the boundary itself, which is the ONLY way to: differentiate trusted static markup from untrusted interpolation (escaping by POSITION), give interpolations meaning per-slot (sql`SELECT ${cols} FROM ${table} WHERE id = ${id}` — identifiers vs values validated differently), or deduplicate/parse statics once (styled-components' hash, graphql's document cache). This is why every serious DSL in the JS ecosystem is a tag, not a template function.\n\nThe boundaries worth stating (senior details): template literals are evaluated EAGERLY at the expression's evaluation — no lazy interpolation (generators + String.raw get you partway; there is no built-in 'format later'); they are NOT a replacement for i18n pluralization/formatting (Intl.MessageFormat exists for that — interpolation says nothing about locale rules); and nested template literal performance in hot paths is fine (engines optimize the join), but the classic bug remains reading template-built HTML into innerHTML — the security story dominates every deep-dive.",
    },
  ],
});

// ---------- javascript-fundamentals ----------

total += applyTopic({
  moduleSlug: "javascript-fundamentals",
  topicSlug: "events-and-listeners",
  topicTitle: "Events And Listeners",
  anchors: [
    {
      slug: "javascript-fundamentals-events-and-listeners-event-api",
      slugName: "the event listener API",
      question: "How does the event listener API work — options, removal, and the patterns that prevent leaks?",
      title: "Event Listener Api",
      direct:
        "addEventListener(type, handler, options) — the third arg: { capture } (phase), { once } (auto-remove after first fire), { passive } (promises no preventDefault — unlocks smooth scrolling on wheel/touch), { signal } (an AbortSignal — abort() removes EVERYTHING bound with it — the modern bulk-teardown). Removal MUST match: removeEventListener with the SAME function reference, type, and capture flag (an anonymous/inline handler can never be removed — the leak). The leak patterns: listeners on window/document/long-lived parents referencing component state (removed component, retained listener, retained closure = the whole subtree un-collectable) and interval/timeout timers left running. The discipline: teardown in the same module that binds (an abort controller per component/lifecycle — bind with { signal }, dispose with controller.abort()).",
      summary:
        "The options object (capture/once/passive/signal), reference-matching removal, and the signal-based teardown that prevents leaks.",
      mistake:
        "Binding inline anonymous handlers that can never be removed, and forgetting timers/intervals in teardown — the classic detached-DOM leak.",
      profile: "implementation",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The API with the lifecycle discipline, verified:\n\n```js\n// BIND with a scope — one abort controller per component/page\nfunction mountSearch(container) {\n  const scope = new AbortController();          // the whole mount's teardown\n\n  container.addEventListener('input', onInput, { signal: scope.signal });\n  window.addEventListener('resize', onResize, {\n    signal: scope.signal,\n    passive: true,                               // won't preventDefault → smooth\n  });\n  document.addEventListener('keydown', onKey, {\n    signal: scope.signal,\n    capture: true,                               // catch before children\n  });\n  const timer = setInterval(autoSave, 30_000);\n\n  return () => {                                // the ONE dispose function\n    scope.abort();                               // removes EVERY signal listener\n    clearInterval(timer);                        // timers are NOT covered\n  };\n}\n\n// REMOVAL RULE — exact reference + type + capture match\nel.removeEventListener('click', onClick);        // works: same function ref\nel.removeEventListener('click', () => {});      // NEVER works: new function\n```\n\nThe options (each one answers a real problem): once — one-shot UI (first-scroll banner reveal); passive — the browser doesn't wait for your handler on scroll-blocking events (wheel, touchstart, and on modern browsers scroll listeners default passive on window/document — an explicit preventDefault there logs a warning); capture — see the event before target-phase handlers (interception, focus/blur which don't bubble); signal — the modern answer to 'remove 12 listeners on unmount' — one abort() call.\n\nThe leak anatomy (why listeners leak and what they take with them): a listener on a LONG-LIVED target (window, document, a persistent parent) captures its handler's closure — variables, DOM nodes, component state — and keeps them unreachable-for-GC as long as the TARGET lives. Remove the component but not the listener, and the listener keeps its whole world alive: the 'detached DOM' grows in memory with every mount/unmount. The audit pattern: Performance panel → 'Detached nodes' / heap snapshot, listener breakpoints, and getEventListeners(el) in the DevTools console (the hidden inspection API).",
      flow:
        "flowchart TD\n    A[addEventListener type fn options] --> OPT{options}\n    OPT --> CAP[capture: run in capture phase]\n    OPT --> ONCE[once: auto-remove after first fire]\n    OPT --> PAS[passive: no preventDefault → smooth scroll]\n    OPT --> SIG[signal: abort() removes all bound]\n    R[removeEventListener] --> MATCH[must match fn reference + type + capture]\n    LEAK[listener on long-lived target] --> CLOSURE[closure retains its whole world]\n    DISPOSE[dispose: scope.abort() + clear timers] --> CLEAN[no detached-DOM leak]\n    IR[inline anonymous handler] --> UNREMOVABLE[can never be removed]",
      deep:
        "The reference-identity contract (the mechanism behind 'cannot remove'): removeEventListener compares the function you pass with the registered ones by IDENTITY — an inline arrow creates a NEW function each time it's evaluated, so the removal call NEVER matches (and the registered handler stays). The same trap in React: every render re-creates methods — the reason addEventListener in useEffect must take the cleanup function seriously (bind → return the remove with the SAME reference → cleanup runs before re-bind and at unmount; eslint's exhaustive-deps guards the capture variables so the identity stays valid).\n\nThe passive default shift (the platform detail worth knowing): Chrome made wheel/touchstart/touchmove listeners on window/document/document-level nodes PASSIVE BY DEFAULT (since ~56) — calling preventDefault there is a no-op plus a console warning. That's why scroll-blocking handlers must pass { passive: false } EXPLICITLY today (pull-to-refresh, custom drag-over-scroll) — and why the default exists: before it, a single bad wheel listener could jank ALL scrolling (the browser waited for every listener's verdict before scrolling).\n\nThe stronger teardown primitives (the scale answers): { signal } IS the platform acknowledging that listener lifecycle should be OWNED rather than hand-tracked — bind many with one signal, abort once (one API replacing N removes; also covers fetch cancellation with the SAME controller — the elegant 'cancel the page load AND its listeners' scope). EventTarget (the base class — Node's EventEmitter sibling) means you can BUILD listenable objects (class Model extends EventTarget — dispatchEvent(new CustomEvent('change', { detail })) with addEventListener on the consumer side); and the observer family (IntersectionObserver, MutationObserver, ResizeObserver) covers the recurring 'react to the platform' needs with disconnect() — the modern replacements for scroll/DOM-churn listeners that leak most often in the wild.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "javascript-fundamentals",
  topicSlug: "scenario-based",
  topicTitle: "Javascript Scenario Based",
  anchors: [
    {
      slug: "javascript-fundamentals-scenario-based-js-bug-playbook",
      slugName: "JavaScript debugging scenarios",
      question: "A JS feature behaves wrongly — stale values, silent NaN, or 'undefined is not a function' — what's the playbook?",
      title: "Js Bug Playbook",
      direct:
        "Classify by SYMPTOM, then apply the matched tool: (1) STALE VALUES — the code sees an old variable: closure captured at creation (React stale state; loop var), async read of a since-changed binding — reproduce with a logged boundary (log before/after each await), fix with functional updates or reading fresh state at call time. (2) SILENT NaN / 'undefined' propagation — an arithmetic/string operation on undefined/null (a missing key, a fetch shape drift, a parseFloat fail): guard at the BOUNDARY (default values ?? / || with care: || drops 0 and '' — the falsy trap; ?? only null/undefined), and fail loud in dev with a thrown Error carrying the shape. (3) 'X is not a function' / undefined property — the object isn't what you think (wrong import shape: default vs named; async import not awaited; array vs single element): console.log the OBJECT not the message, check the actual runtime type. The meta-rule: never debug from a hypothesis — REPRODUCE, LOG THE ACTUAL VALUE at the boundary where assumption meets reality, then fix the cause.",
      summary:
        "Match the fix to the symptom class: stale closures (log await boundaries), silent NaN (guard at boundaries with ?? and loud dev errors), and shape surprises (inspect the object itself).",
      mistake:
        "Debugging from a hypothesis without reproducing, and using || where 0/'' are valid values (the falsy trap that CREATES silent bugs).",
      profile: "debugging",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The playbook, one pattern per symptom class:\n\n```js\n// 1. STALE VALUES — the boundary log reveals capture vs fresh\nasync function save() {\n  console.log('state at entry:', { qty, cartId });    // entry snapshot\n  const res = await api.checkout({ qty, cartId });\n  console.log('state after await:', { qty, cartId }); // UNCHANGED — but the\n  // OUTER world may have moved: this function HOLDS the entry snapshot.\n}\n// React's stale-state twin: handler from render 1 reads render-1 state —\n// the fix is the FUNCTIONAL update reading fresh state at apply time:\nsetCount(c => c + 1);        // not setCount(count + 1) — the classic bug fix\n\n// 2. SILENT NaN / undefined propagation — guard at the BOUNDARY\nconst price = row.unitPrice ?? 0;            // ?? : only null/undefined\nconst label = row.name || 'Unnamed';         // || DROPS '' too — is that wanted?\nconst qty = Number(row.qty);\nif (!Number.isFinite(qty)) throw new Error('bad qty shape: ' + JSON.stringify(row));\n// fail LOUD in dev, degrade gracefully in prod — but NEVER propagate NaN\n\n// 3. SHAPE SURPRISES — inspect the OBJECT, not the error message\nconsole.log('the actual import:', mod);       // default vs named? undefined?\nconsole.log('the actual res:', res, Array.isArray(res), res?.constructor?.name);\n// 'res.map is not a function' usually means res is { items: [...] } — one\n// structural log answers what the error string never shows\n```\n\nThe || vs ?? decision (the bug that CREATES silent bugs): || treats EVERY falsy as absent — 0, '', false, NaN all trigger the fallback. `${count || 'none'}` prints 'none' for a legitimate 0; total || 0 hides a real 0 behind 0 — indistinguishable from 'missing'. ?? fires ONLY on null/undefined — the correct default operator for 'the value may be absent', while || stays correct for 'absent OR empty-is-fine' (display strings). Mixing them up is a top-5 silent-bug source.\n\nThe meta-discipline (what actually separates seniors): the bug lives at the BOUNDARY between what one part believes and what another provides — entry to a function, return from an await, an import, an API response. Log THAT boundary (the actual object, the actual type) instead of sprinkling logs everywhere. Reproduce first (a bug you can trigger on demand is fixed in minutes; one you 'think you know' costs days), delete instrumentation after, and write the regression test while the evidence is fresh.",
      flow:
        "flowchart TD\n    B[bug report] --> R[reproduce on demand FIRST]\n    R --> CL{symptom class}\n    CL -->|stale value| S1[closure captured old state]\n    S1 --> F1[log await boundaries; functional updates; fresh read at call time]\n    CL -->|silent NaN undefined| S2[unguarded boundary]\n    S2 --> F2[?? defaults, Number.isFinite guards, loud dev errors]\n    CL -->|not a function / undefined prop| S3[shape surprise]\n    S3 --> F3[log the OBJECT + its real type; check import shape, await, array-vs-single]\n    HYP[hypothesis-driven debugging] --> WASTE[fixing the wrong thing]\n    EVID[boundary evidence: actual value actual type] --> FIX[fix the cause, add regression test]",
      deep:
        "Why stale closures happen (the underlying model, one sentence at a time): a function captures its LEXICAL ENVIRONMENT at creation — the bindings, not values. Later calls read the binding's CURRENT state for ordinary code, but a handler stored long ago (React render's handler, a setTimeout callback) holds a reference to the environment it was born in — if that environment is a previous render, its 'state' variables are that render's snapshot. The three fixes in order of preference: read at CALL time from a source that can't go stale (a ref, the store), functional updates (the updater receives the latest), or re-create the handler (dependencies arrays exist to trigger this).\n\nThe NaN/undefined propagation economics (why boundaries, not midpoints): one bad value entering a pipeline poisons every downstream expression silently — NaN compares false to everything, undefined stringifies to 'undefined', null arithmetic NaNs. The cost of guarding AT THE PIPELINE ENTRY (parse → validate → typed value) is one check; the cost of guarding every USE is N checks plus the ones you forget. That's the argument for validators at module/API boundaries (a tiny parse function, a schema check) over scattered ?? — and for TypeScript's honest unknown at the boundary.\n\nThe debugging-tool map beyond console.log (worth naming in interviews): breakpoints with CONDITIONAL filters (stop only when qty === undefined — no log spam); the debugger statement for 'always break here' in code under inspection; the Sources pane's scope/watch (see every binding live — better than log-then-rerun); and for async: the 'Async' stack checkbox connecting await chains to their origins. getEventListeners / monitor / copy in the console (the DevTools command-line API) for one-shot inspection without code changes. The through-line: the tool that shows you the ACTUAL VALUE with the least ceremony wins — and the discipline is deleting every trace of it before merge.",
    },
  ],
});

console.log(`Curated browser-dom + js-async + js-fundamentals remaining: ${total} questions.`);
