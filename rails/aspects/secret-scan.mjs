// Yggdrasil adapter for secret-scan (per file).
import { scanSecrets, describeSecret } from '../secrets.mjs';
import { hasNul } from '../binaries.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    if (hasNul(f.content)) continue;
    for (const x of scanSecrets(f.content)) {
      out.push({ message: `secret-scan: ${describeSecret(x)}`, file: f.path, line: x.line });
    }
  }
  return out;
}
