// Yggdrasil adapter for layout/family (per node).
import { checkFamily } from '../layout.mjs';

export function check(ctx) {
  return checkFamily(ctx.files).map((v) => ({ ...v, message: `layout/family: ${v.message}` }));
}
