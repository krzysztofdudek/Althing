// Shared text helpers for the rails: line splitting, fenced code, inline code,
// URLs, paragraphs and folding. Pure functions, no I/O.

const FENCE = /^\s{0,3}(`{3,}|~{3,})/;

// Lines of a text with a flag for each line inside a fenced code block (the
// fence lines themselves count as code). Non-Markdown files have no fences.
export function linesOf(text, { markdown = true } = {}) {
  const raw = text.split(/\r?\n/);
  const out = [];
  let fence = null;
  for (let i = 0; i < raw.length; i++) {
    const line = raw[i];
    if (markdown) {
      const m = line.match(FENCE);
      if (fence) {
        out.push({ n: i + 1, text: line, code: true });
        if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
        continue;
      }
      if (m) {
        fence = m[1];
        out.push({ n: i + 1, text: line, code: true });
        continue;
      }
    }
    out.push({ n: i + 1, text: line, code: false });
  }
  return out;
}

export function isMarkdown(path) {
  return /\.md$/i.test(path || '');
}

const URL_RE = /\b(?:https?|ftp):\/\/[^\s<>()"'`]+|\bwww\.[^\s<>()"'`]+/gi;

export function stripUrls(s) {
  return s.replace(URL_RE, ' ');
}

export function stripInlineCode(s) {
  return s.replace(/(`+)[^`]*?\1/g, ' ');
}

// Paragraphs: runs of non-blank, non-code lines. A list item, a heading or a
// table row starts a paragraph of its own, so one item never borrows words
// from its neighbour.
export function paragraphsOf(lines) {
  const paras = [];
  let cur = null;
  const flush = () => { if (cur) paras.push(cur); cur = null; };
  for (const l of lines) {
    if (l.code || /^\s*$/.test(l.text)) { flush(); continue; }
    const startsOwn = /^\s*(?:[-*+]\s|\d+[.)]\s|#{1,6}\s|\||>)/.test(l.text);
    if (startsOwn) flush();
    if (!cur) cur = { lines: [] };
    cur.lines.push(l);
    if (/^\s*(?:#{1,6}\s|\|)/.test(l.text)) flush();
  }
  flush();
  return paras;
}

// Fold to lower-case ASCII: strip diacritics (NFKD), and the letters NFKD
// does not decompose (l with stroke, o with stroke, eth, thorn, ae, sharp s).
const EXTRA = { '\u0142': 'l', '\u0141': 'l', '\u00f8': 'o', '\u00d8': 'o', '\u00f0': 'd', '\u00d0': 'd', '\u00fe': 'th', '\u00de': 'th', '\u00e6': 'ae', '\u00c6': 'ae', '\u00df': 'ss' };

export function fold(word) {
  let s = '';
  for (const ch of word) s += EXTRA[ch] ?? ch;
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Words of a string with their offsets: runs of letters (any script) and digits.
export function wordsOf(s) {
  const out = [];
  const re = /[\p{L}\p{M}][\p{L}\p{M}\p{N}]*/gu;
  let m;
  while ((m = re.exec(s)) !== null) out.push({ word: m[0], index: m.index });
  return out;
}
