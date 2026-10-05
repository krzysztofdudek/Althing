// Yggdrasil adapter for lang/english (per file). A file with a NUL byte is left
// to boundary/no-binaries.
import { scanEnglish, describe } from '../english.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    if (f.content.includes('\u0000')) continue;
    for (const x of scanEnglish(f.content, f.path)) {
      out.push({ message: `lang/english: ${describe(x)}`, file: f.path, line: x.line || 1 });
    }
  }
  return out;
}
