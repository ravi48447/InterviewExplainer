import os
import re

directory = 'c:/Users/india/OneDrive - galgotiasuniversity.edu.in/Desktop/interview explainer/frontend'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # from-{color}-50 -> from-{color}-50 dark:from-{color}-950/30
    def repl_from(match):
        color = match.group(1)
        return f"from-{color}-50 dark:from-{color}-950/30"
    content = re.sub(r'\bfrom-([a-z]+)-50\b(?!\s*dark:from-|\/|%)', repl_from, content)

    # from-{color}-50/{opacity} -> from-{color}-50/{opacity} dark:from-{color}-950/{opacity}
    def repl_from_opacity(match):
        color = match.group(1)
        opacity = match.group(2)
        return f"from-{color}-50/{opacity} dark:from-{color}-950/{opacity}"
    content = re.sub(r'\bfrom-([a-z]+)-50/([0-9]+)\b(?!\s*dark:from-)', repl_from_opacity, content)

    # to-{color}-50 -> to-{color}-50 dark:to-{color}-950/30
    def repl_to(match):
        color = match.group(1)
        return f"to-{color}-50 dark:to-{color}-950/30"
    content = re.sub(r'\bto-([a-z]+)-50\b(?!\s*dark:to-|\/|%)', repl_to, content)
    
    # to-{color}-50/{opacity} -> to-{color}-50/{opacity} dark:to-{color}-950/{opacity}
    def repl_to_opacity(match):
        color = match.group(1)
        opacity = match.group(2)
        return f"to-{color}-50/{opacity} dark:to-{color}-950/{opacity}"
    content = re.sub(r'\bto-([a-z]+)-50/([0-9]+)\b(?!\s*dark:to-)', repl_to_opacity, content)
    
    # via-{color}-50 -> via-{color}-50 dark:via-{color}-950/30
    def repl_via(match):
        color = match.group(1)
        return f"via-{color}-50 dark:via-{color}-950/30"
    content = re.sub(r'\bvia-([a-z]+)-50\b(?!\s*dark:via-|\/|%)', repl_via, content)
    
    # bg-{color}-100 -> bg-{color}-100 dark:bg-{color}-900/40
    def repl_bg100(match):
        color = match.group(1)
        return f"bg-{color}-100 dark:bg-{color}-900/40"
    content = re.sub(r'\bbg-([a-z]+)-100\b(?!\s*dark:bg-|\/|%)', repl_bg100, content)

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
