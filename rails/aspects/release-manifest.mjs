// Yggdrasil adapter for release/manifest (per node): every family.json of the
// node is a valid family-release/1 manifest.
import { validateManifest } from '../manifest.mjs';
import { parseFreeze, FREEZE_FILE } from '../freeze.mjs';
import { tryRead, ownFile, registryOf } from './read.mjs';

export function check(ctx) {
  const out = [];
  for (const f of ctx.files) {
    const m = /^releases\/([^/]+)\/family\.json$/.exec(f.path);
    if (!m) continue;
    let doc;
    try { doc = JSON.parse(f.content); } catch (e) { out.push({ message: `release/manifest: family.json does not parse: ${e.message}`, file: f.path, line: 1 }); continue; }
    const freeze = ownFile(ctx, `releases/${m[1]}/${FREEZE_FILE}`);
    const msgs = validateManifest(doc, {
      dir: m[1],
      registry: registryOf(ctx),
      previousExists: (v) => { const t = tryRead(ctx, `releases/${v}/family.json`); return t === null ? null : t !== false; },
      frozen: freeze ? new Set(parseFreeze(freeze.content).keys()) : null,
    });
    for (const msg of msgs) out.push({ message: `release/manifest: ${msg}`, file: f.path, line: 1 });
  }
  return out;
}
