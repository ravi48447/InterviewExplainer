#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/frontend-fresher");

const P = (...parts) => parts.join("\n\n");
const B = (...parts) => parts.map((part) => `- ${part}`).join("\n\n");
const mdTable = (headers, rows) => [
  `| ${headers.join(" | ")} |`,
  `|${headers.map(() => "---").join("|")}|`,
  ...rows.map((row) => `| ${row.join(" | ")} |`),
].join("\n");

const lessons = [];

function add(moduleSlug, topicSlug, entries) {
  if (entries.length !== 5) {
    throw new Error(`${moduleSlug}/${topicSlug} must provide five lessons`);
  }
  lessons.push({ moduleSlug, topicSlug, entries });
}

function sectionFromSupport(support) {
  if (!support) return null;
  return { type: support.type, title: support.title, content: support.content };
}

function updateQuestion(original, lesson) {
  const support = sectionFromSupport(lesson.support);
  const sections = [
    { type: "key_points", title: "Quick revision", items: lesson.quick },
    {
      type: "speakable_answer",
      title: "Interview answer",
      answerSize: lesson.answerSize ?? "standard",
      content: Array.isArray(lesson.interview) ? B(...lesson.interview) : lesson.interview,
    },
    {
      type: "overview",
      title: lesson.overviewTitle,
      content: lesson.overview,
    },
    {
      type: "deep_explanation",
      title: lesson.deepTitle,
      content: Array.isArray(lesson.deep) ? P(...lesson.deep) : lesson.deep,
    },
    ...(support ? [support] : []),
    ...(lesson.boundary ? [{
      type: lesson.boundary.type ?? "common_mistakes",
      title: lesson.boundary.title,
      content: lesson.boundary.content,
    }] : []),
  ];

  const updated = {
    ...original,
    question: lesson.question,
    title: lesson.title,
    direct_answer: lesson.direct,
    layout_type: lesson.layout ?? original.layout_type ?? "concept-explanation",
    reading_time_minutes: lesson.minutes ?? 7,
    answer: { ...original.answer, sections },
    followup_questions: lesson.followups,
    seo: {
      ...original.seo,
      metaTitle: `${lesson.title} — frontend fresher interview | InterviewExplainer`,
      metaDescription: lesson.direct.length > 157
        ? `${lesson.direct.slice(0, 154).trimEnd()}...`
        : lesson.direct,
    },
  };
  delete updated.interviewer_intent;
  delete updated.speakable_v2;
  delete updated.answer_sections;
  return updated;
}

