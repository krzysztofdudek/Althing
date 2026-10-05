// Yggdrasil adapter for layout/release (per node).
import { checkRelease } from '../layout.mjs';

export function check(ctx) {
  return checkRelease(ctx.files).map((v) => ({ ...v, message: `layout/release: ${v.message}` }));
}
