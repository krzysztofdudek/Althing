// Yggdrasil adapter for layout/root (per node: the root node's files).
import { checkRoot } from '../layout.mjs';

export function check(ctx) {
  return checkRoot(ctx.files).map((v) => ({ ...v, message: `layout/root: ${v.message}` }));
}
