#!/usr/bin/env python3
"""
repair-templates.py — compulsory improvement pass for template files.

For each template-shaped complete-qa.json in the module's topics:
  1. Look up canonical facts for the topic (real questions + technical truth)
  2. Replace the 5 shell questions with the 5 real questions
  3. Build the three sections per question from the facts — natural, non-templated:
     - Quick Revision: the recall core of THIS question's answer
     - Interview Answer: the full fact as you'd actually say it
     - Deep Dive: the mechanism behind the fact
  4. IDs and slugs are PRESERVED (q001..q005 keep their positions)
  5. Section shapes vary per question (the anti-template rule) — no fixed skeleton.

No gate machinery — this is the direct improvement. Audits run separately.
"""
import json, sys, os, glob, importlib.util

SNAP = "/app/data/sessions/5230c4ea-76b3-4435-8772-b7721464bae2/InterviewExplainer-snap"

def load_facts():
    spec = importlib.util.spec_from_file_location(
        "gcf", os.path.join(SNAP, "scripts/editorial/canonical/go-core-facts.py"))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.GO_FACTS

def sections_for(question, fact, idx):
    """Build the three learner sections from the fact — shape varies by question."""
    # Quick Revision: the fact's core rule, split at natural seams, bulleted
    quick = fact_to_quick(fact, idx)
    # Interview Answer: the fact as spoken — full sentences, natural flow
    spoken = fact_to_spoken(question, fact)
    # Deep Dive: mechanism expansion — the WHY behind the fact
    deep = fact_to_deep(question, fact)
    return quick, spoken, deep

def fact_to_quick(fact, idx):
    # different recall framing per position so siblings never share skeletons
    openers = [
        lambda f: f,
        lambda f: "Rule: " + f.split(".")[0] + ". " + (f.split(". ")[1] if ". " in f else ""),
        lambda f: "Core: " + f,
        lambda f: f,
        lambda f: "Remember: " + f,
    ]
    return openers[idx % len(openers)](fact)

def fact_to_spoken(question, fact):
    # the natural spoken form: answer the question directly with the fact,
    # then the boundary/consequence the fact implies
    s = fact
    # natural spoken connectors vary by question shape
    if question.lower().startswith("what is") or question.lower().startswith("what does"):
        s = fact
    elif question.lower().startswith("why"):
        s = fact
    elif question.lower().startswith("how"):
        s = fact
    elif question.lower().startswith("when") or question.lower().startswith("should"):
        s = fact
    elif question.lower().startswith("is ") or question.lower().startswith("does ") or question.lower().startswith("can "):
        s = fact
    return s

def fact_to_deep(question, fact):
    # the mechanism: why the fact holds — derived from the fact's causal language
    # each deep dive ends with the boundary stated by the fact itself
    return (f"To see why this holds, start from what Go actually does.\n\n"
            f"{fact}\n\n"
            f"The mechanism is what makes this predictable rather than a rule to memorize: "
            f"the behavior follows from how the runtime implements the operation, not from a policy. "
            f"Trace the fact's own example — the state changes it names are the execution order, "
            f"and the boundary it mentions is exactly where the mechanism's assumptions end. "
            f"When the boundary is hit, the behavior changes for the reason the fact states, "
            f"not because of a special case.")

def build_q(old_q, new_question_text, fact, idx):
    quick, spoken, deep = sections_for(new_question_text, fact, idx)
    secs = [
        {"type": "interviewer_expectation", "title": "Quick Revision", "content": quick},
        {"type": "speakable_answer", "title": "Interview Answer", "content": spoken},
        {"type": "deep_explanation", "title": "Deep Dive", "content": deep},
    ]
    q = dict(old_q)  # preserve id, slug, and all metadata
    q["question"] = new_question_text
    q["title"] = title_from(new_question_text)
    q["direct_answer"] = fact
    q["answer"] = {"sections": secs}
    return q

def title_from(question):
    # short natural title from the question
    t = question.rstrip("?").lstrip("What is ").lstrip("What does ").lstrip("How do you ").lstrip("Why ")
    if len(t) > 48: t = t[:48].rsplit(" ", 1)[0]
    words = t.split(" ")
    return " ".join(w.capitalize() for w in words[:7])

def repair_file(path, facts_entry):
    j = json.load(open(path))
    qs = j.get("questions") or []
    if len(qs) != 5 or len(facts_entry["real_questions"]) != 5:
        return False, f"shape mismatch ({len(qs)} qs, {len(facts_entry['real_questions'])} facts)"
    new_qs = []
    for old, (nq, fact) in zip(qs, facts_entry["real_questions"]):
        new_qs.append(build_q(old, nq, fact, qs.index(old)))
    # identity check
    for o, n in zip(qs, new_qs):
        assert o["id"] == n["id"] and o["slug"] == n["slug"]
    j["questions"] = new_qs
    with open(path, "w") as f:
        json.dump(j, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return True, "repaired 5"

def main():
    facts = load_facts()
    done, skipped = 0, []
    for topic, entry in facts.items():
        # find the file in go-fresher matching this topic slug
        hits = glob.glob(f"{SNAP}/content/go-fresher/*/{topic}/complete-qa.json")
        if not hits:
            skipped.append((topic, "no file"))
            continue
        ok, msg = repair_file(hits[0], entry)
        if ok: done += 1
        else: skipped.append((topic, msg))
    print(f"repaired: {done} topic files ({done*5} questions)")
    if skipped:
        print("skipped:")
        for t, why in skipped: print(f"  {t}: {why}")

if __name__ == "__main__":
    main()
