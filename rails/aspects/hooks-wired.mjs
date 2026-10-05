// Yggdrasil adapter for hooks/wired (per node: the hooks node and the ci node).
import { checkHooks, checkCi } from '../hooks.mjs';
import { tryRead } from './read.mjs';

const WORKFLOW = '.github/workflows/rails.yml';

export function check(ctx) {
  const hooks = {};
  for (const f of ctx.files) if (f.path.startsWith('.githooks/')) hooks[f.path] = f.content;
  const out = [];
  if (Object.keys(hooks).length) {
    for (const v of checkHooks(hooks, tryRead(ctx, WORKFLOW))) out.push({ message: `hooks/wired: ${v.message}`, file: v.file, line: 1 });
  }
  const wf = ctx.files.find((f) => f.path === WORKFLOW);
  if (wf) for (const v of checkCi(wf.path, wf.content)) out.push({ message: `hooks/wired: ${v.message}`, file: v.file, line: 1 });
  return out;
}
