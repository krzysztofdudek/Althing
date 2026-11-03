// Runs Rust probe cases (reference-catalogue-shaped .md files under materials/probes/rust/) through the real relation pass of a given Runes tree, and prints every cross-owner edge each one emits. Usage: node rust-probe-runner.mjs <tree> <probe.md>... The tree is a built Runes checkout (dist/ and .grammars/ present); its own reference-case runner is imported by absolute path so the package's self-references resolve inside that tree.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [tree, ...probes] = process.argv.slice(2);
if (!tree || probes.length === 0) {
  console.error('usage: node rust-probe-runner.mjs <tree> <probe.md>...');
  process.exit(2);
}
const runner = await import(pathToFileURL(path.join(tree, 'test', 'relations', 'reference-case-runner.mjs')).href);
for (const probe of probes) {
  const id = path.basename(probe, '.md');
  const doc = runner.loadCaseDoc(id, probe);
  const edges = await runner.caseEdges(doc);
  const lines = edges.map((e) => `${e.fromFile}:${e.line} -> node:${e.owner}`).sort();
  console.log(`${id}: ${lines.length === 0 ? 'silence' : lines.join(' | ')}`);
}
