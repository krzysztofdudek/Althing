// The message rail (19): a commit message is English, carries no URL other
// than public GitHub and the family's own sites (so no link to an agent
// session or a private host), no local path, and no trailer other than the
// attribution line the session's harness provides (Co-Authored-By). Branch
// names are English too. The keyed names scan reads messages separately.

import { scanMessage, scanName, describe } from './english.mjs';
import { scanPaths, describePath } from './paths.mjs';

const ALLOWED_HOSTS = [/^(?:www\.)?github\.com$/, /^[a-z0-9-]+\.github\.io$/, /^(?:gist\.)?github(?:usercontent)?\.com$/, /^(?:www\.)?chrisdudek\.com$/, /^(?:www\.)?npmjs\.com$/];
const URL = /\b(?:[a-z][a-z0-9+.-]*):\/\/([^/\s<>()"'`]+)[^\s<>()"'`]*|\bwww\.([^/\s<>()"'`]+)/gi;
const TRAILER = /^([A-Za-z][A-Za-z0-9-]*):\s+\S/;

export function scanMessageRail(text) {
  const out = [];
  const body = text.split(/\r?\n/).filter((l) => !l.startsWith('#')).join('\n').replace(/\s+$/, '');
  for (const f of scanMessage(body)) out.push({ line: f.line, message: `English: ${describe(f)}` });
  const lines = body.split('\n');
  lines.forEach((l, i) => {
    URL.lastIndex = 0;
    let m;
    while ((m = URL.exec(l)) !== null) {
      const host = (m[1] || m[2] || '').toLowerCase().replace(/[.,;:!?)]+$/, '').replace(/:\d+$/, '').replace(/^.*@/, '');
      if (!ALLOWED_HOSTS.some((re) => re.test(host))) out.push({ line: i + 1, message: `a URL to ${host}: a commit message links only public GitHub and the family's own sites, never an agent session or a private host.` });
    }
  });
  for (const p of scanPaths(body, '')) out.push({ line: p.line, message: describePath(p) });
  // The trailer block: the last paragraph, when every line of it is "Key: value".
  const paras = body.split(/\n\s*\n/);
  const last = paras.length > 1 ? paras[paras.length - 1].split('\n') : [];
  if (last.length && last.every((l) => TRAILER.test(l))) {
    const start = lines.length - last.length;
    last.forEach((l, i) => {
      const key = TRAILER.exec(l)[1];
      if (key.toLowerCase() !== 'co-authored-by') out.push({ line: start + i + 1, message: `the trailer "${key}:" is not allowed: a message ends with the harness's attribution line (Co-Authored-By) and nothing else.` });
    });
  }
  return out;
}

export function scanBranch(name) {
  return scanName(name).map((f) => ({ line: 0, message: `the branch name "${name}": ${describe(f)}` }));
}
