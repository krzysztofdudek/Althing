// Yggdrasil adapter for skills/frontmatter (per file).
import { checkSkill } from '../skills.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    for (const msg of checkSkill(f.path, f.content)) out.push({ message: `skills/frontmatter: ${msg}`, file: f.path, line: 1 });
  }
  return out;
}
