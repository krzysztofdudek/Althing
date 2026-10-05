// Yggdrasil adapter for naming/kebab (per file).
import { checkKebab } from '../layout.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    const msg = checkKebab(f.path);
    if (msg) out.push({ message: `naming/kebab: ${msg}`, file: f.path, line: 1 });
  }
  return out;
}
