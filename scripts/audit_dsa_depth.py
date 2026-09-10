#!/usr/bin/env python3
"""Depth-based DSA quality audit + master-index cross-check."""
import json, os, glob, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "dsa"))

# index problems
problems = []
slug_to_path = {}
for path in glob.glob(os.path.join(ROOT, "*", "*.json")):
    rel = os.path.relpath(path, ROOT)
    top = rel.split(os.sep)[0]
    if top in ("sheets", "learn", "pattern"):
        continue
    if os.path.basename(path).startswith("_"):
        continue
    try:
        d = json.load(open(path))
    except Exception as e:
        print("PARSE ERROR", rel, e); continue
    slug = d.get("slug") or os.path.splitext(os.path.basename(path))[0]
    problems.append((slug, rel, d))
    slug_to_path[slug] = rel

# ---- master _index.json cross-check ----
print("=" * 70)
print("MASTER _index.json CROSS-CHECK")
print("=" * 70)
idx = json.load(open(os.path.join(ROOT, "_index.json")))
idx_problems = idx.get("problems", [])
idx_slugs = set()
for p in idx_problems:
    s = p.get("slug") if isinstance(p, dict) else p
    if s:
        idx_slugs.add(s)
disk_slugs = set(slug_to_path)
print(f"problems in _index.json : {len(idx_slugs)}")
print(f"problem files on disk   : {len(disk_slugs)}")
in_index_no_file = sorted(idx_slugs - disk_slugs)
on_disk_not_index = sorted(disk_slugs - idx_slugs)
print(f"In index but NO file ({len(in_index_no_file)}): {', '.join(in_index_no_file) or 'none'}")
print(f"On disk but NOT in index ({len(on_disk_not_index)}): {', '.join(on_disk_not_index) or 'none'}")

modules = idx.get("modules", [])
print(f"modules in index: {len(modules)}")

# ---- depth grading ----
print()
print("=" * 70)
print("DEPTH QUALITY GRADING (content substance, not just presence)")
print("=" * 70)

def depth_grade(d):
    issues = []
    # narrative substance
    ps = d.get("problemStatement", "") or ""
    if len(ps) < 120: issues.append("thin:problemStatement")
    da = d.get("directAnswer", "") or ""
    if len(da) < 120: issues.append("thin:directAnswer")
    if len(d.get("examples", []) or []) < 2: issues.append("few:examples(<2)")
    if len(d.get("constraints", []) or []) < 2: issues.append("few:constraints(<2)")
    if len(d.get("clarifyingQuestions", []) or []) < 2: issues.append("few:clarifyingQuestions(<2)")
    rem = d.get("remember") or {}
    if not (rem.get("rules") and len(rem.get("rules", [])) >= 2): issues.append("thin:remember.rules")
    if not d.get("interviewerIntent"): issues.append("missing:interviewerIntent")

    approaches = d.get("approaches", []) or []
    if not approaches:
        issues.append("missing:approaches")
    else:
        # at least one approach must have substantial explanation
        max_expl = max((len(a.get("explanation", "") or "") for a in approaches), default=0)
        if max_expl < 300: issues.append("thin:approach.explanation(<300)")
        has_java = any(a.get("code", {}).get("java") for a in approaches)
        has_py = any(a.get("code", {}).get("python") for a in approaches)
        if not has_java: issues.append("missing:java")
        if not has_py: issues.append("missing:python")
        if not any(a.get("lineByLine") for a in approaches): issues.append("missing:lineByLine")
        if not any(a.get("dryRun") for a in approaches): issues.append("missing:dryRun")
        if not all(a.get("complexity") for a in approaches): issues.append("missing:complexity")
    if not d.get("diagrams") and not any(a.get("diagrams") for a in approaches):
        issues.append("missing:diagrams")
    if not d.get("commonMistakesDetailed"): issues.append("missing:commonMistakesDetailed")
    if not d.get("seo"): issues.append("missing:seo")
    # severity: weighted
    weight = {"missing": 3, "thin": 2, "few": 1}
    sev = sum(weight.get(i.split(":")[0], 1) for i in issues)
    return sev, issues

rows = []
for slug, rel, d in problems:
    sev, issues = depth_grade(d)
    rows.append((sev, slug, rel, issues))
rows.sort(reverse=True)

clean = [r for r in rows if r[0] == 0]
minor = [r for r in rows if 1 <= r[0] <= 3]
moderate = [r for r in rows if 4 <= r[0] <= 8]
major = [r for r in rows if r[0] > 8]
print(f"\nTotal: {len(rows)}")
print(f"  CLEAN (0 issues)        : {len(clean)}")
print(f"  MINOR (sev 1-3)         : {len(minor)}")
print(f"  MODERATE (sev 4-8)      : {len(moderate)}")
print(f"  MAJOR (sev >8)          : {len(major)}")
print(f"\n>>> NEEDS IMPROVEMENT (any issue): {len(rows)-len(clean)}")

ic = collections.Counter()
for _, _, _, issues in rows:
    ic.update(issues)
print("\nMost common depth gaps:")
for issue, n in ic.most_common(25):
    print(f"  {n:4d}  {issue}")

print("\n--- Top 50 problems needing the most work ---")
for sev, slug, rel, issues in rows[:50]:
    if sev == 0: break
    print(f"  sev={sev:2d}  {rel:48s} {', '.join(issues[:7])}")

# per-category
print("\n--- Needs-improvement count by category ---")
cat = collections.defaultdict(lambda: [0, 0])
for sev, slug, rel, issues in rows:
    c = rel.split(os.sep)[0]
    cat[c][0] += 1
    if sev > 0: cat[c][1] += 1
for c in sorted(cat):
    tot, bad = cat[c]
    print(f"  {c:18s} n={tot:3d}  needs_work={bad}")
