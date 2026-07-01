import os
import re

files_to_check = [
    "app/dsa/sheet/[slug]/page.tsx",
    "app/dsa/page.tsx",
    "app/dsa/module/[slug]/page.tsx",
    "app/dsa/basic-100/page.tsx",
    "components/dsa/DSAHero.tsx",
    "components/course/CourseLmsExperience.tsx",
]

def fix_file(filepath):
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(match):
        prefix = match.group(1) # className="
        class_str = match.group(2) # the rest up to "
        
        if not re.search(r'(^|\s)dark(\s|$)', class_str):
            class_str = 'dark ' + class_str
        
        return prefix + class_str
    
    # We want to match: className="...bg-[#0f1014]..."
    new_content = re.sub(r'(className=")([^"]*bg-\[\#0f1014\][^"]*")', replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
    else:
        print(f"No changes for {filepath}")

for f in files_to_check:
    fix_file(f)
