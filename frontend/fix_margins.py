import os
import re

dir_path = 'frontend'
replacements = 0

for root, dirs, files in os.walk(dir_path):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith(('.tsx', '.jsx', '.ts', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = re.sub(r'(className="[^"]*)\bmr-2\b\s*([^"]*")', r'\1\2', content)
            new_content = re.sub(r'(className="[^"]*)\s+"', r'"', new_content)
            new_content = re.sub(r'(className=")\s+', r'\1', new_content)
            
            new_content = re.sub(r'(className="[^"]*)\bml-2\b\s*([^"]*")', r'\1\2', new_content)
            new_content = re.sub(r'(className="[^"]*)\s+"', r'"', new_content)
            new_content = re.sub(r'(className=")\s+', r'\1', new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                replacements += 1
                print(f"Fixed {filepath}")

print(f'Fixed {replacements} files.')