add("state-management-basics", "what-is-state-management", [
  {
    question: "What is state management in React, and why does it matter?",
    title: "State management as one clear source of truth",
    direct: "State management is the way an application stores, updates, and shares data that can change while the user works. In React, good state management gives each value a clear owner and makes the UI a predictable result of that state.",
    quick: [
      "State is data that can change and affect what the UI shows.",
      "Each piece of state should have one clear owner.",
      "Updates should be predictable instead of changing data in hidden places.",
      "Local state, lifted state, context, and external stores solve different sharing needs.",
      "Do not store a value when it can be calculated from existing props or state.",
    ],
    interview: [
      "State management means deciding where changing application data lives, who may update it, and which components may read it. In React, the screen is calculated from props and state, so unclear state ownership quickly creates inconsistent UI.",
      "Small, private values normally stay in the component that uses them. When two related components need the same value, it moves to their nearest common parent. Context can make a value available farther down the tree, while an external store can serve unrelated parts of a larger application.",
      "For example, an accordion may keep `openPanelId` in the parent instead of an `isOpen` flag inside every panel. There is then one source of truth, so opening one panel can close the previous panel in the same update.",
      "Good state also has a minimal shape. A filtered list should usually be calculated from `items` and `searchText`; storing all three creates two values that can disagree. Updates should replace objects or arrays rather than mutating the version used by the current render.",
      "The aim is not to put everything in one global store. It is to keep state as local as possible, share it only as far as necessary, and make each change easy to trace from an event to the next render.",
    ],
    overviewTitle: "Changing data needs an owner and an update path",
    overview: "A React interface stays understandable when every changing value has an owner, events request changes through that owner, and consumers receive the new value through props, context, or a store subscription.",
    deepTitle: "State shape, ownership, and derived values",
    deep: [
      "State is a snapshot used to produce one render. Calling a setter requests another render with a new snapshot; it does not rewrite the variables already captured by the current event handler. This is why update logic should be based on the value React provides, especially when several updates depend on earlier ones.",
      "Ownership follows use. A text field's draft may belong to one form, a selected product may belong to a page, and an authenticated user may be needed throughout an application. Moving every value to the highest level adds unnecessary coupling, while keeping shared values in separate children makes them drift apart.",
      "A minimal model prevents contradictions. If `subtotal` is always the sum of cart lines, calculate it during render. Store it separately only when it represents an independent fact, such as a server-confirmed charged amount that may intentionally differ from the current cart.",
    ],
    support: {
      type: "flow_diagram",
      title: "A predictable state update",
      content: "```mermaid\nflowchart LR\n  E[User event] --> U[Owner updates state]\n  U --> R[React renders a new snapshot]\n  R --> V[Consumers receive new values]\n  V --> D[DOM is updated]\n```",
    },
    boundary: { title: "Local first, shared when required", content: "Global state is not automatically better state. Keeping a modal's open flag inside the modal owner avoids making unrelated screens depend on it. Share only the values that truly cross component or route boundaries." },
    followups: ["What is a single source of truth in React?", "What is derived state?", "How do you decide whether state should be local or shared?"],
  },
  {
    question: "How do you decide where React state should live?",
    title: "Choosing the nearest useful state owner",
    direct: "Place state in the lowest component that owns every consumer that must stay in sync. Keep private state local, lift shared state to the nearest common parent, use context for distant descendants, and consider an external store only when the sharing or update model justifies it.",
    quick: [
      "List every component that reads or changes the value.",
      "Choose their nearest common owner.",
      "Pass explicit values and callbacks when the path is short.",
      "Use context for widely needed data below one provider.",
      "Use an external store for broader independent consumers or non-React access.",
    ],
    interview: [
      "I place a value by looking at its consumers, not by choosing a favourite library. If one component alone needs it, local state gives the clearest ownership. If siblings must agree, their nearest common parent should own the value and pass it down.",
      "For example, a product filter and a result list may be siblings. Their page can own `query`; the filter receives the value and setter, and the list receives the value used for filtering. Both now reflect the same snapshot without copying state between them.",
      "Context becomes useful when many distant descendants need stable information such as theme, locale, or the current account. It removes repetitive prop forwarding, but it does not replace the decision about which component owns the state.",
      "An external store is reasonable when unrelated branches, routes, or code outside React need the same state, or when subscriptions and selectors make frequent updates easier to control. Server data often belongs in a data-fetching cache rather than a general client store.",
      "I keep the owner as low as the sharing requirement allows. This reduces rerenders, makes removal easier, and keeps each feature from depending on application-wide state without a real need.",
    ],
    overviewTitle: "The owner is determined by the consumers",
    overview: "Draw the component tree and mark every reader and writer. Their closest shared ancestor is the natural owner unless the value already belongs to an external source with its own subscription model.",
    deepTitle: "A placement decision, not a library decision",
    deep: [
      "Props are explicit and easy to trace, so a few levels of prop passing are often preferable to a hidden dependency. Component composition can also shorten the path: a parent can pass already-built children instead of forwarding configuration through layout-only components.",
      "Context distributes a value but does not store it by itself. A provider may pass a constant, local state, reducer state, or an external-store facade. The source still needs one owner and well-defined update functions.",
      "Broad state should earn its scope. A shopping cart may cross pages and therefore fit a store; a single input's focus state rarely does. If the value comes from a remote API, caching, staleness, refetching, and errors are usually better handled by a server-state tool than by hand-written global flags.",
    ],
    support: {
      type: "decision_tree",
      title: "How far must the value travel?",
      content: "```mermaid\nflowchart TD\n  A{Who needs the value?} -->|One component| B[Local state]\n  A -->|Nearby siblings| C[Lift to common parent]\n  A -->|Many distant descendants| D[Context]\n  A -->|Unrelated branches or external consumers| E[External store]\n  A -->|Remote API data| F[Server-data cache]\n```",
    },
    boundary: { title: "Do not copy shared state", content: "Copying a prop into each child's state creates several owners. If the children must stay synchronized, keep the value once and pass it down; local drafts are different only when they are intentionally allowed to diverge until save or submit." },
    followups: ["When is prop drilling acceptable?", "Does Context API manage state by itself?", "How is server state different from client UI state?"],
  },
  {
    question: "What state-management mistakes commonly cause stale or inconsistent React UI?",
    title: "Avoiding duplicate, mutated, and stale state",
    direct: "The most common problems are storing the same fact in more than one place, mutating objects or arrays, and reading an old state snapshot during dependent updates. Keep one source of truth, calculate derived values, replace state immutably, and use functional updates when the next value depends on the previous one.",
    quick: [
      "Do not keep two independent copies of the same fact.",
      "Calculate values that can be derived during render.",
      "Replace objects and arrays instead of mutating them.",
      "Use `setCount(c => c + 1)` for previous-value updates.",
      "Give state a clear owner instead of synchronizing children with Effects.",
    ],
    interview: [
      "A common state-management bug starts when one fact is represented by several state values. Each copy can be updated on a different path, leaving the interface in a combination that should be impossible.",
      "For example, storing `items`, `searchText`, and a separate `filteredItems` state means every item or query change must also update the filtered copy. Calculating `filteredItems = items.filter(...)` during render keeps it correct by construction.",
      "Mutation creates another problem. `cart.items.push(product); setCart(cart)` keeps the same object reference and also changes the snapshot held by earlier code. Building a new array and object gives React a clear new value and preserves old snapshots.",
      "Stale reads appear when the next update depends on the previous one. Three calls to `setCount(count + 1)` in one handler all use that handler's captured count. Three functional updates, `setCount(c => c + 1)`, are applied in sequence.",
      "I fix these bugs by simplifying the state shape before adding synchronization code. One owner, derived display values, immutable replacement, and updater functions remove most inconsistencies without another library.",
    ],
    overviewTitle: "Contradictory state creates contradictory screens",
    overview: "If two state fields describe the same fact, the application must keep them synchronized forever. Removing the duplicate is usually safer than adding an Effect that tries to repair it after each render.",
    deepTitle: "Why snapshots and identity matter",
    deep: [
      "React gives every render its own state snapshot. Event handlers close over that snapshot, even if they request updates later. Functional setters are queues of calculations, so each receives the result of the preceding update instead of the old captured value.",
      "Objects and arrays are values by reference. Mutating one object changes what all references to it observe, and handing React the same reference can make change detection and memoization misleading. Shallow copies are enough only for the levels that changed; a nested object still needs a new object at its own level.",
      "A reducer can protect complex transitions by rejecting invalid actions and returning one complete next state. It does not make mutation safe: a reducer should still return new values and remain free of side effects.",
    ],
    support: {
      type: "before_code",
      title: "Duplicate state versus a derived value",
      content: "```jsx\n// Fragile: filteredItems can become stale.\nconst [filteredItems, setFilteredItems] = useState([]);\n\n// Clear: every render derives it from its real inputs.\nconst filteredItems = items.filter(item =>\n  item.name.toLowerCase().includes(searchText.toLowerCase())\n);\n```",
    },
    boundary: { title: "A local draft can be intentional", content: "Copying initial data into form state is valid when the form is an editable draft that should not change until the user saves or resets. Name it as a draft and define what happens when new server data arrives." },
    followups: ["Why does React state behave like a snapshot?", "When should you use a functional state update?", "When is copying props into local state valid?"],
  },
  {
    question: "How do local state, Context API, and an external store differ?",
    title: "Local state, context, and stores solve different scopes",
    direct: "Local state owns data inside a component subtree. Context makes a provider's value available to descendants without forwarding every prop. An external store owns state outside the component tree and exposes subscriptions, often with selectors. Choose by ownership and update patterns, not application size alone.",
    quick: [
      "Local state is simplest for one feature or subtree.",
      "Context transports a value through descendants; it is not a separate state engine.",
      "External stores live outside React and provide subscriptions.",
      "Selectors can limit which store changes a component observes.",
      "Remote server data has caching needs that differ from client UI state.",
    ],
    interview: [
      "Local state, context, and external stores differ mainly in ownership and distribution. `useState` or `useReducer` keeps a value with a component. It is the first choice when one screen or subtree owns the value.",
      "Context lets an ancestor provide a value to any descendant below it. The value may come from local state, a reducer, or a constant. For example, a theme provider can expose `theme` and `setTheme` without every layout component forwarding those props.",
      "An external store exists independently of the React tree. Components subscribe to it, and libraries commonly allow a selector such as `state => state.cartCount`. This helps unrelated branches share state and lets non-component code read or update it when that design is required.",
      "Context updates all consumers that read the changed context value. Splitting contexts, stabilizing provider values, and keeping providers close to consumers can be enough; an external store is not mandatory for every frequently changing value.",
      "I choose local state first, context when distribution is the problem, and a store when independent ownership, broad sharing, or selective subscriptions are real requirements. The choice does not remove the need for a minimal state model.",
    ],
    overviewTitle: "Ownership and delivery are separate questions",
    overview: "A value can be owned locally and delivered through context, or owned by an external store and delivered through subscriptions. Treating context as a transport mechanism makes the comparison clearer.",
    deepTitle: "How updates reach consumers",
    deep: [
      "A parent state update rerenders the owner and normally its descendants. Props carry the next values explicitly. Context allows a descendant to read the closest provider directly, but a new provider value still notifies its consumers according to React's context rules.",
      "A store keeps a current value plus a subscriber list outside the tree. A React binding subscribes during the component lifecycle and asks the store for a snapshot. Selector-based APIs can compare the selected result so an unrelated field change need not rerender that component.",
      "For example, a cart count needed by a header and checkout route may fit a selector-based store, while a theme needed only below one shell may fit context. Neither approach is a replacement for a remote-data cache. API data has freshness, deduplication, cancellation, retries, and invalidation concerns that need their own policy.",
    ],
    support: {
      type: "comparison_table",
      title: "Choosing a state scope",
      content: mdTable(["Option", "Owner", "Best fit", "Main caution"], [
        ["Local state", "Component", "One feature or subtree", "Lift it when siblings must agree"],
        ["Context", "Provider", "Distant descendants", "Provider value changes notify consumers"],
        ["External store", "Store object", "Unrelated branches and selectors", "Adds API and lifecycle decisions"],
        ["Server-data cache", "Data layer", "Remote, refreshable data", "Treat staleness and invalidation explicitly"],
      ]),
    },
    boundary: { title: "Context and store can work together", content: "A store can be supplied through context when each page or test needs its own instance. The categories are not enemies; the important part is knowing which layer owns the value and how each consumer subscribes." },
    followups: ["Why is context not a state-management engine by itself?", "What problem do store selectors solve?", "Why might API data need a server-state cache?"],
  },
  {
    question: "How would you diagnose unnecessary rerenders caused by shared React state?",
    title: "Tracing a shared-state rerender to its source",
    direct: "Use React DevTools Profiler to find which component rerendered and what update preceded it. Then inspect whether state is owned too high, a context provider creates a new value each render, or a store selector returns unstable data. Fix the state boundary before adding memoization.",
    quick: [
      "Reproduce one interaction and record it with React Profiler.",
      "Identify the state or context update that started the render.",
      "Check whether the state is broader than its real consumers.",
      "Inspect provider values and selector return identities.",
      "Measure again after changing the ownership boundary.",
    ],
    interview: [
      "I first reproduce one slow interaction and record it with React DevTools Profiler. The goal is to identify the commit, the components that rendered, and the state or context update that caused the work instead of guessing from component size.",
      "For example, suppose typing in a search box rerenders an entire dashboard. I check where `query` is owned. If it sits in the dashboard root but only the search panel needs it, moving that state into the panel removes the unrelated dependency.",
      "For context, I inspect the provider value. An inline object such as `{ user, logout }` has a new identity whenever the provider renders. Stable data, split contexts, or a memoized value can reduce notifications, but only after confirming this is the measured cause.",
      "For an external store, I check the selector. Selecting the whole store or returning a new object on every read makes the component observe more changes than necessary. Selecting a primitive field, or using the library's supported equality helper, gives a narrower subscription.",
      "I finish by profiling the same interaction again and checking behavior tests. Memoization is a targeted optimization, not a substitute for putting transient state with the feature that owns it.",
    ],
    overviewTitle: "The update source and subscription boundary",
    overview: "A rerender is evidence that a component observed an update through its parent, context, or store. Profiling connects the visible delay to one update path so the fix can be made at the correct boundary.",
    deepTitle: "Three common sources of broad updates",
    deep: [
      "State placed high in the tree makes the owning component rerender for every change, which may rerender a large descendant tree. Colocating temporary input or hover state often removes more work than wrapping many children in `memo`.",
      "A context consumer receives the nearest provider value. When that value changes according to `Object.is`, consumers are eligible to rerender. Splitting unrelated values prevents a fast-changing field from sharing the same notification channel as stable configuration.",
      "External stores shift the boundary to subscriptions. A selector should return only what the component displays, and its result should have a meaningful equality rule. A selector returning `{ count: state.count }` creates a new object each time unless shallow comparison or a stable result is used.",
    ],
    support: {
      type: "flow_diagram",
      title: "Rerender investigation",
      content: "```mermaid\nflowchart TD\n  A[Record slow interaction] --> B[Find expensive commit]\n  B --> C{Update source}\n  C -->|Parent state| D[Move state nearer consumers]\n  C -->|Context| E[Split or stabilize provider value]\n  C -->|Store| F[Narrow selector]\n  D --> G[Profile again]\n  E --> G\n  F --> G\n```",
    },
    boundary: { title: "A rerender is not automatically a bug", content: "React may render a component quickly with no visible cost. Optimize only when profiling shows meaningful work or an update violates the intended ownership model; extra memoization adds comparison and maintenance cost." },
    followups: ["What does the React Profiler show?", "Why can an inline context value notify consumers?", "How can a Zustand selector avoid broad subscriptions?"],
  },
]);

