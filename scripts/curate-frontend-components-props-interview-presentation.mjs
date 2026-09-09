#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/react-fundamentals/components-and-props/complete-qa.json",
);

const presentations = [
  {
    slug: "react-fundamentals-components-and-props-interview-basics",
    question: "What are React components and props?",
    beats: [
      {
        cue: "Define a component as a reusable UI calculation",
        stage: "Components describe UI",
        spokenText: "A React component is a JavaScript function that describes one part of the interface and returns React elements, usually written with JSX. A small component may describe a button, while a larger one may describe a product list and render other components beneath it. Component names begin with a capital letter in JSX so React can distinguish them from built-in HTML elements such as `button` and `section`.",
      },
      {
        cue: "Show how a parent configures each rendered instance",
        stage: "Props are component inputs",
        spokenText: "Props are the inputs a parent supplies through JSX attributes. In `<Avatar name=\"Mira\" size={48} />`, React creates an element whose props contain the string `name` and numeric `size`, then uses those values when it renders `Avatar`. Props can also hold objects, callbacks, and React elements, so one component function can produce different results for different parent-owned data.",
        support: {
          type: "code",
          title: "Configure one reusable product card",
          language: "jsx",
          code: "function ProductCard({ product, onAdd }) {\n  return (\n    <article>\n      <h2>{product.name}</h2>\n      <p>₹{product.price}</p>\n      <button onClick={() => onAdd(product.id)}>Add</button>\n    </article>\n  );\n}\n\nexport default function ProductList({ products, addToCart }) {\n  return products.map((product) => (\n    <ProductCard\n      key={product.id}\n      product={product}\n      onAdd={addToCart}\n    />\n  ));\n}",
          caption: "Every card reads its product prop and reports the selected ID through the callback; the list keeps ownership of the cart action.",
        },
      },
      {
        cue: "Explain read-only snapshots and one-way ownership",
        stage: "Values move down",
        spokenText: "A child treats props as read-only snapshots for the current render. It does not edit a passed object or assign a new value to a prop. When the source value changes, its owner renders the child with new props and React calculates the next UI. This one-way flow keeps the source of truth visible and allows render code to stay pure: the same props, state, and context should describe the same JSX.",
        support: {
          type: "trace",
          title: "Data goes down; events report up",
          items: [
            {
              label: "Parent",
              value: "owns product and cart",
              detail: "The source values live with the component responsible for changing them.",
              tone: "blue",
            },
            {
              label: "Props",
              value: "product + onAdd",
              detail: "A read-only render snapshot configures ProductCard.",
              tone: "neutral",
            },
            {
              label: "Child event",
              value: "onAdd(product.id)",
              detail: "The card reports intent without mutating the parent's collection.",
              tone: "orange",
            },
            {
              label: "Next render",
              value: "new props",
              detail: "The owner updates state and sends the resulting snapshot down.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Close with callbacks and meaningful component boundaries",
        stage: "Callbacks report events",
        spokenText: "A callback prop does not make data flow backwards. It is another parent-supplied value that lets the child report an event, while the owner decides whether state changes. Components are most useful when they name a coherent UI responsibility or reusable behaviour; splitting every small wrapper adds contracts without adding clarity. Props make a useful boundary configurable while keeping ownership explicit.",
        recallRule: "A component calculates UI; props are its read-only parent-owned inputs, and callback props let it report events to the owner.",
      },
    ],
  },
  {
    slug: "react-fundamentals-components-and-props-when-to-use",
    question: "What is the difference between props and state in React?",
    beats: [
      {
        cue: "Compare props and state by ownership rather than location",
        stage: "The owner is different",
        spokenText: "Props and state are both inputs to a render, but they have different owners. Props are supplied by a parent when it creates a child element. State is memory associated with a component's position in the React tree and is declared with a Hook such as `useState` or `useReducer`. Calling props external and state internal is a useful shortcut, but ownership is the rule that explains how each value should change.",
        support: {
          type: "comparison",
          title: "Props and state side by side",
          items: [
            {
              label: "Owner",
              value: "parent / component position",
              detail: "A parent owns a prop; the rendered component position owns its state.",
              tone: "blue",
            },
            {
              label: "Change",
              value: "new prop / setter",
              detail: "The owner renders a new prop or queues state with a setter or reducer.",
              tone: "green",
            },
            {
              label: "Mutation",
              value: "neither is mutated",
              detail: "Both are read-only snapshots while a render is running.",
              tone: "neutral",
            },
            {
              label: "Purpose",
              value: "configure / remember",
              detail: "Props configure a child; state remembers changing UI data.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain how each owner supplies a new render snapshot",
        stage: "Both change by replacement",
        spokenText: "A child reads its props but cannot change them. To request a change, it calls a parent callback and the parent may render a new prop value. A component updates its own state through a setter or reducer, which queues another render with a new state snapshot. Direct mutation of either value bypasses that model and can leave the displayed UI inconsistent with React's known state.",
      },
      {
        cue: "Place shared state where every coordinated child can reach it",
        stage: "Shared truth moves up",
        spokenText: "If two children must agree on one value, place the state in their closest common owner and pass each child the needed value and event callback. An accordion can own one `activeId`; each panel receives `isActive` and `onShow` as props. A click reports upward, the parent changes one state value, and both panels receive consistent props on the next render.",
        support: {
          type: "code",
          title: "One state value controls sibling panels",
          language: "jsx",
          code: "import { useState } from \"react\";\n\nfunction Panel({ title, isActive, onShow }) {\n  return (\n    <section>\n      <h2>{title}</h2>\n      {isActive ? <p>Details</p> : <button onClick={onShow}>Show</button>}\n    </section>\n  );\n}\n\nexport default function Accordion() {\n  const [activeId, setActiveId] = useState(\"profile\");\n  return (\n    <>\n      <Panel title=\"Profile\" isActive={activeId === \"profile\"} onShow={() => setActiveId(\"profile\")} />\n      <Panel title=\"Security\" isActive={activeId === \"security\"} onShow={() => setActiveId(\"security\")} />\n    </>\n  );\n}",
          caption: "Accordion owns the changing selection as state; each Panel receives its current view and an event callback as props.",
        },
      },
      {
        cue: "Warn against creating a second source of truth",
        stage: "Do not copy without a reason",
        spokenText: "`useState(props.name)` uses the prop only when that state is first created; later prop changes do not automatically reset the local copy. That separate timeline is valid for an intentionally independent edit draft, but it needs an explicit reset boundary. Values such as `fullName` that can be calculated from current props and state usually should be derived during render rather than stored again.",
        recallRule: "Use props for values owned elsewhere, state for values this component position owns and remembers, and lift shared truth to the closest common owner.",
      },
    ],
  },
  {
    slug: "react-fundamentals-components-and-props-common-mistake",
    question: "How does the children prop support component composition?",
    beats: [
      {
        cue: "Connect nested JSX to the children prop",
        stage: "Nested JSX becomes children",
        spokenText: "`children` is the prop React uses for content placed between a custom component's opening and closing tags. In `<Card><Profile /></Card>`, the caller creates the `Profile` element and React includes it in Card's props as `children`. Card can render that value inside its own markup without importing Profile or knowing how Profile is implemented.",
        support: {
          type: "trace",
          title: "How nested content reaches a wrapper",
          items: [
            {
              label: "Caller",
              value: "creates nested elements",
              detail: "The inner JSX describes the content the caller owns.",
              tone: "blue",
            },
            {
              label: "Element props",
              value: "children value",
              detail: "React carries that content on the wrapper element's props.",
              tone: "neutral",
            },
            {
              label: "Wrapper",
              value: "places children",
              detail: "The component chooses where the supplied subtree appears.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Explain the separate responsibilities created by composition",
        stage: "The wrapper owns the frame",
        spokenText: "Composition lets a reusable component own a shell, layout, or behaviour while each caller supplies its domain content. A `Dialog` can own the dialog heading, close action, and body position. One caller places a confirmation message in that body and another places a sign-in form, so Dialog does not need a new condition or configuration flag for every content type.",
      },
      {
        cue: "Show that children is an opaque renderable value",
        stage: "Children can take many forms",
        spokenText: "Children are not guaranteed to be one DOM node. The value may be text, one element, several elements, a Fragment, or nothing. A normal container should simply place that opaque renderable value. React's `Children` utilities are reserved for cases that genuinely need to inspect or transform the immediate child structure.",
        support: {
          type: "code",
          title: "One dialog shell accepts different content",
          language: "jsx",
          code: "function Dialog({ title, children, onClose }) {\n  return (\n    <section role=\"dialog\" aria-labelledby=\"dialog-title\">\n      <h2 id=\"dialog-title\">{title}</h2>\n      <div>{children}</div>\n      <button onClick={onClose}>Close</button>\n    </section>\n  );\n}\n\nexport default function SignInDialog({ onClose }) {\n  return (\n    <Dialog title=\"Sign in\" onClose={onClose}>\n      <form>{/* sign-in fields */}</form>\n    </Dialog>\n  );\n}",
          caption: "Dialog controls the reusable shell and insertion point; its caller supplies the form as a child element.",
        },
      },
      {
        cue: "Choose named slots when several positions have different roles",
        stage: "Named slots clarify roles",
        spokenText: "When a component needs several independently placed areas, named element props such as `header` and `footer` can make those roles clearer while `children` remains the body. Avoid relying on child order or checking child component types when an explicit contract is simpler. Composition also does not remove accessibility work: a real modal still needs focus management, Escape handling, and focus restoration.",
        recallRule: "The caller owns nested content; the component receives it as children and decides where it fits inside the reusable frame.",
      },
    ],
  },
  {
    slug: "react-fundamentals-components-and-props-compare",
    question: "When should you split a React UI into separate components?",
    beats: [
      {
        cue: "Use a coherent responsibility instead of a line-count rule",
        stage: "Name what the component owns",
        spokenText: "Split a React UI when a region has a coherent responsibility that can be named clearly, not when the file reaches an arbitrary number of lines. Repeated structure, focused interaction, a reusable behaviour pattern, or an independently understandable section are useful signals. A one-off section may still deserve a component when the boundary makes ownership and change easier to understand.",
        support: {
          type: "comparison",
          title: "Signals for keeping or extracting",
          items: [
            {
              label: "Keep inline",
              value: "small nearby detail",
              detail: "It has no independent responsibility and follows the parent's simple flow.",
              tone: "neutral",
            },
            {
              label: "Extract",
              value: "clear repeated unit",
              detail: "The region has a useful name, focused behaviour, or repeated structure.",
              tone: "green",
            },
            {
              label: "Reconsider",
              value: "many pass-through props",
              detail: "The proposed boundary may be misplaced or the data model may lack cohesion.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Use one order row to demonstrate a meaningful contract",
        stage: "Extract a focused contract",
        spokenText: "On an order page, a one-off heading can stay inline while a repeated `OrderItem` is a strong component candidate. Each row formats one item, exposes a remove action, and may later own focused quantity controls. The page keeps the order collection, and each row receives a small contract such as `item` and `onRemove` rather than reaching into duplicated state.",
        support: {
          type: "code",
          title: "A stable component for one order row",
          language: "jsx",
          code: "function OrderItem({ item, onRemove }) {\n  return (\n    <li>\n      <span>{item.name} × {item.quantity}</span>\n      <button onClick={() => onRemove(item.id)}>Remove</button>\n    </li>\n  );\n}\n\nexport default function Order({ items, removeItem }) {\n  return (\n    <ul>\n      {items.map((item) => (\n        <OrderItem key={item.id} item={item} onRemove={removeItem} />\n      ))}\n    </ul>\n  );\n}",
          caption: "OrderItem has one row responsibility, a small prop boundary, and stable identity across Order renders.",
        },
      },
      {
        cue: "Account for state ownership and the cost of a boundary",
        stage: "Every boundary has a cost",
        spokenText: "Extraction hides internal markup, but every value the region needs now crosses a prop boundary. A large set of unrelated pass-through props can mean the split is in the wrong place. State should remain with the smallest owner that covers every component needing the same truth: local dropdown state may move into the dropdown, while filters needed by a product list must stay above both controls and results.",
      },
      {
        cue: "Keep component type identity stable between renders",
        stage: "Keep component identity stable",
        spokenText: "Define component functions at module level rather than inside another component's render. A nested definition creates a new function identity on each parent render, so React can treat it as a different component type and reset its state. The goal is neither one huge component nor a maze of wrappers, but a tree whose boundaries match clear responsibilities, data ownership, and useful contracts.",
        recallRule: "Extract a named responsibility with a useful contract, keep state with its real owner, and preserve component identity across renders.",
      },
    ],
  },
];

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions)) throw new Error("Expected a question array");
if (questions.length !== presentations.length) {
  throw new Error(`Expected ${presentations.length} questions, found ${questions.length}`);
}

for (const presentation of presentations) {
  const matches = questions.filter((question) => question.slug === presentation.slug);
  if (matches.length !== 1) {
    throw new Error(`Expected one ${presentation.slug} question, found ${matches.length}`);
  }

  const question = matches[0];
  if (question.question !== presentation.question) {
    throw new Error(`Question text changed for ${presentation.slug}`);
  }

  const sections = question.answer?.sections;
  if (!Array.isArray(sections)) throw new Error(`${presentation.slug} is missing answer sections`);
  const speakableMatches = sections.filter((section) => section.type === "speakable_answer");
  if (speakableMatches.length !== 1) {
    throw new Error(`Expected one speakable answer, found ${speakableMatches.length}`);
  }

  const speakable = speakableMatches[0];
  speakable.answerSize = "standard";
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${presentations.length} components-and-props Interview Answer presentations`);
