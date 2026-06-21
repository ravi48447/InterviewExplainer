import fs from 'fs';
import path from 'path';
import {
  ENABLED_LANGUAGES,
  ENABLED_HUBS,
  LAUNCH_QUICK_PATHS,
} from '../lib/launch-config';

const readerSrc = fs.readFileSync(
  path.join(__dirname, '..', 'lib', 'content-reader.ts'),
  'utf8',
);

describe('launch-config.ts', () => {
  test('ENABLED_LANGUAGES contains at least java and python', () => {
    expect(ENABLED_LANGUAGES).toContain('java');
    expect(ENABLED_LANGUAGES).toContain('python');
  });

  test('every LAUNCH_QUICK_PATHS.href resolves to a known domain slug', () => {
    for (const qp of LAUNCH_QUICK_PATHS) {
      const slug = qp.href.replace(/^\//, '');
      const inReader =
        readerSrc.includes(`'${slug}'`) || readerSrc.includes(`"${slug}"`);
      expect(inReader).toBe(true);
    }
  });

  test('every ENABLED_HUBS key is one of the known hub names', () => {
    const known = new Set([
      'interviewQA', 'prepCategories', 'systemDesign', 'dsa', 'behavioral',
      'topics', 'tools', 'compare', 'companies', 'career', 'roadmaps',
      'cheatsheets', 'dashboard', 'mockInterviews', 'search',
      'interviewByLang',
    ]);
    for (const k of Object.keys(ENABLED_HUBS)) {
      expect(known.has(k)).toBe(true);
    }
  });
});
