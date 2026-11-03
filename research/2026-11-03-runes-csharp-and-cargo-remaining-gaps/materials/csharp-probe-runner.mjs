// Runs C# probe cases (the reference-case format of Runes) against one Runes tree and prints the edges each gives next to the edges the probe expects.
// Usage, from the Runes tree's directory: node csharp-probe-runner.mjs <runes tree> <probe.md>...
// The tree's own reference-case runner is used (loadCaseDoc + caseEdges), so the pipeline is the real one: extractor, symbol table, global-using pre-pass, reachability (where the tree has it), resolver.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [tree, ...probes] = process.argv.slice(2);
if (!tree || probes.length === 0) {
  console.error('usage: node csharp-probe-runner.mjs <runes tree> <probe.md>...');
  process.exit(2);
}
const runner = await import(pathToFileURL(path.resolve(tree, 'test/relations/reference-case-runner.mjs')).href);
const key = (e) => `${e.fromFile}:${e.line}->${e.owner}`;
let differ = 0;
for (const probe of probes) {
  const id = path.basename(probe, '.md');
  let doc;
  try {
    doc = runner.loadCaseDoc(id, probe);
  } catch (err) {
    console.log(`${id}: LOAD ERROR ${err.message}`);
    differ++;
    continue;
  }
  let edges;
  try {
    edges = await runner.caseEdges(doc);
  } catch (err) {
    console.log(`${id}: RUN ERROR ${err.message}`);
    differ++;
    continue;
  }
  const actual = [...new Set(edges.map(key))].sort();
  const expected = doc.expectEdges.map(key).sort();
  const same = actual.length === expected.length && actual.every((k, i) => k === expected[i]);
  console.log(`${id}: ${same ? 'PASS' : 'DIFFERS'}`);
  console.log(`  expected: ${expected.length === 0 ? 'silence' : expected.join(', ')}`);
  console.log(`  actual:   ${actual.length === 0 ? 'silence' : actual.join(', ')}`);
  if (!same) differ++;
}
console.log(`${probes.length} probes, ${differ} differ from the expectation`);