add("state-management-basics", "lifting-state-up", [
  {
    question: "What does lifting state up mean in React?",
    title: "One parent coordinates shared child state",
    direct: "Lifting state up means removing duplicated state from child components, storing it in their nearest common parent, and passing the current value and change callbacks down through props. It gives related children one source of truth so they cannot drift out of sync.",
    quick: ["Move shared state to the nearest common parent.", "Pass the value down as props.", "Pass callbacks down for requested changes.", "Children become controlled for that value.", "Do not lift unrelated private state."],
    interview: [
      "Lifting state up is the React pattern for keeping two or more components synchronized. The shared value is removed from the children and placed in their nearest common parent, which becomes the single owner.",
      "The parent passes the current value to each child and gives them callbacks for requesting changes. The children no longer update separate copies; an event travels upward through a callback, the parent creates the next state, and new props travel down.",
      "For example, an accordion can store `activePanelId` in `Accordion`. Each `Panel` receives `isActive={activePanelId === id}` and an `onShow` callback. Selecting the second panel changes one value, so the first closes and the second opens in one render.",
      "A child controlled this way can still own other private values, such as whether its pointer is hovering. Only the fact that must remain coordinated is lifted.",
      "I lift state to the lowest common owner that covers all real consumers. Going higher than necessary makes unrelated UI rerender and increases prop or context scope without improving correctness.",
    ],
    overviewTitle: "Requests go up; values come down",
    overview: "A controlled child reports an event through a callback. The common parent decides the next shared state and sends the resulting value back to every child during the next render.",
    deepTitle: "Controlled components and a single source of truth",
    deep: [
      "A component is controlled for a value when an owner supplies that value and the component reports desired changes instead of changing its own copy. Controlled does not mean stateless: the component may still own unrelated interaction state.",
      "The parent should store the smallest shared fact. An accordion needs the active panel identifier, not a separate boolean for every panel. A temperature converter can store one entered value and its scale, then calculate the converted field during render.",
      "Lifting also makes rules visible. The parent can enforce that only one panel is open, validate a shared selection, or save one form model. Separate child states would need extra synchronization to express the same invariant.",
    ],
    support: { type: "flow_diagram", title: "The lifted-state loop", content: "```mermaid\nflowchart LR\n  C1[Child event] --> P[Parent callback]\n  P --> S[Parent updates shared state]\n  S --> C1V[Child 1 gets new props]\n  S --> C2V[Child 2 gets new props]\n```" },
    boundary: { title: "Lift only the shared fact", content: "Moving every field to a page root creates a large state owner. Keep temporary UI details in the component that uses them unless another component truly needs to coordinate with them." },
    followups: ["What makes a React component controlled?", "Why is one source of truth useful?", "How do callbacks let a child request a state change?"],
  },
  {
    question: "When should sibling React components share lifted state?",
    title: "Lifting state when siblings must agree",
    direct: "Lift state when sibling components display or change the same fact, or when a parent must enforce a rule across them. Good signals include synchronized inputs, one selected item, one open panel, or a filter that controls a separate result list.",
    quick: ["Lift when siblings represent the same fact.", "Choose their closest common parent.", "Keep one minimal state value.", "Calculate alternate views instead of storing copies.", "Use context only if prop delivery becomes genuinely inconvenient."],
    interview: [
      "Sibling components should share lifted state when their outputs must agree or one child's action changes what another child should show. Their nearest common parent is the natural coordinator because it renders both with the same snapshot.",
      "For example, a search field and a product grid may be separate children. The page owns `query`, passes it and `onQueryChange` to the field, and derives the visible products for the grid. There is no copied `filteredProducts` state to synchronize.",
      "The same rule fits tabs, accordions, unit converters, and master-detail views. The parent stores the smallest decision—such as `selectedProductId`—and each child derives its own appearance from that decision.",
      "I would not lift a tooltip's hover flag merely because the tooltip is rendered inside a list. No sibling depends on it, so local ownership is clearer and avoids rerendering the list owner on every pointer move.",
      "If the common parent becomes very distant, I first consider composition and clearer component boundaries. Context is useful when many descendants need the shared value, but lifting still determines where that value is created.",
    ],
    overviewTitle: "Synchronization is the deciding signal",
    overview: "The need to keep several views consistent—not component depth by itself—justifies lifting. The shared owner can express rules that would be hard to maintain across independent child copies.",
    deepTitle: "Model the shared invariant once",
    deep: [
      "An invariant is a rule that must remain true, such as exactly one selected tab. Storing `isSelected` inside every tab permits several tabs to be true at once. Storing one `selectedId` in the parent makes that invalid combination impossible.",
      "Derived views belong near rendering. A Celsius value and scale can produce Fahrenheit without a second independent temperature state. A query can produce a filtered list. This keeps the state shape smaller and eliminates Effects whose only job is copying one state field into another.",
      "When a child needs an editable draft, it can intentionally diverge from the parent until save. That is a different requirement from synchronized display and should be named as draft state with explicit save, cancel, and reset behavior.",
    ],
    support: { type: "comparison_table", title: "Lift or keep local?", content: mdTable(["Situation", "Owner"], [["Two tabs must share one selection", "Nearest common parent"], ["Search input controls a sibling list", "Nearest common parent"], ["One tooltip hover flag", "Tooltip or item"], ["Many distant descendants need current theme", "State owner plus context provider"]]) },
    boundary: { title: "A form draft is allowed to diverge", content: "If a dialog lets the user edit and cancel, its draft may stay local while the saved record remains in the parent or server cache. The two values represent different facts rather than accidental duplication." },
    followups: ["How can selectedId replace many boolean fields?", "Why should filtered data usually be derived?", "When should a form keep a local draft?"],
  },
  {
    question: "What mistakes make lifted React state harder to maintain?",
    title: "Avoiding over-lifted and duplicated state",
    direct: "Two opposite mistakes are common: leaving independent copies in children that must agree, and lifting private state to an unnecessarily high ancestor. Store each shared fact once in the nearest common owner, pass clear value and event props, and derive values that do not need storage.",
    quick: ["Do not synchronize duplicate child copies with Effects.", "Do not lift private interaction state to the app root.", "Store identifiers or source values, not every derived flag.", "Use specific callbacks such as `onSelect(id)`.", "Keep the owner near its consumers."],
    interview: [
      "The first lifting mistake is keeping the old child state as well as the new parent state. That creates two owners, so updates can arrive in different orders and the displayed value may depend on which copy rendered last.",
      "For example, if a parent passes `selectedId` but each row also stores `isSelected`, an Effect may try to copy the prop into every row. Removing the row state and calculating `selectedId === row.id` makes selection immediate and consistent.",
      "The opposite mistake is lifting too far. A text box's draft placed in the application root makes unrelated layout and navigation components share its update scope. The nearest common parent—not the highest possible parent—is the target.",
      "Broad callbacks can also hide ownership. A child should report an event such as `onSelect(product.id)` rather than receive a raw state object and setter that lets it change unrelated fields.",
      "I simplify the model until each fact has one owner and each child receives only what it needs. Context or memoization may improve delivery later, but they do not repair duplicated meaning.",
    ],
    overviewTitle: "The right level is neither duplicated nor global",
    overview: "State placement is a balance: high enough to cover every coordinated consumer, but low enough to avoid coupling unrelated parts of the tree to frequent updates.",
    deepTitle: "Why copy-and-sync patterns fail",
    deep: [
      "An Effect runs after a render, so copying a prop into local state creates at least one render where the local copy still holds the previous value. It also raises policy questions: should unsaved local edits be overwritten when the prop changes? If no intentional draft exists, the copy adds delay without meaning.",
      "Passing a domain event upward keeps the parent in control of the invariant. `onPanelOpen(id)` says what happened, while passing `setState` exposes how unrelated state is stored. Specific events also make tests and later reducer migration clearer.",
      "Moving state downward is a valid optimization when fewer components need it than expected. This is often simpler than memoizing an entire tree because the update never reaches that tree in the first place.",
    ],
    support: { type: "before_code", title: "Remove the synchronized copy", content: "```jsx\n// Avoid a second owner inside Row.\nfunction Row({ item, selectedId, onSelect }) {\n  const selected = item.id === selectedId;\n  return <button aria-pressed={selected} onClick={() => onSelect(item.id)}>{item.name}</button>;\n}\n```" },
    boundary: { title: "Prop drilling is not automatically a defect", content: "Passing a value through two clear component levels can be easier to understand than adding context. Change the delivery method only when intermediate forwarding is genuinely noisy or many distant consumers need the value." },
    followups: ["Why is copying props to state often a problem?", "Why are domain callbacks clearer than passing a setter?", "How can moving state down improve performance?"],
  },
  {
    question: "How does lifting state up compare with React Context?",
    title: "State ownership versus state delivery",
    direct: "Lifting state up decides which common ancestor owns a shared value. Context decides how an ancestor delivers a value to distant descendants without forwarding it through every intermediate component. They often work together: lifted state can be passed through props or supplied through context.",
    quick: ["Lifting answers: who owns the value?", "Context answers: how do descendants receive it?", "Nearby consumers usually work well with props.", "Distant repeated consumers may justify context.", "Context does not remove the need for an update owner."],
    interview: [
      "Lifting state and context solve related but different problems. Lifting chooses the owner: shared state moves to the closest ancestor that can coordinate all consumers. Context is a transport mechanism that lets descendants read an ancestor's value without every component forwarding a prop.",
      "For example, two sibling filters can share lifted state in their page and receive ordinary props. If the same filter settings are needed by controls many levels deeper, the page can provide that lifted state through a `FilterContext`.",
      "Props remain useful because dependencies are explicit and local. Context becomes helpful when the same value crosses many intermediate components that do not use it or when many distant descendants need it.",
      "A context provider still needs a value. That value may be component state, reducer state, a constant, or an external-store object. Calling context a replacement for lifting misses the ownership step.",
      "I therefore choose ownership first and delivery second. I lift to the nearest correct owner, use props while the path is clear, and introduce context only for a real distribution problem.",
    ],
    overviewTitle: "Two separate design choices",
    overview: "The component tree needs both a source and a route. Lifting identifies the source of a shared fact; props or context determine the route by which consumers receive it.",
    deepTitle: "Why context does not create state",
    deep: [
      "`createContext` creates a context object with a default fallback, not a mutable store. A provider supplies a value for the subtree. When that value comes from `useState`, the component holding `useState` remains the owner and context only distributes its snapshot and update function.",
      "Context lookup follows nesting: a consumer reads the closest matching provider above it. This makes scoped overrides possible, such as a dark-themed section inside a light application or a test provider with fixture data.",
      "Props can be preferable even across several layers because they show data flow in component signatures. Composition can reduce forwarding by letting a high-level component pass children directly. Context is most valuable when the dependency is genuinely shared throughout a subtree.",
    ],
    support: { type: "comparison_table", title: "Ownership and delivery", content: mdTable(["Pattern", "Question answered", "Example"], [["Lift state", "Where is the one source?", "Page owns selected item"], ["Props", "How do nearby children receive it?", "Page passes selectedId"], ["Context", "How do distant descendants receive it?", "Provider exposes selectedId"]]) },
    boundary: { title: "Context can increase hidden coupling", content: "A component that calls `useContext` depends on a provider even though the value is absent from its props. That is reasonable for cross-cutting data, but a reusable leaf component may be easier to test when it receives ordinary props." },
    followups: ["Can context be used without useState?", "How does a nested provider override a value?", "When are props clearer than context?"],
  },
  {
    question: "How would you fix two React inputs that keep showing different values?",
    title: "Debugging duplicated state between components",
    direct: "Trace which component owns each displayed value and log the event that updates it. If both inputs represent the same fact, remove their separate local copies, store the value in their nearest common parent, and pass the value plus one change callback to both controlled inputs.",
    quick: ["Reproduce the exact edit that creates disagreement.", "Find every state field representing the value.", "Choose one nearest common owner.", "Make both inputs controlled from that owner.", "Test edits from each input and any reset path."],
    interview: [
      "I would reproduce the mismatch and inspect both inputs' `value` props and change handlers. The key question is whether they represent one fact or two intentional drafts. If it is one fact, separate `useState` calls are the root problem.",
      "For example, a Celsius field and Fahrenheit field should not each own an independent temperature. Their common parent can store `{ value, scale }`. Editing Celsius updates that source, and the Fahrenheit value is calculated for the next render; editing Fahrenheit performs the inverse conversion.",
      "I would remove Effects that copy one field into the other. Those Effects run after rendering, can create loops, and make rounding behavior depend on update order. Derivation gives both inputs the same source immediately.",
      "Then I would check input details: every controlled input needs a defined `value`, parsing should preserve an empty draft, and conversions should handle invalid text without turning the field into `NaN` unexpectedly.",
      "Finally, I would test editing each side, clearing a field, entering decimals, and resetting. The fix is successful when one stored fact produces both displays and no synchronization callback is required.",
    ],
    overviewTitle: "Find whether the mismatch is in ownership or conversion",
    overview: "Different values can come from duplicate owners or a faulty transformation. Remove duplicate owners first, then test the pure conversion from the one source value to each displayed form.",
    deepTitle: "A temperature converter with one source",
    deep: [
      "The parent can store the text exactly as entered plus the scale of the last edit. The active field displays the stored text, while the other field displays a converted value only when parsing succeeds. This preserves temporary drafts such as an empty string or `-`.",
      "Both child inputs become controlled: their `value` comes from props and their `onChange` reports text to the parent. They do not know about one another. The parent owns the conversion rule and rerenders both from the same snapshot.",
      "If two fields are allowed to diverge until a user presses Apply, then they are separate drafts and should be named that way. The product requirement—not a blanket lifting rule—decides which model is correct.",
    ],
    support: { type: "code_example", title: "One owner for synchronized fields", content: "```jsx\nfunction Converter() {\n  const [temperature, setTemperature] = useState({ text: '', scale: 'c' });\n  const celsius = temperature.scale === 'c' ? temperature.text : toCelsius(temperature.text);\n  const fahrenheit = temperature.scale === 'f' ? temperature.text : toFahrenheit(temperature.text);\n\n  return <>\n    <TemperatureInput value={celsius} onChange={text => setTemperature({ text, scale: 'c' })} />\n    <TemperatureInput value={fahrenheit} onChange={text => setTemperature({ text, scale: 'f' })} />\n  </>;\n}\n```" },
    boundary: { title: "Do not destroy an editable draft", content: "Conversion code should distinguish empty or temporarily invalid input from a real number. Forcing every keystroke through numeric formatting can make the controlled field unpleasant or impossible to edit." },
    followups: ["Why can synchronization Effects loop?", "How should a controlled numeric field handle empty text?", "When do two inputs represent separate drafts?"],
  },
]);

