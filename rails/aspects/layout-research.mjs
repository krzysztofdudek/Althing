// Yggdrasil adapter for layout/research (per node).
import { checkResearch } from '../layout.mjs';

export function check(ctx) {
  return checkResearch(ctx.files).map((v) => ({ ...v, message: `layout/research: ${v.message}` }));
}
