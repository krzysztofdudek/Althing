// usage: node classify-folder.mjs <path of a Runes checkout at v1.1.0, built, with .grammars/> <folder of source files> [--files]
// Prints, for every use the extractors read in every file of the folder (a git-free walk), the line, the candidates and the classifyUse answer, with the Runes reader a consumer that passes the folder as a listed file view gets.
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const runes = path.resolve(process.argv[2]);
const repo = path.resolve(process.argv[3]);
const require = createRequire(path.join(runes, 'package.json'));
const load = (p) => import(pathToFileURL(path.join(runes, 'dist', p)).href);
const [relations, ast, langs] = await Promise.all([load('relations/index.mjs'), load('ast/index.mjs'), load('grammars/languages.mjs')]);
const TreeSitter = await import(pathToFileURL(require.resolve('web-tree-sitter')).href);
const host = ast.createParserHost({ runtime: TreeSitter, runtimeIdentity: () => ast.fileSha256(require.resolve('web-tree-sitter/web-tree-sitter.wasm')), grammarDirs: [path.join(runes, '.grammars')] });
const walk = (dir, rel = '') => readdirSync(path.join(dir, rel), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === '.git' ? [] : walk(dir, path.posix.join(rel, e.name))) : [path.posix.join(rel, e.name)]);
const listed = walk(repo).sort();
const read = (p) => readFileSync(path.join(repo, p), 'utf8');
const view = relations.listedFileView(listed, read);
const extLang = new Map();
for (const def of Object.values(langs.LANGUAGES)) for (const e of def.extensions) extLang.set(e.toLowerCase(), def.id);
const ownerOf = (f) => path.posix.dirname(f);
const symbolTable = new relations.SymbolTable();
const sources = [];
for (const file of listed) {
  let code = read(file);
  let parsePath = file;
  let language = extLang.get(path.posix.extname(file).toLowerCase());
  const sfc = relations.sfcScriptView(file, code);
  if (sfc) { code = sfc.content; parsePath = sfc.parsePath; language = sfc.language; }
  if (!language || !relations.extractorForLanguage(language)) continue;
  const extractor = relations.extractorForLanguage(language);
  const record = await host.withParsedFile(parsePath, code, (tree) => {
    const parsed = { path: file, content: code, tree, language, newParser: host.newParser };
    return { path: file, language, declarations: extractor.declarations(parsed), detected: extractor.uses(parsed) };
  });
  for (const d of record.declarations) symbolTable.declare(language, d.symbolKey, file);
  sources.push(record);
}
const resolvePathToFile = relations.makeResolvePathToFile(repo, ownerOf, undefined, { files: view });
const resolver = relations.makeResolver({ ownerIndex: { ownerOf }, symbolTable, resolvePathToFile });
for (const s of sources) {
  for (const dep of s.detected) {
    const answer = resolver.classifyUse(dep.candidates, s.path, s.language);
    console.log(`${s.path}:${dep.line}\t${dep.candidates.map((c) => c.symbolKey ?? c.specifier ?? JSON.stringify(c)).join(' | ')}\t${JSON.stringify(answer)}`);
  }
}
console.log(`files read: ${sources.map((s) => s.path).join(', ')}`);
