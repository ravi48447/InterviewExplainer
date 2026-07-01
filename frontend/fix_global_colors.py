import os
import re

directory = 'c:/Users/india/OneDrive - galgotiasuniversity.edu.in/Desktop/interview explainer/frontend'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Find all className="something" or className={`something`} or just strings with classes
    # We will just do a global replace carefully.
    
    # 1. bg-{color}-50 -> bg-{color}-50 dark:bg-{color}-950/30
    def repl_bg(match):
        color = match.group(1)
        # if already has dark:bg- skip
        return f"bg-{color}-50 dark:bg-{color}-950/30"

    # only replace if not followed by / (like bg-blue-50/50) and not already followed by dark:bg
    content = re.sub(r'\bbg-([a-z]+)-50\b(?!\s*dark:bg-|\/)', repl_bg, content)

    # 2. border-{color}-100 or 200 or 300 -> dark:border-{color}-900/30
    def repl_border(match):
        color = match.group(1)
        shade = match.group(2)
        return f"border-{color}-{shade} dark:border-{color}-900/30"

    content = re.sub(r'\bborder-([a-z]+)-(100|200|300)\b(?!\s*dark:border-)', repl_border, content)

    # 3. text-{color}-600 or 700 or 800 or 900 -> dark:text-{color}-400
    def repl_text(match):
        color = match.group(1)
        shade = match.group(2)
        # don't replace text-white or text-black or text-gray etc if they are generic, but we matched [a-z]+
        if color in ['slate', 'gray', 'zinc', 'neutral', 'stone']:
            # generic grays might be handled differently, let's just do it
            pass
        return f"text-{color}-{shade} dark:text-{color}-400"

    content = re.sub(r'\btext-([a-z]+)-(600|700|800|900)\b(?!\s*dark:text-)', repl_text, content)

    # Special case: hover:bg-{color}-50 -> hover:bg-{color}-50 dark:hover:bg-{color}-900/30
    def repl_hover_bg(match):
        color = match.group(1)
        return f"hover:bg-{color}-50 dark:hover:bg-{color}-900/30"
    content = re.sub(r'\bhover:bg-([a-z]+)-50\b(?!\s*dark:hover:bg-)', repl_hover_bg, content)

    # Special case: hover:text-{color}-600 -> hover:text-{color}-600 dark:hover:text-{color}-400
    def repl_hover_text(match):
        color = match.group(1)
        shade = match.group(2)
        return f"hover:text-{color}-{shade} dark:hover:text-{color}-400"
    content = re.sub(r'\bhover:text-([a-z]+)-(600|700|800)\b(?!\s*dark:hover:text-)', repl_hover_text, content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(directory):
    if 'node_modules' in root or '.next' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Done")
