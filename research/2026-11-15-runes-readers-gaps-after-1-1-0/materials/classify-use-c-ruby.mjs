// usage: node classify-use-c-ruby.mjs <path of a Runes checkout at v1.1.0 with dist/ built>
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const runes = path.resolve(process.argv[2]);
const { makeResolver, makeResolvePathToFile, listedFileView } = await import(pathToFileURL(path.join(runes, 'dist/relations/index.mjs')).href);
const files = ['src/main.c', 'src/util.h', 'src/main.cpp', 'app/main.rb', 'app/util.rb'];
const view = listedFileView(files, () => '');
const resolvePathToFile = makeResolvePathToFile('/nonexistent', undefined, undefined, { files: view });
const resolver = makeResolver({ resolvePathToFile, ownerOf: () => 'o', symbolTable: undefined });
const cases = [
  ['c', 'src/main.c', { kind: 'path', specifier: 'missing.h' }],
  ['c', 'src/main.c', { kind: 'path', specifier: 'stdio.h' }],
  ['cpp', 'src/main.cpp', { kind: 'path', specifier: 'vector' }],
  ['cpp', 'src/main.cpp', { kind: 'path', specifier: 'missing.hpp' }],
  ['ruby', 'app/main.rb', { kind: 'path', specifier: 'json' }],
  ['ruby', 'app/main.rb', { kind: 'path', specifier: './missing' }],
  ['python', 'app/main.py', { kind: 'path', specifier: 'os' }],
];
for (const [language, from, hint] of cases) console.log(language, JSON.stringify(hint), JSON.stringify(resolver.classifyUse([hint], from, language)));
