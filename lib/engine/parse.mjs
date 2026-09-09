/**
 * parse.mjs — dependency-free resume file parsing.
 *
 * DOCX: a ZIP container; we read the central directory, pull word/document.xml,
 *       inflate it with node:zlib (raw deflate), and extract <w:t> runs.
 * PDF:  text lives in content streams; FlateDecode streams are RFC-1950 zlib,
 *       so node:zlib inflates them; we then pull text-showing operators
 *       (Tj / TJ / ') with a quality gate (CID fonts without ToUnicode produce
 *       garbage — the gate catches it and the UI falls back to paste).
 *
 * No npm dependencies. Returns { text, method, words, alphaRatio, confidence }.
 */

import zlib from 'node:zlib';

// ---------------- ZIP (for DOCX) ----------------

function findEOCD(buf) {
  const SIG = 0x06054b50;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65536); i -= 1) {
    if (buf.readUInt32LE(i) === SIG) return i;
  }
  return -1;
}

/** Read one file out of a ZIP buffer. Returns a Buffer or null. */
export function zipRead(buf, wantedName) {
  const eocd = findEOCD(buf);
  if (eocd < 0) return null;
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const cdCount = buf.readUInt16LE(eocd + 10);
  let p = cdOffset;
  for (let i = 0; i < cdCount; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) return null;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString('latin1', p + 46, p + 46 + nameLen);
    if (name === wantedName) {
      // local header: skip to data
      if (buf.readUInt32LE(localOffset) !== 0x04034b50) return null;
      const lNameLen = buf.readUInt16LE(localOffset + 26);
      const lExtraLen = buf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lNameLen + lExtraLen;
      const data = buf.subarray(dataStart, dataStart + compSize);
      if (method === 0) return Buffer.from(data);
      if (method === 8) {
        try {
          return zlib.inflateRawSync(data);
        } catch {
          return null;
        }
      }
      return null;
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

/** DOCX: word/document.xml -> plain text (paragraphs as lines). */
export function docxText(xml) {
  const decoded = String(xml)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
  const paragraphs = decoded.split(/<\/w:p>/);
  const lines = [];
  for (const para of paragraphs) {
    let line = '';
    const re = /<w:t[^>]*>([\s\S]*?)<\/w:t>|<w:tab[^>]*\/>|<w:br[^>]*\/>/g;
    let m;
    while ((m = re.exec(para))) {
      if (m[1] !== undefined) line += m[1];
      else if (m[0].startsWith('<w:br')) line += '\n';
      else line += ' ';
    }
    lines.push(line);
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ---------------- PDF ----------------

function inflateFlate(data) {
  try {
    return zlib.inflateSync(data);
  } catch {
    try {
      return zlib.inflateRawSync(data);
    } catch {
      return null;
    }
  }
}

/** Decode a PDF literal-string body (escapes already stripped of backslash by regex). */
function pdfUnescape(s) {
  return s.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (m, g) => {
    if (g === 'n') return '\n';
    if (g === 'r') return '\r';
    if (g === 't') return '\t';
    if (g === 'b' || g === 'f') return '';
    if (g === '(' || g === ')' || g === '\\') return g;
    return String.fromCharCode(parseInt(g, 8));
  });
}

/** Extract shown text from one decoded content stream (latin1). */
function pdfStreamText(s) {
  let out = '';
  const STR = String.raw`(?:\\[\s\S]|[^()\\])*`;
  const re = new RegExp(
    String.raw`\((${STR})\)\s*Tj` +
      String.raw`|\[(${String.raw`(?:\\[\s\S]|[^()\\\[\]])*`})\]\s*TJ` +
      String.raw`|\((${STR})\)\s*'` +
      String.raw`|T\*|ET`,
    'g'
  );
  let m;
  while ((m = re.exec(s))) {
    if (m[1] !== undefined) out += pdfUnescape(m[1]);
    else if (m[2] !== undefined) {
      // TJ array: join the literal strings (kerning splits must not gain spaces)
      const inner = new RegExp(String.raw`\((${STR})\)`, 'g');
      let im;
      while ((im = inner.exec(m[2]))) out += pdfUnescape(im[1]);
    } else if (m[3] !== undefined) {
      out += pdfUnescape(m[3]) + '\n';
    } else {
      out += '\n'; // T* or ET: line break
    }
  }
  return out;
}

/** PDF buffer -> text (all content streams, in file order). */
export function pdfText(buf) {
  let out = '';
  let i = 0;
  while ((i = buf.indexOf('stream', i)) !== -1) {
    // dict immediately before the stream keyword (bounded window)
    const dictStart = Math.max(0, i - 600);
    const dict = buf.toString('latin1', dictStart, i);
    let dataStart = i + 6;
    if (buf[dataStart] === 0x0d) dataStart += buf[dataStart + 1] === 0x0a ? 2 : 1;
    else if (buf[dataStart] === 0x0a) dataStart += 1;
    const endIdx = buf.indexOf('endstream', dataStart);
    if (endIdx < 0) break;
    let dataEnd = endIdx;
    // trailing EOL before endstream
    while (dataEnd > dataStart && (buf[dataEnd - 1] === 0x0a || buf[dataEnd - 1] === 0x0d)) dataEnd -= 1;
    // explicit /Length wins when sane
    const lm = /\/Length\s+(\d+)/.exec(dict);
    if (lm) {
      const len = Number(lm[1]);
      if (len > 0 && dataStart + len <= endIdx) dataEnd = dataStart + len;
    }
    const chunk = buf.subarray(dataStart, dataEnd);
    let text = null;
    if (/\/FlateDecode/.test(dict)) {
      const inf = inflateFlate(chunk);
      if (inf) text = inf.toString('latin1');
    } else if (!/\/Filter/.test(dict)) {
      text = chunk.toString('latin1');
    }
    if (text) out += pdfStreamText(text) + '\n';
    i = endIdx + 9;
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

// ---------------- quality gate + entry point ----------------

function grade(text, method) {
  const words = (text.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).length;
  const alnum = (text.match(/[A-Za-z0-9@.+\-/\s]/g) ?? []).length;
  const alphaRatio = text.length ? alnum / text.length : 0;
  let confidence;
  if (words >= 150 && alphaRatio >= 0.55) confidence = 'high';
  else if (words >= 60 && alphaRatio >= 0.4) confidence = 'medium';
  else confidence = 'low';
  return { text, method, words, alphaRatio: +alphaRatio.toFixed(2), confidence };
}

/**
 * Parse an uploaded resume buffer. Auto-detects PDF/DOCX.
 * Returns null for unknown formats.
 */
export function parseResumeFile(buf) {
  const head = buf.subarray(0, 5).toString('latin1');
  if (head.startsWith('%PDF')) return grade(pdfText(buf), 'pdf');
  if (buf.readUInt16LE(0) === 0x4b50) {
    // ZIP: 'PK' — DOCX carries word/document.xml
    const xml = zipRead(buf, 'word/document.xml');
    if (xml) return grade(docxText(xml), 'docx');
    return grade('', 'docx'); // a zip without our entry: empty -> low confidence
  }
  return null;
}
