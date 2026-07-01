import os
import re

dir_path = "components/dsa"
files = [f for f in os.listdir(dir_path) if f.endswith(".tsx")]

# Each tuple is (exact_class_name, dark_class_to_add)
# We will match `(?<![\w-])exact_class_name(?![\w/-])` and replace with `exact_class_name dark_class_to_add`
# But only if it's not already preceded by `dark:` or followed by the same dark class.
replacements = [
    # emerald
    ('bg-emerald-50', 'dark:bg-emerald-500/10'),
    ('bg-emerald-50/50', 'dark:bg-emerald-500/10'),
    ('text-emerald-600', 'dark:text-emerald-400'),
    ('text-emerald-700', 'dark:text-emerald-400'),
    ('text-emerald-900', 'dark:text-emerald-400'),
    ('border-emerald-100', 'dark:border-emerald-500/20'),
    ('border-emerald-200', 'dark:border-emerald-500/20'),
    ('border-emerald-500', 'dark:border-emerald-500/50'),

    # indigo
    ('bg-indigo-50', 'dark:bg-indigo-500/10'),
    ('text-indigo-700', 'dark:text-indigo-400'),
    ('border-indigo-200', 'dark:border-indigo-500/20'),

    # amber
    ('bg-amber-50', 'dark:bg-amber-500/10'),
    ('text-amber-600', 'dark:text-amber-400'),
    ('text-amber-700', 'dark:text-amber-400'),
    ('border-amber-100', 'dark:border-amber-500/20'),
    ('border-amber-200', 'dark:border-amber-500/20'),

    # rose
    ('bg-rose-50', 'dark:bg-rose-500/10'),
    ('text-rose-600', 'dark:text-rose-400'),
    ('text-rose-700', 'dark:text-rose-400'),
    ('border-rose-200', 'dark:border-rose-500/20'),

    # violet
    ('bg-violet-50', 'dark:bg-violet-500/10'),
    ('bg-violet-50/40', 'dark:bg-violet-500/10'),
    ('bg-violet-50/60', 'dark:bg-violet-500/10'),
    ('text-violet-600', 'dark:text-violet-400'),
    ('text-violet-700', 'dark:text-violet-400'),
    ('text-violet-900', 'dark:text-violet-400'),
    ('border-violet-100', 'dark:border-violet-500/20'),
    ('border-violet-200', 'dark:border-violet-500/20'),
    ('border-violet-500', 'dark:border-violet-500/50'),

    # red
    ('bg-red-50', 'dark:bg-red-500/10'),
    ('text-red-700', 'dark:text-red-400'),
    ('border-red-200', 'dark:border-red-500/20'),

    # blue
    ('bg-blue-50', 'dark:bg-blue-500/10'),
    ('text-blue-600', 'dark:text-blue-400'),
    ('border-blue-100', 'dark:border-blue-500/20'),

    # orange
    ('bg-orange-50', 'dark:bg-orange-500/10'),
    ('text-orange-600', 'dark:text-orange-400'),
    ('border-orange-100', 'dark:border-orange-500/20'),

    # sky
    ('bg-sky-50', 'dark:bg-sky-500/10'),
    ('text-sky-700', 'dark:text-sky-400'),
    ('border-sky-200', 'dark:border-sky-500/20'),

    # generic light borders and backgrounds that should be adapted
    ('divide-slate-100', 'dark:divide-slate-800/60'),
    ('border-slate-100', 'dark:border-slate-800/60'),
]

for filename in files:
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for target_class, dark_class in replacements:
        # Match target_class exactly, not preceded by 'dark:', not followed by another class chunk, 
        # and ensure the dark_class is not already somewhere nearby (for simplicity we check if dark_class is not in the line, 
        # but a regex is safer).
        
        # We find all occurrences of the class, replace it, but skip if preceded by 'dark:'
        pattern = r'(?<!dark:)(?<![\w\-])' + re.escape(target_class) + r'(?![\w\/\-])'
        
        def replacer(match):
            return f"{target_class} {dark_class}"
            
        new_content = re.sub(pattern, replacer, new_content)
        
    # Also deduplicate any double dark classes that might have been accidentally created.
    # If the original file had `bg-emerald-50 dark:bg-emerald-500/10`, now it's `bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-500/10`
    for target_class, dark_class in replacements:
        escaped_dark = re.escape(dark_class)
        pattern_dup = escaped_dark + r'(\s+)' + escaped_dark
        new_content = re.sub(pattern_dup, dark_class, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
