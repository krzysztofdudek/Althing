// The Yggdrasil nodes of the releases region. Nodes are top-level siblings so
// that a loop never inherits the rails of the release record around it:
//   releases            releases/INDEX.md, related to every release record
//   release-<v>         releases/<v>/ outside the loop (family.json, plans/, briefs/, FROZEN.sha256)
//   release-<v>-loop    releases/<v>/.jarl/, related to its record (for the freeze file)
// A record relates to the previous release's record (its manifest names it)
// and to the family node when one exists (the registry).

import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readManifest, listReleases } from './releases.mjs';

const MODEL = ['.yggdrasil', 'model'];

function yamlList(items) {
  return items.map((x) => `  - ${x}`).join('\n');
}

function nodeFile({ name, type, description, mapping, relations = [] }) {
  const rel = relations.length ? `\nrelations:\n${relations.map((t) => `  - target: ${t}\n    type: uses`).join('\n')}` : '';
  return `name: ${name}\ntype: ${type}\ndescription: "${description}"\nmapping:\n${yamlList(mapping.map((m) => (m.includes('*') ? `"${m}"` : m)))}${rel}\n`;
}

function write(root, id, text) {
  const dir = join(root, ...MODEL, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'yg-node.yaml'), text);
  return `${MODEL.join('/')}/${id}/yg-node.yaml`;
}

export function releaseNodes(root, v) {
  const base = join(root, 'releases', v);
  if (!existsSync(join(base, 'family.json'))) throw new Error(`releases/${v}/family.json does not exist`);
  const written = [];
  const m = readManifest(root, v);
  const mapping = [`releases/${v}/*`];
  for (const d of ['plans', 'briefs']) if (existsSync(join(base, d)) && readdirSync(join(base, d)).length) mapping.push(`releases/${v}/${d}/`);
  const relations = [];
  if (m && m.previous && existsSync(join(root, 'releases', m.previous, 'family.json'))) relations.push(`release-${m.previous}`);
  if (existsSync(join(root, ...MODEL, 'family', 'yg-node.yaml'))) relations.push('family');
  written.push(write(root, `release-${v}`, nodeFile({ name: `Release${v.replace(/\./g, '_')}`, type: 'release-record', description: `Release ${v} outside its loop: the manifest, plans, brief templates and, once frozen, the freeze file.`, mapping, relations })));
  if (existsSync(join(base, '.jarl'))) {
    written.push(write(root, `release-${v}-loop`, nodeFile({ name: `Release${v.replace(/\./g, '_')}Loop`, type: 'release-loop', description: `The permanent Jarl loop of release ${v}, written through its driver Jarl, and by hand only in a conversion that follows the tool's conversion file.`, mapping: [`releases/${v}/.jarl/`], relations: [`release-${v}`] })));
  }
  return written;
}

export function indexNode(root) {
  if (!existsSync(join(root, 'releases', 'INDEX.md'))) return null;
  const records = listReleases(root).filter((v) => existsSync(join(root, ...MODEL, `release-${v}`, 'yg-node.yaml'))).map((v) => `release-${v}`);
  return write(root, 'releases', nodeFile({ name: 'Releases', type: 'release-record', description: 'The generated index of every release (releases/INDEX.md); it reads each release record through its relations.', mapping: ['releases/INDEX.md'], relations: records }));
}
