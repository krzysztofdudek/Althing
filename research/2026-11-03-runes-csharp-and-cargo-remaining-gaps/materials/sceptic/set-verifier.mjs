// Sets the field "verifier" on each item of csharp-findings.json and nothing else. Usage: node set-verifier.mjs <csharp-findings.json>
import fs from 'node:fs';

const verdicts = {
  'csharp-1-nestencl': 'confirmed',
  'csharp-1-inhermem': 'confirmed',
  'csharp-1-basenest': 'confirmed-with-a-changed-severity (medium to low)',
  'csharp-1-arityign': 'confirmed',
  'csharp-1-delegate': 'confirmed-with-a-changed-severity (medium to low)',
  'csharp-1-attrread': 'confirmed',
  'csharp-1-extinstm': 'confirmed',
  'csharp-1-patterns': 'confirmed-with-a-changed-severity (medium to low)',
  'csharp-1-usingsta': 'confirmed',
  'csharp-1-reftypes': 'confirmed',
  'csharp-1-queryrng': 'confirmed',
  'csharp-1-fnptrtyp': 'confirmed',
  'csharp-1-filelocl': 'confirmed',
  'csharp-1-refnoout': 'confirmed',
  'csharp-1-compremv': 'confirmed',
};
const file = process.argv[2];
const items = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const item of items) {
  if (!(item.id in verdicts)) throw new Error(`no verdict for ${item.id}`);
  item.verifier = `skp-runes-csharp-opus: ${verdicts[item.id]}`;
}
if (items.length !== Object.keys(verdicts).length) throw new Error(`expected ${Object.keys(verdicts).length} items, found ${items.length}`);
fs.writeFileSync(file, JSON.stringify(items, null, 2) + '\n');
console.log(`${items.length} items given a verifier`);
