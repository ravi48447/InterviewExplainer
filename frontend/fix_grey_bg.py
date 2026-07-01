import os
import re

directories = ["components", "app"]
files = []
for directory in directories:
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(".tsx"):
                files.append(os.path.join(root, filename))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # We want to replace `from-[#eef0f4] to-[#f4f5f7]` with `from-[#eef0f4] to-[#f4f5f7] dark:from-background dark:to-surface`
    # Replace single `bg-[#f4f5f7]` with `bg-[#f4f5f7] dark:bg-background`
    # Replace single `bg-white` with `bg-white dark:bg-surface` but only if not already dark:
    
    # Replace bg-[#f4f5f7] -> bg-[#f4f5f7] dark:bg-background
    new_content = re.sub(r'(?<!dark:)bg-\[\#f4f5f7\](?![\w\-\/])', r'bg-[#f4f5f7] dark:bg-background', new_content)
    
    # Replace from-[#eef0f4] to-[#f4f5f7] -> from-[#eef0f4] to-[#f4f5f7] dark:from-background dark:to-surface
    # Wait, the from/to are separate classes. Let's just do them individually.
    new_content = re.sub(r'(?<!dark:)from-\[\#eef0f4\](?![\w\-\/])', r'from-[#eef0f4] dark:from-background', new_content)
    new_content = re.sub(r'(?<!dark:)to-\[\#f4f5f7\](?![\w\-\/])', r'to-[#f4f5f7] dark:to-surface', new_content)

    # For violet gradients
    new_content = re.sub(r'(?<!dark:)from-violet-200/40(?![\w\-\/])', r'from-violet-200/40 dark:from-violet-900/20', new_content)
    new_content = re.sub(r'(?<!dark:)via-violet-100/15(?![\w\-\/])', r'via-violet-100/15 dark:via-violet-900/10', new_content)

    # Clean up any duplicates
    new_content = new_content.replace('dark:bg-background dark:bg-background', 'dark:bg-background')
    new_content = new_content.replace('dark:to-surface dark:to-surface', 'dark:to-surface')
    new_content = new_content.replace('dark:from-background dark:from-background', 'dark:from-background')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
