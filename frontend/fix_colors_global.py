import os
import re

def fix_colors_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to find patterns like: text-blue-300 dark:text-blue-300
    # And replace the base color (text-blue-300) with a darker shade (text-blue-700)
    
    # We will look for: text-({color})-({lightness}) dark:text-\1-({dark_lightness})
    # OR: text-({color})-({lightness}) hover:text-... dark:text-\1-({dark_lightness})
    
    # Actually, a simpler approach: 
    # Just look for all instances of "text-{color}-{lightness}" where lightness is 100, 200, 300, 400.
    # If the line contains "dark:text-", then we know it's meant to be theme-aware.
    
    lines = content.split('\n')
    changed = False
    new_lines = []
    
    color_map = {
        '100': '800',
        '200': '700',
        '300': '700',
        '400': '600'
    }
    
    # Only target these specific vibrant colors that are used for highlights
    colors = ['blue', 'emerald', 'green', 'amber', 'rose', 'red', 'teal', 'cyan', 'indigo', 'violet', 'purple']
    
    pattern = re.compile(r'(?<!dark:)(?<!hover:)(?<!focus:)\btext-(' + '|'.join(colors) + r')-([1234]00)\b')
    
    for line in lines:
        original_line = line
        
        # Check if this line seems to be theme-aware (has dark: classes)
        # Or if it's explicitly a component we know is broken.
        if 'dark:text-' in line or 'dark:bg-' in line or 'dark:border-' in line:
            
            # Don't touch if it's explicitly dark themed component, identified by dark hex codes as base
            if 'bg-[#0A0A0A]' in line or 'bg-[#111111]' in line or 'bg-[#030712]' in line:
                new_lines.append(line)
                continue
                
            # Find all base light colors
            matches = pattern.finditer(line)
            # Iterate backwards to replace without messing up indices
            for match in reversed(list(matches)):
                color = match.group(1)
                lightness = match.group(2)
                
                # We skip if the exact text is inside a string literal that might just be a variable name, 
                # but in tsx classNames it's fine.
                
                new_lightness = color_map[lightness[0:1] + '00']
                replacement = f"text-{color}-{new_lightness}"
                
                start, end = match.span()
                line = line[:start] + replacement + line[end:]
                
        if line != original_line:
            changed = True
            
        new_lines.append(line)
        
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        return True
    return False

def run():
    directories = [
        'c:/Users/india/OneDrive - galgotiasuniversity.edu.in/Desktop/interview explainer/frontend/app',
        'c:/Users/india/OneDrive - galgotiasuniversity.edu.in/Desktop/interview explainer/frontend/components'
    ]
    
    count = 0
    for directory in directories:
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.ts'):
                    filepath = os.path.join(root, file)
                    if fix_colors_in_file(filepath):
                        print(f"Fixed: {filepath}")
                        count += 1
                        
    print(f"Total files fixed: {count}")

if __name__ == '__main__':
    run()
