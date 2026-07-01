import os
import re

files_to_check = [
    "app/dsa/sheet/[slug]/page.tsx",
    "app/dsa/module/[slug]/page.tsx",
    "app/dsa/basic-100/page.tsx",
    "components/dsa/DSAHero.tsx",
    "components/course/CourseLmsExperience.tsx",
]

for filepath in files_to_check:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def replacer(m):
        return m.group(0).replace('text-foreground', 'text-slate-100')
        
    new_content = re.sub(r'className="[^"]*bg-\[\#0f1014\][^"]*"', replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
