// usage: node cancel-parse.mjs <typescript|csharp> <sizeKiB> <stopAfterBytes>
import * as TreeSitter from 'web-tree-sitter';
import { readFileSync } from 'node:fs';

const shapes = {
  typescript: { file: 'tree-sitter-typescript.wasm', prefix: '', unit: 'a<a,' },
  csharp: { file: 'tree-sitter-c_sharp.wasm', prefix: 'int x = f(', unit: 'a < b, ' },
};
const [language, sizeKiB, stopAfter] = process.argv.slice(2);
const shape = shapes[language];
const bytes = Number(sizeKiB) * 1024;
const content = (shape.prefix + shape.unit.repeat(Math.ceil(bytes / shape.unit.length))).slice(0, bytes);
await TreeSitter.Parser.init();
const parser = new TreeSitter.Parser();
parser.setLanguage(await TreeSitter.Language.load(readFileSync(`/app/grammars/${shape.file}`)));
let calls = 0;
const started = performance.now();
const tree = parser.parse(content, undefined, {
  progressCallback: (state) => {
    calls += 1;
    return state.currentOffset > Number(stopAfter);
  },
});
console.log(JSON.stringify({
  language,
  sizeKiB: Number(sizeKiB),
  stopAfterBytes: Number(stopAfter),
  result: tree === null ? 'null (cancelled)' : 'tree',
  progressCalls: calls,
  parseMs: Math.round(performance.now() - started),
  peakRssMiB: Math.round(process.resourceUsage().maxRSS / 1024),
}));