add("state-management-basics", "context-api-basics", [
  {
    question: "What is React Context, and when should you use it?",
    title: "Sharing a value with distant descendants",
    direct: "React Context lets a component provide a value to any descendant below it without forwarding that value through every intermediate component. Use it for genuinely shared subtree data such as theme, locale, current account, or reducer state—not as an automatic replacement for ordinary props.",
    quick: ["Create a context, provide a value above consumers, and read it with `useContext`.", "A consumer reads the closest matching provider.", "Context removes repetitive prop forwarding.", "A changed provider value notifies components that read that context.", "Try props or composition first when the dependency is local."],
    interview: [
      "React Context is a built-in way for an ancestor to make a value available anywhere in its descendant tree. A child reads the closest provider for that context, so intermediate components do not have to accept and forward a prop they never use.",
      "The usual flow is to create a context, render a provider with a value, and call `useContext` in a descendant. The provider value can be a constant, state, reducer state, or an object containing data and update functions. Context itself does not decide how that value changes.",
      "For example, a `ThemeContext` provider can expose `theme` and `setTheme` around the application. A deeply nested button reads the theme directly, while a nested provider can intentionally give one section a different theme.",
      "I use context when information is needed by many distant descendants: theme, locale, current account, routing data, or a feature's reducer state. For a parent and one child, props remain clearer because the dependency is visible in the component signature.",
      "Context solves delivery, not every state problem. Provider scope, value identity, update frequency, and fallback behavior still need deliberate choices.",
    ],
    overviewTitle: "A provider creates a scoped value channel",
    overview: "Context lookup follows the component tree rather than the import tree. Each consumer receives the value from the nearest provider above it, which allows both application-wide defaults and smaller scoped overrides.",
    deepTitle: "Create, provide, and consume",
    deep: [
      "`createContext(defaultValue)` creates the context object and a fallback used only when no matching provider exists above a consumer. The fallback is static; it is not initial mutable state and it does not change when a provider is later added elsewhere.",
      "A provider supplies a value for its descendants. In current React, the context object itself can be rendered as a provider; the familiar `<ThemeContext.Provider value={...}>` form remains widely used and clear across supported versions. `useContext(ThemeContext)` subscribes the component to that channel.",
      "Context passes through intermediate components, including memoized ones. When the provider receives a different value according to `Object.is`, consumers may rerender. This is why provider scope and value construction matter for frequently changing data.",
    ],
    support: { type: "flow_diagram", title: "Context value lookup", content: "```mermaid\nflowchart TD\n  P[Theme provider: dark] --> L[Layout does not read theme]\n  L --> B[Button reads dark]\n  L --> N[Nested provider: light]\n  N --> C[Card reads light]\n```" },
    boundary: { title: "The default is not a safety net for missing app state", content: "If a consumer requires a real provider, use an impossible default such as `null` and throw a clear error in a custom hook. A realistic fake default can hide a missing provider and make a screen silently use the wrong data." },
    followups: ["What does the default value passed to createContext mean?", "How does React choose between nested providers?", "Does context manage changing state by itself?"],
  },
  {
    question: "When is Context API a better choice than passing props?",
    title: "Choosing context for a real distribution problem",
    direct: "Context is useful when the same value is needed by many descendants or must cross several components that only forward it. Props are usually better for nearby or reusable components because they keep dependencies explicit. Component composition can also remove prop drilling without introducing context.",
    quick: ["Prefer props for short, explicit data paths.", "Use context when many distant descendants need the same value.", "Consider passing JSX as children to avoid forwarding layout props.", "Keep providers close to the subtree that needs them.", "Split unrelated fast- and slow-changing values into separate contexts."],
    interview: [
      "I choose context when data distribution—not state creation—is the real problem. If a value passes through several components that do not use it, or many distant descendants need it, a provider can make that dependency available throughout the relevant subtree.",
      "For example, an authenticated account may be read by navigation, profile controls, permissions, and an order form. Providing the account near the application shell avoids repeating an `account` prop through every layout layer.",
      "I still use props when the relationship is short or when a reusable component should receive all dependencies explicitly. Passing a `header` or `children` element can also let the data-owning component render the consumer without threading configuration through the layout.",
      "Provider scope should match the feature. A checkout context can wrap only checkout routes instead of the whole application. Unrelated values should not be bundled into one large context object if they change at very different rates.",
      "So context is better when it removes real forwarding noise for a coherent shared value. It is not better merely because an application has many components.",
    ],
    overviewTitle: "Measure the path and number of consumers",
    overview: "A long path containing components that only forward the same prop, or many consumers scattered through one subtree, are strong context signals. One parent-child relationship is not.",
    deepTitle: "Alternatives before adding a provider",
    deep: [
      "Prop drilling is sometimes a sign that components are doing too much. Extracting the actual consumer closer to the data owner or passing it as `children` can shorten the path while keeping dependencies explicit.",
      "Context is most natural for ambient data: a value that defines the environment in which descendants operate. Theme, locale, account, routing state, and a feature-wide dispatch function fit this model because many components adapt to the nearest provider.",
      "A provider is also a testing boundary. Tests can wrap a component with a small fixture value, and nested providers can model a scoped override. That flexibility is useful, but required providers should fail clearly rather than silently falling back to placeholder data.",
    ],
    support: { type: "decision_tree", title: "Props, composition, or context", content: "```mermaid\nflowchart TD\n  A{Many distant consumers?} -->|No| B[Use props]\n  A -->|Yes| C{Intermediate components only forward it?}\n  C -->|Can restructure| D[Use composition or clearer boundaries]\n  C -->|Shared ambient value| E[Use a scoped context provider]\n```" },
    boundary: { title: "Context is not a service locator", content: "Putting every dependency into one global context makes components hard to reuse and hides what each one needs. Keep context values cohesive and expose feature-specific hooks rather than one application object." },
    followups: ["How can component composition reduce prop drilling?", "Why should providers be scoped narrowly?", "When should contexts be split?"],
  },
  {
    question: "What Context API mistakes cause stale data or excessive rerenders?",
    title: "Stable provider values and honest dependencies",
    direct: "Common mistakes include mutating the provided object, recreating a large provider value unnecessarily, using a misleading fallback, and putting unrelated fast-changing fields into one context. Replace state immutably, scope or split contexts, stabilize values only when needed, and make required-provider failures explicit.",
    quick: ["Never mutate an object and expect context consumers to detect it.", "A new provider object is a new context value.", "Split unrelated update channels.", "Use `null` plus a checked custom hook for required providers.", "Memoization helps only after state and provider boundaries are correct."],
    interview: [
      "The most important context mistake is treating the provider value as a mutable bag. React compares the next value with the previous value. Mutating the same object can leave consumers with changes that did not travel through a proper state update.",
      "The opposite issue is creating a fresh object on every provider render. For example, `<AuthContext.Provider value={{ user, logout }}>` creates a new object even when `user` and `logout` are unchanged, so consumers can be notified along with unrelated parent renders.",
      "I first keep state immutable and put the provider near its consumers. If profiling shows identity is the cause, I can stabilize callbacks and memoize the value. Splitting `AuthStateContext` from `AuthActionsContext` may be clearer when they change differently.",
      "A fake default such as a guest user can hide a missing provider. A required context can default to `null`, and `useAuth` can throw a direct error if it is read outside `AuthProvider`.",
      "Finally, I avoid one giant context containing theme, account, notifications, and transient form state. Separate ownership and update rates make rerenders and tests much easier to reason about.",
    ],
    overviewTitle: "Context broadcasts provider identity changes",
    overview: "Consumers depend on the nearest provider value. Correct immutable updates ensure real changes are visible; coherent provider values keep unrelated updates from sharing the same broadcast channel.",
    deepTitle: "Identity, scope, and consumer updates",
    deep: [
      "Context comparison uses `Object.is`, so reference values are compared by identity. A new object can represent the same fields but still be different. This is not a reason to memoize every object; it is a reason to avoid placing the provider above components that rerender for unrelated work.",
      "Splitting contexts can separate data with different consumers or update rates. A component that only dispatches actions need not also subscribe to frequently changing state when action access is provided separately.",
      "Selectors are not part of the basic `useContext` API. Reading one field still subscribes the component to the context value as a whole. If selective subscriptions are a central requirement, an external-store API designed for snapshots and selectors may be a better fit.",
    ],
    support: { type: "code_example", title: "A checked provider hook", content: "```jsx\nconst AuthContext = createContext(null);\n\nexport function useAuth() {\n  const value = useContext(AuthContext);\n  if (value === null) throw new Error('useAuth must be used inside AuthProvider');\n  return value;\n}\n```" },
    boundary: { title: "Do not optimize without a measured problem", content: "A small provider whose consumers render cheaply may need no memoization. Added callbacks and memo layers have their own complexity; profile an actual interaction and fix broad ownership first." },
    followups: ["How does React compare context values?", "Why can a realistic context default hide errors?", "Why does useContext not provide field selectors?"],
  },
  {
    question: "How does Context API compare with an external store such as Zustand?",
    title: "Context broadcast versus store subscriptions",
    direct: "Context provides a value through a component subtree and consumers read the closest provider. Zustand owns state in a store outside the tree and lets components subscribe through selectors. Context is often enough for stable subtree data; a store helps when broad sharing, selective subscriptions, or non-component access is required.",
    quick: ["Context follows provider scope in the React tree.", "Zustand exposes an external store and subscription API.", "Basic context consumers observe the full provider value.", "Store selectors can subscribe to a smaller result.", "Both approaches still need clear ownership and immutable updates."],
    interview: [
      "Context and Zustand differ in where state lives and how updates reach components. Context distributes a provider value through the React tree. Zustand's `create` makes a store-backed React hook, and components subscribe to selected snapshots of that store.",
      "For example, a theme that changes rarely and is needed only below one application shell fits context well. A cart read by unrelated routes, a header badge, and non-component actions may fit a store, especially when each component selects only `itemCount` or `total`.",
      "With basic context, changing the provider value notifies consumers of that context. Zustand selectors can narrow the subscription, but returning a fresh object still needs an appropriate equality strategy. A store does not make poor selectors or oversized state harmless.",
      "Context has no extra dependency and supports natural scoped overrides. Zustand offers imperative APIs, middleware, persistence options, and independent store ownership, which is useful but adds another abstraction and policies to maintain.",
      "I use context when subtree delivery is the problem and a store when independent state ownership or fine-grained subscriptions are genuine needs. Neither should hold remote data by default without a freshness plan.",
    ],
    overviewTitle: "Tree scope and subscription scope",
    overview: "Context scope is defined by provider placement. An external store's scope is defined by the store instance and who subscribes to it; selectors determine which part of its snapshot a component observes.",
    deepTitle: "How each model delivers a new value",
    deep: [
      "A context provider participates in React rendering. Its descendants find the closest provider and consumers update when that provider value changes. Nested providers naturally create separate scopes, which is valuable for themes, forms, and tests.",
      "A Zustand store has `getState`, `setState`, and `subscribe` behavior outside React. The React hook connects a component to the store and applies a selector. This makes the same state accessible outside components, but that power should be part of the design rather than an accidental global singleton.",
      "Both can be scoped. A vanilla store can be created per feature or request and passed through context, combining explicit provider lifetime with selector-based subscriptions. The useful comparison is therefore not simply local versus global; it is provider lookup versus external-store snapshots.",
    ],
    support: { type: "comparison_table", title: "Context and Zustand", content: mdTable(["Concern", "Context", "Zustand"], [["Owner", "Provider supplies value", "Store object"], ["Consumers", "Descendants", "Any subscriber with store access"], ["Narrow updates", "Split provider values", "Selectors and equality"], ["Outside React", "Not directly", "Imperative store API"], ["Extra library", "No", "Yes"]]) },
    boundary: { title: "A store is not automatically global", content: "Creating one imported singleton is common, but Zustand also supports separate store instances. Per-feature or per-request stores can avoid leaking state between tests, pages, or server requests." },
    followups: ["What does a Zustand selector do?", "Can a Zustand store be scoped through context?", "Why might a global singleton be unsafe during server rendering?"],
  },
  {
    question: "How would you debug a React component that reads the wrong context value?",
    title: "Tracing context to the nearest provider",
    direct: "Inspect the rendered component tree and find the nearest provider of that exact context object. Check whether the consumer is outside the provider, a nested provider overrides the value, the provider imports a different duplicated context module, or its value was mutated instead of replaced.",
    quick: ["Confirm provider and consumer import the same context object.", "Find the closest provider above the consumer.", "Look for an unintended nested override.", "Inspect the current provider value with React DevTools.", "Replace mutated data and test provider boundaries."],
    interview: [
      "I would first inspect the component with React DevTools and walk upward to the closest provider for that context. `useContext` does not search by variable name; it reads the exact context object and uses the nearest provider above the consumer.",
      "For example, if a button displays the light theme inside a dark page, a nested `ThemeContext` provider around a card may be intentionally overriding the page value. Moving the button or changing that nested value fixes the scope, while editing the outer provider would not.",
      "If no provider appears above the consumer, it receives the static default. I check whether conditional rendering placed the consumer beside rather than inside the provider, and whether a portal's React parent still has the intended provider.",
      "I also verify that both files import the same context object. Duplicate packages or two separately created contexts with similar names never match. If the correct provider exists, I inspect whether state was mutated in place or a stale callback closes over older data.",
      "The final test renders the consumer with a known provider value, with a nested override, and—if allowed—without a provider. This proves the lookup and failure behavior directly.",
    ],
    overviewTitle: "Context lookup is exact and nearest",
    overview: "A consumer follows its React ancestors and stops at the first provider created from the same context object. Most wrong-value bugs are therefore provider placement, identity, or update bugs.",
    deepTitle: "Provider scope is based on the React tree",
    deep: [
      "DOM nesting is not the lookup rule. A portal may place DOM elsewhere while remaining a child in the React tree, so it keeps the context of the component that rendered it. Conversely, two roots do not share context merely because their DOM nodes are adjacent.",
      "A provider cannot affect a `useContext` call in the component that renders that provider; the call reads providers above that component. Move the consumer into a child below the provider when it should receive the new value.",
      "Module duplication can create two context objects. This may happen with linked packages or bundler resolution problems. Identity equality is required, so confirming the import path and resolved package copy is part of a complete diagnosis.",
    ],
    support: { type: "flow_diagram", title: "Wrong context value checklist", content: "```mermaid\nflowchart TD\n  A[Consumer shows wrong value] --> B{Matching provider above it?}\n  B -->|No| C[Fix placement or required-provider error]\n  B -->|Yes| D{Nested provider closer?}\n  D -->|Yes| E[Check intended override]\n  D -->|No| F{Same context object?}\n  F -->|No| G[Fix duplicate import or package]\n  F -->|Yes| H[Inspect immutable provider update]\n```" },
    boundary: { title: "Portals preserve React context", content: "A modal rendered with `createPortal` moves its DOM placement but remains in the same React tree, so context normally crosses the portal. A separate React root is the boundary that needs its own provider." },
    followups: ["Does context cross a React portal?", "Why do two createContext calls never share values?", "Can a provider affect useContext in the same component that returns it?"],
  },
]);

