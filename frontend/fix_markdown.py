import re

file_path = "components/MarkdownContent.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove useContentTheme import
content = re.sub(r'import\s+\{\s*useContentTheme\s*\}\s+from\s+[^;]+;\n', '', content)

# Replace buildRendererOptions
new_buildRendererOptions = """function buildRendererOptions() {
  return {
    gfm: true,
    breaks: false,
    renderer: {
      heading(this: any, token: any) {
        const { tokens, depth } = token;
        const text = this.parser.parseInline(tokens);
        const tag = `h${depth}`;
        const cls: Record<number, string> = {
          1: 'text-[22px] font-black text-foreground dark:text-muted-foreground mt-8 mb-4 first:mt-0 pb-2.5 border-b border-border dark:border-border/60 tracking-tight leading-tight',
          2: 'text-[19px] font-bold text-foreground dark:text-muted-foreground mt-8 mb-3 first:mt-0 pb-1.5 border-b border-border dark:border-border/40 tracking-tight leading-snug',
          3: 'text-[16.5px] font-bold text-foreground dark:text-muted-foreground mt-7 mb-2.5 first:mt-0 leading-snug pl-3 border-l-[3px] border-blue-500/70 dark:border-blue-500/60',
          4: 'text-[12.5px] font-bold text-muted-foreground uppercase tracking-[0.12em] mt-5 mb-1.5',
        };
        return `<${tag} class="${cls[depth] ?? ''}">${text}</${tag}>`;
      },

      paragraph(this: any, token: any) {
        const { tokens } = token;
        const text = this.parser.parseInline(tokens);
        const cls = 'text-[15.5px] leading-[1.78] text-foreground dark:text-muted-foreground mb-5 last:mb-0';
        return `<p class="${cls}">${text}</p>`;
      },

      blockquote(this: any, token: any) {
        const { tokens } = token;
        const body = this.parser.parse(tokens);
        const cls = 'border-l-4 border-blue-400/60 dark:border-blue-500/60 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg text-muted-foreground italic';
        return `<blockquote class="${cls}">${body}</blockquote>`;
      },

      list(this: any, token: any) {
        const { items, ordered, start } = token;
        const tag = ordered ? 'ol' : 'ul';
        const listCls = 'space-y-3 mb-5 pl-0 list-none';
        let counter = typeof start === 'number' ? start : 1;
        const itemsHtml = items
          .map((item: any) => {
            const body = this.parser.parse(item.tokens);
            if (ordered) {
              const num = counter++;
              const badgeCls = 'mt-[3px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-surface dark:bg-slate-700/70 text-[11px] font-bold text-foreground dark:text-muted-foreground border border-border dark:border-slate-600/60';
              const textCls = 'flex-1 text-[15.5px] leading-[1.78] text-foreground dark:text-muted-foreground min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0';
              return `<li class="flex items-start gap-3"><span class="${badgeCls}">${num}</span><div class="${textCls}">${body}</div></li>`;
            }
            const dotCls = 'mt-[9px] h-[7px] w-[7px] rounded-full bg-blue-500 dark:bg-blue-400 shrink-0';
            const textCls = 'flex-1 text-[15.5px] leading-[1.78] text-foreground dark:text-muted-foreground min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0';
            return `<li class="flex items-start gap-3"><span class="${dotCls}"></span><div class="${textCls}">${body}</div></li>`;
          })
          .join('');
        return `<${tag} class="${listCls}">${itemsHtml}</${tag}>`;
      },

      strong(token: any) {
        const { text } = token;
        const cls = 'font-bold text-foreground dark:text-white';
        return `<strong class="${cls}">${text}</strong>`;
      },

      em(token: any) {
        const { text } = token;
        const cls = 'italic text-muted-foreground';
        return `<em class="${cls}">${text}</em>`;
      },

      codespan(token: any) {
        const { text } = token;
        const cls = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-200 rounded px-[6px] py-[2px] text-[0.86em] font-mono font-medium border border-blue-200/70 dark:border-blue-800/50';
        return `<code class="${cls}">${text}</code>`;
      },

      del(token: any) {
        const { text } = token;
        const cls = 'line-through text-slate-400 dark:text-slate-500';
        return `<del class="${cls}">${text}</del>`;
      },

      hr() {
        const cls = 'border-border dark:border-border/60 my-6';
        return `<hr class="${cls}" />`;
      },

      link(token: any) {
        const { href, text } = token;
        const isExternal = href.startsWith('http');
        const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const cls = 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-600/30 dark:decoration-blue-400/30 hover:decoration-blue-700 dark:hover:decoration-blue-300 transition-colors';
        return `<a href="${href}"${target} class="${cls}">${text}</a>`;
      },

      table(this: any, token: any) {
        const { header, rows } = token;
        const thCls = 'px-4 py-3 bg-surface dark:bg-surface font-bold text-foreground dark:text-muted-foreground border-b border-border dark:border-border/60 text-left text-[11.5px] uppercase tracking-[0.08em]';
        const tdCls = 'px-4 py-3 border-b border-slate-100 dark:border-border/40 text-foreground dark:text-muted-foreground text-[14px] leading-[1.6] align-top';
        const trEvenCls = 'bg-surface/50 dark:bg-surface/30';
        const containerCls = 'overflow-x-auto my-6 rounded-lg border border-border dark:border-border/60';
        const theadCls = 'bg-surface dark:bg-surface';

        const headerCells = (header as any[])
          .map((cell: any) => `<th class="${thCls}">${this.parser.parseInline(cell.tokens)}</th>`)
          .join('');

        const bodyHtml = (rows as any[][])
          .map((row: any[], rowIdx) => {
            const cells = row
              .map((cell: any) => `<td class="${tdCls}">${this.parser.parseInline(cell.tokens)}</td>`)
              .join('');
            return `<tr class="${rowIdx % 2 === 1 ? trEvenCls : ''}">${cells}</tr>`;
          })
          .join('');

        return `<div class="${containerCls}"><table class="min-w-full border-collapse"><thead class="${theadCls}"><tr>${headerCells}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
      },
    },
  };
}"""

# Replace the whole buildRendererOptions function block
content = re.sub(r'function buildRendererOptions\(theme: \'dark\' \| \'light\'\) \{.*?(?=\n// Two module-level instances)', new_buildRendererOptions + '\n', content, flags=re.DOTALL)

# Replace the module level instances
instances_replacement = """// A single module-level instance. Created once, never recreated.
const markedInstance = new Marked();
markedInstance.use(buildRendererOptions() as any);"""
content = re.sub(r'// Two module-level instances[^\n]*\nconst markedDark = new Marked\(\);\nmarkedDark\.use\(buildRendererOptions\(\'dark\'\) as any\);\n\nconst markedLight = new Marked\(\);\nmarkedLight\.use\(buildRendererOptions\(\'light\'\) as any\);', instances_replacement, content, flags=re.DOTALL)

# Remove the useContentTheme hook and use markedInstance
content = re.sub(r'  const \{ theme \} = useContentTheme\(\);\n  const instance = theme === \'dark\' \? markedDark : markedLight;', '  const instance = markedInstance;', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
