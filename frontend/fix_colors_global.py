import os
import re

directories = ["components", "app"]
files = []
for directory in directories:
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(".tsx"):
                files.append(os.path.join(root, filename))

# Each tuple is (exact_class_name, dark_class_to_add)
replacements = [
    # emerald
    ('bg-emerald-50', 'dark:bg-emerald-500/10'),
    ('bg-emerald-50/50', 'dark:bg-emerald-500/10'),
    ('text-emerald-600', 'dark:text-emerald-400'),
    ('text-emerald-700', 'dark:text-emerald-400'),
    ('text-emerald-900', 'dark:text-emerald-400'),
    ('border-emerald-100', 'dark:border-emerald-500/20'),
    ('border-emerald-200', 'dark:border-emerald-500/20'),
    ('border-emerald-300', 'dark:border-emerald-500/30'),
    ('border-emerald-500', 'dark:border-emerald-500/50'),

    # indigo
    ('bg-indigo-50', 'dark:bg-indigo-500/10'),
    ('text-indigo-700', 'dark:text-indigo-400'),
    ('border-indigo-200', 'dark:border-indigo-500/20'),

    # amber
    ('bg-amber-50', 'dark:bg-amber-500/10'),
    ('bg-amber-50/70', 'dark:bg-amber-500/10'),
    ('bg-amber-100/80', 'dark:bg-amber-500/20'),
    ('text-amber-600', 'dark:text-amber-400'),
    ('text-amber-700', 'dark:text-amber-400'),
    ('text-amber-900', 'dark:text-amber-400'),
    ('border-amber-100', 'dark:border-amber-500/20'),
    ('border-amber-200', 'dark:border-amber-500/20'),
    ('border-amber-300', 'dark:border-amber-500/30'),

    # rose
    ('bg-rose-50', 'dark:bg-rose-500/10'),
    ('bg-rose-50/40', 'dark:bg-rose-500/10'),
    ('text-rose-600', 'dark:text-rose-400'),
    ('text-rose-700', 'dark:text-rose-400'),
    ('border-rose-200', 'dark:border-rose-500/20'),
    ('border-rose-300', 'dark:border-rose-500/30'),

    # violet
    ('bg-violet-50', 'dark:bg-violet-500/10'),
    ('bg-violet-50/40', 'dark:bg-violet-500/10'),
    ('bg-violet-50/60', 'dark:bg-violet-500/10'),
    ('bg-violet-100/80', 'dark:bg-violet-500/20'),
    ('text-violet-600', 'dark:text-violet-400'),
    ('text-violet-700', 'dark:text-violet-400'),
    ('text-violet-900', 'dark:text-violet-400'),
    ('border-violet-100', 'dark:border-violet-500/20'),
    ('border-violet-200', 'dark:border-violet-500/20'),
    ('border-violet-300', 'dark:border-violet-500/30'),
    ('border-violet-500', 'dark:border-violet-500/50'),

    # red
    ('bg-red-50', 'dark:bg-red-500/10'),
    ('text-red-700', 'dark:text-red-400'),
    ('border-red-200', 'dark:border-red-500/20'),

    # blue
    ('bg-blue-50', 'dark:bg-blue-500/10'),
    ('bg-blue-500/10', 'dark:bg-blue-500/20'),
    ('text-blue-600', 'dark:text-blue-400'),
    ('text-blue-700', 'dark:text-blue-400'),
    ('border-blue-100', 'dark:border-blue-500/20'),

    # orange
    ('bg-orange-50', 'dark:bg-orange-500/10'),
    ('bg-orange-500/10', 'dark:bg-orange-500/20'),
    ('text-orange-600', 'dark:text-orange-400'),
    ('border-orange-100', 'dark:border-orange-500/20'),

    # sky
    ('bg-sky-50', 'dark:bg-sky-500/10'),
    ('bg-sky-100', 'dark:bg-sky-500/20'),
    ('text-sky-700', 'dark:text-sky-400'),
    ('border-sky-200', 'dark:border-sky-500/20'),
    ('border-sky-300', 'dark:border-sky-500/30'),

    # generic light borders and backgrounds that should be adapted
    ('divide-slate-100', 'dark:divide-slate-800/60'),
    ('border-slate-100', 'dark:border-slate-800/60'),
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for target_class, dark_class in replacements:
        pattern = r'(?<!dark:)(?<![\w\-])' + re.escape(target_class) + r'(?![\w\/\-])'
        
        def replacer(match):
            return f"{target_class} {dark_class}"
            
        new_content = re.sub(pattern, replacer, new_content)
        
    for target_class, dark_class in replacements:
        escaped_dark = re.escape(dark_class)
        pattern_dup = escaped_dark + r'(\s+)' + escaped_dark
        new_content = re.sub(pattern_dup, dark_class, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
