// The private-paths detector (rail boundary/no-private-paths). Althing names no
// machine: no absolute local path (a home directory, the system temporary
// directory, a Windows user folder), no file URL, no path shaped like a private
// practice repository's client or journal area, and no relative link that
// climbs out of the repository. Names themselves are the keyed names rail's job.
//
// One narrow allowance: Jarl writes the worktree a lease ran in into its record,
// as the **Worktree:** header field of an issue and as "· worktree <path>" in a
// log line. Inside releases/<v>/.jarl/, and only there, a worktree under a home
// directory's .jarl-wt/ or the devcontainer's wt/ root is allowed in those two
// places. Everything else is refused.

import { isMarkdown, linesOf } from './markdown.mjs';

const PATTERNS = [
  { re: /(?<![\w.~/-])\/(?:Users|home|private)\/[^\s'"`)\]>,;]+/g, label: 'an absolute path under a home or system directory' },
  { re: /(?<![\w.~/-])\/(?:tmp|var\/folders)(?=[/\s'"`)\]>,;]|$)[^\s'"`)\]>,;]*/g, label: 'a path in the system temporary directory' },
  { re: /\b[A-Za-z]:\\(?:Users|Documents and Settings)\\[^\s'"`]*/gi, label: 'a Windows user path' },
  { re: /\bfile:\/\/[^\s'"`)\]>]*/gi, label: 'a file URL' },
  { re: /(?<![\w./-])clients\/[a-z0-9][a-z0-9_-]*\//g, label: "a path shaped like a private practice repository's client area" },
  { re: /(?<![\w./-])journal\/\d{4}-\d{2}-\d{2}/g, label: 'a path shaped like a private journal entry' },
];

const LOOP_FILE = /^releases\/[^/]+\/\.jarl\//;
const ALLOWED_WORKTREE = /^\/(?:(?:Users|home)\/[^/\s]+\/\.jarl-wt|home\/node\/wt)\/[^/\s]+\/?$/;

function allowedInLoop(path, lineText, hit, index) {
  if (!LOOP_FILE.test(path)) return false;
  if (!ALLOWED_WORKTREE.test(hit)) return false;
  if (/^\s*\*\*Worktree:\*\*/.test(lineText)) return true;
  return /· worktree $/.test(lineText.slice(0, index)) && /(^|\/)log\.md$/.test(path);
}

const LINK = /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|^\s*\[[^\]]+\]:\s*<?(\S+?)>?(?:\s|$)/g;

// Relative link targets of a Markdown line (not URLs, anchors or absolute paths).
export function linkTargets(text) {
  const out = [];
  let m;
  LINK.lastIndex = 0;
  while ((m = LINK.exec(text)) !== null) {
    const raw = (m[1] || m[2] || '').trim();
    if (!raw || raw.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) continue;
    out.push({ target: raw.split('#')[0].split('?')[0], index: m.index });
  }
  return out;
}

// Resolve a relative target against the file's directory. Returns the
// repository-relative path, or null when it climbs above the root.
export function resolveLink(fromPath, target) {
  const parts = target.startsWith('/') ? [] : fromPath.split('/').slice(0, -1);
  for (const seg of target.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') { if (!parts.length) return null; parts.pop(); } else parts.push(decodeURIComponent(seg));
  }
  return parts.join('/');
}

// Scan one file. Returns [{ line, label, hit }].
export function scanPaths(text, path = '') {
  const out = [];
  const markdown = isMarkdown(path);
  for (const l of linesOf(text, { markdown })) {
    for (const { re, label } of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(l.text)) !== null) {
        if (allowedInLoop(path, l.text, m[0], m.index)) continue;
        out.push({ line: l.n, label, hit: m[0] });
      }
    }
    if (markdown && !l.code) {
      for (const { target } of linkTargets(l.text)) {
        if (target && !target.startsWith('/') && resolveLink(path, target) === null) {
          out.push({ line: l.n, label: 'a relative link that climbs out of the repository', hit: target });
        }
      }
    }
  }
  return out;
}

export function describePath(f) {
  return `${f.label} ("${f.hit}"). Write it relative to the repository, as a placeholder a brief fills in per machine, or in plain words; link other repositories by their GitHub URL.`;
}
