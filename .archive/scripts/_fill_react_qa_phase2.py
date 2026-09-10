#!/usr/bin/env python3
"""One-off: fill _TBD_PHASE_2_ in react routing/forms, performance, testing complete-qa.json files."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE = ROOT / "content/java-fullstack-intermediate"


def S(t: str, title: str, content: str) -> dict:
    return {"type": t, "title": title, "content": content.strip()}


def apply(path: Path, fills: list[tuple[int, str, list[dict]]]) -> int:
    """fills: (question_index, direct_answer, sections)"""
    data = json.loads(path.read_text(encoding="utf-8"))
    n = 0
    for idx, direct, sections in fills:
        q = data["questions"][idx]
        if q.get("direct_answer") != "_TBD_PHASE_2_":
            raise SystemExit(f"Expected TBD direct_answer at {path} idx {idx}")
        if q.get("answer", {}).get("sections") != "_TBD_PHASE_2_":
            raise SystemExit(f"Expected TBD sections at {path} idx {idx}")
        q["direct_answer"] = direct
        q["answer"]["sections"] = sections
        n += 1
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return n


def main() -> None:
    total = 0

    # --- react-routing-forms ---
    p = BASE / "react-routing-forms/react-router-basics/complete-qa.json"
    total += apply(
        p,
        [
            (
                0,
                "React Router v6 is built around **declarative route trees**: `<BrowserRouter>` (or a data router from `createBrowserRouter`) wraps the app; you declare `<Routes>` containing `<Route path=\"...\" element={<Page/>} />` (the `element` prop replaces v5’s `component` / `render`). **`<Link>` / `<NavLink>`** navigate without full reloads; **`useNavigate`** imperatively pushes or replaces history; **`useParams`**, **`useSearchParams`**, and **`useLocation`** read the active URL. Nested routes use a parent `element` with **`<Outlet />`** so child routes render inside a shared shell. **Data routers** add **`loader`**, **`action`**, and **`errorElement`** so data fetching and mutations align with navigation—often preferable to fetching only in `useEffect` after paint.",
                [
                    S(
                        "overview",
                        "What changed from v5 — interview headline",
                        "In v6 there is **no `<Switch>`** — use `<Routes>` (first match wins). Routes are **objects with `element`**, not `component={}` props. **Relative route resolution** is automatic inside route trees. **Data APIs** (`createBrowserRouter`, `RouterProvider`) run **loaders before the route renders** and **actions on form POST**, which fixes the classic “flash of unauthorized UI” when auth checks lived only in effects.",
                    ),
                    S(
                        "architecture_diagram",
                        "Navigation → matched route → element tree",
                        "```mermaid\nflowchart LR\n  URL[\"Current URL\"]\n  R[\"<Routes> match\"]\n  M[\"Matched <Route> chain\"]\n  L[\"loader (data router)\"]\n  E[\"element + <Outlet/>\"]\n  DOM[\"DOM commit\"]\n  URL --> R --> M\n  M --> L\n  L --> E --> DOM\n```\n\n**Mental model for the panel:** the router picks a branch, optionally **awaits loader data**, then React renders the declared `element` chain. Declarative `<Link>` updates the URL; the same pipeline runs again.",
                    ),
                    S(
                        "after_code",
                        "Minimal v6 declarative router",
                        "```tsx\nimport { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';\n\nfunction Layout() {\n  return (\n    <div>\n      <nav><Link to=\"/\">Home</Link> <Link to=\"/invoices\">Invoices</Link></nav>\n      <Outlet />\n    </div>\n  );\n}\n\nexport function App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route element={<Layout />}>\n          <Route index element={<Home />} />\n          <Route path=\"invoices\" element={<Invoices />} />\n        </Route>\n      </Routes>\n    </BrowserRouter>\n  );\n}\n```\n\n**Talking pace:** start with `BrowserRouter` + `Routes`/`Route`, then mention **layout routes** (`element` + `Outlet`) without a path segment.",
                    ),
                    S(
                        "step",
                        "If they ask about data routers — 30-second version",
                        "1. Call **`createBrowserRouter([{ path, element, children, loader, action }])`**.\n2. Render **`RouterProvider router={router}`** instead of `BrowserRouter`.\n3. **`loader`**: runs when entering a route; return JSON, throw **`redirect()`**, or `defer()` slow bits.\n4. **`action`**: runs on `<Form method=\"post\">` submissions from Router’s `<Form>` / `useSubmit`.\n5. Components read data with **`useLoaderData`**, pending state with **`useNavigation`**.\n\nThis is the same *idea* as colocated data in frameworks like Remix—**fetch before paint** where possible.",
                    ),
                    S(
                        "key_points",
                        "Key points",
                        "- **`element` prop** is the v6 default; avoid v5 `component` / `render` vocabulary unless comparing.\n- **`<Outlet />`** renders the next nested match—layout routes are a common senior-level topic.\n- **Relative `<Link to=\"../..\">`** resolves against the route hierarchy—not filesystem paths.\n- **Data routers** pair navigation with **loaders/actions**; use them when **auth or data gating** must happen **before** UI commits.\n- **`<NavLink>`** exposes `isActive` / `isPending` for styling tabs.",
                    ),
                    S(
                        "speakable_answer",
                        "How to answer this verbally",
                        "I’d describe React Router v6 as **element-based route declarations** inside `<Routes>`, with **`<Link>`** for declarative navigation and **`useNavigate`** when something imperative fires—like after a login form.\n\nI’d mention **nested routes** using a parent layout component and **`<Outlet />`** for the child slot.\n\nIf the role cares about data loading, I’d add **`createBrowserRouter`** with **loaders** so we **fetch or authorize before render**, instead of always chaining `useEffect` after paint.",
                    ),
                ],
            ),
            (
                1,
                "**`useParams()`** returns dynamic **path segments** from the matched pattern (e.g. `/users/:id` → `{ id: '42' }`). **`useSearchParams()`** mirrors the **query string** as a read/write tuple similar to `useState`: `[params, setParams]` where `setParams` merges or replaces search params and triggers navigation. **`useLocation()`** exposes the full **`Location`** object—`pathname`, `search`, `hash`, and optional **`state`** you passed via `navigate('/x', { state })`—useful for **scroll restoration**, analytics, or remembering filter UI. **Interview tip:** say *why* you lift filters into the URL (shareable/bookmarkable) and how **`setSearchParams`** keeps history entries predictable.",
                [
                    S(
                        "overview",
                        "Three hooks, three layers of the URL",
                        "| Hook | Reads | Typical use |\n|------|-------|----------------|\n| `useParams` | Path placeholders (`:id`) | Detail pages, nested IDs |\n| `useSearchParams` | `?tab=audit&page=2` | Filters, tabs, pagination |\n| `useLocation` | pathname + search + hash + `state` | Analytics, transitions, scroll |\n\nPath params are part of the **route match**. Search params are **opaque to matching** unless you add multiple routes or loaders that interpret them.",
                    ),
                    S(
                        "after_code",
                        "Query params with useSearchParams",
                        "```tsx\nimport { useSearchParams } from 'react-router-dom';\n\nexport function Invoices() {\n  const [search, setSearch] = useSearchParams();\n  const page = Number(search.get('page') ?? '1');\n\n  return (\n    <footer>\n      <button type=\"button\" onClick={() => setSearch({ page: String(page + 1) })}>\n        Next\n      </button>\n    </footer>\n  );\n}\n```\n\n**Note:** `setSearch` **navigates**; it is not a local React state setter. Prefer **`{ replace: true }`** when you do not want every filter tweak in history (pass as second arg in supported versions / use `navigate` for full control).",
                    ),
                    S(
                        "tradeoffs",
                        "URL as state vs React state",
                        "**Put state in the URL** when users should **share links**, use the **back button**, or when SSR/loader code must read it.\n\n**Keep state in React** for ephemeral UI (open/closed popover) that should **not** pollute history.\n\n**Pitfall:** storing **large objects** in `location.state`—they are lost on refresh and clutter session history.",
                    ),
                    S(
                        "key_points",
                        "Key points",
                        "- **`useParams`** only sees **dynamic segments for that route level**—use relative patterns or splats (`*`) consciously.\n- **`useSearchParams`** returns **`URLSearchParams`**—use `.get`, `.has`, and `Object.fromEntries` for ergonomics.\n- **`useLocation().key`** can help with list/remount strategies—use rarely and comment why.\n- **Prefer `userEvent` + RTL** over reaching into router internals in tests—wrap with **`MemoryRouter`** / **`createMemoryRouter`**.",
                    ),
                    S(
                        "speakable_answer",
                        "How to answer this verbally",
                        "I use **`useParams`** when the route pattern includes **`:` segments**—that gives me the IDs I need for fetching.\n\nFor **filters or tabs**, I put them in the **query string** and read them with **`useSearchParams`**, because users can bookmark or share that URL.\n\n**`useLocation`** is my view of the **whole navigation entry**—pathname, query, hash, and any **`state`** we pushed programmatically—which is handy for **analytics** or **scroll restoration**.",
                    ),
                ],
            ),
        ],
    )

    p = BASE / "react-routing-forms/nested-routes-and-layouts/complete-qa.json"
    total += apply(
        p,
        [
            (
                0,
                "Nested routes model **parent/child URL segments** where the parent route’s `element` is a **layout shell** and the child’s `element` renders into the parent’s **`<Outlet />`**. React Router walks the **matched branch**; each level may supply its own `element`, `loader`, and `errorElement`. **Pathless layout routes** (`<Route element={<Shell/>}>` with children but no extra URL segment) share chrome across sections. **`useOutletContext()`** passes props from the layout to deeply nested children without prop drilling. **Index routes** (`index` prop) render when the parent path matches exactly—great for default dashboard panes.",
                [
                    S(
                        "overview",
                        "Outlet mental model",
                        "Think of `<Outlet />` as a **slot** whose contents are **whatever child route matched**. The parent owns chrome (nav, breadcrumbs); children swap inside the outlet as the URL changes. **Relative links** inside the subtree resolve against the **current route’s URL base**, which keeps deep links portable.",
                    ),
                    S(
                        "architecture_diagram",
                        "Nested match → layout + child",
                        "```mermaid\nflowchart TB\n  subgraph layout[\"Layout route /dashboard\"]\n    Nav[\"Sidebar + header\"]\n    O[\"<Outlet />\"]\n  end\n  C1[\"Child: users\"]\n  C2[\"Child: settings\"]\n  URL1[\"/dashboard/users\"]\n  URL2[\"/dashboard/settings\"]\n  URL1 --> layout\n  URL2 --> layout\n  O --> C1\n  O --> C2\n```",
                    ),
                    S(
                        "after_code",
                        "Layout + nested routes",
                        "```tsx\n<Route path=\"/dashboard\" element={<DashboardLayout />}>\n  <Route index element={<DashboardHome />} />\n  <Route path=\"users\" element={<Users />} />\n  <Route path=\"settings\" element={<Settings />} />\n</Route>\n\nfunction DashboardLayout() {\n  const user = useLoaderData() as { name: string };\n  return (\n    <AppShell user={user}>\n      <Outlet context={{ user }} />\n    </AppShell>\n  );\n}\n\nfunction Users() {\n  const { user } = useOutletContext<{ user: { name: string } }>();\n  return <h1>Users for {user.name}</h1>;\n}\n```",
                    ),
                    S(
                        "step",
                        "Index vs pathless layout — quick contrast",
                        "1. **Index route** (`index`): default child when the parent path matches **exactly**—`/dashboard` shows dashboard home.\n2. **Pathless layout**: a parent `<Route element>` **wraps children** without adding its own segment—useful for guards/providers.\n3. **Splats** (`path=\"*\"`) capture remainder segments—use for embedded CMS pages **carefully** (SEO + data loaders).",
                    ),
                    S(
                        "key_points",
                        "Key points",
                        "- **One `<Outlet />` per layout level**—parallel slots need multiple outlets or split layouts.\n- **`useOutletContext`** is the idiomatic **typed channel** from layout to leaf.\n- **Avoid duplicate `<Routes>`** that re-declare unrelated trees—breaks relative resolution and context.\n- **Loader data** on the layout route is ideal for **shared session** (current org, nav counts).",
                    ),
                    S(
                        "speakable_answer",
                        "How to answer this verbally",
                        "Nested routes let me share a **dashboard shell** while swapping the inner page.\n\nThe parent component renders **`<Outlet />`** where the child route should appear, and React Router injects the matched child there.\n\nIf children need shared objects without lots of props, I expose them via **`useOutletContext`** from the layout.",
                    ),
                ],
            ),
        ],
    )

    p = BASE / "react-routing-forms/route-guards-and-loaders/complete-qa.json"
    total += apply(
        p,
        [
            (
                0,
                "You implement **protected routes** by **not rendering** the sensitive screen until auth is known—either with a **wrapper component** (`<RequireAuth><Page/></RequireAuth>`) that redirects (`<Navigate to=\"/login\" replace state={{ from: location }} />`) or, preferably, with a **data-router `loader`** that runs **before** the route commits and can **`throw redirect('/login')`** early. **Element guards** are easy but can **flash** content while a client-only check runs; **loaders** align with SSR/remix-style patterns and pair well with **`Await`** / **`defer`** for slow session endpoints.",
                [
                    S(
                        "overview",
                        "Two patterns interviewers compare",
                        "| Pattern | Pros | Cons |\n|---------|------|------|\n| **Wrapper (`RequireAuth`)** | Simple, works with `BrowserRouter` | Easy to **flash** protected UI if check is async |\n| **Loader guard** | Redirect **before paint** | Requires data router setup |\n\nMost strong answers **acknowledge both** and pick based on **auth latency** and **whether SSR** exists.",
                    ),
                    S(
                        "step",
                        "Wrapper guard — fast verbal walkthrough",
                        "1. Read **session** from memory, cookie, or context.\n2. If missing, render **`<Navigate>`** to login with **`state.from`** capturing `location.pathname`.\n3. After login, `navigate(state.from ?? '/', { replace: true })`.\n4. Optionally show a **spinner** while hydrating session on first load.\n\n**Testing:** wrap with **`MemoryRouter`** initial entries and stub auth module.",
                    ),
                    S(
                        "after_code",
                        "Loader guard sketch (data router)",
                        "```tsx\nasync function rootLoader() {\n  const session = await getSession(); // fetch cookie / API\n  if (!session) throw redirect('/login');\n  return session;\n}\n\nconst router = createBrowserRouter([\n  { path: '/', loader: rootLoader, element: <Shell /> },\n]);\n```\n\n**Why it wins in interviews:** you explicitly say the redirect happens **before** the protected `element` renders, avoiding **content leakage**.",
                    ),
                    S(
                        "tradeoffs",
                        "Where auth logic should live",
                        "**Client loaders** still assume a hostile client—**always re-authorize on the server** for mutations.\n\nLoaders are great for **route gating** and **initial data**; **short-lived UI permissions** can remain component-local.\n\nAvoid duplicating **three different** auth sources (context + loader + axios interceptor) without a **single session module**.",
                    ),
                    S(
                        "key_points",
                        "Key points",
                        "- **Remember intended URL** with `location.state` or a query param like `?next=`.\n- **`<Navigate replace>`** avoids stacking history entries.\n- **Throwing `redirect()`** inside loaders is idiomatic in RR 6.4+.\n- **Role-based routes** compose the same patterns—keep **role checks** next to **data loaders** when possible.",
                    ),
                    S(
                        "speakable_answer",
                        "How to answer this verbally",
                        "For protected routes I first decide if I can accept a **short loading state**.\n\nIf I’m on a **data router**, I put an **auth check in a parent `loader`** and **`throw redirect`** to login so we never render the dashboard shell with no session.\n\nIf I’m on a simpler `BrowserRouter` setup, I wrap private pages in a **`RequireAuth`** component that renders a **`Navigate`** when there’s no user, and I store **`state.from`** so post-login navigation returns them to the right page.",
                    ),
                ],
            ),
            (
                1,
                "**`loader`** functions run when a route is **entered or revalidated**; they return serializable data (or `defer` promises) consumed via **`useLoaderData`**. **`action`** functions run on **non-GET navigations**—typically **`<Form method=\"post\">`** from `react-router-dom`—and are the right place for mutations that should participate in the router’s **revalidation** story (POST → invalidate loaders). **`useFetcher`** enables **background** mutations without changing the URL. Compared to `useEffect` fetching, loaders **parallelize per route**, integrate with **errors** (`errorElement`), and reduce **waterfalls**.",
                [
                    S(
                        "overview",
                        "Loaders vs effects — the interview frame",
                        "**`useEffect` + `fetch`:** runs **after** paint; easy waterfalls; harder to coordinate with pending UI.\n\n**`loader`:** runs as part of **navigation**; Router can **await** before committing; exposes **`useNavigation`** state for global pending bars.\n\n**`action`:** colocates **writes** with routes; on success call **`redirect`** or rely on **automatic revalidation** of loaders.",
                    ),
                    S(
                        "architecture_diagram",
                        "POST action → revalidate loaders",
                        "```mermaid\nsequenceDiagram\n  participant U as User\n  participant F as <Form>\n  participant A as action()\n  participant L as loaders\n  participant V as View\n  U->>F: submit POST\n  F->>A: invoke route action\n  A-->>L: revalidate matching loaders\n  L-->>V: new useLoaderData()\n```",
                    ),
                    S(
                        "after_code",
                        "Minimal loader + action",
                        "```tsx\nimport { Form, useLoaderData } from 'react-router-dom';\n\nexport async function loader() {\n  const tasks = await api.tasks.list();\n  return { tasks };\n}\n\nexport async function action({ request }: ActionFunctionArgs) {\n  const fd = await request.formData();\n  await api.tasks.create({ title: String(fd.get('title')) });\n  return redirect('.'); // reload current route data\n}\n\nexport function Tasks() {\n  const { tasks } = useLoaderData() as { tasks: Task[] };\n  return (\n    <>\n      <ul>{tasks.map((t) => <li key={t.id}>{t.title}</li>)}</ul>\n      <Form method=\"post\">\n        <input name=\"title\" />\n        <button type=\"submit\">Add</button>\n      </Form>\n    </>\n  );\n}\n```",
                    ),
                    S(
                        "tradeoffs",
                        "Next.js App Router comparison (one sentence each)",
                        "**RR loaders/actions** solve **SPA data coupling** without adopting a full **React Server Components** model—loaders still typically hit **your JSON APIs**.\n\n**Next App Router** moves more data work to **server components** and **cache tags**—different deployment constraints.\n\nIn an interview, emphasize **similarity of goals** (colocate data with route) and **difference of runtime** (browser vs edge server).",
                    ),
                    S(
                        "key_points",
                        "Key points",
                        "- **`defer`** streams slow loader fields with `<Await>` + `<Suspense>`.\n- **`shouldRevalidate`** gates unnecessary loader churn.\n- **Errors** bubble to **`errorElement`**—pair with typed error boundaries.\n- **`useNavigation().state`** is `'loading' | 'submitting' | 'idle'`—great for disabling buttons.",
                    ),
                    S(
                        "speakable_answer",
                        "How to answer this verbally",
                        "A **loader** is a function React Router calls when you navigate to a route to **prepare data** before rendering that route’s component.\n\nAn **action** handles **form posts** or other mutations, and when it finishes Router can **re-run loaders** so the UI stays consistent.\n\nCompared to putting fetches in **`useEffect`**, loaders give me **better timing**, fewer **request waterfalls**, and a cleaner story for **errors and redirects** tied to navigation.",
                    ),
                ],
            ),
        ],
    )

    # forms-controlled, rhf, formik, zod, file-upload — continued in part 2 via exec? Keep in same file.
    print("part1", total)


if __name__ == "__main__":
    main()
