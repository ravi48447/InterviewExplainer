import json, glob, os, sys

def load(path):
    with open(path) as f:
        d = json.load(f)
    if isinstance(d, list):
        return d, "list"
    return d.get("questions", []), "dict"

for target in sys.argv[1:]:
    files = sorted(glob.glob(os.path.join(target, "**", "complete-qa.json"), recursive=True))
    for fpath in files:
        qs, shape = load(fpath)
        print("="*100)
        print(f"FILE {fpath}  shape={shape}  nq={len(qs)}")
        for i, q in enumerate(qs):
            sec = q.get("answer", {}).get("sections", []) if isinstance(q.get("answer"), dict) else []
            types = [s.get("type") for s in sec if isinstance(s, dict)]
            kp_arr = any(isinstance(s.get("content"), (list, dict)) for s in sec if isinstance(s, dict))
            sv2 = "sv2" if q.get("speakable_v2") else "no-sv2"
            imp = "imp" if "importance" in q else "no-imp"
            print(f"  [{i}] id={q.get('id')} slug={q.get('slug')} lt={q.get('layout_type')} {imp} {sv2} order={q.get('order')}")
            print(f"      Q: {q.get('question')}")
            print(f"      types: {types}  nonstr_content={kp_arr}")
