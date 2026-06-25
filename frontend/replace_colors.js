const fs = require('fs');
const path = require('path');

const dirsToProcess = ['app', 'components', 'modules'];
const exts = ['.tsx', '.ts', '.jsx', '.js'];

const replacements = [
  { regex: /\bbg-white\b/g, replacement: 'bg-background dark:bg-background' },
  { regex: /\bbg-black\b/g, replacement: 'bg-foreground dark:bg-background' },
  { regex: /\btext-black\b/g, replacement: 'text-foreground' },
  { regex: /\btext-white\b/g, replacement: 'text-primary-foreground dark:text-foreground' },
  // specific slates
  { regex: /\bbg-slate-50\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-slate-100\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-slate-800\b/g, replacement: 'dark:bg-surface' },
  { regex: /\bbg-slate-900\b/g, replacement: 'dark:bg-surface' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-gray-800\b/g, replacement: 'dark:bg-surface' },
  { regex: /\bbg-gray-900\b/g, replacement: 'dark:bg-surface' },
  { regex: /\bborder-slate-200\b/g, replacement: 'border-border' },
  { regex: /\bborder-slate-300\b/g, replacement: 'border-border' },
  { regex: /\bborder-slate-700\b/g, replacement: 'border-border' },
  { regex: /\bborder-slate-800\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-700\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-800\b/g, replacement: 'border-border' },
  { regex: /\btext-slate-500\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-slate-600\b/g, replacement: 'text-secondary' },
  { regex: /\btext-slate-700\b/g, replacement: 'text-foreground' },
  { regex: /\btext-slate-800\b/g, replacement: 'text-foreground' },
  { regex: /\btext-slate-900\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-secondary' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-900\b/g, replacement: 'text-foreground' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const rule of replacements) {
    content = content.replace(rule.regex, rule.replacement);
  }

  // simplify double classes like 'bg-background dark:bg-background' to 'bg-background'
  content = content.replace(/\bbg-background dark:bg-background\b/g, 'bg-background');
  content = content.replace(/\btext-foreground dark:text-foreground\b/g, 'text-foreground');
  content = content.replace(/\bbg-surface dark:bg-surface\b/g, 'bg-surface');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

for (const dir of dirsToProcess) {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    processDirectory(fullPath);
  }
}
console.log('Done!');
