#!/usr/bin/env python3
"""Audit DSA content: sheet coverage + per-problem quality grading.

Gold-standard reference is content/dsa/arrays/two-sum.json.
Run from repo root: python3 scripts/audit_dsa.py
"""
import json, os, glob, collections

ROOT = os.path.join(os.path.dirname(__file__), "..", "content", "dsa")
ROOT = os.path.abspath(ROOT)

# ---- 1. Index every problem file by slug -------------------------------
slug_to_path = {}
dup_slugs = collections.defaultdict(list)
problem_files = []
for path in glob.glob(os.path.join(ROOT, "*", "*.json")):
    # skip sheet/pattern/learn index files
    rel = os.path.relpath(path, ROOT)
    top = rel.split(os.sep)[0]
    if top in ("sheets", "learn", "pattern"):
        continue
    base = os.path.basename(path)
    if base.startswith("_"):
        continue
    try:
        d = json.load(open(path))
    except Exception as e:
        print(f"  !! JSON parse error: {rel}: {e}")
        continue
    slug = d.get("slug") or os.path.splitext(base)[0]
    problem_files.append((slug, path, d))
    if slug in slug_to_path:
        dup_slugs[slug].append(path)
    slug_to_path[slug] = path

print(f"Total problem JSON files indexed: {len(problem_files)}")
if dup_slugs:
    print(f"Duplicate slugs: {dict((k, len(v)+1) for k,v in dup_slugs.items())}")
print()

# ---- 2. Sheet coverage --------------------------------------------------
print("=" * 70)
print("SHEET COVERAGE (referenced problemSlugs that have a content file)")
print("=" * 70)
all_referenced = set()
sheet_missing = {}
for sheet_path in sorted(glob.glob(os.path.join(ROOT, "sheets", "*", "index.json"))):
    sheet = os.path.basename(os.path.dirname(sheet_path))
    s = json.load(open(sheet_path))
    declared = s.get("totalProblems")
    slugs = []
    for g in s.get("groups", []):
        slugs.extend(g.get("problemSlugs", []))
    uniq = list(dict.fromkeys(slugs))
    found = [x for x in uniq if x in slug_to_path]
    missing = [x for x in uniq if x not in slug_to_path]
    all_referenced.update(uniq)
    sheet_missing[sheet] = missing
    pct = (len(found) / len(uniq) * 100) if uniq else 0
    print(f"\n{sheet:18s} declared={declared}  referenced={len(uniq)}  "
          f"found={len(found)}  missing={len(missing)}  coverage={pct:.0f}%")
    if missing:
        print(f"    MISSING ({len(missing)}): {', '.join(missing)}")

# problems on disk not referenced by ANY sheet
orphans = sorted(s for s, _, _ in problem_files if s not in all_referenced)
print(f"\nProblems on disk NOT referenced by any sheet: {len(orphans)}")

# ---- 3. Quality grading -------------------------------------------------
print()
print("=" * 70)
print("QUALITY GRADING vs gold standard (two-sum schema)")
print("=" * 70)

def grade(d):
    """Return (score 0-100, list of missing/weak attributes)."""
    issues = []
    score = 0
    # core narrative fields (40)
    for f, pts in [("problemStatement", 6), ("directAnswer", 5),
                   ("understanding", 4), ("constraints", 4),
                   ("examples", 5), ("clarifyingQuestions", 4),
                   ("interviewerIntent", 4), ("remember", 4),
                   ("commonMistakes", 4)]:
        v = d.get(f)
        ok = bool(v) and (len(v) > 0 if isinstance(v, (list, dict, str)) else True)
        if ok:
            score += pts
        else:
            issues.append(f"missing:{f}")
    # approaches with java+python code + walkthrough (40)
    approaches = d.get("approaches", [])
    if not approaches:
        issues.append("missing:approaches")
    else:
        score += 6
        has_java = any(a.get("code", {}).get("java") for a in approaches)
        has_py = any(a.get("code", {}).get("python") for a in approaches)
        has_lbl = any(a.get("lineByLine") for a in approaches)
        has_dry = any(a.get("dryRun") for a in approaches)
        has_complexity = all(a.get("complexity") for a in approaches)
        has_optimal = len(approaches) >= 2
        for cond, pts, name in [
            (has_java, 8, "java-code"),
            (has_py, 8, "python-code"),
            (has_lbl, 6, "lineByLine"),
            (has_dry, 5, "dryRun"),
            (has_complexity, 4, "complexity"),
            (has_optimal, 3, "multiple-approaches"),
        ]:
            if cond:
                score += pts
            else:
                issues.append(f"weak:{name}")
    # richness extras (20)
    for f, pts in [("diagrams", 5), ("commonMistakesDetailed", 5),
                   ("followupVariations", 4), ("seo", 3), ("patterns", 3)]:
        v = d.get(f)
        if v:
            score += pts
        else:
            issues.append(f"missing:{f}")
    return score, issues

graded = []
for slug, path, d in problem_files:
    score, issues = grade(d)
    graded.append((score, slug, os.path.relpath(path, ROOT), issues))

graded.sort()

# Buckets
excellent = [g for g in graded if g[0] >= 90]
good = [g for g in graded if 75 <= g[0] < 90]
needs = [g for g in graded if 50 <= g[0] < 75]
poor = [g for g in graded if g[0] < 50]

print(f"\nTotal graded: {len(graded)}")
print(f"  EXCELLENT (>=90): {len(excellent)}")
print(f"  GOOD      (75-89): {len(good)}")
print(f"  NEEDS WORK (50-74): {len(needs)}")
print(f"  POOR      (<50):  {len(poor)}")
print(f"\n>>> Problems needing improvement (score < 75): {len(needs)+len(poor)}")

# Most common issues
issue_counter = collections.Counter()
for _, _, _, issues in graded:
    issue_counter.update(issues)
print("\nMost common quality gaps across ALL problems:")
for issue, n in issue_counter.most_common(20):
    print(f"  {n:4d}  {issue}")

print("\n--- Worst 40 problems (lowest score) ---")
for score, slug, rel, issues in graded[:40]:
    print(f"  {score:3d}  {rel:45s} {', '.join(issues[:6])}")

# Per-category quality
print("\n--- Average quality by category ---")
cat_scores = collections.defaultdict(list)
for score, slug, rel, issues in graded:
    cat = rel.split(os.sep)[0]
    cat_scores[cat].append(score)
for cat in sorted(cat_scores):
    arr = cat_scores[cat]
    avg = sum(arr) / len(arr)
    below = sum(1 for x in arr if x < 75)
    print(f"  {cat:18s} n={len(arr):3d}  avg={avg:5.1f}  need_work={below}")
