// usage: node parse-memory.mjs <typescript|csharp> <sizeKiB>
import * as TreeSitter from 'web-tree-sitter';
import { createRequire } from 'node:module';
import { createParserHost, fileSha256 } from '@chrisdudek/runes/ast';

const shapes = {
  typescript: { file: 'shape.ts', prefix: '', unit: 'a<a,' },
  csharp: { file: 'shape.cs', prefix: 'int x = f(', unit: 'a < b, ' },
};
const [language, sizeKiB] = process.argv.slice(2);
const shape = shapes[language];
const bytes = Number(sizeKiB) * 1024;
const content = (shape.prefix + shape.unit.repeat(Math.ceil(bytes / shape.unit.length))).slice(0, bytes);
const require = createRequire(import.meta.url);
const host = createParserHost({
  runtime: TreeSitter,
  runtimeIdentity: () => fileSha256(require.resolve('web-tree-sitter/web-tree-sitter.wasm')),
  grammarDirs: ['/app/grammars'],
});
const started = performance.now();
let rootChildren = null;
let error = null;
try {
  rootChildren = await host.withParsedFile(shape.file, content, (tree) => tree.rootNode.childCount);
} catch (caught) {
  error = String(caught?.message ?? caught).split('\n')[0];
}
const parseMs = Math.round(performance.now() - started);
console.log(JSON.stringify({
  language,
  sizeKiB: Number(sizeKiB),
  bytes: content.length,
  parseMs,
  peakRssMiB: Math.round(process.resourceUsage().maxRSS / 1024),
  rootChildren,
  error,
  node: process.version,
}));
