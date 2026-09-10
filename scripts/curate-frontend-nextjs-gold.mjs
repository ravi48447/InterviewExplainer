#!/usr/bin/env node

import { curateIndexedModule, markdownTable } from "./lib/frontend-indexed-gold-curator.mjs";

const code = (title, language, lines, note) => ({
  type: "code_example",
  title,
  content: [`\`\`\`${language}`, ...lines, "```", "", note].join("\n"),
});

const table = (title, headers, rows) => ({ type: "comparison_table", title, content: markdownTable(headers, rows) });

const topicPacks = {
  "csr-vs-ssr-vs-ssg": [
    {
      question: "What is the difference between CSR, SSR, and SSG?",
      title: "CSR, SSR, and SSG rendering",
      direct: "CSR builds most page UI in the browser, SSR produces HTML for each request, and SSG produces HTML ahead of requests, usually at build or revalidation time. A Next.js application can combine these choices by route and data need.",
      quick: ["CSR moves initial rendering work to the browser.", "SSR creates request-specific output on the server.", "SSG reuses prebuilt output across requests.", "Hydration adds client interactivity to server-produced HTML."],
      interview: [
        "Client-side rendering, server-side rendering, and static-site generation mainly differ in when and where the initial HTML is produced. CSR lets browser JavaScript fetch data and build much of the page. SSR builds request-time output on the server. SSG creates reusable output before a visitor requests it.",
        "For example, an account page may use request-time server rendering because it depends on the signed-in user's cookies. A documentation page can be generated statically and served from a CDN. An interactive chart inside either page can still use client-side JavaScript after it loads.",
        "Server or static HTML can improve first content and search discovery, but interactive parts still need hydration and browser code. SSR adds server work per request, while SSG needs a freshness plan. The choice belongs to each route and data source rather than one label for the whole application.",
      ],
      deepTitle: "Rendering and interactivity are separate decisions",
      deep: [
        "Server rendering determines how the initial result reaches the browser. Hydration then connects client component logic to matching HTML. A page can therefore be mostly server-rendered while a small search, menu, or editor remains interactive in the browser.",
        "For example, a product page can prebuild its public description, revalidate inventory periodically, and load a personalized recently-viewed widget on the client. This hybrid design avoids forcing every part into the same rendering mode.",
      ],
      support: table("Rendering choices", ["Mode", "Initial output created", "Good fit", "Main cost"], [["CSR", "In the browser", "Highly interactive client-only areas", "More work/data may be needed before first content"], ["SSR / dynamic rendering", "On the server for a request", "Request-specific or private data", "Server work and caching complexity"], ["SSG", "Ahead of requests", "Public content shared by many users", "Needs build or revalidation freshness"]]),
      followups: ["What does hydration do?", "Can one route combine server and client rendering?"],
    },
    {
      question: "When should a Next.js page use request-time server rendering?",
      title: "Choose dynamic rendering for request-specific data",
      direct: "Use request-time server rendering when the output depends on current request information such as cookies, headers, authentication, permissions, or data that must be fresh for every request. Cache shared work separately when safe.",
      quick: ["Request-specific data cannot be one shared static page.", "Server rendering can keep secrets and private queries off the client.", "Every-request work adds latency and server load.", "Personalized output needs correct cache boundaries."],
      interview: [
        "Request-time server rendering is appropriate when the server cannot produce the correct page before it knows the incoming request. Authentication cookies, locale headers, permissions, and immediately current private data are common reasons.",
        "For example, `/account` should not be built once with one customer's orders. The server reads the authenticated identity, authorizes the request, fetches that customer's records, and returns output for that request. Sensitive credentials stay in server code.",
        "Dynamic rendering is not automatically better for every frequently updated page. Shared public data may use revalidation or a cached data layer instead of repeating the full work for every visitor. The response and data caches must never mix private output between users.",
      ],
      deepTitle: "Dynamic output follows the request boundary",
      deep: [
        "In the App Router, using request-bound APIs such as cookies or headers makes the route depend on the request. Other server work can still be cached if it is genuinely shared and its invalidation is correct.",
        "For example, an account page can render private orders per request while reading a shared country list from a longer-lived cache. Separating those data lifetimes reduces repeated work without caching personal HTML as public content.",
      ],
      support: { type: "diagram", title: "Request-specific rendering", content: "```mermaid\nsequenceDiagram\n  participant B as Browser\n  participant N as Next.js server\n  participant D as Data source\n  B->>N: GET /account with session cookie\n  N->>N: Authenticate and authorize\n  N->>D: Fetch this user's orders\n  D-->>N: Authorized records\n  N-->>B: Request-specific result\n```" },
      followups: ["Can part of a dynamic route still use cached data?", "Why is authentication separate from authorization?"],
    },
    {
      question: "How do static generation and revalidation work in Next.js?",
      title: "Static output with a freshness policy",
      direct: "Static generation creates reusable route output before a request, while revalidation allows that cached output or its data to be refreshed after a time or an application event. This combines fast shared delivery with controlled freshness.",
      quick: ["Static output is shared across visitors.", "Time-based revalidation sets a freshness interval.", "On-demand revalidation follows an application event.", "Users may briefly receive the last valid cached result during refresh."],
      interview: [
        "Static generation prepares output that can be reused instead of rendering the same public page for every request. Next.js can create it during a build or when a route is first generated, depending on the route and deployment behavior.",
        "For example, a public article can fetch with a revalidation interval so its cached data becomes eligible for refresh after that period. A content publishing action can instead call path- or tag-based revalidation so related pages are invalidated when editors publish.",
        "Revalidation is a freshness policy, not an exact scheduled job. A request can receive cached content while a refresh happens, depending on the cache and platform. Pages that must reflect every write immediately need a more direct dynamic or mutation-aware design, and invalidation tags should match real data ownership.",
      ],
      deepTitle: "Cache reuse needs an invalidation story",
      deep: [
        "Time-based revalidation is simple for content where bounded staleness is acceptable. Event-based invalidation can be more precise because the application knows when a product, article, or collection changes.",
        "For example, a product update can revalidate the product's tag so its detail and listing consumers refresh without purging unrelated pages. Overly broad invalidation wastes cache value; overly narrow invalidation leaves inconsistent views.",
      ],
      support: table("Freshness strategies", ["Strategy", "Refresh trigger", "Good fit"], [["Static build", "New deployment/build", "Rarely changing content"], ["Time revalidation", "Cached result ages past interval", "Bounded staleness is acceptable"], ["On-demand revalidation", "Mutation or publishing event", "Known content changes"], ["Dynamic rendering", "Each request", "Request-specific or always-current output"]]),
      followups: ["Is a revalidation interval an exact timer?", "Why are cache tags useful?"],
    },
    {
      question: "What causes a hydration mismatch in Next.js?",
      title: "Hydration mismatch causes and fixes",
      direct: "A hydration mismatch occurs when the browser's first render does not match the HTML produced by the server. Common causes include time or randomness, browser-only state, invalid HTML nesting, locale differences, and data that changes between renders.",
      quick: ["The initial server and client trees must match.", "Do browser-only work after hydration or inside a client-only boundary.", "Use stable data for the first render.", "Do not hide broad mismatches with suppression."],
      interview: [
        "Hydration attaches React behavior to HTML already sent by the server. React expects the browser's first render to produce the same structure and relevant text. If it does not, Next.js reports a hydration mismatch and React may replace or recover parts of the tree.",
        "For example, rendering `new Date().toLocaleTimeString()` directly can produce one value on the server and a later or differently localized value in the browser. Reading `window.innerWidth` during initial render has a similar problem because the server has no browser window.",
        "The fix is to make the first render deterministic: pass a stable server value, move browser-dependent updates into an effect, or isolate a truly client-only widget. Invalid element nesting must be corrected. `suppressHydrationWarning` is only an escape hatch for a small intentional difference, not a repair for inconsistent application state.",
      ],
      deepTitle: "Hydration reuses rather than redraws server HTML",
      deep: [
        "The server and client run in different times, environments, and sometimes locales. Any render logic based on those differences must still produce matching initial output. Effects run after hydration and can safely update browser-specific details afterward.",
        "For example, a theme can be chosen in an inline pre-hydration strategy or represented by a stable default, then synchronized with browser storage. Rendering an unverified storage value immediately on the client makes the first tree disagree with the server tree.",
      ],
      support: table("Mismatch source and remedy", ["Source", "Why it differs", "Safer approach"], [["Current time or random value", "Runs separately", "Pass stable value or update after hydration"], ["window/localStorage", "Unavailable on server", "Read in effect or client-only boundary"], ["Invalid HTML nesting", "Browser reparses structure", "Fix semantic markup"], ["Changing fetched data", "Two renders see different snapshots", "Share/carry stable initial data"]]),
      followups: ["Why can invalid HTML nesting cause hydration errors?", "When is suppressHydrationWarning acceptable?"],
    },
    {
      question: "How would you choose rendering modes for an e-commerce site?",
      title: "Use a hybrid rendering plan for commerce",
      direct: "Statically generate shared category and product content with suitable revalidation, render account and checkout data per request, and keep interactive controls as client components. Match inventory and price freshness to business risk.",
      quick: ["Public catalog content benefits from shared caching.", "Private account and checkout data are request-specific.", "Price and stock need explicit freshness rules.", "Client interactivity does not require client-rendering the whole page."],
      interview: [
        "An e-commerce site has data with different ownership and freshness. Product descriptions and category pages are public and read-heavy, so static output with revalidation can serve them efficiently. Account, cart ownership, and checkout permissions depend on the request and belong on the server.",
        "For example, a product page can pre-render its title, images, and description, refresh catalog data after publishing, and use a small client component for the image gallery or quantity picker. The add-to-cart action validates current price, stock, and user rules on the server rather than trusting stale page HTML.",
        "Flash-sale inventory may need shorter caching or a live endpoint, while an editorial guide can remain static much longer. Search may be dynamically rendered or client-updated according to indexing and interaction goals. This route-by-route design provides freshness where correctness requires it without giving up cacheable public content.",
      ],
      deepTitle: "Freshness follows business consequences",
      deep: [
        "Not every visible value has the same risk when stale. A description can tolerate delayed updates, while accepting an unavailable item or wrong checkout price affects the transaction. The server should re-check critical facts at mutation time.",
        "For example, showing a cached “in stock” label can be acceptable if checkout still reserves inventory atomically and returns a clear sold-out result. Static rendering is not permission to skip authoritative validation.",
      ],
      support: table("Commerce route plan", ["Area", "Likely strategy", "Reason"], [["Category/product content", "Static plus revalidation", "Shared, read-heavy, search-visible"], ["Search results", "Dynamic or client-updated", "Query-specific and interactive"], ["Account/orders", "Request-time server rendering", "Private, authorized data"], ["Checkout mutation", "Server validation/action", "Price, stock, and permission must be current"], ["Gallery/filter controls", "Client components", "Browser interaction"]]),
      followups: ["Why must checkout revalidate price and inventory?", "Can a statically generated product page contain client components?"],
    },
  ],

  "nextjs-file-routing": [
    {
      question: "How does file-based routing work in the Next.js App Router?",
      title: "App Router folders and special files",
      direct: "Folders under `app` form URL segments, but a route becomes publicly accessible when a `page` file provides its UI. Special files such as layout, loading, error, not-found, and route add shared UI or route behavior.",
      quick: ["A folder represents a route segment.", "`page.tsx` makes a UI route accessible.", "`layout.tsx` wraps its segment and descendants.", "`route.ts` defines an HTTP endpoint instead of page UI."],
      interview: [
        "The App Router maps the folder hierarchy under `app` to URL segments. A folder can organize route files, but the segment is publicly reachable as page UI only when a `page.js` or `page.tsx` file exists for that path.",
        "For example, `app/products/[id]/page.tsx` handles product URLs such as `/products/42`. `app/products/layout.tsx` wraps the product list and product detail descendants, while `loading.tsx`, `error.tsx`, and `not-found.tsx` define states for that segment.",
        "A `route.ts` file creates a route handler for HTTP methods and cannot share the same route segment level as a conflicting page endpoint. File conventions determine behavior, so ordinary helper components can live elsewhere or in safely non-routable folders without becoming pages.",
      ],
      deepTitle: "Segments build a nested route tree",
      deep: [
        "Each folder contributes a segment and each layout contributes a persistent UI boundary around its descendants. The root layout is required and supplies the document structure. Nested pages render through the `children` slot of their matching layouts.",
        "For example, navigating from `/products/1` to `/products/2` can reuse the products layout while the page segment changes. This nesting supports shared navigation and loading boundaries without manually rebuilding a route table.",
      ],
      support: { type: "diagram", title: "Folder tree to route tree", content: "```text\napp/\n├── layout.tsx              shared root\n├── page.tsx                /\n└── products/\n    ├── layout.tsx          wraps product routes\n    ├── page.tsx            /products\n    └── [id]/\n        ├── loading.tsx\n        └── page.tsx        /products/:id\n```" },
      followups: ["Does every folder under app create a public page?", "What is the role of the root layout?"],
    },
    {
      question: "How do dynamic, catch-all, and optional catch-all routes work in Next.js?",
      title: "Dynamic route segment patterns",
      direct: "`[slug]` matches one segment, `[...slug]` matches one or more segments as an array, and `[[...slug]]` also matches the parent path with no segment. Current App Router page props expose params asynchronously.",
      quick: ["`[id]` matches one URL part.", "`[...parts]` requires one or more parts.", "`[[...parts]]` also allows zero parts.", "Validate and authorize parameter values before data access."],
      interview: [
        "Square brackets mark a dynamic segment. `[id]` captures exactly one path part. A catch-all `[...parts]` captures the remaining path parts as an array, while optional catch-all `[[...parts]]` also matches the route with no remaining part.",
        "For example, `app/docs/[...parts]/page.tsx` can receive `['guides', 'install']` for `/docs/guides/install`, but it does not match `/docs` without another page. `[[...parts]]` would match both. In current App Router APIs, the `params` page prop is a promise and can be awaited.",
        "Route parameters are untrusted input. A product ID must be validated, and fetching a private record still needs authorization. `generateStaticParams` can provide known values for static generation, but dynamic behavior for values outside that set depends on route configuration and must be tested.",
      ],
      deepTitle: "A route pattern describes shape, not validity",
      deep: [
        "Matching `[id]` only proves that one path segment exists. It does not prove the segment is numeric, that a record exists, or that the current user can access it. Those checks belong in page data logic and can lead to a not-found or unauthorized result.",
        "For example, an optional docs catch-all receives no parts at `/docs`, so the code can render a documentation home. At `/docs/api/auth`, the array order preserves the nested path and can be used to locate the requested document safely.",
      ],
      support: table("Dynamic segment forms", ["Folder", "Matches", "Param example"], [["`[id]`", "/products/42", "`{ id: '42' }`"], ["`[...parts]`", "/docs/a/b", "`{ parts: ['a', 'b'] }`"], ["`[[...parts]]`", "/docs and /docs/a/b", "`{ parts: undefined }` or array"]]),
      followups: ["What should happen when a dynamic ID does not exist?", "What does generateStaticParams provide?"],
    },
    {
      question: "What is the difference between a layout and a template in Next.js?",
      title: "Persistent layouts and remounting templates",
      direct: "A layout is shared and preserves its component state across navigation within its segment, while a template receives a new key and remounts its children when the matching route segment changes.",
      quick: ["Layouts wrap descendants through children.", "Layouts persist across matching client navigations.", "Templates remount their subtree on navigation.", "Use a template only when reset or repeated effects are intentional."],
      interview: [
        "Both layouts and templates wrap child route content, but their navigation lifetime differs. Next.js reuses a matching layout across client navigation, preserving client component state inside that layout. A template is keyed so its subtree mounts again when the segment changes.",
        "For example, a shared dashboard navigation belongs in a layout because it should remain stable while moving between reports. A route transition that intentionally resets a form or runs an entrance effect on every child navigation may use a template.",
        "Remounting is not a general refresh solution because it discards local state and reruns effects. Data freshness should use the correct fetch or cache policy. Most shared route chrome belongs in layouts; templates are for the smaller set of experiences where a new instance is part of the requirement.",
      ],
      deepTitle: "Component lifetime follows the route boundary",
      deep: [
        "A persistent layout can contain client state such as an expanded navigation group without losing it as descendant pages change. It also avoids recreating shared UI work on each navigation.",
        "For example, placing a draft editor state in a template means navigating to another child and back creates a fresh editor instance. That may be desired for per-page transitions or dangerous if the user expected the draft to remain.",
      ],
      support: table("Layout and template", ["File", "Navigation lifetime", "Typical use"], [["layout.tsx", "Reused for matching segment", "Navigation, shell, shared providers"], ["template.tsx", "New keyed instance", "Intentional reset or repeated mount effect"]]),
      followups: ["Why should data freshness not rely on a template remount?", "Where can persistent client state live?"],
    },
    {
      question: "What are route groups and private folders in the App Router?",
      title: "Organize routes without changing URLs",
      direct: "A route group such as `(marketing)` organizes routes and can apply a layout without adding its name to the URL. A private folder such as `_components` is excluded from routing and can colocate implementation files safely.",
      quick: ["Parentheses create a URL-neutral route group.", "An underscore prefix marks a private non-route folder.", "Groups can give different sections different layouts.", "Two groups cannot resolve to the same final URL."],
      interview: [
        "Route groups use parentheses around a folder name. They organize route segments or apply layouts to selected sections, but the group name is omitted from the public URL. Private folders begin with an underscore and opt their subtree out of routing.",
        "For example, `app/(shop)/products/page.tsx` still maps to `/products`, while `app/(shop)/layout.tsx` can provide shop navigation. `app/(shop)/_components/ProductCard.tsx` can be colocated without creating a route segment.",
        "Because group names do not appear in URLs, `(shop)/about` and `(marketing)/about` would conflict if both produce `/about`. Navigating between routes that use different root layouts can cause a full page load, so layout grouping is an architectural choice rather than only cosmetic folder cleanup.",
      ],
      deepTitle: "Filesystem structure and public URL can differ",
      deep: [
        "Route groups let teams structure source around product areas while keeping stable user-facing URLs. They can also make only selected routes share a loading boundary or layout without adding an unwanted segment name.",
        "For example, `(auth)/login` and `(app)/dashboard` can have different layouts at `/login` and `/dashboard`. If no single top-level layout covers both, crossing those root layout trees reloads the document and should be an intentional experience.",
      ],
      support: { type: "diagram", title: "URL-neutral organization", content: "```text\napp/\n├── (marketing)/\n│   └── about/page.tsx       -> /about\n└── (shop)/\n    ├── products/page.tsx    -> /products\n    └── _components/         -> never a route\n        └── ProductCard.tsx\n```" },
      followups: ["Can two route groups define the same URL?", "When can navigation cause a full page load across groups?"],
    },
    {
      question: "How do loading, error, and not-found files work in Next.js?",
      title: "Route-level loading and failure UI",
      direct: "`loading.tsx` provides streaming fallback UI for a route segment, `error.tsx` catches render errors in its descendant segment through a client error boundary, and `not-found.tsx` renders when `notFound()` is called or a route is unmatched.",
      quick: ["Loading UI should resemble the pending content.", "Error boundaries need a useful retry or escape path.", "`notFound()` ends rendering for the missing resource path.", "Expected API errors still need normal application handling."],
      interview: [
        "The App Router provides special files for common route states. `loading.tsx` supplies immediate fallback UI while route content streams. `error.tsx` creates an error boundary around descendant content and must be a Client Component because it receives error and reset behavior.",
        "For example, a missing product can call `notFound()` and render the nearest `not-found.tsx`. A temporary database failure is different: it can reach `error.tsx`, which may show a retry control. A slow product fetch can display a product-shaped skeleton from `loading.tsx`.",
        "These files should not turn every expected result into an exception. A form validation error belongs beside the form, and an API's known empty result may belong in normal page UI. Error boundaries also need logging at the correct layer because retrying without evidence can hide repeated failures.",
      ],
      deepTitle: "Place recovery at the smallest useful boundary",
      deep: [
        "Nested route boundaries keep a failing area from replacing the entire application shell. A segment can provide its own loading and error experience while parent navigation remains available.",
        "For example, a dashboard reports panel can use Suspense for its slow data and a local error boundary for its request. The rest of the dashboard can remain interactive instead of waiting for or failing with that one panel.",
      ],
      support: table("Special route state files", ["File", "Trigger", "User need"], [["loading.tsx", "Segment content is pending", "Immediate meaningful feedback"], ["error.tsx", "Descendant render throws", "Explanation, retry, or navigation"], ["not-found.tsx", "notFound() or unmatched route", "Clear missing-resource path"]]),
      followups: ["Why must error.tsx be a Client Component?", "When should a form error stay in ordinary UI?"],
    },
  ],

  "server-vs-client-components": [
    {
      question: "What is the difference between Server and Client Components in Next.js?",
      title: "Server and Client Component responsibilities",
      direct: "Server Components render on the server and can access server data without sending their component code to the browser. Client Components are needed for state, effects, event handlers, context, and browser APIs, and begin at a `use client` boundary.",
      quick: ["App Router pages and layouts are Server Components by default.", "Server Components can use private server resources.", "Client Components provide browser interactivity.", "`use client` defines a client module boundary, not a whole-route requirement."],
      interview: [
        "In the App Router, pages and layouts are Server Components by default. They can fetch data and use server-only resources, and their component logic is not shipped as browser JavaScript. Client Components run during server prerendering and in the browser, where they can use state, effects, event handlers, and browser APIs.",
        "For example, a product page can fetch the product in a Server Component and render most of the description there. A small `AddToCartButton` marked with `use client` owns click handling and local pending state. The whole page does not need to become a Client Component for one button.",
        "Data passed across the server-to-client boundary must be serializable. Server code should still authorize data before passing it, and client code cannot safely contain secrets. Good boundaries keep interactive islands small without forcing awkward fragmentation of components that naturally work together.",
      ],
      deepTitle: "The boundary controls code and data movement",
      deep: [
        "Importing a module under a `use client` entry pulls that module and its client-side dependency graph into the client bundle. The directive only needs to appear on entry modules that are rendered directly from server code, not every nested client file.",
        "For example, a client `Counter` can import another presentational component without repeating the directive. A Server Component can also pass already-rendered server content as a child prop to a Client Component, keeping data work on the server and interaction around it on the client.",
      ],
      support: { type: "diagram", title: "A small client island", content: "```mermaid\nflowchart TB\n  A[Server product page] --> B[Server description]\n  A --> C[Client AddToCartButton]\n  C --> D[Click state and browser event]\n```" },
      followups: ["Does a Client Component render only in the browser?", "What does the use client boundary include?"],
    },
    {
      question: "When does a Next.js component need the `use client` directive?",
      title: "Place `use client` at interaction boundaries",
      direct: "Use `use client` on an entry module when its component needs client state, effects, event handlers, context, custom client hooks, or browser APIs. Keep data-only parents on the server when possible.",
      quick: ["State and lifecycle hooks require a Client Component.", "Event handlers require browser-side code.", "Browser APIs such as localStorage require a client boundary.", "Place the directive as low as a useful component boundary allows."],
      interview: [
        "The `use client` directive marks a module as a client entry point. Components that need interactive React features or browser capabilities belong below such a boundary: state, effects, event handlers, context providers, and APIs such as `window` or `localStorage`.",
        "For example, a server-rendered article can import a client `BookmarkButton` that reads button state and handles a click. Marking the article itself as client code would add its imported client graph to the browser bundle without being required for the static article body.",
        "The lowest possible boundary is not always one tiny element; a cohesive form may reasonably be one Client Component. The aim is to keep server data access and non-interactive rendering on the server while giving related interactive state a clear browser owner.",
      ],
      deepTitle: "One directive establishes an import boundary",
      deep: [
        "Once a file is a client entry, the modules it imports for that client graph must be browser-compatible. A server-only database or secret module cannot be imported into that graph even if a particular branch seems not to run in the browser.",
        "For example, a client form can receive initial serializable values from a server parent, then own editing state. Submission can call a server action or HTTP endpoint, keeping credentials and protected mutations out of the client bundle.",
      ],
      support: code("A narrow client entry", "tsx", ["// app/articles/[slug]/BookmarkButton.tsx", "'use client';", "", "import { useState } from 'react';", "", "export function BookmarkButton() {", "  const [saved, setSaved] = useState(false);", "  return <button onClick={() => setSaved(!saved)}>{saved ? 'Saved' : 'Save'}</button>;", "}"], "The server-rendered article can import this one interactive boundary."),
      followups: ["Should every nested client file repeat use client?", "Why can server-only modules not enter the client graph?"],
    },
    {
      question: "What data can be passed from a Server Component to a Client Component?",
      title: "Serializable props across the component boundary",
      direct: "Props crossing from a Server Component to a Client Component must be serializable by React's server-to-client transport. Plain data and supported values work; functions, class instances, and server-only resources should remain behind server behavior.",
      quick: ["Send the data the UI needs, not a database object.", "Event-handler functions cannot cross from server to client.", "Server actions have an explicit supported transport.", "Authorize and shape data before passing it."],
      interview: [
        "The server renders a description of the Client Component and sends its props to the browser. Those props must use values supported by React's serialization protocol rather than arbitrary live server objects.",
        "For example, pass `{ id, name, price }` to a client cart control instead of an ORM entity with methods and database state. A normal function such as `onClick={() => ...}` declared in a Server Component cannot be shipped as a client event handler. A server action is a separate supported mechanism for calling server behavior.",
        "The boundary is also a security boundary. Only fields safe for the browser should cross it, even if the component does not visibly print them. Permissions must be checked on the server again for mutations because a user can change client-sent values.",
      ],
      deepTitle: "Serialization turns server values into transport data",
      deep: [
        "A database connection, request object, or class instance carries behavior and process identity that a browser cannot recreate safely. Converting a record to a small view model creates an explicit public contract and can reduce the response payload.",
        "For example, a client profile card may need a display name and avatar URL but not the user's password hash, internal flags, or full session. Selecting those fields at the server boundary protects both bundle size and data exposure.",
      ],
      support: table("Boundary examples", ["Value", "Pass as ordinary prop?", "Reason"], [["Plain product fields", "Yes", "Transportable UI data"], ["Database client", "No", "Server process resource"], ["Normal callback created on server", "No", "Function cannot become browser code"], ["Authorized server action reference", "Supported path", "Explicit server-call mechanism"], ["Secret/internal field", "No", "Must not be exposed"]]),
      followups: ["Why should an ORM entity become a view model?", "Does hiding a prop in the UI make it secret?"],
    },
    {
      question: "Why is server-side data fetching useful in Next.js?",
      title: "Fetch close to protected data",
      direct: "Server-side fetching can access databases and services with private credentials, reduce client waterfalls and shipped data logic, and send only authorized UI data. Cache and dynamic behavior must still match the source's freshness.",
      quick: ["Secrets stay in server-only code.", "The server can query a database directly where appropriate.", "Send the browser only the fields it needs.", "Server fetching still requires error, cache, and authorization rules."],
      interview: [
        "A Server Component can fetch data while rendering without first shipping component JavaScript and then starting a browser request. It can also call protected services or a database from the trusted server environment.",
        "For example, an order page can read the current session, authorize access to the requested order, query it on the server, and pass a small display model to interactive controls. The database password and internal fields never become client props.",
        "Server fetching does not make data correct automatically. User input must be validated, access must be authorized, and caching must not share private results. Browser fetching remains useful for live updates and interactions that begin after the page loads.",
      ],
      deepTitle: "Remove the unnecessary browser round trip",
      deep: [
        "A purely client-fetched private page may first load JavaScript, hydrate, request data, then render content. Fetching during server rendering can combine those steps and stream useful output earlier, although server and data-source latency still affect the response.",
        "For example, independent server queries can begin together instead of nesting child requests in a client waterfall. Slow sections can stream behind Suspense while shared page content appears, keeping the server model without blocking every region.",
      ],
      support: { type: "diagram", title: "Server-owned order data", content: "```mermaid\nflowchart LR\n  A[Request] --> B[Authenticate and authorize]\n  B --> C[Server query]\n  C --> D[Small safe view model]\n  D --> E[Rendered page and client controls]\n```" },
      followups: ["Can server-fetched private data be cached publicly?", "When is browser fetching still useful?"],
    },
    {
      question: "How would you split a page between Server and Client Components?",
      title: "Design a practical server-client component boundary",
      direct: "Keep the route, data fetching, authorization, and mostly static content in Server Components; move the smallest cohesive interactive regions—forms, filters, editors, or browser integrations—behind Client Component boundaries.",
      quick: ["Begin from server components in the App Router.", "Locate actual interaction and browser dependencies.", "Pass small serializable props into client islands.", "Avoid turning a whole page client-side for one interactive child."],
      interview: [
        "The split follows responsibilities rather than visual boxes. Server Components own protected data access and non-interactive rendering. Client Components own state that changes in the browser, event handlers, effects, context, and browser APIs.",
        "For example, a searchable catalog page can be a Server Component that reads URL parameters and fetches products. A client filter panel updates the URL, and each client add-to-cart control handles immediate interaction. Product cards that only display data can remain server-rendered.",
        "The boundary should be cohesive. Splitting every input into a separate island can make state coordination awkward, while marking the entire catalog as client code increases the bundle and may recreate a browser data waterfall. Measure the result and keep sensitive mutations validated on the server.",
      ],
      deepTitle: "Move interactivity down; compose server content through it",
      deep: [
        "A Client Component can accept Server Component output as children, which lets an interactive shell surround content whose data was prepared on the server. The client file does not need to import the server implementation itself.",
        "For example, a client disclosure component can control open state while its child article body remains server-rendered. This composition keeps article code and data out of the client graph but still provides browser interaction around it.",
      ],
      support: { type: "diagram", title: "Catalog component split", content: "```mermaid\nflowchart TB\n  A[Server catalog route] --> B[Server data query]\n  A --> C[Client filter panel]\n  A --> D[Server product cards]\n  D --> E[Client cart buttons]\n```" },
      followups: ["Can a Client Component display Server Component children?", "Why is one component per island not always ideal?"],
    },
  ],

  "data-fetching-nextjs": [
    {
      question: "How do you fetch data in a Next.js Server Component?",
      title: "Async data fetching in Server Components",
      direct: "Make the Server Component async, await the data source, handle missing and error states, and set cache or revalidation behavior explicitly when reuse is intended. Current Next.js fetch requests are not cached by default.",
      quick: ["Server Components can await data during render.", "Keep secrets in server-only modules.", "Current fetch defaults should not be assumed to cache.", "A route can still be prerendered depending on all dynamic inputs."],
      interview: [
        "A Server Component can be an async function and await `fetch`, a database query, or another server-side data function before returning UI. This keeps protected data access on the server and avoids a browser effect for the initial request.",
        "For example, a product page can await `fetch(url, { cache: 'force-cache' })` for intentionally reusable data, or use `next: { revalidate: 300 }` for time-based freshness. Current Next.js versions do not cache ordinary fetch requests by default, so old assumptions about implicit fetch caching should not guide new code.",
        "The route's final rendering behavior also depends on request APIs and other data work. A missing record can call `notFound()`, while service failure needs an error boundary or handled state. Cache choices must respect authorization; private per-user responses should not be placed in a shared public cache.",
      ],
      deepTitle: "Data-cache and route-output decisions interact",
      deep: [
        "A fetch can be uncached while a route is still prerendered when all information is known during generation. Conversely, using cookies or headers makes output request-specific. Thinking separately about data reuse and route rendering avoids oversimplified labels.",
        "For example, a static public page may make an uncached request during its build and then serve the generated output. A dynamic account page may also read a cached shared country list while its private account query runs per request.",
      ],
      support: code("Server Component fetch", "tsx", ["export default async function ProductPage({ params }) {", "  const { id } = await params;", "  const response = await fetch(`https://api.example/products/${id}`, {", "    next: { revalidate: 300 },", "  });", "  if (response.status === 404) notFound();", "  if (!response.ok) throw new Error('Product request failed');", "  const product = await response.json();", "  return <h1>{product.name}</h1>;", "}"], "The five-minute revalidation policy is an example; real freshness should follow the product requirement."),
      followups: ["Are fetch requests cached by default in current Next.js?", "How can a route be static when its build-time fetch is uncached?"],
    },
    {
      question: "How do you avoid data-fetching waterfalls in Next.js?",
      title: "Start independent data work in parallel",
      direct: "Identify requests that do not depend on each other, start them before awaiting, and use `Promise.all` or component streaming to overlap their wait time. Keep genuinely dependent requests sequential.",
      quick: ["Sequential awaits add their waiting times.", "Independent promises can begin together.", "Dependent queries must wait for required input.", "Suspense can stream slow regions without blocking the whole page."],
      interview: [
        "A data waterfall occurs when one request waits for another even though its inputs were already available. The total delay becomes close to the sum of both waits. Starting independent promises together lets their latency overlap.",
        "For example, a dashboard that needs a profile and notifications can create both promises and await `Promise.all`. If recommendations need the profile's favorite category, that request is truly dependent and remains sequential after the profile resolves.",
        "Parallel work can increase simultaneous load, so it should follow real independence and service limits. Another option is to place a slow section behind Suspense so the page shell and faster section stream first. Shared request memoization or a cached data function can prevent the same data from being fetched repeatedly in one render tree.",
      ],
      deepTitle: "Model dependencies as a graph",
      deep: [
        "Requests with no edge between them can begin at the same time. A request whose input comes from another result must wait. Drawing that small graph prevents both accidental waterfalls and incorrect parallel calls with missing data.",
        "For example, profile and notifications can start together, then recommendations can start after profile. This creates two latency stages instead of three. Streaming can make the independent notifications panel visible even while recommendations remain pending.",
      ],
      support: code("Parallel independent requests", "ts", ["const profilePromise = getProfile(userId);", "const notificationsPromise = getNotifications(userId);", "", "const [profile, notifications] = await Promise.all([", "  profilePromise,", "  notificationsPromise,", "]);", "", "const recommendations = await getRecommendations(profile.category);"], "Only the recommendations call depends on profile data."),
      followups: ["When should requests stay sequential?", "How does Suspense improve a slow independent section?"],
    },
    {
      question: "How do loading.tsx and Suspense stream a Next.js page?",
      title: "Stream useful UI before every section is ready",
      direct: "`loading.tsx` wraps a route segment with an automatic Suspense fallback, while explicit Suspense boundaries can stream smaller slow regions independently. The fallback should reserve space and describe the content that is pending.",
      quick: ["Streaming sends ready UI in chunks.", "`loading.tsx` provides segment-level fallback.", "Explicit Suspense gives finer boundaries.", "Slow work must occur under the boundary to be streamed separately."],
      interview: [
        "Streaming lets the server send a route in parts rather than waiting for every data source. A `loading.tsx` file gives its segment immediate fallback UI and makes navigation interruptible. Explicit `<Suspense>` boundaries can isolate slower content within the page.",
        "For example, a dashboard header and account summary can render quickly while a recommendation panel waits under its own skeleton. When the recommendation data finishes, the server streams that region and React places it into the existing page.",
        "A boundary must wrap the component that actually suspends. Awaiting all slow data in the parent before returning means the boundary below never gets a chance to show early content. Skeletons should avoid large layout jumps, and important errors need an error boundary as well as a loading state.",
      ],
      deepTitle: "Boundary placement defines what can arrive independently",
      deep: [
        "Server rendering can begin outer UI, send its fallback, and continue work for nested async components. This reduces perceived waiting even when the slow query itself takes the same time.",
        "For example, two independent Suspense boundaries let reviews and recommendations reveal as they finish. One boundary around both makes the faster section wait for the slower one; a boundary around every small line can make the interface visually unstable.",
      ],
      support: code("Fine-grained streaming boundary", "tsx", ["export default function Dashboard() {", "  return (", "    <>", "      <AccountSummary />", "      <Suspense fallback={<RecommendationsSkeleton />}>", "        <Recommendations />", "      </Suspense>", "    </>", "  );", "}"], "`Recommendations` owns its async data work so the summary can appear first."),
      followups: ["Why can awaiting in the parent defeat a child boundary?", "How is an error boundary different from Suspense?"],
    },
    {
      question: "How do Server Actions and revalidation work after a mutation?",
      title: "Mutate on the server, then refresh affected data",
      direct: "A Server Action runs trusted server code from a form or client transition, but it must validate input and authorize the user like any endpoint. After a successful write, revalidate the affected path or cache tag and optionally redirect.",
      quick: ["`use server` marks server-callable action code.", "Validate and authorize inside every action.", "Perform the write before invalidating cached reads.", "Use path or tag revalidation according to data ownership."],
      interview: [
        "A Server Action is an asynchronous server function that React and Next.js can invoke through forms or client interactions. It keeps mutation implementation on the server, where it can use protected services and credentials.",
        "For example, an `updateProduct` action can parse form data, confirm the current user may edit that product, validate the fields, update the database, then call `revalidateTag('product:42')` or `revalidatePath('/products/42')` so cached readers do not keep old data.",
        "An action is still a public mutation surface and must not trust hidden inputs or the fact that a button was unavailable in the UI. Expected validation errors should return a useful form state; unexpected errors need logging and an error path. Broad invalidation is simple but may discard unrelated cache entries.",
      ],
      deepTitle: "Mutation and cache invalidation form one consistency flow",
      deep: [
        "The database write establishes the new source of truth. Revalidation tells cached readers that their earlier view may no longer be valid. If invalidation happens before a failed write, the cache can refresh with unchanged data and the user still sees no successful result.",
        "For example, tagging both product detail and listing fetches with the affected product or catalog tag can make one action update all necessary views. Tag design should follow shared data relationships instead of route names alone.",
      ],
      support: code("Authorized server mutation", "ts", ["'use server';", "", "export async function updateProduct(id, formData) {", "  const user = await requireUser();", "  await requireProductEditor(user, id);", "  const input = productSchema.parse(Object.fromEntries(formData));", "  await db.product.update({ where: { id }, data: input });", "  revalidateTag(`product:${id}`);", "}"], "Client-provided ID and form fields are validated and authorized inside the action."),
      followups: ["Why must a Server Action authorize every call?", "When is tag revalidation more useful than path revalidation?"],
    },
    {
      question: "When should data be fetched in a Client Component?",
      title: "Use client fetching for browser-driven data",
      direct: "Fetch in a Client Component when data depends on browser-only state, frequent interaction, live updates, or post-load user actions. Use a client data library when caching, deduplication, retries, and synchronization become important.",
      quick: ["Initial protected content often fits server fetching.", "Browser-only inputs can require client fetching.", "Client effects need loading, error, cleanup, and race handling.", "A data library can manage cache and deduplication."],
      interview: [
        "Client fetching is useful when the browser initiates the need after the page is interactive. Examples include typeahead search, polling, live dashboards, location-dependent data, and a panel opened by a click.",
        "For example, a stock widget can render its initial snapshot from the server and then subscribe or poll from a Client Component. The client flow must show loading and error states, stop work when unmounted, and prevent an older response from replacing a newer query.",
        "A plain effect can handle a small request, but repeated screens often benefit from a library that provides caching, deduplication, retry, focus revalidation, and mutation synchronization. Client fetching exposes the request to browser network conditions and cannot safely use server secrets, so APIs must still authenticate and authorize it.",
      ],
      deepTitle: "Initial delivery and later synchronization can differ",
      deep: [
        "Server fetching can provide useful initial HTML, while client fetching keeps data updated after hydration. Combining them requires a clear initial snapshot and cache key so the browser does not immediately duplicate a request or show inconsistent data.",
        "For example, a notifications badge can receive an initial count, then use a client subscription for new events. When the tab reconnects, it may refetch authoritative state because live messages could have been missed.",
      ],
      support: table("Fetch location", ["Need", "Likely location", "Reason"], [["Initial private page data", "Server", "Authorize before rendering"], ["Browser location or device state", "Client", "Only browser has input"], ["Live/polling updates", "Client after initial load", "Ongoing interaction"], ["Shared public content", "Server with cache policy", "Reusable response"], ["User-triggered mutation", "Server action or API", "Trusted validation and write"]]),
      followups: ["Why can an effect cause a stale-response race?", "How can server initial data and a client cache work together?"],
    },
  ],

  "deploying-nextjs": [
    {
      question: "What do `next build` and `next start` do?",
      title: "Build and run a production Next.js application",
      direct: "`next build` creates an optimized production build and reports build-time route issues, while `next start` runs that build with the Next.js Node.js server. The build must succeed before start can serve it.",
      quick: ["Build compiles and optimizes production output.", "Start serves an existing production build.", "Development behavior is not the deployment test.", "Run checks and inspect build output in CI."],
      interview: [
        "`next build` compiles the application for production, generates eligible route output, creates server and client chunks, and reports errors that appear during production compilation or prerendering. `next start` launches the built application with the Next.js production server.",
        "For example, a page that accidentally reads a missing production environment variable may work in local development but fail during `next build`. CI should run the same build command with the intended configuration before publishing any artifact.",
        "`next start` is one deployment option, not a static-file server. A platform adapter, container, or custom hosting setup may run the build differently. The selected deployment must support the features used by the application, such as request-time rendering, image optimization, route handlers, and cache behavior.",
      ],
      deepTitle: "Build-time and request-time failures are different",
      deep: [
        "Static generation executes eligible route logic during the build, so unavailable APIs or invalid data can fail before deployment. Dynamic routes may build successfully but fail only when a request reaches a missing runtime service.",
        "For example, validating required environment variables both at build startup and server startup gives a clear error earlier than a user-facing request failure. Health checks then verify that the running process can serve its critical dependencies.",
      ],
      support: { type: "diagram", title: "Production lifecycle", content: "```mermaid\nflowchart LR\n  A[Source and environment] --> B[next build]\n  B --> C[Production artifact]\n  C --> D[next start or platform runtime]\n  D --> E[Health and request checks]\n```" },
      followups: ["Which failures can appear only at request time?", "Why is next start not a static-file server?"],
    },
    {
      question: "How do environment variables work in a deployed Next.js app?",
      title: "Server-only and browser-exposed environment values",
      direct: "Environment variables are server-only by default. Variables prefixed with `NEXT_PUBLIC_` can be included in browser bundles and are commonly inlined at build time, so they must never contain secrets and may be frozen to the build environment.",
      quick: ["Unprefixed values stay in server code when boundaries are respected.", "`NEXT_PUBLIC_` means browser-visible.", "Public values can be captured during build.", "Validate required variables before serving traffic."],
      interview: [
        "Next.js loads environment variables for server code, but browser code cannot read arbitrary server environment values. Prefixing a variable with `NEXT_PUBLIC_` marks it for browser exposure and replacement in the client bundle.",
        "For example, `DATABASE_URL` belongs only in server code. `NEXT_PUBLIC_ANALYTICS_ID` can be public, but it may be inlined when the app is built. Promoting one already-built image from staging to production will not necessarily change that public value at runtime.",
        "Secrets must never use the public prefix or be passed into Client Component props. A containerized application can read server-only runtime variables when its server code executes, while public runtime configuration may need an explicit endpoint or server-rendered value if it truly must change after build. Missing values should fail clearly during deployment checks.",
      ],
      deepTitle: "Build environment and runtime environment are separate",
      deep: [
        "A build step can transform source and replace public variable references with literal values. The resulting JavaScript no longer asks the deployment machine for that value; it carries the build's value to every browser.",
        "For example, one immutable Docker image used across regions can safely receive a server-only database hostname at runtime, but a public API origin embedded during build remains the one from the build job. Designing configuration ownership prevents surprising cross-environment calls.",
      ],
      support: table("Environment value visibility", ["Example", "Available to", "Typical timing"], [["`DATABASE_URL`", "Server code only", "Server runtime/build when accessed"], ["`NEXT_PUBLIC_API_ORIGIN`", "Server and browser bundle", "Usually inlined during build"], ["Secret passed as client prop", "Browser", "Unsafe: data is exposed"]]),
      followups: ["Why can NEXT_PUBLIC values be frozen after build?", "How can public runtime configuration be delivered safely?"],
    },
    {
      question: "What is the difference between a static export and a Next.js server deployment?",
      title: "Static export versus server runtime",
      direct: "A static export emits HTML, CSS, JavaScript, and assets that any static host can serve, but it cannot use features that require a Next.js server at request time. A server deployment supports dynamic rendering, route handlers, cookies, and other server behavior.",
      quick: ["Static export uses `output: 'export'`.", "Static files can be served from a CDN or simple host.", "Request-time Next.js features need a server or compatible platform.", "All dynamic paths in an export need a build-time plan."],
      interview: [
        "A static export asks Next.js to generate deployable files that do not require a running Next.js process. It fits sites whose route output can be known at build time and whose later dynamic behavior can call external APIs from the browser.",
        "For example, a documentation site can prebuild every article and deploy the output directory to static storage. An account page that reads an HTTP-only session cookie and renders private orders per request cannot be implemented by those static files alone.",
        "A Node.js server or supported platform can use the full request-time feature set, but it adds runtime operations and scaling. Static export has feature limits around server-dependent behavior, dynamic paths, rewrites, headers, and image handling, so deployment choice should be made from actual route requirements before implementation is complete.",
      ],
      deepTitle: "A static host cannot execute request-time application code",
      deep: [
        "Static hosting maps URLs to files and does not run a Next.js route for each request. Dynamic client JavaScript can still run after loading, but it must call a separately hosted API and cannot turn the static host into a server renderer.",
        "For example, a `[slug]` documentation route can be exported when `generateStaticParams` supplies all slugs. An unknown new slug will not appear until another build unless the hosting architecture adds a server or another dynamic service.",
      ],
      support: table("Deployment capability", ["Capability", "Static export", "Next.js server"], [["Prebuilt public pages", "Yes", "Yes"], ["Request-time Server Components", "No", "Yes"], ["Route handlers/server actions", "No request-time runtime", "Yes"], ["Read request cookies on server", "No", "Yes"], ["Simple CDN/static host", "Yes", "Requires server-capable platform"]]),
      followups: ["Can a static export still call an API from the browser?", "How can a dynamic route be exported?"],
    },
    {
      question: "What should you consider when self-hosting Next.js across multiple instances?",
      title: "Operate Next.js as a distributed service",
      direct: "Use a reverse proxy, consistent build artifacts and environment, graceful shutdown, shared or coordinated cache behavior, durable external state, health checks, logs, and compatible asset delivery across all instances.",
      quick: ["Instances should run the same build version during a release window.", "Do not keep required user state only in process memory.", "Coordinate cache and invalidation across replicas.", "Drain traffic before stopping a process."],
      interview: [
        "Self-hosting several Next.js processes turns the application into a distributed service. A reverse proxy normally handles public traffic, TLS, limits, and routing to healthy instances. Application state that must survive requests belongs in a shared durable system rather than one process's memory.",
        "For example, if one instance revalidates a cached product while another has an independent old cache, users can receive inconsistent pages. The deployment can use a supported shared cache handler or an invalidation design that reaches every replica. All instances also need access to compatible static chunks during rolling releases.",
        "Shutdown should stop new traffic, allow in-flight requests to finish, and then exit. Health and readiness checks should distinguish a running process from one ready to serve. Logs, traces, resource limits, image optimization load, and versioned assets are operational requirements, not framework defaults that can be ignored.",
      ],
      deepTitle: "Process-local assumptions fail across replicas",
      deep: [
        "A request can land on any healthy instance. In-memory sessions, one-instance rate limits, and local invalidation messages create behavior that changes with load-balancer choice. Shared stores or deliberately instance-safe designs remove that hidden dependency.",
        "For example, during a rolling update an existing browser may request an older chunk after reaching new HTML. Serving versioned assets from stable shared storage and retaining old hashes for the rollout window prevents avoidable chunk failures.",
      ],
      support: { type: "diagram", title: "Multi-instance deployment", content: "```mermaid\nflowchart TB\n  A[Reverse proxy] --> B[Next.js instance A]\n  A --> C[Next.js instance B]\n  B --> D[Shared data/cache services]\n  C --> D\n  B --> E[Versioned asset store]\n  C --> E\n```" },
      followups: ["Why is an in-memory session unsafe across replicas?", "How do versioned assets help rolling releases?"],
    },
    {
      question: "How do you debug a Next.js deployment that builds but fails in production?",
      title: "Trace a Next.js runtime deployment failure",
      direct: "Inspect server logs and the first failed request, confirm runtime environment and artifact contents, compare Node/platform support, verify routes and assets through the proxy, and reproduce using the same production build and configuration.",
      quick: ["A successful build does not test every dynamic request.", "Check server logs and browser Network together.", "Verify runtime variables and deployed artifact version.", "Test direct routes, API handlers, and static chunks through the real proxy."],
      interview: [
        "A build proves that compilation and build-time route work completed. It does not prove that runtime environment variables, databases, permissions, proxies, dynamic routes, or production network access are correct.",
        "For example, the home page may load while `/api/orders` returns 500 because the server process lacks `DATABASE_URL`. Server logs identify the missing configuration, while the browser Network panel proves which endpoint failed. A chunk 404 would instead point toward asset paths or mixed release versions.",
        "The investigation confirms the deployed commit and artifact, Node and platform compatibility, runtime variables, file permissions, proxy forwarding, base paths, health checks, and external service access. Running the exact built artifact locally or in a staging environment with production-like configuration narrows the difference. Secrets must be checked by presence, not printed into logs.",
      ],
      deepTitle: "Production request boundaries",
      deep: [
        "A user request may pass through DNS, CDN, proxy, Next.js process, route logic, and a database or API. The status, response headers, request ID, and logs at each boundary locate the failure more reliably than rebuilding repeatedly.",
        "For example, a proxy 502 with no application request log suggests the process was unreachable or unhealthy. An application 500 with a matching request ID means traffic arrived and the route or its dependency failed.",
      ],
      support: table("Runtime symptom", ["Symptom", "Likely boundary", "Evidence"], [["502 before app log", "Proxy/process health", "Proxy logs and readiness"], ["500 with app request ID", "Route or dependency", "Application trace/error"], ["Chunk 404", "Asset path or release mismatch", "Requested hash and artifact"], ["Only dynamic route fails", "Runtime data/config", "Server log and environment presence"], ["Direct URL 404", "Proxy rewrite/base path", "Final URL and routing config"]]),
      followups: ["What does a 502 without an application log suggest?", "Why should secret values not be printed during checks?"],
    },
  ],
};

curateIndexedModule({ moduleSlug: "nextjs-basics", topicPacks });
