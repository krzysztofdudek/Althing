// Yggdrasil adapter for links/resolve (per file): reads the node's own mapping
// and the mappings of the nodes it declares relations to.
import { scanLinks, describeLink } from '../links.mjs';

export function check(ctx) {
  const out = [];
  const regions = [ctx.node.mapping];
  for (const r of ctx.graph.relationsFrom(ctx.node)) {
    const id = typeof r.target === 'string' ? r.target : r.target?.id;
    const n = id ? ctx.graph.node(id) : undefined;
    if (n) regions.push(n.mapping);
  }
  for (const f of ctx.files) {
    for (const x of scanLinks(f, { regions, exists: (p) => ctx.fs.exists(p) })) {
      out.push({ message: `links/resolve: ${describeLink(x)}`, file: f.path, line: x.line });
    }
  }
  return out;
}
