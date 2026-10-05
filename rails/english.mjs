// The English-only detector (rail lang/english). Everything written into this
// repository is English; this finds Polish, the owner's language, which is the
// language most likely to slip in. Four rules, all over text with fenced code
// and URLs removed:
//   letter     a Polish-specific letter in a word that is not on the allow-list
//   o-acute    the letter o-acute in a word whose folded form is a Polish word
//   sentence   two Polish words in one sentence: two distinct stop-words, two
//              Polish-looking words, or one of each (inline code spans are not
//              prose and are left out of this rule)
//   slot       one Polish stop-word in a heading, a file name, a Tags value or
//              a branch name, where a single word is already a signal
// The word lists live in rails/lexicon/. Calibration: node rails/english.mjs --calibrate.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { linesOf, isMarkdown, stripUrls, stripInlineCode, paragraphsOf, fold, wordsOf } from './markdown.mjs';
import STOPWORDS_TEXT from './lexicon/pl-stopwords.mjs';
import ALLOW_TEXT from './lexicon/foreign-allow.mjs';

function entries(text) {
  return text.split('\n').map((l) => l.replace(/\s+#.*$/, '').trim()).filter((l) => l && !l.startsWith('#'));
}

export const STOPWORDS = new Set(entries(STOPWORDS_TEXT).map(fold));
export const ALLOW = new Set(entries(ALLOW_TEXT));

const PL_LETTER = /[\u0105\u0107\u0119\u0142\u0144\u015b\u017a\u017c\u0104\u0106\u0118\u0141\u0143\u015a\u0179\u017b]/;
const O_ACUTE = /[\u00f3\u00d3]/;

function letterFindings(s, n, allow) {
  const out = [];
  for (const { word } of wordsOf(s)) {
    if (allow.has(word)) continue;
    if (PL_LETTER.test(word)) out.push({ line: n, rule: 'letter', word });
    else if (O_ACUTE.test(word) && STOPWORDS.has(fold(word))) out.push({ line: n, rule: 'o-acute', word });
  }
  return out;
}

// Polish-looking words: lower-case, at least four letters, holding a letter
// cluster, an ending or a prefix that English almost never has (the MORPH
// pattern below). A name starts with a capital and is never counted.
// Written with one-letter classes so that this line is not itself Polish-looking.
const MORPH = /r[z]|s[z]|c[z]|d[z]|y[c]h$|y[m]i$|o[s]c$|o[s]ci$|[ae]n[i]e$|^(?:p[r]ze|p[r]zy|r[o]z|n[a]j)/;
function polishLooking(word) {
  return word.length >= 4 && word === word.toLowerCase() && !/\d/.test(word) && MORPH.test(fold(word));
}

// Sentence rule over one paragraph: lines joined, sentences cut at . ! ? and
// at the end of the paragraph. A sentence fails with two distinct stop-words,
// or two distinct Polish-looking words, or one of each. Reports the line where
// the sentence first fails.
function sentenceFindings(para, markdown) {
  const out = [];
  let stops = new Set();
  let looks = new Set();
  let reported = false;
  const reset = () => { stops = new Set(); looks = new Set(); reported = false; };
  for (const l of para.lines) {
    let s = stripUrls(l.text);
    if (markdown) s = stripInlineCode(s);
    const re = /[\p{L}\p{M}][\p{L}\p{M}\p{N}]*|[.!?](?=\s|$)/gu;
    let m;
    while ((m = re.exec(s)) !== null) {
      const tok = m[0];
      if (/^[.!?]$/.test(tok)) { reset(); continue; }
      const f = fold(tok);
      if (STOPWORDS.has(f)) stops.add(f);
      else if (polishLooking(tok)) looks.add(f);
      else continue;
      if (!reported && (stops.size >= 2 || looks.size >= 2 || (stops.size >= 1 && looks.size >= 1))) {
        reported = true;
        out.push({ line: l.n, rule: 'sentence', word: [...stops, ...looks].slice(0, 3).join(', ') });
      }
    }
  }
  return out;
}

// One stop-word in a structural slot (a heading, a Tags value, a name).
// A Polish-looking word counts there too.
export function slotWords(s) {
  return wordsOf(s.replace(/([a-z])([A-Z])/g, '$1 $2')).map((w) => w.word).filter((w) => STOPWORDS.has(fold(w)) || polishLooking(w));
}

const MESSAGES = {
  letter: 'a Polish letter',
  'o-acute': 'a Polish word with o-acute',
  sentence: 'Polish words in one sentence',
  slot: 'a Polish word in a heading, a name or a tag',
};

export function describe(f) {
  return `${MESSAGES[f.rule]} ("${f.word}"). Everything written into Althing is English: translate it (the owner's words as "(translated from Polish)"), or, for a foreign proper name, propose an entry in rails/lexicon/foreign-allow.mjs with its reason.`;
}

// Scan one file's text. `path` decides Markdown handling and is itself
// scanned as a name. Returns [{ line, rule, word }], line 0 for the path.
export function scanEnglish(text, path = '', { allow = ALLOW } = {}) {
  const markdown = isMarkdown(path);
  const out = [];
  if (path) {
    for (const w of slotWords(path)) out.push({ line: 0, rule: 'slot', word: w });
  }
  const lines = linesOf(text, { markdown });
  for (const l of lines) {
    if (l.code) continue;
    const s = stripUrls(l.text);
    out.push(...letterFindings(s, l.n, allow));
    if (markdown && /^\s{0,3}#{1,6}\s/.test(l.text)) {
      for (const w of slotWords(stripInlineCode(s))) out.push({ line: l.n, rule: 'slot', word: w });
    }
    const tags = l.text.match(/^\s*\*\*Tags:\*\*(.*)$/);
    if (tags) for (const w of slotWords(tags[1])) out.push({ line: l.n, rule: 'slot', word: w });
  }
  for (const p of paragraphsOf(lines)) out.push(...sentenceFindings(p, markdown));
  return dedupe(out);
}

// A commit message: the letter and sentence rules, no slot rule (its subject
// is prose). Lines starting with '#' are git's comments and are skipped.
export function scanMessage(text) {
  const kept = text.split(/\r?\n/).map((t) => (t.startsWith('#') ? '' : t)).join('\n');
  const lines = linesOf(kept, { markdown: false });
  const out = [];
  for (const l of lines) out.push(...letterFindings(stripUrls(l.text), l.n, ALLOW));
  for (const p of paragraphsOf(lines)) out.push(...sentenceFindings(p, false));
  return dedupe(out);
}

// A branch name, a tag name or a slug: one stop-word is enough.
export function scanName(name) {
  const out = [];
  out.push(...letterFindings(name, 0, ALLOW));
  for (const w of slotWords(name)) out.push({ line: 0, rule: 'slot', word: w });
  return dedupe(out);
}

function dedupe(fs) {
  const seen = new Set();
  return fs.filter((f) => {
    const k = `${f.line}|${f.rule}|${f.word}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ---- calibration (owner's machine only; prints counts, never text) ----------

const TEXT_EXT = new Set(['.md', '.mjs', '.js', '.json', '.yaml', '.yml', '.txt', '']);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'vendor', '.cache', 'repos', 'dist', 'build']);

function walk(p, out = []) {
  const st = statSync(p);
  if (st.isFile()) { if (TEXT_EXT.has(extname(p))) out.push(p); return out; }
  for (const e of readdirSync(p)) {
    if (SKIP_DIRS.has(e)) continue;
    walk(join(p, e), out);
  }
  return out;
}

function foldPolish(text) {
  let s = '';
  for (const ch of text) s += PL_LETTER.test(ch) || O_ACUTE.test(ch) ? fold(ch) : ch;
  return s;
}

function polishParagraphs(text, path) {
  const markdown = isMarkdown(path);
  const paras = paragraphsOf(linesOf(text, { markdown }));
  const res = [];
  for (const p of paras) {
    const joined = p.lines.map((l) => (markdown ? stripInlineCode(stripUrls(l.text)) : stripUrls(l.text))).join(' ');
    const words = wordsOf(joined).length;
    const polish = PL_LETTER.test(joined) || wordsOf(joined).some((w) => O_ACUTE.test(w.word) && STOPWORDS.has(fold(w.word)));
    res.push({ from: p.lines[0].n, to: p.lines[p.lines.length - 1].n, words, polish });
  }
  return res;
}

function flaggedIn(findings, from, to) {
  return findings.some((f) => f.line >= from && f.line <= to);
}

export function calibrate({ positive = [], negative = [], minWords = 6 }) {
  const pos = { files: 0, paragraphs: 0, short: 0, flagged: 0, foldedFlagged: 0 };
  for (const root of positive) {
    for (const file of walk(root)) {
      pos.files++;
      const text = readFileSync(file, 'utf8');
      const rel = relative(root, file);
      const found = scanEnglish(text, rel, { allow: new Set() }).filter((f) => f.line > 0);
      const folded = foldPolish(text);
      const foundFolded = scanEnglish(folded, rel, { allow: new Set() }).filter((f) => f.line > 0);
      for (const p of polishParagraphs(text, rel)) {
        if (!p.polish) continue;
        if (p.words < minWords) { pos.short++; continue; }
        pos.paragraphs++;
        if (flaggedIn(found, p.from, p.to)) pos.flagged++;
        if (flaggedIn(foundFolded, p.from, p.to)) pos.foldedFlagged++;
      }
    }
  }
  const neg = { files: 0, paragraphs: 0, flagged: 0, hits: [] };
  for (const root of negative) {
    for (const file of walk(root)) {
      neg.files++;
      const text = readFileSync(file, 'utf8');
      const found = scanEnglish(text, file, {}).filter((f) => f.line > 0);
      const paras = paragraphsOf(linesOf(text, { markdown: isMarkdown(file) }));
      neg.paragraphs += paras.length;
      for (const p of paras) {
        const hit = found.find((f) => f.line >= p.lines[0].n && f.line <= p.lines[p.lines.length - 1].n);
        if (hit) { neg.flagged++; neg.hits.push(`${file}:${hit.line} ${hit.rule} ${hit.word}`); }
      }
    }
  }
  return { positive: pos, negative: neg, minWords };
}

// ---- command line -------------------------------------------------------------

function main(argv) {
  if (argv[0] !== '--calibrate') {
    process.stdout.write('usage: node rails/english.mjs --calibrate --positive <dir>... --negative <path>... [--min-words n]\n');
    return argv.length ? 1 : 0;
  }
  const positive = [];
  const negative = [];
  let minWords = 6;
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--positive') positive.push(argv[++i]);
    else if (argv[i] === '--negative') negative.push(argv[++i]);
    else if (argv[i] === '--min-words') minWords = Number(argv[++i]);
    else { process.stderr.write(`unknown argument: ${argv[i]}\n`); return 1; }
  }
  const r = calibrate({ positive, negative, minWords });
  const pct = (a, b) => (b ? ((100 * a) / b).toFixed(2) : 'n/a');
  const p = r.positive;
  const n = r.negative;
  process.stdout.write(`positive: ${p.files} files, ${p.paragraphs} Polish paragraphs of at least ${r.minWords} words (${p.short} shorter ones not counted)\n`);
  process.stdout.write(`  flagged as written: ${p.flagged} (${pct(p.flagged, p.paragraphs)}%)\n`);
  process.stdout.write(`  flagged once folded to ASCII: ${p.foldedFlagged} (${pct(p.foldedFlagged, p.paragraphs)}%)\n`);
  process.stdout.write(`negative: ${n.files} files, ${n.paragraphs} paragraphs, flagged ${n.flagged}\n`);
  for (const h of n.hits) process.stdout.write(`  ${h}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  process.exitCode = main(process.argv.slice(2));
}
