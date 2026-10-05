// The freeze detector (rail freeze/holds). A cited research folder or a closed
// release is frozen: FROZEN.sha256 lists the SHA-256 of every file under its
// directory, and from then on every listed file matches and nothing unlisted
// is added. ws freeze writes the file; this checks it. Hashes are taken over
// the UTF-8 text, the way the gate reads every file.

import { createHash } from 'node:crypto';

export const FREEZE_FILE = 'FROZEN.sha256';

export function sha256(text) {
  return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex');
}

// "<64 hex>  <path relative to the frozen directory>" per line.
export function parseFreeze(text) {
  const map = new Map();
  for (const line of text.split(/\r?\n/)) {
    const m = /^([0-9a-f]{64})\s+(\S.*)$/.exec(line.trim());
    if (m) map.set(m[2], m[1]);
  }
  return map;
}

export function renderFreeze(entries) {
  return [...entries].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([p, h]) => `${h}  ${p}`).join('\n') + '\n';
}

// checkFreeze({ root, list, files, owns })
//   root   the frozen directory (repository-relative)
//   list   parseFreeze() of its FROZEN.sha256
//   files  this node's files under root: [{ path, content }]
//   owns   (relativePath) => true when that entry belongs to this node
export function checkFreeze({ root, list, files, owns = () => true }) {
  const out = [];
  const have = new Map(files.map((f) => [f.path.slice(root.length + 1), f]));
  for (const [rel, hash] of list) {
    if (!owns(rel)) continue;
    const f = have.get(rel);
    if (!f) out.push({ file: null, message: `${root}/${rel} is listed in ${FREEZE_FILE} but is gone. A frozen directory never changes; restore it from git.` });
    else if (sha256(f.content) !== hash) out.push({ file: f.path, message: `${f.path} changed after ${root} was frozen. Restore it from git; a correction is new work in a new place, never an edit here.` });
  }
  for (const [rel, f] of have) {
    if (rel === FREEZE_FILE || !owns(rel)) continue;
    if (!list.has(rel)) out.push({ file: f.path, message: `${f.path} was added after ${root} was frozen.` });
  }
  return out;
}
