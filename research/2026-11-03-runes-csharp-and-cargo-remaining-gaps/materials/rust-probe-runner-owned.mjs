// Runs Rust probe cases through the real Rust relation pass of a given Runes tree, honouring a fence's `owner=` attribute even on trees whose own reference-case runner predates it (v1.0.0 reads only the parent directory's name). It does what both trees' runners do for a Rust case: parse every `.rs` file of the case, declare the extractor's symbols into one SymbolTable, materialize the files and the Cargo.toml files into a throwaway directory under the OS temp dir, resolve each detected dependency through makeResolver and makeResolvePathToFile, and print every edge whose target owner differs from the source file's owner. Usage: node rust-probe-runner-owned.mjs <tree> <probe.md>...
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [tree, ...probes] = process.argv.slice(2);
if (!tree || probes.length === 0) {
  console.error('usage: node rust-probe-runner-owned.mjs <tree> <probe.md>...');
  process.exit(2);
}
const imp = (rel) => import(pathToFileURL(path.join(tree, rel)).href);
const { withParsedFiles } = await imp('test/helpers/tree-sitter.mjs');
const { extractorForLanguage, SymbolTable, makeResolver, resolveDetectedEdges, makeResolvePathToFile } = await imp('dist/relations/index.mjs');

function loadProbe(file) {
  const text = readFileSync(file, 'utf-8');
  const filesStart = text.indexOf('## Files');
  const filesEnd = text.indexOf('\n## ', filesStart + 1);
  const section = text.slice(filesStart, filesEnd === -1 ? undefined : filesEnd);
  const fenceRe = /```[a-zA-Z+]*\s+path=([^\s`]+)(?:[ \t]+owner=([^\s`]+))?\n([\s\S]*?)```/g;
  const files = [];
  const configFiles = [];
  let m;
  while ((m = fenceRe.exec(section)) !== null) {
    const p = m[1].trim();
    const segs = p.split('/');
    if (p.endsWith('.rs')) files.push({ path: p, code: m[3], language: 'rust', owner: m[2] ?? (segs.length >= 2 ? segs[segs.length - 2] : '') });
    else configFiles.push({ path: p, code: m[3] });
  }
  return { files, configFiles };
}

for (const probe of probes) {
  const id = path.basename(probe, '.md');
  const doc = loadProbe(probe);
  const edges = await withParsedFiles(doc.files.map((f) => ({ path: f.path, code: f.code, language: f.language })), async (parsedFiles) => {
    const parsedByPath = new Map();
    doc.files.forEach((f, i) => parsedByPath.set(f.path, { ...parsedFiles[i], path: f.path }));
    const extractor = extractorForLanguage('rust');
    const symbolTable = new SymbolTable();
    for (const f of doc.files) for (const decl of extractor.declarations(parsedByPath.get(f.path))) symbolTable.declare('rust', decl.symbolKey, f.path);
    const owned = new Map(doc.files.map((f) => [f.path, f.owner]));
    const ownerOf = (file) => owned.get(file);
    const root = mkdtempSync(path.join(os.tmpdir(), 'rust-probe-'));
    try {
      for (const f of [...doc.files, ...doc.configFiles]) {
        const abs = path.join(root, f.path);
        mkdirSync(path.dirname(abs), { recursive: true });
        writeFileSync(abs, f.code, 'utf-8');
      }
      const resolver = makeResolver({ ownerIndex: { ownerOf }, symbolTable, resolvePathToFile: makeResolvePathToFile(root, ownerOf) });
      const out = [];
      for (const f of doc.files) {
        for (const { line, owner } of resolveDetectedEdges(extractor.uses(parsedByPath.get(f.path)), resolver, f.path, 'rust')) {
          if (owner !== f.owner) out.push(`${f.path}:${line} -> node:${owner}`);
        }
      }
      return out;
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  edges.sort();
  console.log(`${id}: ${edges.length === 0 ? 'silence' : edges.join(' | ')}`);
}
