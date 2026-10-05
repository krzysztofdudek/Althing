// The proper-noun glance (rail 21, advisory). New capitalised words in staged
// Markdown, other than at the start of a sentence and other than the words in
// rails/lexicon/proper-nouns.txt, are printed for a glance. It never blocks:
// it is how a name that is on no list gets a second look before it is pushed.

import { linesOf, stripInlineCode, stripUrls } from './markdown.mjs';

export function parseNouns(text) {
  return new Set(text.split(/\r?\n/).map((l) => l.replace(/\s+#.*$/, '').trim()).filter((l) => l && !l.startsWith('#')));
}

// lines: [{ path, line, text }] of added Markdown lines; known: Set of words.
export function newProperNouns(lines, known) {
  const seen = new Map();
  for (const l of lines) {
    if (!/\.md$/i.test(l.path)) continue;
    const text = stripUrls(stripInlineCode(l.text)).replace(/\[[^\]]*\]\([^)]*\)/g, (m) => m.replace(/\]\([^)]*\)/, ']'));
    const re = /[\p{L}][\p{L}\p{N}'-]*/gu;
    let m;
    while ((m = re.exec(text)) !== null) {
      const w = m[0].replace(/['-]+$/, '').replace(/'s$/, '');
      if (!/^\p{Lu}/u.test(w) || w.length < 3) continue;
      if ((/^\p{Lu}+$/u.test(w) && w.length <= 5) || /\d/.test(w)) continue; // short acronyms, versioned identifiers
      const before = text.slice(0, m.index).trimEnd().replace(/[*_`"(\[]+$/, '').trimEnd();
      if (!before || /[.!?:;|#>\-+]$/.test(before) || /^\s*(?:[-*+]|\d+[.)])$/.test(before)) continue; // sentence or item start
      if (known.has(w) || known.has(w.toLowerCase())) continue;
      if (!seen.has(w)) seen.set(w, `${l.path}:${l.line}`);
    }
  }
  return [...seen].map(([word, where]) => ({ word, where }));
}
