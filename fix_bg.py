import os
import re

directories = ["frontend/app", "frontend/components"]
files = []
for directory in directories:
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(".tsx"):
                files.append(os.path.join(root, filename))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(
        r'from-\[\#eef0f4\]\s+to-\[\#f4f5f7\](?:\s+dark:from-background)?(?:\s+dark:to-surface)?(?:\s+dark:to-background)?',
        r'from-[#eef0f4] to-[#f4f5f7] dark:from-background dark:to-background',
        content
    )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
