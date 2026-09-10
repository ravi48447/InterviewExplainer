#!/usr/bin/env python3
"""
Fix speakable_v2 bullet beats that have only 1 item (violates PayloadBullets minItems:2).
Splits single-item strings on '; ' to produce multiple items.
For items that can't be cleanly split, generates 2-item array by sentence splitting.
"""
import json, glob, re, sys

MIN_ITEM_LEN = 10  # chars — don't create tiny fragments


def split_item(text: str) -> list[str]:
    """Split a single long string into 2+ meaningful items."""
    # Strategy 1: split on semicolons
    parts = [p.strip() for p in text.split(';') if p.strip()]
    if len(parts) >= 2 and all(len(p) >= MIN_ITEM_LEN for p in parts):
        return parts

    # Strategy 2: split on ' — ' dash separator
    parts = [p.strip() for p in re.split(r'\s+—\s+', text) if p.strip()]
    if len(parts) >= 2 and all(len(p) >= MIN_ITEM_LEN for p in parts):
        return parts[:4]  # max 4 items

    # Strategy 3: split on '. ' then capital letter (sentence split)
    sentences = re.split(r'\.\s+(?=[A-Z])', text)
    if len(sentences) >= 2:
        clean = [s.strip().rstrip('.') for s in sentences if len(s.strip()) >= MIN_ITEM_LEN]
        if len(clean) >= 2:
            return clean[:4]

    # Strategy 4: split on newlines (some items use \n)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if len(lines) >= 2 and all(len(l) >= MIN_ITEM_LEN for l in lines):
        return lines[:4]

    # Strategy 5: if still can't split, keep as single (will remain flagged but not crash)
    return [text]


def patch_file(fpath: str) -> tuple[int, int]:
    """Returns (beats_patched, skipped)."""
    with open(fpath) as f:
        data = json.load(f)

    patched = 0
    skipped = 0

    for q in (data if isinstance(data, list) else data.get("questions", [])):
        sv = q.get("speakable_v2")
        if not sv or not sv.get("archetype"):
            skipped += 1
            continue

        changed = False
        for beat in sv.get("beats", []):
            if beat.get("layout") == "bullets":
                items = beat.get("items", [])
                if isinstance(items, list) and len(items) == 1:
                    new_items = split_item(items[0])
                    if len(new_items) >= 2:
                        beat["items"] = new_items
                        changed = True
                        patched += 1
                    else:
                        skipped += 1

    if patched > 0:
        with open(fpath, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")

    return patched, skipped


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "content/java-backend-intermediate"
    files = glob.glob(f"{target}/**/complete-qa.json", recursive=True)
    total_patched = 0
    total_skipped = 0
    files_changed = 0
    for fpath in sorted(files):
        p, s = patch_file(fpath)
        total_patched += p
        total_skipped += s
        if p > 0:
            files_changed += 1
            print(f"  patched {p:3d} beats  {fpath}")

    print(f"\nDone: {total_patched} bullet beats fixed across {files_changed} files ({total_skipped} skipped)")


if __name__ == "__main__":
    main()
