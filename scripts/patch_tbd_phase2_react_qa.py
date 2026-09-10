#!/usr/bin/env python3
"""One-off patch: replace _TBD_PHASE_2_ in react-core and react-state-data complete-qa.json files."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "content/java-fullstack-intermediate"


def sec(t, title, content):
    return {"type": t, "title": title, "content": content}


# slug -> (direct_answer, [sections])
PATCHES: dict[str, dict[str, tuple[str, list]]] = {}

# --- react-core/components-and-jsx ---
PATCHES["react-core/components-and-jsx/complete-qa.json"] = {
    "functional-vs-class-components-react": (
        "**Functional components** are plain functions that return JSX; **class components** are ES6 classes extending `React.Component` with `render()`. Since **React 16.8 hooks**, function components are the **default** for new code: state, effects, context, and memoization all live in hooks. Classes remain supported and still own **error boundaries** (`componentDidCatch`) until a hooks-based boundary exists. Performance is **not** inherently better for either model.",
        [
            sec(
                "architecture_diagram",
                "Hooks vs class mental model",
                "```mermaid\nflowchart TB\n  subgraph fn[\"Function component\"]\n    H1[useState / useEffect / useMemo]\n    R1[render → JSX]\n  end\n  subgraph cls[\"Class component\"]\n    L[constructor / lifecycle]\n    R2[render → JSX]\n  end\n  App[App tree] --> fn\n  App --> cls\n```",
            ),
            sec(
                "after_code",
                "Same UI: class vs function",
                "```tsx\n// Function + hooks (modern default)\nfunction Counter() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}\n\n// Class (legacy / error boundaries)\nclass ErrorShell extends React.Component {\n  state = { err: null as Error | null };\n  static getDerivedStateFromError(e: Error) { return { err: e }; }\n  render() {\n    return this.state.err ? <p>Something broke</p> : this.props.children;\n  }\n}\n```",
            ),
            sec(
                "tradeoffs",
                "When each still makes sense",
                "**Function + hooks:** new features (Concurrent, **Server Components**, modern data libraries) assume this model.\n\n**Classes:** error boundaries today; deep legacy codebases; occasional third-party APIs that expect class refs.\n\n**Cost of migration:** large class trees need incremental refactors; hooks change how you think about effects (deps, cleanup) vs `componentDidMount`.",
            ),
            sec(
                "key_points",
                "Key Points",
                "- **Hooks do not exist inside class `render`** — pick one style per component.\n- **New React APIs are function-first** — Suspense data, `use()`, RSC.\n- **Error boundaries are still class-only** in core React (libraries wrap this).\n- **No performance crown** — measure; both reconcile through the same Fiber runtime.",
            ),
            sec(
                "speakable_answer",
                "How to Answer This Verbally",
                "Function components are just functions; classes are `React.Component` subclasses with lifecycle methods.\n\nSince hooks, we write **almost all new UI as functions** because state and side effects map cleanly to `useState` and `useEffect`.\n\nClasses are still valid — I mention **error boundaries** specifically because `componentDidCatch` does not have a stable hook replacement in core yet.\n\nI avoid claiming one is faster; **React optimizes both** through the same reconciler.",
            ),
        ],
    ),
    "what-is-jsx-how-it-transpiles": (
        "**JSX** is syntax sugar so you can write tree-shaped UI in JavaScript. Classic transform calls **`React.createElement(type, props, ...children)`**; the **automatic JSX runtime** (React 17+) calls **`_jsx(type, props, key)`** from `react/jsx-runtime`, so you **do not need `import React` in scope** for JSX-only files. Babel, SWC, or TypeScript performs this compile step before bundling.",
        [
            sec(
                "architecture_diagram",
                "From JSX to runtime calls",
                "```mermaid\nflowchart LR\n  A[\"<Card title=... />\"] --> B[Compiler]\n  B --> C[\"jsx(Card, { title }, key)\"]\n  C --> D[Fiber reconcile]\n```",
            ),
            sec(
                "after_code",
                "What the compiler emits (conceptually)",
                "```tsx\n// JSX\nexport function Greet({ name }: { name: string }) {\n  return <h1 className=\"hi\">Hello {name}</h1>;\n}\n\n// Simplified classic output\nimport { createElement as h } from \"react\";\nexport function Greet({ name }) {\n  return h(\"h1\", { className: \"hi\" }, \"Hello \", name);\n}\n```",
            ),
            sec(
                "tradeoffs",
                "Classic vs automatic JSX runtime",
                "**Automatic runtime:** smaller boilerplate, slightly better DX, aligns with TS `jsx: react-jsx`.\n\n**Classic `React.createElement`:** older tooling or explicit `import React` habits.\n\n**Capitalization rule:** `<Foo />` is a component; `<foo />` is treated as a **built-in DOM tag** — this is how the compiler chooses `createElement` type.",
            ),
            sec(
                "key_points",
                "Key Points",
                "- JSX is **not HTML** — `className`, `htmlFor`, camelCase DOM props.\n- **Fragments** `<>...</>` avoid wrapper divs for multiple roots.\n- **Children** can be expressions `{value}` interleaved with elements.\n- **Server Components** still use JSX but execute on the server with different rules for hooks and data.",
            ),
            sec(
                "speakable_answer",
                "How to Answer This Verbally",
        "JSX is a syntax extension that compiles to plain JavaScript function calls that build React elements.\n\nHistorically that was `React.createElement`; today the automatic runtime uses the **`jsx` helper from `react/jsx-runtime`** so files without other React APIs do not need a default React import.\n\nThe compiler uses **capitalization** to tell custom components from intrinsic HTML tags.\n\nI always note JSX is **embedded expressions in braces**, not a template language executing arbitrary HTML.",
            ),
        ],
    ),
}

# Continue building PATCHES in the same dict structure - file relative path from BASE / react-core or react-state-data

# I'll append more in a second write or expand this file - actually better to split: run multiple patch dicts merged.
