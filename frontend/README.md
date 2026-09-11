# ⚠️ This directory is a STALE app — do not run it

You are looking at the **old pre-rebuild frontend** kept for the
`intex-v2` Cloudflare-deploy experiments. It contains **none** of the
2026-09 platform work:

- ❌ no `MockInterviewStudioV2` (the 3-panel interview home)
- ❌ no company-loop discovery page, popups, or persistence
- ❌ no `InterviewRoom` / voice controller / STAR workspaces
- ❌ no new brand logo, product sidebar shell, or design-token pass

## The real app is the **repo root**

```bash
cd ..          # back to the repository root
npm install
npm run dev -- -p 3015
```

The root `app/`, `components/`, and `lib/` directories are the live
product that `codex/home-learning-depth` develops. This `frontend/`
tree only exists because early Cloudflare packaging work (branch
`intex-v2`) needed a nested layout; it is **not** referenced by
anything at the root.

If you got here by muscle memory (`cd frontend && npm run dev`), the
guarded scripts will now stop you with an explanation instead of
booting a broken-looking UI.
