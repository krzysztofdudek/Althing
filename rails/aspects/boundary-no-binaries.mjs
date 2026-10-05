// Yggdrasil adapter for boundary/no-binaries (per file).
import { scanBinary, describeBinary } from '../binaries.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    const reason = scanBinary(f.path, f.content);
    if (reason) out.push({ message: `boundary/no-binaries: ${describeBinary(reason)}`, file: f.path, line: 1 });
  }
  return out;
}
