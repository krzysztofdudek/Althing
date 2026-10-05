// Yggdrasil adapter for canon/registry-consistent (per node: family/).
import { checkCanon } from '../canon.mjs';
import { ownFile } from './read.mjs';

export function check(ctx) {
  const reg = ownFile(ctx, 'family/registry.json');
  if (!reg) return [];
  let registry;
  try { registry = JSON.parse(reg.content); } catch { return []; }
  const docs = {};
  for (const p of ['family/canon.md', 'family/map.md', 'family/contracts.md']) { const f = ownFile(ctx, p); if (f) docs[p] = f.content; }
  return checkCanon(registry, docs).map((v) => ({ message: `canon/registry-consistent: ${v.message}`, file: v.file, line: 1 }));
}
