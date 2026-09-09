#!/usr/bin/env node

import { curateIndexedModule, markdownTable } from "./lib/frontend-indexed-gold-curator.mjs";

const jsCode = (title, lines, note) => ({
  type: "code_example",
  title,
  content: ["```js", ...lines, "```", "", note].join("\n"),
});

const table = (title, headers, rows) => ({ type: "comparison_table", title, content: markdownTable(headers, rows) });

const topicPacks = {
  "common-fe-interview-patterns": [
    {
      question: "What is event delegation in JavaScript?",
      title: "Event delegation with bubbling",
      direct: "Event delegation places one listener on a common ancestor and handles events from matching descendants as they bubble upward. It is useful for large or changing lists when the target is identified safely with `closest()`.",
      quick: ["Delegation depends on event propagation.", "Read `event.target`, then find the intended descendant.", "`closest()` handles clicks on nested child elements.", "Confirm the match belongs to the delegated container."],
      interview: [
        "Event delegation is a pattern where one ancestor listener handles events for many descendant elements. Most common UI events bubble from the original target through its ancestors, so the parent can inspect the event and decide which child action occurred.",
        "For example, a todo list can attach one click listener to the `<ul>` instead of one listener to every delete button. `event.target.closest('[data-action=delete]')` finds the button even when the user clicked an icon inside it. Newly added todo rows work without adding new listeners.",
        "The handler should verify that the matched element is inside the intended container. Not every event bubbles, and propagation can be stopped by other code, so delegation is not automatic for every interaction. Semantic controls and keyboard behavior still matter; delegation only changes where the JavaScript listener lives.",
      ],
      deepTitle: "From event target to delegated action",
      deep: [
        "`event.target` is the deepest element that began the event, while `event.currentTarget` is the element whose listener is currently running. In a delegated handler, those values are intentionally different. `closest()` walks from the target toward its ancestors until it finds the requested selector.",
        "For example, after finding a delete button, a containment check protects against a match that belongs to a nested or nearby widget. The action can then locate the row with another `closest()` call and remove or update the correct item.",
      ],
      support: jsCode("Delegated list action", ["const list = document.querySelector('#todos');", "", "list.addEventListener('click', (event) => {", "  const button = event.target.closest('[data-action=delete]');", "  if (!button || !list.contains(button)) return;", "  button.closest('li')?.remove();", "});"], "One listener handles existing and future delete buttons inside the list."),
      followups: ["How do target and currentTarget differ?", "Why is closest safer than checking target.matches only?"],
    },
    {
      question: "When should you debounce or throttle a frontend event?",
      title: "Debounce versus throttle",
      direct: "Debouncing waits until rapid calls stop before running, while throttling limits calls to at most once per time interval. Debounce suits search input; throttle suits continuous scroll or pointer updates.",
      quick: ["Debounce groups a burst into a later call.", "Throttle permits calls at a controlled rate.", "Both need a delay policy and cleanup.", "The UI use case decides which behavior feels correct."],
      interview: [
        "Debouncing and throttling control how often an expensive function runs during frequent events. A debounce resets its timer on every call and normally runs after the quiet period. A throttle allows execution at a limited rate while events continue.",
        "For example, a search box can debounce for 300 ms so typing `react` produces one request after the user pauses. A scroll indicator can throttle updates to a regular interval so it still moves during scrolling without recalculating on every event.",
        "Both patterns must decide whether to run on the leading edge, trailing edge, or both. Pending timers should be cancelled when a component unmounts, and stale network requests may also need `AbortController`. A delay that is too long makes the interface feel unresponsive even if it saves work.",
      ],
      deepTitle: "Two different time guarantees",
      deep: [
        "Debounce guarantees quiet-time behavior: a continuing burst can postpone the call indefinitely unless a maximum wait is added. Throttle guarantees a rate limit: a continuing burst can still produce periodic updates.",
        "For example, autosave may use debounce to save after editing pauses, while drag position may use animation-frame throttling to align visual work with rendering. Testing should use controlled fake timers and verify both the number of calls and their final arguments.",
      ],
      support: table("Timing patterns", ["Pattern", "During a continuing burst", "Typical use"], [["Debounce", "Waits for a pause", "Search, validation, autosave"], ["Throttle", "Runs at a limited rate", "Scroll, resize, pointer tracking"]]),
      followups: ["What do leading and trailing calls mean?", "Why might a request also need cancellation?"],
    },
    {
      question: "What is the difference between a shallow copy and a deep copy in JavaScript?",
      title: "Shallow and deep copying",
      direct: "A shallow copy creates a new outer array or object but reuses nested references. A deep copy recursively creates independent nested data; `structuredClone()` supports many built-in data types but not functions or every host object.",
      quick: ["Spread and `Object.assign` are shallow.", "Nested objects remain shared after a shallow copy.", "`structuredClone` handles circular references and many built-ins.", "JSON stringify/parse loses unsupported values and type information."],
      interview: [
        "A shallow copy duplicates only the first container. Primitive properties are copied as values, but nested arrays and objects still point to the same instances. A deep copy duplicates the nested graph so later changes do not affect the original graph.",
        "For example, `const next = { ...user }` creates a new user object, but `next.address === user.address` remains true. Changing `next.address.city` also changes the original. Copying the address explicitly, or using `structuredClone(user)` when its supported types fit, breaks that shared reference.",
        "Deep copying everything can be expensive and can destroy useful identity. Immutable updates often copy only the path that changed. `JSON.parse(JSON.stringify(value))` is not a general deep clone because it mishandles values such as `undefined`, dates, maps, sets, big integers, circular references, and functions.",
      ],
      deepTitle: "Copy the ownership boundary that changes",
      deep: [
        "Reference equality is the practical test. A new outer object is useful for state-change detection, but any nested object not copied keeps shared ownership. Copying the changed path preserves identities for untouched branches and is usually clearer than cloning an entire application state.",
        "For example, changing a city can use `{ ...user, address: { ...user.address, city: 'Pune' } }`. The outer user and address are new, while an unrelated preferences object can remain the same reference. This is structural sharing, not a full deep clone.",
      ],
      support: jsCode("Copy only the changed path", ["const user = { name: 'Asha', address: { city: 'Delhi' } };", "const next = {", "  ...user,", "  address: { ...user.address, city: 'Pune' },", "};", "", "console.log(next.address === user.address); // false"], "The update keeps the original object unchanged without cloning unrelated data."),
      followups: ["Why is JSON serialization not a general clone?", "What is structural sharing?"],
    },
    {
      question: "What is CORS, and why can a browser block an API call?",
      title: "CORS and browser cross-origin requests",
      direct: "CORS is an HTTP-header mechanism through which a server permits browser code from specified origins to read cross-origin responses. The browser may send a preflight and blocks JavaScript access when the response policy does not allow the request.",
      quick: ["An origin is scheme, host, and port.", "CORS is enforced by browsers, not a server authentication system.", "Some requests use an OPTIONS preflight.", "The API must return the correct allow headers."],
      interview: [
        "The same-origin policy restricts a page from reading resources from another origin. CORS lets the target server relax that restriction using response headers such as `Access-Control-Allow-Origin`. An origin includes the URL scheme, host, and port.",
        "For example, JavaScript from `https://app.example` calling `https://api.example` is cross-origin because the hosts differ. A JSON `POST` with an authorization header may first trigger an `OPTIONS` preflight. The API must approve the origin, method, and requested headers before the browser sends or exposes the main response.",
        "CORS is not a substitute for authentication or authorization, and non-browser clients such as curl are not protected by the browser's same-origin policy. Credentials require stricter header rules, and a wildcard origin cannot be combined with credentialed sharing. The Network panel should be used to inspect both preflight and actual response.",
      ],
      deepTitle: "Permission is communicated in HTTP responses",
      deep: [
        "A simple cross-origin request may be sent without a preflight, but the browser still checks the response before exposing it to JavaScript. Other methods, headers, or content types cause a preflight that asks what the server permits.",
        "For example, seeing a successful status in server logs does not prove frontend JavaScript received the body. If the allow-origin header is missing or mismatched, the browser can hide that response from the calling script and report a CORS error in the console.",
      ],
      support: { type: "diagram", title: "Preflighted request flow", content: "```mermaid\nsequenceDiagram\n  participant B as Browser\n  participant A as API\n  B->>A: OPTIONS with Origin and requested method\n  A-->>B: Allowed origin, method, headers\n  B->>A: Actual API request\n  A-->>B: Response with CORS headers\n  B-->>B: Expose response to JavaScript\n```" },
      followups: ["What makes two URLs different origins?", "Why is CORS not authentication?"],
    },
    {
      question: "What makes a modal dialog accessible?",
      title: "Accessible modal dialog behavior",
      direct: "An accessible modal has a clear dialog name, moves focus inside when opened, keeps keyboard focus within it, closes predictably, makes background content unavailable, and restores focus to the opener.",
      quick: ["Use a semantic dialog or correct dialog role and name.", "Move focus to a useful element inside.", "Trap Tab and Shift+Tab while modal.", "Return focus to the element that opened it."],
      interview: [
        "A modal dialog temporarily becomes the active interaction area. It needs an accessible name, usually from a visible heading, and modal semantics such as `<dialog>` behavior or `role=dialog` with `aria-modal=true` when a custom implementation is necessary.",
        "For example, opening a delete confirmation should move focus to the dialog or its safest useful control. Tab and Shift+Tab cycle through the modal controls, Escape can close when appropriate, and the page behind it cannot receive pointer or keyboard interaction. Closing returns focus to the delete button that opened it.",
        "ARIA labels alone do not implement focus movement, trapping, dismissal, or background isolation. The native `<dialog>` element reduces some custom work but still needs a meaningful label and application behavior. Screen-reader, keyboard-only, zoom, and focus-order testing should all be included.",
      ],
      deepTitle: "Focus follows the visible interaction context",
      deep: [
        "Keyboard focus should never disappear behind an open modal. Saving the opener before showing the dialog provides a stable restoration target. If that element is removed, the application needs a sensible nearby fallback.",
        "For example, a destructive confirmation should not automatically focus the destructive button without considering accidental activation. Focus can begin on the dialog heading, a cancel button, or the first meaningful control based on content and risk.",
      ],
      support: { type: "diagram", title: "Modal focus lifecycle", content: "```mermaid\nflowchart LR\n  A[Focus opener] --> B[Open dialog]\n  B --> C[Move focus inside]\n  C --> D[Keep focus in dialog]\n  D --> E[Close dialog]\n  E --> A\n```" },
      followups: ["Why is aria-modal not enough by itself?", "Where should initial focus go in a destructive dialog?"],
    },
  ],

  "hr-and-behavioral": [
    {
      question: "How should a fresher answer “Tell me about yourself”?",
      title: "A focused fresher introduction",
      direct: "Use a short present–evidence–direction flow: current study or role, two relevant skills supported by a project, and why the next role fits. Keep personal history only when it supports the job.",
      quick: ["Present: who you are professionally now.", "Evidence: skills shown through one project or internship.", "Direction: the work you want to grow into.", "Keep the answer relevant and specific."],
      interview: [
        "A useful introduction connects the candidate's current position, evidence of ability, and next direction. It is not a full life story or a reading of every resume line. The content should make the later technical discussion easy to continue.",
        "A fresher example is: “I recently completed my computer science degree and have focused on frontend development with JavaScript and React. In my final project, I built an expense tracker with responsive forms, API integration, and tests, and I worked on reducing unnecessary requests in its search flow.”",
        "The close can connect that evidence to the opening: “I am now looking for a frontend role where I can strengthen product engineering skills while contributing with the JavaScript and UI foundations I have already practised.” The project, skills, and direction should be replaced with truthful details, not memorized claims.",
      ],
      deepTitle: "Build a professional thread through the resume",
      deep: [
        "The present–evidence–direction structure works because each part answers a natural question: what the candidate does now, what proves the stated interest, and why this opportunity makes sense. One concrete project detail is stronger than a long list of technologies.",
        "For example, “I know React, Node, Git, and CSS” gives labels but no evidence. Connecting React to a form, an API, a bug solved, or a measured result gives the interviewer a useful topic for follow-up questions.",
      ],
      support: table("Introduction flow", ["Part", "Content", "Avoid"], [["Present", "Current education, role, or focus", "Unrelated childhood history"], ["Evidence", "Relevant project, internship, or result", "Unsupported skill list"], ["Direction", "Why this type of work is next", "Generic praise for every company"]]),
      followups: ["How can a student without an internship show evidence?", "Which resume detail should be left for follow-up?"],
    },
    {
      question: "How do you answer a question about a difficult challenge or failure?",
      title: "Explain a challenge with action and learning",
      direct: "Describe one real situation, your responsibility, the actions you personally took, the result, and the lesson that changed later work. Own the mistake without blaming others or pretending the outcome was perfect.",
      quick: ["Give enough context to understand the difficulty.", "Separate your action from the team's action.", "State the result honestly.", "Show a concrete change made afterward."],
      interview: [
        "A challenge answer needs a specific event rather than a general claim about working hard. The situation and responsibility can be brief; most of the detail belongs in the decisions, actions, result, and learning.",
        "For example, a student team might discover near submission that a dashboard fails on mobile. The candidate can explain reproducing the overflow, using DevTools to trace fixed widths, converting the layout to a responsive grid, dividing retesting across the team, and completing the core mobile views before the deadline.",
        "If some lower-priority pages remained imperfect, saying so makes the result believable. The learning should describe changed behavior, such as adding small-screen checks to the definition of done and testing layouts earlier, rather than the empty phrase “I learned a lot.”",
      ],
      deepTitle: "Evidence turns a story into a competency",
      deep: [
        "Situation and task establish the constraint, but action shows judgement. Useful action details include what evidence was collected, why one option was chosen, how risk was controlled, and how other people were involved.",
        "For example, a failure can still demonstrate ownership if the candidate explains the missed assumption, its effect, the correction, and a later practice that prevents recurrence. Blaming a teammate removes evidence of self-awareness and collaboration.",
      ],
      support: table("Challenge story", ["Part", "Question it answers"], [["Situation", "What made this difficult?"], ["Responsibility", "What were you accountable for?"], ["Action", "What did you actually do and why?"], ["Result", "What changed, including limits?"], ["Learning", "What do you do differently now?"]]),
      followups: ["How much technical detail should the story contain?", "Can an unsuccessful result still be a good example?"],
    },
    {
      question: "How do you describe a disagreement with a teammate?",
      title: "Show collaboration during disagreement",
      direct: "Use a real disagreement about work, explain both concerns fairly, show how evidence and shared goals guided the decision, and state the result without presenting the teammate as the problem.",
      quick: ["Choose a professional disagreement, not personal drama.", "Explain the other view accurately.", "Use evidence or a small experiment.", "Show how the team moved forward."],
      interview: [
        "A disagreement story should show that different views can exist without becoming personal conflict. The useful content is the shared goal, the trade-off each person saw, and the method used to reach a decision.",
        "For example, one developer may want a state library while another prefers local React state for a small feature. The candidate can describe listing the actual shared-state needs, building a small version with local state, and agreeing to introduce a library only if cross-page coordination appears.",
        "The result might be a simpler first release and a written decision point for later growth. Respectful listening, questions, a time-boxed experiment, documentation, and acceptance of the final team decision are stronger evidence than claiming to have convinced everyone.",
      ],
      deepTitle: "Move the discussion from preference to criteria",
      deep: [
        "Many technical disagreements are really differences in assumptions: expected scale, delivery time, failure cost, familiarity, or maintenance ownership. Making those assumptions visible gives the team something concrete to test.",
        "For example, comparing options against current requirements can reveal that both views are reasonable under different future conditions. A small proof, measurement, or reversible first step lowers the cost of being wrong and protects the working relationship.",
      ],
      support: { type: "diagram", title: "Collaborative decision flow", content: "```mermaid\nflowchart LR\n  A[Shared goal] --> B[Different concerns]\n  B --> C[Agree on criteria]\n  C --> D[Test or compare evidence]\n  D --> E[Decide and document]\n```" },
      followups: ["What if the team chooses the option you opposed?", "How can a technical decision remain reversible?"],
    },
    {
      question: "How do you answer “Why do you want this role and company?”",
      title: "Connect role, evidence, and company",
      direct: "Connect the role's actual work with skills you have demonstrated, name one specific company product or engineering reason, and explain the contribution and growth you expect without using generic praise.",
      quick: ["Use details from the job description.", "Support interest with a real project or skill.", "Name a specific company reason.", "Show mutual fit: contribution and learning."],
      interview: [
        "This answer is strongest when it links three facts: what the role requires, evidence from the candidate's work, and something specific about the company. “It is a great company” could describe any employer and does not explain the fit.",
        "For example: “This role focuses on accessible React interfaces and API-driven products. Those are the parts I enjoyed most in my campus marketplace project, where I built keyboard-friendly forms and handled loading and error states for product data.”",
        "A company connection can then be concrete: “Your public product shows the same focus on self-service workflows, and the junior role includes code review with a frontend team. I can contribute with the foundations I have built while learning how those interfaces are maintained at production scale.” Every detail must be checked and truthful.",
      ],
      deepTitle: "Specific fit is stronger than enthusiasm alone",
      deep: [
        "The role connection should come from responsibilities, not only a technology list. Building reliable user flows, collaborating with design, writing tests, or improving performance may matter more than naming a framework.",
        "For example, company research can use its actual product, engineering writing, public values with evidence, or the problem domain. Avoid inventing culture claims from marketing language. A candidate can be enthusiastic and still be precise about what is known.",
      ],
      support: table("Fit evidence", ["Connection", "Useful source"], [["Role work", "Job responsibilities and expected outcomes"], ["Candidate evidence", "Project, internship, coursework, or contribution"], ["Company reason", "Product, domain, engineering material, or verified practice"], ["Growth", "Skills the role genuinely exercises"]]),
      followups: ["What can you use when a company has no engineering blog?", "How is role fit different from listing technologies?"],
    },
    {
      question: "How do you discuss a strength and a weakness in an interview?",
      title: "Use evidence for strengths and change for weaknesses",
      direct: "Choose a job-relevant strength with a short example, and a genuine manageable weakness with its effect and the action improving it. Avoid disguised strengths and weaknesses that make the role impossible.",
      quick: ["A strength needs evidence, not only an adjective.", "A weakness should be real and safe to discuss.", "Explain its effect without exaggeration.", "Show the habit or system used to improve."],
      interview: [
        "A strength becomes credible when it is tied to behavior and an outcome. For example: “One strength is systematic debugging. In a project with duplicate API calls, I reproduced the request sequence, traced the effect lifecycle, and added a cancellation and regression test rather than hiding the symptom.”",
        "A weakness needs the same honesty: “I used to wait too long before sharing unfinished work because I wanted it to be polished. That delayed feedback on one project and caused avoidable rework.” This is clearer than calling perfectionism a hidden strength.",
        "The improvement completes the answer: “I now open a draft pull request early, list unresolved decisions, and ask for feedback after the first working slice.” The weakness should not contradict a core requirement of the role, and improvement should be supported by an actual repeated practice.",
      ],
      deepTitle: "Behavior makes self-description testable",
      deep: [
        "Adjectives such as hardworking, creative, or detail-oriented are difficult to evaluate alone. A compact event shows what the strength looks like and gives the interviewer a truthful path for follow-up.",
        "For example, a weakness framed only in the past can sound conveniently solved. An ongoing control such as a checklist, feedback routine, practice schedule, or deadline makes progress concrete while admitting that improvement continues.",
      ],
      support: table("Evidence pattern", ["Topic", "Include", "Avoid"], [["Strength", "Behavior, example, useful outcome", "Unsupported adjective list"], ["Weakness", "Real limitation, effect, improvement system", "Disguised strength or fatal role mismatch"]]),
      followups: ["Why is perfectionism often an unhelpful weakness answer?", "How can a fresher prove a professional strength?"],
    },
  ],

  "project-explanation": [
    {
      question: "How do you explain a frontend project clearly in an interview?",
      title: "Explain a project from problem to result",
      direct: "Cover the user problem, your role, the main architecture and flow, one hard decision, and the result. Use one concrete user journey instead of listing every library in the repository.",
      quick: ["Problem: who needed what?", "Role: what did you personally own?", "Flow: how does one important action work?", "Decision and result: what changed because of your work?"],
      interview: [
        "A clear project explanation follows the product rather than the package list. It names the user and problem, defines the candidate's responsibility, then traces one important flow through the frontend, API, and stored data.",
        "For example, an expense tracker explanation can follow adding an expense: React validates the form, sends a request, updates cached totals after success, and displays an inline error without losing entered data on failure. This flow naturally introduces component state, API design, and error handling.",
        "One decision adds depth, such as choosing server-owned totals to avoid different calculations across clients. The close gives an honest result: completed features, tests, users, performance change, or learning supported by evidence. Libraries are mentioned where they explain a decision, not as a memorized inventory.",
      ],
      deepTitle: "A user journey connects technical layers",
      deep: [
        "A project can contain dozens of components, but one end-to-end path shows how they work together. It also makes ownership visible: the candidate can name the form, validation, request state, backend contract, and test that they implemented.",
        "For example, a diagram from browser action to API and back is more useful than an architecture full of every file. Follow-up questions can then expand into authentication, failure behavior, caching, deployment, or trade-offs without losing the main story.",
      ],
      support: { type: "diagram", title: "Project explanation spine", content: "```mermaid\nflowchart LR\n  A[User problem] --> B[Your responsibility]\n  B --> C[One end-to-end flow]\n  C --> D[Important decision]\n  D --> E[Result and learning]\n```" },
      followups: ["How much of a team project can you claim?", "Which project flow should be chosen?"],
    },
    {
      question: "How do you explain a frontend project's architecture and data flow?",
      title: "Trace data through a frontend architecture",
      direct: "Name the major boundaries, then trace one value from input or route through state, API access, and rendering. Explain where each kind of state lives and how loading, error, and stale data are handled.",
      quick: ["Describe boundaries before individual files.", "Trace one value in both directions.", "Separate local, shared, server, and URL state.", "Include loading and failure behavior."],
      interview: [
        "Frontend architecture is easier to understand as boundaries and data flow. Typical boundaries include route pages, reusable UI components, state or query logic, an API client, and backend services. The exact layers should match the real project rather than a diagram template.",
        "For example, a product-filter change can update URL search parameters, cause the query layer to request matching products, store the response in a cache, and render cards. The URL preserves shareable filter state, local state controls a temporary open menu, and server data remains owned by the query cache.",
        "The return path matters too: loading placeholders appear while data is pending, an error view offers retry, and stale responses must not overwrite a newer filter result. Architecture is justified by these responsibilities. Adding a global store for every value would increase coupling without improving the flow.",
      ],
      deepTitle: "State placement communicates ownership",
      deep: [
        "Local component state belongs to one UI lifetime, URL state belongs in navigation and sharing, server state comes from a remote source and needs freshness rules, and cross-tree client state belongs in a shared owner only when several consumers truly need it.",
        "For example, a checkout address draft may be local until submitted, while the current authenticated user is shared and product inventory is server state. Treating all three as the same global object hides their different update and failure rules.",
      ],
      support: { type: "diagram", title: "Example product-filter flow", content: "```mermaid\nflowchart LR\n  A[Filter control] --> B[URL parameters]\n  B --> C[Query layer]\n  C --> D[API]\n  D --> C\n  C --> E[Product cards]\n```" },
      followups: ["How do local and server state differ?", "Why might filters belong in the URL?"],
    },
    {
      question: "How do you describe your individual contribution to a team project?",
      title: "Separate personal ownership from team delivery",
      direct: "State the team's goal, name the exact part you owned, describe your decisions and collaboration, and separate personal implementation from shared or teammate work without minimizing either.",
      quick: ["Use “I” for your actions and “we” for team outcomes.", "Name files or features only when they clarify ownership.", "Include reviews and coordination, not only coding.", "Be honest about reused or teammate-built work."],
      interview: [
        "A team project has a shared result, but the interview still needs evidence of the candidate's work. The explanation can begin with the team goal and then narrow to an owned feature, decision, investigation, test, or integration.",
        "For example: “We built a campus marketplace. I owned the listing form and image-upload flow. I designed the validation states, integrated the upload endpoint, added progress and retry behavior, and worked with the backend teammate to agree on file limits and error responses.”",
        "The outcome returns to the team: the feature was reviewed, tested, and released as part of the shared application. Saying that another teammate built authentication or that a library provided compression is accurate attribution, not a weakness. Claiming the entire architecture makes technical follow-ups expose uncertainty quickly.",
      ],
      deepTitle: "Ownership includes decisions and interfaces",
      deep: [
        "Individual contribution is broader than lines typed. Clarifying an API contract, reviewing a risky change, diagnosing an integration bug, writing tests, or organizing a release can be owned work when the specific action is explained.",
        "For example, “I did the frontend” is too broad to verify. Naming an image upload from selection through validation, request, progress, failure, and success exposes a meaningful boundary and several concrete decisions.",
      ],
      support: table("Attribution language", ["Scope", "Useful evidence"], [["Team", "Shared problem and shipped outcome"], ["Personal", "Owned feature, decisions, code, tests, investigation"], ["Collaboration", "Contract, review, handoff, conflict resolution"], ["External", "Library or service behavior that was reused"]]),
      followups: ["Does code review count as contribution?", "How do you explain a feature built from a library?"],
    },
    {
      question: "How do you explain a technical trade-off from your project?",
      title: "Explain a decision with constraints and consequences",
      direct: "Name the decision, the real constraints, at least two viable options, why one fit those constraints, what cost it introduced, and what evidence or future condition would make you revisit it.",
      quick: ["A trade-off needs two real options.", "Constraints explain why one option fit.", "Every choice has a cost or risk.", "State the signal that would trigger a new decision."],
      interview: [
        "A technical trade-off is not simply saying one tool is better. It explains why one option was more suitable under the project's current users, deadline, team skills, data size, reliability needs, or deployment environment.",
        "For example, a small dashboard may keep filter state in the URL and local components instead of adding a global state library. That reduces setup and keeps links shareable, but cross-page coordination would become harder if many unrelated screens began editing the same draft.",
        "The decision can be revisited when that cost appears, such as repeated prop plumbing or inconsistent updates across routes. Tests, bundle measurement, a short proof, or production observations give stronger support than preference. The rejected option can still be valid under different constraints.",
      ],
      deepTitle: "Good decisions include an expiration condition",
      deep: [
        "Architecture choices are made with incomplete future knowledge. Recording the current assumptions and a revisit signal keeps a simple choice from becoming permanent by accident and prevents premature complexity.",
        "For example, choosing client-side filtering for 200 cached items can be reasonable. A move to tens of thousands of changing items, slow devices, or access-controlled results would be evidence for server-side filtering and pagination.",
      ],
      support: table("Trade-off record", ["Part", "Example question"], [["Constraint", "What was true about scale, time, or risk?"], ["Options", "Which realistic alternatives existed?"], ["Decision", "Why did this fit now?"], ["Cost", "What became harder?"], ["Revisit signal", "What evidence changes the choice?"]]),
      followups: ["What if no measurements were collected?", "Why should the rejected option be described fairly?"],
    },
    {
      question: "How do you prove the impact and quality of a frontend project?",
      title: "Support project claims with evidence",
      direct: "Use evidence appropriate to the project: user completion, performance measurements, accessibility checks, tests, error rates, bundle size, review feedback, or a clear before-and-after result. Do not invent business metrics.",
      quick: ["Choose evidence connected to the project's goal.", "Keep measurement conditions comparable.", "Quality includes behavior, accessibility, and maintainability.", "State limits when the project had few real users."],
      interview: [
        "Project impact means a useful change, and quality means confidence that the change behaves well. A student project may not have revenue or thousands of users, but it can still have honest technical and usability evidence.",
        "For example, lazy-loading a chart route might reduce the initial JavaScript transfer from 420 KB to 270 KB under the same build settings. Tests can show that search handles loading, empty, error, and success states, while a keyboard walkthrough can reveal whether the form works without a mouse.",
        "The evidence should be tied to a baseline and method. Lighthouse is one lab signal, not a universal production score. A small usability session, automated checks, test coverage around risky paths, and production monitoring each answer different questions. Unknown impact should be described as unknown rather than replaced with an invented percentage.",
      ],
      deepTitle: "Match the measure to the claimed result",
      deep: [
        "A bundle-size change supports a claim about delivered bytes but not automatically faster interaction. A performance trace or user metric is needed for runtime experience. Similarly, line coverage does not prove that important behavior was asserted.",
        "For example, an accessible-name audit can find missing labels, while keyboard and screen-reader checks test actual interaction. Combining focused automated and manual evidence gives a more credible quality picture than one score.",
      ],
      support: table("Evidence by claim", ["Claim", "Useful evidence"], [["Loads faster", "Comparable network trace and user performance metric"], ["More reliable", "Regression tests and error monitoring"], ["More accessible", "Semantic audit plus keyboard/assistive testing"], ["Easier to maintain", "Smaller boundary, review feedback, safer tests"], ["Useful to users", "Task completion or direct user feedback"]]),
      followups: ["Why is a single Lighthouse score limited?", "What evidence can a project without real users provide?"],
    },
  ],

  "scenario-based": [
    {
      question: "A UI bug appears only after deployment. How would you investigate it?",
      title: "Investigate a production-only UI bug",
      direct: "Capture the affected route, browser, account, and release; compare console, network, feature flags, and production data; reproduce with the production build; then apply the smallest safe fix with a regression check.",
      quick: ["Record exact environment and reproduction steps.", "Check the first console or network failure.", "Compare production data and flags with local assumptions.", "Protect users before pursuing a perfect diagnosis."],
      interview: [
        "A production-only bug needs evidence from the environment where it occurs. Useful context includes release version, route, browser and device, account or permissions, feature flags, input data, frequency, and the first visible wrong behavior.",
        "For example, a price card may break only for a product whose discount is `null`. Network data can reveal that shape, while local fixtures always use a number. Replaying the same response against the production build can reproduce the rendering path without changing unrelated code.",
        "The first action may be a rollback or disabled flag when users are blocked. The permanent fix then handles the valid data contract, adds a regression test for the failing record, and verifies monitoring after release. Logging should provide enough context without exposing personal or secret data.",
      ],
      deepTitle: "Production differences are testable hypotheses",
      deep: [
        "Deployment transforms code and adds real data, browser diversity, caches, services, permissions, and flags. Listing those differences turns “only in production” into a set of boundaries that can be checked one at a time.",
        "For example, if the same API payload fails in a local production preview, the host is less likely to be the cause. If it works locally but an asset is missing in Network, attention shifts to deployment or caching.",
      ],
      support: { type: "diagram", title: "Production incident path", content: "```mermaid\nflowchart LR\n  A[Capture affected case] --> B[Reduce user impact]\n  B --> C[Collect console, network, data]\n  C --> D[Reproduce production path]\n  D --> E[Fix and add regression]\n  E --> F[Verify after release]\n```" },
      followups: ["When is rollback better than an immediate code fix?", "Which production data should not be logged?"],
    },
    {
      question: "An API works in Postman but fails in the browser. What could be wrong?",
      title: "Separate browser policy from API behavior",
      direct: "Inspect the browser request and console for CORS, preflight, cookie, mixed-content, certificate, redirect, and frontend URL differences. Postman is not subject to the browser's same-origin and cookie security rules.",
      quick: ["Compare exact URL, method, headers, and body.", "Inspect an OPTIONS preflight when present.", "Check credentials and cookie SameSite/Secure rules.", "HTTPS pages cannot freely load insecure HTTP resources."],
      interview: [
        "Postman proving that an endpoint responds does not prove a web page may access it. Browsers add origin policy, credential, cookie, TLS, and mixed-content rules around the same HTTP exchange.",
        "For example, a frontend `POST` with JSON and an authorization header may trigger an `OPTIONS` preflight. If the server does not allow that origin, method, or header, the browser stops the flow even though sending the POST directly from Postman succeeds.",
        "Network evidence should compare the exact browser URL and payload with the working request, including redirects. Cookie-based calls need compatible `credentials` options and server headers, plus valid SameSite and Secure attributes. The correction belongs in the API or deployment policy; disabling browser security is not a product fix.",
      ],
      deepTitle: "Browsers enforce the page's security context",
      deep: [
        "The browser knows which page initiated a request and protects that page's user and credentials. Postman is an independent client, so it does not apply the same-origin policy or automatically reproduce a browser cookie jar and site context.",
        "For example, an HTTPS page calling an HTTP API can be blocked as mixed content before application data is usable. A redirect can also send a request to an unapproved origin, so the final Network URL matters as much as the initial code string.",
      ],
      support: table("Browser-only checks", ["Evidence", "Possible cause"], [["OPTIONS fails", "CORS preflight policy"], ["Cookie absent", "Credentials or SameSite/Secure scope"], ["Mixed-content warning", "HTTPS page calling HTTP"], ["Different final URL", "Redirect or environment configuration"], ["TLS/certificate error", "Browser trust or hostname problem"]]),
      followups: ["Why can a redirect change a CORS result?", "What does SameSite affect?"],
    },
    {
      question: "A search field sends a request on every keypress. How would you improve it?",
      title: "Build a responsive, race-safe search flow",
      direct: "Debounce the query, require a sensible minimum input when appropriate, cancel or ignore stale requests, show clear loading and empty states, and cache results only when freshness and privacy rules allow it.",
      quick: ["Debounce reduces requests during typing.", "Stale responses must not replace newer results.", "Loading, empty, error, and success are separate UI states.", "Keyboard and screen-reader feedback still matters."],
      interview: [
        "A request per keypress wastes network and can produce out-of-order results. A debounce waits for a brief pause, and a minimum query length can avoid broad searches when the product permits it.",
        "For example, typing `react` may start a request for `rea` and then one for `react`. If the older request finishes last, it must not overwrite the newer result. Aborting the earlier fetch with `AbortController`, or checking a request identity before storing data, protects the ordering.",
        "The interface should preserve the typed value, distinguish no results from an error, and announce updates accessibly without excessive noise. A short cache can improve repeated queries, but user-specific or rapidly changing results need suitable keys and freshness rules. The delay should be measured for the product rather than copied blindly.",
      ],
      deepTitle: "Rate control and result correctness are separate",
      deep: [
        "Debouncing reduces how many calls begin, but it does not guarantee which network response arrives last. Cancellation or stale-result checks are still required. These two controls solve load and correctness respectively.",
        "For example, the UI can associate each request with its normalized query and only display the response if that query still matches the current field. This remains useful even when the browser or server cannot cancel work already in progress.",
      ],
      support: { type: "diagram", title: "Search request lifecycle", content: "```mermaid\nflowchart LR\n  A[Typing] --> B[Debounce]\n  B --> C[Cancel older request]\n  C --> D[Fetch current query]\n  D --> E{Still current?}\n  E -->|Yes| F[Render state]\n  E -->|No| G[Ignore stale result]\n```" },
      followups: ["Why is debounce alone not race-safe?", "When is a minimum query length inappropriate?"],
    },
    {
      question: "A React page re-renders too often. How would you find and fix the cause?",
      title: "Diagnose unnecessary React rendering",
      direct: "Measure with React DevTools Profiler, identify which component rendered and why, then narrow state, stabilize truly important props, split expensive work, or memoize only where the measured cost justifies it.",
      quick: ["A render is not automatically a performance bug.", "Profile the slow interaction first.", "Find the changing state, context, or prop.", "Verify the optimization with a second profile."],
      interview: [
        "React re-renders a component when its state changes, its parent renders, or consumed context changes. That is normal. It becomes a problem when measured work is expensive or frequent enough to harm the user interaction.",
        "For example, typing in one filter might re-render a large table because the filter state lives above the whole page and a context value is recreated on every render. The Profiler can show the affected commits and component cost. Moving transient state closer to the filter or splitting context can reduce the update area.",
        "`memo`, `useMemo`, and `useCallback` have their own complexity and do not stop changing dependencies. They should follow evidence, not surround every component. List keys, expensive calculations, effect loops, and external subscriptions also need inspection. A matching before-and-after profile proves whether the fix helped.",
      ],
      deepTitle: "Render frequency and render cost both matter",
      deep: [
        "A very cheap component can render often without visible harm, while one expensive chart can make a single interaction slow. The Profiler connects frequency, duration, and changed inputs so the remedy matches the cost.",
        "For example, memoizing a child will not help if it receives a new object prop every time. The parent can avoid recreating that object when necessary, or the component boundary can accept simpler primitive props. Often the clearer fix is better state placement rather than more memoization.",
      ],
      support: { type: "diagram", title: "Measured rendering workflow", content: "```mermaid\nflowchart LR\n  A[Record slow action] --> B[Find expensive commit]\n  B --> C[Why did component render?]\n  C --> D[Change state or boundary]\n  D --> E[Profile again]\n```" },
      followups: ["Why is every re-render not a bug?", "When can memo fail to help?"],
    },
    {
      question: "How would you implement and test an accessible modal in a frontend app?",
      title: "Implement an accessible modal as a complete interaction",
      direct: "Use a native dialog or proven accessible primitive, provide a visible name, manage initial and restored focus, contain interaction, support keyboard dismissal when appropriate, isolate the background, and test behavior with keyboard and assistive tools.",
      quick: ["Prefer native or well-tested dialog behavior.", "Save the opener and restore focus on close.", "Keep focus inside while modal.", "Test more than ARIA attributes."],
      interview: [
        "An accessible modal is a focus and interaction system, not merely a centered box. A native `<dialog>` opened with `showModal()` provides modal behavior, while a custom dialog needs equivalent semantics and focus handling.",
        "For example, a profile form modal can use its visible heading as the accessible name. Opening moves focus to the heading or first field, Tab remains within the form and its close controls, Escape closes when no destructive confirmation is required, and closing returns focus to the Edit profile button.",
        "Tests should confirm the dialog name and role, initial focus, forward and reverse tab order, Escape and close-button behavior, background isolation, validation errors, and focus restoration. Automated checks catch missing semantics, while keyboard and screen-reader use checks whether the complete interaction makes sense.",
      ],
      deepTitle: "Treat focus restoration as state",
      deep: [
        "The opener is captured at the time the modal opens because the same dialog may be launched from several places. On close, that element may no longer exist, so a nearby stable fallback needs to be chosen instead of focusing the document body.",
        "For example, deleting a row from inside its modal also deletes the row's opener. Focus can move to the next row action or the list heading. That behavior is a product decision and should be covered by the deletion test.",
      ],
      support: table("Modal test cases", ["Behavior", "Expected result"], [["Open", "Meaningful focus enters named dialog"], ["Tab / Shift+Tab", "Focus remains within modal controls"], ["Escape or Cancel", "Closes when product rule permits"], ["Close", "Focus returns to opener or safe fallback"], ["Background", "Cannot be operated while modal is active"]]),
      followups: ["What if the opener is deleted while the modal is open?", "Which modal checks still need manual testing?"],
    },
  ],
};

curateIndexedModule({ moduleSlug: "fe-interview-readiness", topicPacks });
