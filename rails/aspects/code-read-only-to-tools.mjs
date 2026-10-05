// Yggdrasil adapter for code/read-only-to-tools (per file).
import { scanCode, describeCode } from '../code.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    for (const x of scanCode(f.path, f.content)) out.push({ message: `code/read-only-to-tools: ${describeCode(x)}`, file: f.path, line: x.line });
  }
  return out;
}
