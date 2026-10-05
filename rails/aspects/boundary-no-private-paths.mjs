// Yggdrasil adapter for boundary/no-private-paths (per file).
import { scanPaths, describePath } from '../paths.mjs';
import { hasNul } from '../binaries.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    if (hasNul(f.content)) continue;
    for (const x of scanPaths(f.content, f.path)) {
      out.push({ message: `boundary/no-private-paths: ${describePath(x)}`, file: f.path, line: x.line });
    }
  }
  return out;
}
