// Yggdrasil adapter for index/in-sync (per node, advisory).
import { renderReleasesIndex, renderResearchIndex, sameIndex } from '../index.mjs';
import { tryRead, ownFile } from './read.mjs';

const FIX = 'Run node workspace/ws.mjs index and commit the result.';

export function check(ctx) {
  const out = [];
  const research = ownFile(ctx, 'research/INDEX.md');
  if (research) {
    const dirs = new Set();
    for (const f of ctx.files) { const m = /^research\/([^/]+)\//.exec(f.path); if (m) dirs.add(m[1]); }
    const folders = [...dirs].map((dir) => ({ dir, readme: (ownFile(ctx, `research/${dir}/README.md`) || {}).content || '' }));
    if (!sameIndex(research.content, renderResearchIndex(folders))) out.push({ message: `index/in-sync: research/INDEX.md is not what ws index writes. ${FIX}`, file: research.path, line: 1 });
  }
  const releases = ownFile(ctx, 'releases/INDEX.md');
  if (releases) {
    const versions = new Set();
    for (const r of ctx.graph.relationsFrom(ctx.node)) {
      const id = typeof r.target === 'string' ? r.target : r.target?.id;
      const n = id ? ctx.graph.node(id) : undefined;
      for (const e of (n && n.mapping) || []) { const m = /^releases\/(\d+\.\d+\.\d+)\//.exec(e); if (m) versions.add(m[1]); }
    }
    const list = [...versions].map((version) => {
      const t = tryRead(ctx, `releases/${version}/family.json`);
      let manifest = null;
      try { manifest = typeof t === 'string' ? JSON.parse(t) : null; } catch { manifest = null; }
      return { version, manifest };
    });
    if (!sameIndex(releases.content, renderReleasesIndex(list))) out.push({ message: `index/in-sync: releases/INDEX.md is not what ws index writes, or a release's node is missing from the index node's relations. ${FIX}`, file: releases.path, line: 1 });
  }
  return out;
}
