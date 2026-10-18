// The message rail (19): a commit message is English, carries no URL other
// than public GitHub and the family's own sites (so no link to an agent
// session or a private host; a trailer value is a line like any other), no
// local path, and no Claude-Session trailer. Standard trailers (Signed-off-by,
// Reviewed-by, Fixes, Refs, Co-Authored-By) are allowed. Branch names are
// English too. The keyed names scan reads messages separately.

import { scanMessage, scanName, describe } from './english.mjs';
import { scanPaths, describePath } from './paths.mjs';

const ALLOWED_HOSTS = [/^(?:www\.)?github\.com$/, /^[a-z0-9-]+\.github\.io$/, /^(?:gist\.)?github(?:usercontent)?\.com$/, /^(?:www\.)?chrisdudek\.com$/, /^(?:www\.)?npmjs\.com$/];
const URL = /\b(?:[a-z][a-z0-9+.-]*):\/\/([^/\s<>()"'`]+)[^\s<>()"'`]*|\bwww\.([^/\s<>()"'`]+)/gi;

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
  // The session trailer: refused wherever it stands, as a trailer or a line of its own.
  lines.forEach((l, i) => {
    if (/^claude-session\s*:/i.test(l.trim())) out.push({ line: i + 1, message: 'the trailer "Claude-Session:" is not allowed: a commit message never links an agent session. Other standard trailers (Signed-off-by, Reviewed-by, Fixes, Refs, Co-Authored-By) are fine.' });
  });
  return out;
}

export function scanBranch(name) {
  return scanName(name).map((f) => ({ line: 0, message: `the branch name "${name}": ${describe(f)}` }));
}