add("state-management-basics", "usereducer-pattern", [
  {
    question: "What is useReducer, and when is it useful?",
    title: "Centralizing related React state transitions",
    direct: "`useReducer` is a React Hook that stores state and updates it by sending actions to a reducer function. It is useful when a component has several related state fields, many update paths, or transitions that are easier to understand as named events than as scattered setter calls.",
    quick: ["`useReducer(reducer, initialState)` returns state and `dispatch`.", "An action describes what happened.", "The reducer calculates and returns the next state.", "Reducers should be pure and must not mutate state.", "Prefer `useState` when updates remain simple and independent."],
    interview: [
      "`useReducer` is a React Hook for managing state through a reducer function. The component dispatches an action that describes an event, and React calls the reducer with the current state and that action to calculate the next state.",
      "A reducer is useful when several fields change together, many handlers update the same state, or the allowed transitions form a clear workflow. It centralizes the rules without making the state global.",
      "For example, an order form can dispatch `{ type: 'shippingChanged', address }`, `{ type: 'submitted' }`, and `{ type: 'failed', message }`. The reducer can update `address`, `status`, and `error` consistently for each event instead of duplicating those setter sequences across handlers.",
      "The reducer should be pure: it must return new objects or arrays, avoid side effects, and produce the same result for the same state and action. Network calls remain in event handlers or Effects; their results can later be dispatched.",
      "I use `useReducer` for transition complexity, not simply for a large object. If one counter or two independent inputs are clear with `useState`, a reducer would add ceremony without improving the model.",
    ],
    overviewTitle: "Events enter; one next state leaves",
    overview: "A component sends a named action to one reducer. The reducer applies the transition rule and returns a complete next snapshot, which React uses for the following render.",
    deepTitle: "State transition logic as a pure function",
    deep: [
      "A reducer has the shape `(state, action) => nextState`. The action commonly contains a `type` and any data needed for that event. Because transition logic is separated from rendering, it can be read as a list of business rules and tested with plain function calls.",
      "Purity is important because React may call reducers more than once in development to expose accidental mutation. A reducer should not send requests, read changing global data, or mutate its input. It should only calculate the next value.",
      "The state shape should make invalid combinations difficult. A single `status` such as `idle | saving | success | error` is often clearer than several booleans that could all become true. The reducer can reject or preserve state for unknown actions rather than silently producing an incomplete object.",
    ],
    support: { type: "flow_diagram", title: "Reducer update flow", content: "```mermaid\nflowchart LR\n  E[Event handler] -->|dispatch action| R[Reducer]\n  S[Current state] --> R\n  R --> N[New state]\n  N --> V[Next render]\n```" },
    boundary: { title: "A reducer does not perform side effects", content: "The reducer may decide that state is now `saving`, but the request itself belongs outside the reducer. Keeping I/O out makes every transition deterministic and testable." },
    followups: ["What makes a reducer pure?", "How is dispatch different from a state setter?", "When is useState simpler than useReducer?"],
  },
  {
    question: "When should you replace several useState calls with useReducer?",
    title: "Recognizing transition complexity",
    direct: "Consider `useReducer` when many handlers update related fields together, later updates depend on the current workflow state, or duplicated setter sequences are creating inconsistent combinations. Keep separate `useState` calls when the values and their updates are independent and easy to follow.",
    quick: ["Several fields alone do not require a reducer.", "Look for related transitions and repeated setter sequences.", "Named actions are useful when events matter to the model.", "A reducer can enforce valid state combinations.", "Keep remote I/O outside the reducer."],
    interview: [
      "I switch from `useState` to `useReducer` when the difficulty is understanding transitions, not when a component reaches a fixed number of fields. Warning signs are many handlers changing the same fields, repeated setter sequences, and booleans that can form invalid combinations.",
      "For example, an upload screen may track a file, progress, status, and error. `started`, `progressed`, `succeeded`, `failed`, and `cancelled` actions describe the workflow and let one reducer decide which fields change together.",
      "A reducer is also useful when the next state depends on both the current state and an event payload. The transition can reject `progressed` after `cancelled`, or clear an old error when a new upload starts.",
      "I keep ordinary setters for independent details such as whether a help tooltip is open. Folding unrelated state into the upload reducer would couple its lifecycle and make actions less focused.",
      "The migration should improve names and invariants. If the reducer merely copies setter names into action types without clarifying transitions, it has added indirection rather than solving a problem.",
    ],
    overviewTitle: "Reducer signals in an event-driven workflow",
    overview: "Reducers work best when the state changes through a small vocabulary of meaningful events. Independent toggles and inputs rarely need that extra transition layer.",
    deepTitle: "From scattered setters to explicit states",
    deep: [
      "Several booleans can represent impossible states: `isIdle`, `isUploading`, and `isDone` might accidentally all be true. A status field defines one phase, while the reducer controls which actions can move between phases.",
      "Actions should describe events such as `uploadStarted`, not implementation commands such as `setLoadingTrue`. Event names survive state-shape changes and keep components from knowing which fields must be updated together.",
      "Reducers can be unit-tested with state and action tables. That is especially useful for errors, retries, and cancellation paths that are hard to exercise manually but important to the user experience.",
    ],
    support: { type: "comparison_table", title: "useState or useReducer", content: mdTable(["Signal", "useState", "useReducer"], [["Independent field", "Clear fit", "Usually unnecessary"], ["Many related updates", "Can become scattered", "Central transition"], ["Workflow phases", "Several flags may conflict", "One status plus actions"], ["Testing", "Test through handlers", "Reducer can be tested directly"]]) },
    boundary: { title: "Do not build a mini framework", content: "Local reducers do not need action creators, middleware, or a global store unless the feature has those real requirements. A plain switch or explicit transition map is often enough." },
    followups: ["How should reducer actions be named?", "How can a reducer prevent impossible boolean combinations?", "Can useReducer state remain local to one component?"],
  },
  {
    question: "What mistakes make a useReducer reducer unreliable?",
    title: "Keeping reducer transitions pure and complete",
    direct: "Reducers become unreliable when they mutate the current state, perform side effects, read changing outside values, or return incomplete state for an action. Return a fresh complete state, keep the calculation pure, validate action cases, and put requests, timers, and storage work outside the reducer.",
    quick: ["Never assign into the current state object.", "Do not fetch, log analytics, or start timers in a reducer.", "Return every required state field.", "Handle or reject unknown actions clearly.", "Test important state-action-result triples."],
    interview: [
      "The most serious reducer mistake is mutation. Code such as `state.items.push(item); return state` changes an existing render snapshot and returns the same reference. That can produce missed updates and makes earlier state observations untrustworthy.",
      "The corrected reducer returns a new array and object: `{ ...state, items: [...state.items, item] }`. Nested values need copies at every changed level, while unchanged branches can keep their references.",
      "A reducer must also stay pure. For example, calling `fetch`, writing `localStorage`, generating a random identifier, or reading the current time inside it makes the same action produce different outcomes. The caller can create the identifier or run the request, then dispatch the result as data.",
      "Each action should return a complete valid state. Forgetting the spread in `{ count: state.count + 1 }` can discard other fields. An unknown action should normally preserve state or throw a clear development error according to the team's policy.",
      "I verify reducers with table-driven tests for normal transitions, invalid transitions, and immutability. A reliable reducer is a deterministic state calculator, not an event handler with hidden work.",
    ],
    overviewTitle: "Purity protects every render snapshot",
    overview: "A reducer receives a historical state value. Treating it as immutable lets React and application code safely compare old and new snapshots and makes a transition reproducible in a test.",
    deepTitle: "Mutation and side effects break replayable logic",
    deep: [
      "A pure reducer can be replayed: start from the same state, apply the same actions, and receive the same final state. This property makes debugging and testing straightforward. Outside reads, random values, and I/O remove that guarantee.",
      "Shallow copying only the root does not protect nested mutation. `{ ...state }` followed by `next.user.name = value` still edits the original nested `user` object. Copy the path that changes or use a well-understood immutable update helper.",
      "Development Strict Mode may call a reducer and initializer twice to reveal impurities. Correct pure code produces the same calculated result; code that mutates an array may add an item twice and expose the defect.",
    ],
    support: { type: "before_code", title: "Mutating and immutable reducer cases", content: "```jsx\n// Wrong\nstate.items.push(action.item);\nreturn state;\n\n// Correct\nreturn {\n  ...state,\n  items: [...state.items, action.item]\n};\n```" },
    boundary: { title: "Throwing for unknown actions is a policy choice", content: "A local reducer can throw during development to expose misspelled action types. Reusable reducers may instead return unchanged state for actions they do not own. Either choice should be deliberate and tested." },
    followups: ["Why is returning the same mutated object a problem?", "Where should an API request happen when using useReducer?", "How do nested immutable updates work?"],
  },
  {
    question: "How does useReducer compare with useState?",
    title: "Direct setters versus named state transitions",
    direct: "Both Hooks keep local component state. `useState` directly replaces one value and is clearer for simple independent updates. `useReducer` sends named actions through one pure transition function, which is clearer when related fields and workflow rules change together. Neither is inherently faster or more global.",
    quick: ["Both Hooks trigger local React state updates.", "useState exposes a setter for one state value.", "useReducer exposes dispatch and central transition logic.", "Reducers suit related workflow updates.", "Choose clarity; neither Hook is automatically a performance optimization."],
    interview: [
      "`useState` and `useReducer` both store state for a component. With `useState`, an event calculates or supplies the next value directly. With `useReducer`, the event dispatches an action and a reducer decides the next state.",
      "For example, a simple quantity counter is clear as `setQuantity(q => q + 1)`. An order editor with items, discount, validation, and save status may be clearer with `itemAdded`, `discountApplied`, `submitted`, and `saveFailed` actions.",
      "`useState` keeps the update near the event, which is easy to read for independent values. `useReducer` collects related rules in one pure function and gives many handlers a shared vocabulary. That function can also be tested without rendering the component.",
      "Neither Hook makes state global, and a reducer is not automatically more efficient. Both schedule React updates. Dispatch also has a stable identity, but component rendering still depends on state ownership and subtree structure.",
      "I choose the form that makes valid transitions easiest to understand. Starting with `useState` and moving to a reducer when update logic becomes connected is a normal evolution.",
    ],
    overviewTitle: "The difference is where the next state is calculated",
    overview: "A setter lets the caller provide the next value. Dispatch lets the caller report an event while one reducer owns the rule that converts that event and current state into the next value.",
    deepTitle: "Co-location versus centralization",
    deep: [
      "Direct setters co-locate a small change with its handler. That is valuable when the logic is obvious and used in one place. Replacing every setter with an action can force readers to jump between files for no benefit.",
      "A reducer centralizes rules that otherwise appear in several handlers. When submit, retry, and cancel all update `status` and `error`, one transition function prevents those paths from drifting apart.",
      "A reducer and context are often combined but remain separate tools. The reducer manages transitions; context can deliver state and dispatch to distant descendants. A reducer can also remain entirely inside one component with ordinary prop passing.",
    ],
    support: { type: "comparison_table", title: "Two local state APIs", content: mdTable(["Question", "useState", "useReducer"], [["Update input", "Next value or updater", "Action"], ["Rule location", "Event handler or helper", "Reducer"], ["Best fit", "Simple independent values", "Related transitions"], ["Global?", "No", "No"]]) },
    boundary: { title: "Object state does not require a reducer", content: "A small form object can be clear with one state setter. Move to a reducer because its transitions are hard to follow, not because the value happens to be an object." },
    followups: ["Does useReducer improve performance automatically?", "Can a reducer remain local?", "When would you combine a reducer with context?"],
  },
  {
    question: "How would you debug a useReducer action that does not update the UI?",
    title: "Tracing dispatch, reducer output, and state identity",
    direct: "Confirm the event dispatches the expected action, the reducer case matches its type, and the case returns a new complete state without mutation. Then inspect whether the component renders the updated field or reads a stale/derived copy. Test the reducer directly with the failing state and action.",
    quick: ["Log or inspect the exact dispatched action.", "Check the reducer case and payload field names.", "Verify a new state reference is returned.", "Confirm rendered UI reads the reducer field.", "Reproduce the transition with a direct reducer test."],
    interview: [
      "I trace the update as three values: the state before dispatch, the exact action, and the reducer result. This quickly separates an event problem from a transition problem and a rendering problem.",
      "For example, if clicking Add leaves a cart unchanged, I check whether the handler dispatches `{ type: 'itemAdded', item }` while the reducer expects `'addItem'` or reads `action.product`. A type or payload mismatch may fall into the default case with no visible error.",
      "Next I inspect identity and mutation. If the reducer pushes into `state.items` and returns `state`, React receives the same object. Returning `{ ...state, items: [...state.items, action.item] }` gives a real next snapshot.",
      "If reducer output is correct, I check what the component renders. It may display a copied local `items` state, a memoized value with missing dependencies, or a selector aimed at a different field.",
      "Finally, I call the reducer in a focused test with the failing state and action and assert both the new contents and that the old state was unchanged. That regression test proves the transition independently of UI events.",
    ],
    overviewTitle: "A reducer bug has a short data path",
    overview: "The handler creates an action, the reducer creates a state, and rendering reads that state. Capturing each point turns a vague frozen UI into one concrete mismatch.",
    deepTitle: "Event, transition, and rendering failure modes",
    deep: [
      "An event failure means dispatch never runs or constructs the wrong payload. A transition failure means the reducer has no matching case, mutates its input, or returns an invalid next shape. A rendering failure means the correct next state exists but the component displays another source.",
      "Reducers are plain functions, so their tests need no browser. Freeze the input during a test when practical, call the reducer, and compare both result content and references. This catches nested mutation that a visual test may miss.",
      "React DevTools can show component state before and after the interaction. Logging inside a reducer is useful temporarily, but it should not become a side effect relied upon by production behavior.",
    ],
    support: { type: "flow_diagram", title: "Reducer debugging path", content: "```mermaid\nflowchart LR\n  H[Handler] -->|action| R[Matching reducer case]\n  R -->|new immutable state| S[Hook state]\n  S --> V[Rendered field]\n  H -. inspect .-> A[Action payload]\n  R -. test .-> O[Old and new references]\n```" },
    boundary: { title: "Development logs may appear more than once", content: "React development checks can call pure reducers more than once. Do not treat duplicate temporary logs as proof that a production action was dispatched twice; inspect the actual event and keep reducer logic pure." },
    followups: ["How can a direct reducer test catch mutation?", "Why can an unknown action appear to do nothing?", "What if reducer state changes but the component still shows stale data?"],
  },
]);

