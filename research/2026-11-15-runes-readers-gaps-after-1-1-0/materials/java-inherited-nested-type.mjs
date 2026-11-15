// usage: node java-inherited-nested-type.mjs <Runes checkout at v1.1.0, built, with .grammars/> <git checkout of a Java repository>
// Prints the classifyUse answers of every Java use of the repository, their tally, and each use answered unfollowed.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const runes = path.resolve(process.argv[2]);
const repo = path.resolve(process.argv[3]);
const require = createRequire(path.join(runes, 'package.json'));
const load = (p) => import(pathToFileURL(path.join(runes, 'dist', p)).href);
const [relations, ast] = await Promise.all([load('relations/index.mjs'), load('ast/index.mjs')]);
const TreeSitter = await import(pathToFileURL(require.resolve('web-tree-sitter')).href);
const host = ast.createParserHost({ runtime: TreeSitter, runtimeIdentity: () => ast.fileSha256(require.resolve('web-tree-sitter/web-tree-sitter.wasm')), grammarDirs: [path.join(runes, '.grammars')] });
const tracked = execFileSync('git', ['ls-files'], { cwd: repo, encoding: 'utf8' }).split('\n').filter(Boolean).sort();
const read = (p) => readFileSync(path.join(repo, p), 'utf8');
const view = relations.listedFileView(tracked, read);
const ownerOf = (f) => path.posix.dirname(f);
const symbolTable = new relations.SymbolTable();
const extractor = relations.extractorForLanguage('java');
const sources = [];
for (const file of tracked.filter((f) => f.endsWith('.java'))) {
  const code = read(file);
  const record = await host.withParsedFile(file, code, (tree) => {
    const parsed = { path: file, content: code, tree, language: 'java', newParser: host.newParser };
    return { path: file, declarations: extractor.declarations(parsed), detected: extractor.uses(parsed) };
  });
  for (const d of record.declarations) symbolTable.declare('java', d.symbolKey, file);
  sources.push(record);
}
const resolvePathToFile = relations.makeResolvePathToFile(repo, ownerOf, undefined, { files: view });
const resolver = relations.makeResolver({ ownerIndex: { ownerOf }, symbolTable, resolvePathToFile });
const tally = {};
let uses = 0;
for (const s of sources) {
  for (const dep of s.detected) {
    const answer = resolver.classifyUse(dep.candidates, s.path, 'java');
    const key = answer.kind + (answer.reason ? `:${answer.reason}` : '');
    tally[key] = (tally[key] ?? 0) + 1;
    uses++;
    if (answer.reason === 'unfollowed') console.log(`${s.path}:${dep.line}\t${dep.candidates.map((c) => c.symbolKey ?? c.specifier).join(' | ')}`);
  }
}
console.log(`uses ${uses}`, JSON.stringify(tally));
