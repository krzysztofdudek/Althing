// Yggdrasil adapter for freeze/holds (per node). A frozen directory's
// FROZEN.sha256 sits at its top: in a research folder, or in a release
// directory, where the loop node reads it through its relation to the record.
import { parseFreeze, checkFreeze, FREEZE_FILE } from '../freeze.mjs';
import { tryRead } from './read.mjs';

function rootsOf(ctx) {
  const roots = new Map();
  for (const f of ctx.files) {
    if (f.path.endsWith(`/${FREEZE_FILE}`)) roots.set(f.path.slice(0, -FREEZE_FILE.length - 1), f.content);
    const loop = /^(releases\/[^/]+)\/\.jarl\//.exec(f.path);
    if (loop && !roots.has(loop[1])) {
      const t = tryRead(ctx, `${loop[1]}/${FREEZE_FILE}`);
      if (typeof t === 'string') roots.set(loop[1], t);
    }
  }
  return roots;
}

export function check(ctx) {
  const out = [];
  const isLoopNode = ctx.files.some((f) => /^releases\/[^/]+\/\.jarl\//.test(f.path));
  for (const [root, text] of rootsOf(ctx)) {
    const files = ctx.files.filter((f) => f.path.startsWith(`${root}/`));
    const owns = (rel) => (root.startsWith('releases/') ? rel.startsWith('.jarl/') === isLoopNode : true);
    for (const v of checkFreeze({ root, list: parseFreeze(text), files, owns })) {
      out.push({ message: `freeze/holds: ${v.message}`, file: v.file || (files[0] && files[0].path), line: 1 });
    }
  }
  return out;
}