add("state-management-basics", "zustand-intro", [
  {
    question: "What is Zustand, and how does a basic store work?",
    title: "A small external store with React selectors",
    direct: "Zustand is a state-management library whose `create` function builds a React Hook backed by an external store. The state creator returns data and actions; components call the Hook with selectors to read only the values they need, while actions update the store through `set`.",
    quick: ["`create` returns a store-bound React Hook.", "The state creator receives `set`, `get`, and the store API.", "State and actions commonly live in one returned object.", "A selector chooses the snapshot a component observes.", "The store also exposes imperative APIs such as `getState` and `subscribe`."],
    interview: [
      "Zustand is a small external-store library commonly used with React. Calling `create` with a state-creator function returns a Hook connected to that store. The creator normally returns both state fields and actions that call `set`.",
      "A component reads the store through a selector. `useCartStore(state => state.total)` subscribes to the selected total rather than asking for the whole object. When an action updates the store, subscribers whose selected result changes render with the new snapshot.",
      "For example, a cart store can contain `items` and an `addItem` action. A header selects only `items.length`, while the cart page selects the full items array. Both share one store without a provider at every use site.",
      "The Hook also has imperative utilities such as `getState`, `setState`, and `subscribe`. Those are useful for integration code, but actions remain a clearer place for domain updates than changing arbitrary fields throughout the application.",
      "I choose Zustand when state is shared across unrelated branches or selective subscriptions help. Local component state and context remain simpler when the scope is small.",
    ],
    overviewTitle: "One store, selected snapshots",
    overview: "The store owns a current state object and notifies subscribers after updates. Each React component selects the part it needs, so different components can observe different slices of the same source.",
    deepTitle: "Creation, updates, and subscriptions",
    deep: [
      "`create(stateCreator)` builds a store and a bound Hook. The creator receives `set` for updates and `get` for reading the current value inside actions after initialization. It returns the initial state shape, which can include functions as actions.",
      "By default, `set` shallowly merges the partial object supplied to it. Updater functions receive current state and are the safe form when the next value depends on the previous one. Nested structures still need deliberate immutable updates.",
      "Selectors are part of the subscription contract. Selecting one primitive gives a simple equality check. Selecting a newly allocated object or array on every call can make the result appear changed, so choose stable fields or use the library's supported shallow comparison when combining values.",
    ],
    support: { type: "code_example", title: "A minimal counter store", content: "```jsx\nimport { create } from 'zustand';\n\nconst useCounterStore = create(set => ({\n  count: 0,\n  increment: () => set(state => ({ count: state.count + 1 }))\n}));\n\nfunction Counter() {\n  const count = useCounterStore(state => state.count);\n  const increment = useCounterStore(state => state.increment);\n  return <button onClick={increment}>{count}</button>;\n}\n```" },
    boundary: { title: "Initialization is not an action", content: "The current Zustand API warns against calling `set`, `get`, or the store object synchronously while the state creator is still initializing. Return initial values directly and call those APIs later from actions or application code." },
    followups: ["What does a Zustand selector do?", "How does set update state?", "What imperative APIs are attached to a bound store?"],
  },
  {
    question: "When is Zustand useful in a React application?",
    title: "Using a store for broad sharing and selective updates",
    direct: "Zustand is useful when unrelated components or routes need the same client state, when code outside components must interact with that state, or when selector-based subscriptions make updates easier to control. It is usually unnecessary for private input, hover, or modal state owned by one subtree.",
    quick: ["Use it for genuinely shared client state.", "Selectors suit components that need different store fields.", "Imperative access can integrate non-component code.", "Keep feature-private state local.", "Use a server-data cache for remote freshness and invalidation concerns."],
    interview: [
      "I use Zustand when an independent client-side store matches the ownership requirement. Good examples are a cart used across routes, a media player controlled by several layouts, or a multi-step draft that must survive component boundaries.",
      "For example, the header can select `cartItems.length`, the checkout page can select `cartItems`, and an `addItem` action can update the same store. The header need not receive cart props through every route layout.",
      "Selectors are helpful when consumers need different pieces and update at different rates. A component selecting only `isPlaying` does not need the playlist object merely because both belong to the media feature.",
      "I keep local UI state local: whether one dropdown is open or what one unsaved text field contains rarely needs an imported store. Moving it out adds a global-looking dependency and makes cleanup or reuse harder.",
      "Remote API data is a separate decision. If caching, refetching, deduplication, and stale data are central, a server-state library often fits better than building those policies into a general Zustand store.",
    ],
    overviewTitle: "A store should earn independent ownership",
    overview: "The strongest reason for a Zustand store is that the state has a lifetime or consumer set wider than one React subtree. Project size alone is not a reason.",
    deepTitle: "Feature stores instead of one application bucket",
    deep: [
      "A store can be organized around a coherent feature, such as cart or playback, rather than one object containing every application value. Focused actions express the feature's valid updates and make ownership clear even though the data lives outside components.",
      "Store lifetime must be chosen deliberately. A module-level singleton survives component unmounts and is shared by every importer in that JavaScript environment. A per-page or per-test store instance may be safer when state should reset or multiple instances must coexist.",
      "Persistence is optional middleware, not a property of every store. Persist only values that remain valid across sessions, plan migrations for shape changes, and never treat browser storage as a secure place for secrets.",
    ],
    support: { type: "decision_tree", title: "Does the state need an external store?", content: "```mermaid\nflowchart TD\n  A{Only one component or subtree?} -->|Yes| B[Local or lifted React state]\n  A -->|No| C{Many independent consumers or non-React access?}\n  C -->|Yes| D[Consider Zustand]\n  C -->|No| E[Props or scoped context]\n  D --> F{Remote server data?}\n  F -->|Mostly| G[Consider a server-data cache]\n```" },
    boundary: { title: "Shared does not mean persisted", content: "A cart may need persistence, while a media seek position may not. Add persistence because the product needs cross-session recovery, not merely because the value is in a store." },
    followups: ["When should Zustand state be scoped per feature?", "Why is local state still useful with a store?", "How does client state differ from server state?"],
  },
  {
    question: "What Zustand mistakes lead to unnecessary renders or unsafe state?",
    title: "Narrow selectors and immutable store updates",
    direct: "Common mistakes are selecting the entire store, returning a new object from a selector without an equality strategy, mutating nested state, and putting unrelated features in one singleton. Select stable values, update structures immutably, expose focused actions, and scope store instances to their intended lifetime.",
    quick: ["Select only the fields a component displays.", "Avoid a fresh object result unless equality is handled.", "Use functional `set` for previous-state updates.", "Replace nested arrays and objects immutably.", "Do not let one singleton leak state between requests or tests."],
    interview: [
      "A common Zustand performance mistake is `const store = useStore()` with no selector. That component observes the full store, so any field update can make it render even if it displays only the cart count.",
      "A narrower call such as `useStore(state => state.cartCount)` expresses the real dependency. If a selector returns `{ count: state.count, total: state.total }`, that object is newly created; use separate selectors or the supported shallow-comparison helper when a combined object is useful.",
      "Mutation causes correctness problems too. For example, `state.items.push(item)` changes the existing array. An action should call `set(state => ({ items: [...state.items, item] }))` so subscribers receive a new snapshot.",
      "I also avoid exporting one store containing unrelated authentication, editor, notifications, and modal state. Feature stores or scoped instances make reset behavior and testing clearer.",
      "Finally, module-level stores can be unsafe when server requests share a process. Request-specific state should not leak through a singleton. The store's lifetime must match the user's or feature's lifetime.",
    ],
    overviewTitle: "Subscription breadth follows selector breadth",
    overview: "A selector is both a read and a subscription declaration. Returning only the needed value narrows the conditions under which the component receives a changed snapshot.",
    deepTitle: "Reference equality and store lifetime",
    deep: [
      "Store bindings compare selected results to decide whether a subscriber needs an update. Primitive results are simple. A selector that allocates an array or object each time produces a different reference even when its fields match, so equality must be handled intentionally.",
      "Zustand's `set` merges at the top level by default; it does not deeply clone nested data. Updating `user.profile.name` still requires new objects along that changed path, or a carefully chosen helper.",
      "The store object outlives any one component unless application code creates and disposes it differently. Reset actions, test setup, route scope, and server request boundaries are therefore part of state design—not afterthoughts.",
    ],
    support: { type: "before_code", title: "Broad and narrow selectors", content: "```jsx\n// Broad: observes the whole store.\nconst store = useCartStore();\n\n// Narrow: observes only what this component displays.\nconst itemCount = useCartStore(state => state.items.length);\nconst addItem = useCartStore(state => state.addItem);\n```" },
    boundary: { title: "Actions are values too", content: "Selecting an action function separately is usually stable when the action was created once in the store. Recreating action functions inside state updates can make consumers observe needless identity changes." },
    followups: ["Why can a selector returning an object rerender often?", "Does Zustand deeply merge nested objects?", "Why can a module-level store leak server-request state?"],
  },
  {
    question: "How does Zustand compare with useReducer plus Context?",
    title: "External-store selectors versus reducer context",
    direct: "`useReducer` plus Context keeps state in a React provider and distributes state and dispatch through the tree. Zustand keeps state in an external store and offers selector-based subscriptions and imperative access. Reducer context has no extra library; Zustand can simplify broad sharing and narrow subscriptions.",
    quick: ["Reducer plus Context is owned by a provider component.", "Zustand is owned by a store instance.", "Context consumers read provider values.", "Zustand consumers select store snapshots.", "Both can use named actions and scoped instances."],
    interview: [
      "`useReducer` plus Context and Zustand can both manage shared feature state, but their update channels differ. In the React approach, a provider owns reducer state and supplies state and dispatch to descendants. In Zustand, a store owns the value outside the tree and the bound Hook subscribes components to selected snapshots.",
      "For example, a task editor contained in one route can use a `TasksProvider` around that route. Its descendants read state and dispatch without another dependency, and unmounting the provider naturally ends that instance's lifetime.",
      "A task board shared by unrelated layouts and integration code may benefit from a Zustand store. A toolbar can select `selectedCount`, a list can select `tasks`, and an autosave service can subscribe through the store API.",
      "Basic context consumers are notified when their provider value changes. Splitting state and dispatch contexts helps, while Zustand selectors provide a direct fine-grained model. Zustand also adds library APIs and store-lifetime decisions.",
      "I choose the simplest model that fits scope and update frequency. Reducer plus Context is strong for a contained subtree; Zustand is useful when external ownership and selectors solve real problems.",
    ],
    overviewTitle: "Provider lifetime versus store lifetime",
    overview: "A reducer provider is created and destroyed with part of the React tree. A Zustand store can be a singleton or an explicitly created scoped instance, so its lifetime must be chosen separately.",
    deepTitle: "Both approaches can model events",
    deep: [
      "A Zustand action can apply the same pure transition ideas as a reducer, but it is not required to route every change through one reducer function. This can be concise, though a complex workflow still benefits from explicit event names and invariants.",
      "Reducer context can separate `StateContext` and `DispatchContext`, preventing dispatch-only consumers from reading state. It remains tied to React and naturally supports multiple provider instances for tests or repeated widgets.",
      "Zustand can also be scoped by creating a vanilla store and supplying it through context. This avoids treating the comparison as provider or no provider; the key difference is external snapshot subscriptions and the attached store API.",
    ],
    support: { type: "comparison_table", title: "Two shared-state designs", content: mdTable(["Concern", "useReducer + Context", "Zustand"], [["Owner", "Provider component", "Store instance"], ["Update input", "Dispatch action", "Store action or setState"], ["Subscription", "Context value", "Selector result"], ["Outside React", "Awkward", "Built-in store API"], ["Dependency", "React only", "Zustand"]]) },
    boundary: { title: "Do not migrate only to remove prop drilling", content: "Context alone may solve delivery while leaving the existing reducer and tests intact. A store migration is worthwhile when its ownership, subscriptions, or integration APIs provide a clear benefit." },
    followups: ["How can two contexts separate state and dispatch?", "Can Zustand actions use reducer-style events?", "How do you create more than one store instance?"],
  },
  {
    question: "How would you debug stale or unexpectedly shared Zustand state?",
    title: "Inspecting store identity, updates, and selectors",
    direct: "Check which store instance the component imports, inspect the current state before and after the action, and verify the selector reads the field that changed. Then look for mutation, a selector with unstable output, persistence rehydration, or a singleton shared across tests or server requests.",
    quick: ["Confirm the component and action use the same store instance.", "Compare `getState()` before and after the action.", "Check selector fields and result identity.", "Look for nested mutation or persistence rehydration.", "Reset or scope stores between tests and requests."],
    interview: [
      "I first confirm store identity. A component may subscribe to one store while an action updates another scoped instance, or a test may reuse a module singleton left over from the previous case.",
      "For example, if a cart badge stays at zero after `addItem`, I inspect `useCartStore.getState()` before and after the action. If `items` changes there, I check whether the badge selector reads `itemCount`, whether that field is actually derived, and whether the selector result changes.",
      "If state does not change, I inspect the action for mutation or an overwritten field. Functional `set` should return the new partial state. Nested arrays and objects must be replaced along the changed path.",
      "Persistence can briefly show initial state before rehydration or restore old data after startup. I check hydration status, storage keys, version migrations, and whether the test clears the configured storage.",
      "On a server, I verify that user-specific state is not held in a process-wide singleton. I then add a focused store test and a component test that proves the selector sees the intended update.",
    ],
    overviewTitle: "Store, update, and subscription failures",
    overview: "A stale screen can mean the wrong store was used, the action did not produce a new snapshot, or the component did not select the changed value. Inspect those boundaries in order.",
    deepTitle: "Hydration and instance boundaries",
    deep: [
      "Persistence adds another source: the in-memory initial state may later be replaced or merged with stored data. UI that depends on restored values should represent the hydration phase instead of assuming storage is synchronous in every environment.",
      "Scoped stores require matching provider and consumer hooks. A component outside the provider may use a fallback or throw, while an action captured from another scope updates a different instance. Labeling instances in development can make this visible.",
      "Tests should create a fresh store or restore a known initial snapshot. Clearing only rendered components does not reset a module singleton. Server code needs stronger isolation because two requests may overlap inside one process.",
    ],
    support: { type: "flow_diagram", title: "Zustand stale-state diagnosis", content: "```mermaid\nflowchart TD\n  A[UI looks stale] --> B{Store snapshot changed?}\n  B -->|No| C[Inspect action and mutation]\n  B -->|Yes| D{Selector result changed?}\n  D -->|No| E[Fix selector or derived field]\n  D -->|Yes| F{Correct store instance?}\n  F -->|No| G[Fix scope or singleton leak]\n  F -->|Yes| H[Inspect hydration and render boundary]\n```" },
    boundary: { title: "getState does not subscribe", content: "Calling `getState()` reads the current snapshot once. A React component should use the bound Hook or `useStore` to subscribe; otherwise it will not rerender merely because the store changes later." },
    followups: ["How can persistence change initial rendering?", "Why does getState not update a component?", "How should tests reset a Zustand store?"],
  },
]);

// Additional frontend modules are appended below before this script is run.

for (const { moduleSlug, topicSlug, entries } of lessons) {
  const file = path.join(domainRoot, moduleSlug, topicSlug, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.questions) || document.questions.length !== entries.length) {
    throw new Error(`${moduleSlug}/${topicSlug} has ${document.questions?.length ?? "no"} questions`);
  }
  document.questions = document.questions.map((question, index) => updateQuestion(question, entries[index]));
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

console.log(`Curated ${lessons.reduce((sum, item) => sum + item.entries.length, 0)} frontend questions across ${lessons.length} topics.`);
