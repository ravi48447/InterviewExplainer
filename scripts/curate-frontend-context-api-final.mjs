#!/usr/bin/env node
/**
 * curate-frontend-context-api-final.mjs — finish state-management-basics/context-api-basics
 * with the final interview-path pattern (anchor + 4 template follow-ups + plan metadata).
 */

import { applyTopic } from "./curate-frontend-final-pattern.mjs";

const count = applyTopic({
  moduleSlug: "state-management-basics",
  topicSlug: "context-api-basics",
  topicTitle: "Context Api Basics",
  anchors: [
    {
      slug: "state-management-basics-context-api-basics-context-api",
      slugName: "context api basics",
      question: "How does React Context work — and what does it actually solve?",
      title: "Context Api Basics",
      direct:
        "Context lets an ancestor publish one value to every descendant without threading it through intermediate props — a scoped broadcast channel, not a state manager. A consumer reads the NEAREST provider of that exact context object above it (nested providers override). When the provider's value changes by Object.is, every consumer reading that context re-renders — including memoized intermediaries. It solves DELIVERY (prop drilling), not storage or update scheduling.",
      summary:
        "Context is a scoped value channel: a provider publishes, useContext reads the nearest provider above, and a changed value re-renders all consumers of that context.",
      mistake:
        "Assuming Context manages or optimizes state — it does neither; it only delivers values, and an unconditional new object value re-renders every consumer.",
      profile: "mechanism",
      stage: "framework",
      priority: "must-prepare",
      language: "jsx",
      speakable:
        "The mechanism, verified:\n\n```jsx\nconst ThemeContext = createContext('light');   // 1. create (arg = default when NO provider)\n\nfunction App() {\n  const [theme, setTheme] = useState('dark');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <Layout />          {/* Layout never sees theme props */}\n    </ThemeContext.Provider>\n  );\n}\n\nfunction ThemedButton() {                  // deeply nested — no props needed\n  const { theme, setTheme } = useContext(ThemeContext);  // 2. consume\n  return (\n    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>\n      theme: {theme}\n    </button>\n  );\n}\n```\n\nThe lookup rule (the interview core): a consumer receives the value from the NEAREST provider of that exact context object above it in the React tree. Nested providers intentionally override — a page in 'dark' can host a card in 'light'. The default (createContext's argument) applies ONLY when no provider exists above — it's a fallback, not initial state.\n\nWhat Context is NOT (the trap half): it is not a state manager. The provider VALUE comes from somewhere — useState, useReducer, a store — Context just delivers it. And it is not automatically performant: every consumer re-renders when the provider value changes, even if the part they read didn't. The classic perf bug: `value={{ user, notifications }}` as an inline object — every App re-render creates a new object, Object.is fails, ALL consumers re-render even when nothing changed.\n\nThe value-identity discipline (the senior close): memo the value (`useMemo`) or split fast- and slow-changing data into SEPARATE contexts (a UserContext that rarely changes vs a NotificationsContext that changes constantly — consumers of one don't re-render for the other). Provider scope should match the feature: wrap checkout routes, not the whole app.",
      flow:
        "flowchart TD\n    P[Provider publishes value] -->|descendants read| C1[consumer 1]\n    P --> C2[consumer 2]\n    NP[nested provider: overrides] --> C3[consumer 3 reads override]\n    NO[no provider above] --> D[consumer gets static default]\n    V[value changes by Object.is] --> R[ALL consumers of that context re-render]\n    M[inline object literal every render] -->|new identity| R",
      deep:
        "Why memoized intermediaries still re-render (the mechanism most miss): Context propagation does NOT respect React.memo on the way down. The provider re-renders → React walks its subtree and updates every context consumer directly — a memoized component between provider and consumer is skipped for ITS OWN render, but the consumer below still receives the new context value and re-renders. This is by design: context is a documented escape hatch from prop-based memoization. The performance lever is therefore not memo() in the middle — it's (a) smaller provider scope, (b) stable values (useMemo/useRef), and (c) splitting contexts by change frequency.\n\nThe stale-context closure trap (the debugging angle): a consumer re-renders when context changes, but a callback CREATED in an earlier render still closes over that older value. If a component stores a context value in a ref or a long-lived listener, it holds a snapshot — the same stale-binding semantics as closures in loops. The fixes are the same family: read from a ref updated in an effect, or use a functional update at the owner.\n\nThe architecture frame (the senior close): Context is the React-native layer of the state ladder — colocate (useState) → lift (nearest ancestor) → context (subtree-global, low-frequency) → external store with selectors (app-global or high-frequency, because Zustand/Redux subscribers select slices and only re-render when THEIR slice changes — Context lacks selectors, so every consumer takes every change of that context). The interview-worthy line: Context for delivery, a store for subscription granularity.",
      code: "const ThemeContext = createContext('light');\n// ...provider above, consumer below",
    },
  ],
});

console.log(`Applied final pattern to context-api-basics: ${count} questions.`);
