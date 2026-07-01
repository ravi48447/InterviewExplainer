import os
import re

target_dir = r'c:\Users\india\OneDrive - galgotiasuniversity.edu.in\Desktop\interview explainer\frontend'
mod_count = 0

for root, dirs, files in os.walk(target_dir):
    if 'node_modules' in root or '.next' in root:
        continue
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
            
            modified = False
            for i, line in enumerate(lines):
                # We want to match: classNames that contain from-something-50 to-something-50 but lack dark:from
                if 'from-' in line and ('-50 ' in line or '-50/' in line or 'to-white' in line or 'to-slate-50' in line):
                    if 'dark:from-' not in line and 'dark:to-' not in line and 'dark:bg-' not in line:
                        # Append dark:from-background dark:to-background/50
                        # Find the end of the className string
                        match = re.search(r'className=(?:\"([^\"]+)\"|\`([^\`]+)\`)', line)
                        if match:
                            full_match = match.group(0)
                            inner_class = match.group(1) or match.group(2)
                            new_inner = inner_class + ' dark:from-background dark:to-background/50'
                            if 'via-' in inner_class:
                                new_inner += ' dark:via-background/80'
                            
                            new_full = full_match.replace(inner_class, new_inner)
                            lines[i] = line.replace(full_match, new_full)
                            modified = True
                        else:
                            # Might be a simple string
                            if '"bg-gradient' in line or "'bg-gradient" in line or "`bg-gradient" in line:
                                lines[i] = re.sub(r'(to-[a-z0-9/-]+)', r'\1 dark:from-background dark:to-background/50', line, count=1)
                                modified = True

            if modified:
                with open(path, 'w', encoding='utf-8') as file:
                    file.writelines(lines)
                mod_count += 1
                print(f'Modified: {path}')

print(f'Total files modified: {mod_count}')
