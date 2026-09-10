const fs = require('fs');

function getDeepChars(sections) {
  return sections
    .filter(s => s.type !== 'key_points' && s.type !== 'speakable_answer')
    .reduce((sum, s) => {
      if (typeof s.content === 'string') return sum + s.content.length;
      if (typeof s.content === 'object' && s.content !== null) return sum + JSON.stringify(s.content).length;
      if (s.code) return sum + s.code.length;
      return sum;
    }, 0);
}

// ─── Fix 1: Redis — convert reference_group content objects to strings ──────
{
  const filePath = 'content/interview/java/backend/intermediate/redis/complete-qa.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fixed = 0;
  data.questions.forEach(q => {
    (q.answer?.sections || []).forEach(s => {
      if (typeof s.content === 'object' && s.content !== null && !Array.isArray(s.content)) {
        const obj = s.content;
        let md = '';
        if (obj.group_title) md += `**${obj.group_title}**\n\n`;
        if (obj.items && Array.isArray(obj.items)) {
          obj.items.forEach(item => {
            md += `- **${item.name}** — ${item.description || ''}\n`;
            if (item.use_when) md += `  - *Use when:* ${item.use_when}\n`;
            if (item.avoid_when) md += `  - *Avoid when:* ${item.avoid_when}\n`;
            if (item.example) md += `  - *Example:* ${item.example}\n`;
            if (item.complexity) md += `  - *Complexity:* ${item.complexity}\n`;
          });
        }
        s.content = md.trim();
        fixed++;
      }
    });
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Redis: converted ${fixed} object content fields to markdown strings`);
  
  data.questions.forEach((q, i) => {
    const dc = getDeepChars(q.answer?.sections || []);
    const ok = dc > 1500 ? '✓' : '✗';
    console.log(`  ${ok} Q${i} deep=${dc}`);
  });
}

// ─── Fix 2: Spring-core Q9 — needs > 1500, currently exactly 1500 ──────────
{
  const filePath = 'content/interview/java/backend/intermediate/spring-core/complete-qa.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const q9 = data.questions[9];
  const overview = q9.answer.sections.find(s => s.type === 'overview');
  if (overview) {
    overview.content += '\n\nIn production Spring Boot services, conditional beans are the backbone of auto-configuration: starters like `spring-boot-starter-data-redis` register beans only when `Jedis` or `Lettuce` classes are on the classpath, and teams override those defaults by declaring their own `@Bean` methods, which causes the starter to back off via `@ConditionalOnMissingBean`.';
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  const dc = getDeepChars(q9.answer.sections);
  console.log(`Spring-core Q9: deep=${dc} ${dc > 1500 ? '✓' : '✗'}`);
}

// ─── Fix 3: Check $ref-based files (Kafka, Git, React) ─────────────────────
// These files reference shared content. The shared files are already fixed.
// The issue is that the local file only has overrides (code_example), not the full answer.
// Need to check if the content resolution system handles this at runtime.
const refFiles = [
  'content/interview/java/backend/intermediate/kafka/complete-qa.json',
  'content/interview/java/backend/beginner/git/complete-qa.json',
  'content/interview/java/fullstack/intermediate/react/complete-qa.json',
  'content/interview/python/backend/intermediate/kafka/complete-qa.json',
  'content/interview/ruby/fullstack/intermediate/react/complete-qa.json',
];
refFiles.forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const refs = data.questions.filter(q => q['$ref']);
  if (refs.length > 0) {
    console.log(`\n${f.replace('content/interview/','')}: ${refs.length} $ref questions`);
    refs.forEach((q, i) => {
      const ref = q['$ref'];
      const [file, id] = ref.split('#');
      const shared = JSON.parse(fs.readFileSync('content/' + file, 'utf8'));
      const sharedQ = shared.questions?.find(sq => sq.id === id);
      if (sharedQ) {
        const s = sharedQ.answer?.sections || [];
        const hasKP = s.some(x => x.type === 'key_points');
        const hasSA = s.some(x => x.type === 'speakable_answer');
        const dc = getDeepChars(s);
        const ok = hasKP && hasSA && dc > 1500;
        console.log(`  ${ok ? '✓' : '✗'} ${id} (in shared) hasKP=${hasKP} hasSA=${hasSA} deep=${dc}`);
      } else {
        console.log(`  ? ${id} NOT FOUND in shared file`);
      }
    });
  }
});
