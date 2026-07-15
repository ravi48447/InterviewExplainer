#!/usr/bin/env python3
"""
Post-process JBF complete-qa.json files to break wall-of-text sections
into structured content (bullet lists, paragraph breaks).

No API calls — purely regex/string transformations.

Transforms:
  common_mistakes:  "**A**: desc **B**: desc" → "- **A**: desc\n- **B**: desc"
  when_to_use:      "**Scenario N**: desc **X**: desc" → paragraphs or bullets
  overview:         Break before "WHY", "HOW", "WHEN", "NOTE" sentence openers
"""

import json
import glob
import re
import sys
import os


# ---------------------------------------------------------------------------
# Transformers
# ---------------------------------------------------------------------------

def restructure_common_mistakes(text: str) -> str:
    """
    Input:  "**MistakeName**: explanation text. **AnotherMistake**: more text."
    Output: "- **MistakeName**: explanation text.\n- **AnotherMistake**: more text."
    """
    if not text or '\n' in text:
        return text  # already structured

    # Split on pattern: space then ** (new bold term starting a mistake)
    # We want to split just before "  **" or ". **" when there's a : after the bold
    # Pattern: look for " **SomeWords**: " or ". **SomeWords**: "
    parts = re.split(r'(?<=[.!]) (?=\*\*[A-Z])', text)
    if len(parts) <= 1:
        # Try splitting on " **" where the bold looks like a title (>2 words capitalized or single word)
        parts = re.split(r' (?=\*\*[A-Z][a-zA-Z ]{2,30}\*\*:)', text)

    if len(parts) > 1:
        return '\n'.join(f'- {p.strip()}' for p in parts if p.strip())
    return text


def restructure_when_to_use(text: str) -> str:
    """
    Input:  "Use X when... **Scenario 1**: text **Scenario 2**: text"
    Output: Paragraphs split at **Scenario/Use/Step markers
    """
    if not text or '\n' in text:
        return text

    # Split on "**Scenario N**:" or "**Use X**:" or "**Step N**:" patterns
    # that start mid-sentence
    parts = re.split(r' (?=\*\*(?:Scenario|Step|Case|Situation|Option|Rule|Tip)\b)', text)
    if len(parts) > 1:
        return '\n\n'.join(p.strip() for p in parts if p.strip())

    # Split on any "**bold term**: " that appears after a period/comma mid-text
    # This catches "**Common scenario one**: text **Another**: text"
    parts = re.split(r'(?<=[.!,]) (?=\*\*[A-Za-z][^*]{2,40}\*\*:)', text)
    if len(parts) > 1:
        return '\n\n'.join(p.strip() for p in parts if p.strip())

    # Split on capital sentence starters after periods
    parts = re.split(r'\. (?=Use\b|Avoid\b|Apply\b|Choose\b|Prefer\b)', text)
    if len(parts) > 1:
        return '.\n\n'.join(p.strip() for p in parts if p.strip())

    return text


def restructure_overview(text: str) -> str:
    """
    Break walls of text in overview sections by inserting paragraph breaks
    before conceptual markers like WHY, HOW, WHEN, NOTE, Think of.
    """
    if not text or text.count('\n') >= 2:
        return text  # already has structure

    # Add paragraph break before common section openers that appear mid-text
    markers = [
        r'(?<=[.!]) (WHY (?:it|this|that)\b)',
        r'(?<=[.!]) (HOW (?:it|this|that)\b)',
        r'(?<=[.!]) (Think of (?:it|this)\b)',
        r'(?<=[.!]) (NOTE:)',
        r'(?<=[.!]) (In (?:practice|production|interviews|Java|Spring)\b)',
        r'(?<=[.!]) (The (?:key|main|core|real|practical|important)\b)',
        r'(?<=[.!]) (For (?:freshers?|interviews?|beginners?)\b)',
        r'(?<=[.!]) (Internally\b)',
        r'(?<=[.!]) (Under (?:the hood)\b)',
    ]

    result = text
    for marker in markers:
        result = re.sub(marker, r'\n\n\1', result)

    # Also split on "WHY:" "HOW:" etc. that start mid-text without space before
    result = re.sub(r'(?<=[a-z,]) (WHY:|HOW:|WHEN:|KEY INSIGHT:|REMEMBER:)', r'\n\n**\1**', result)

    # For still-unbroken long overviews: split at conceptual shift sentences
    # Pattern: after a period, a sentence that introduces a new facet of the topic
    if result.count('\n') < 2 and len(result) > 500:
        # Split on sentences that start with "This", "It", "When", "Both", etc.
        # after a period — these typically introduce a new conceptual angle
        result = re.sub(
            r'\. (This (?:means|allows|ensures|makes|keeps|enables|creates|prevents|gives)\b)',
            r'.\n\n\1', result
        )
        result = re.sub(
            r'\. (Without (?:this|it|a|the|proper|explicit)\b)',
            r'.\n\n\1', result
        )
        result = re.sub(
            r'\. (The (?:key|main|core|real|goal|difference|idea|result|benefit|problem|trick)\b)',
            r'.\n\n\1', result
        )
        result = re.sub(
            r'\. (In (?:practice|Java|Spring|interviews|a real)\b)',
            r'.\n\n\1', result
        )
        result = re.sub(
            r'\. (Under the hood\b)',
            r'.\n\n\1', result
        )

    # Last resort: if still one paragraph and > 600 chars, add break at 3rd sentence
    if result.count('\n') < 2 and len(result) > 600:
        # Find position of 3rd period followed by space and capital letter
        positions = [m.start() for m in re.finditer(r'\. [A-Z]', result)]
        if len(positions) >= 2:
            break_pos = positions[1] + 1  # after the 2nd sentence
            result = result[:break_pos] + '\n\n' + result[break_pos:].lstrip()

    return result


def restructure_section(section_type: str, content) -> object:
    """Apply the appropriate restructurer for a section type."""
    if not isinstance(content, str):
        return content  # lists/dicts are already structured

    if section_type == 'common_mistakes':
        return restructure_common_mistakes(content)
    elif section_type == 'when_to_use':
        return restructure_when_to_use(content)
    elif section_type in ('overview', 'explanation', 'deep_explanation'):
        return restructure_overview(content)
    return content


# ---------------------------------------------------------------------------
# File processor
# ---------------------------------------------------------------------------

def process_file(fpath: str) -> tuple[int, int]:
    """Returns (questions_changed, total_questions)."""
    with open(fpath) as f:
        data = json.load(f)

    is_list = isinstance(data, list)
    questions = data if is_list else data.get('questions', [])

    changed = 0
    for q in questions:
        answer = q.get('answer', {})
        sections = answer.get('sections', [])
        q_changed = False
        for s in sections:
            old = s.get('content', '')
            new = restructure_section(s.get('type', ''), old)
            if new != old:
                s['content'] = new
                q_changed = True
        if q_changed:
            changed += 1

    if changed > 0:
        out = data if is_list else data
        with open(fpath, 'w') as f:
            json.dump(out, f, indent=2, ensure_ascii=False)
            f.write('\n')

    return changed, len(questions)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    domain = sys.argv[1] if len(sys.argv) > 1 else 'content/java-backend-fresher'
    files = sorted(glob.glob(os.path.join(domain, '**/complete-qa.json'), recursive=True))

    total_files = len(files)
    total_q_changed = 0
    total_q = 0
    files_changed = 0

    for fpath in files:
        q_changed, q_total = process_file(fpath)
        total_q_changed += q_changed
        total_q += q_total
        if q_changed:
            files_changed += 1

    print(f'Done: {total_q_changed}/{total_q} questions restructured across {files_changed}/{total_files} files')


if __name__ == '__main__':
    main()
