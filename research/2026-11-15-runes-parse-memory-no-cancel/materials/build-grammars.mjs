// usage: node build-grammars.mjs <language>...
import { buildGrammars } from '@chrisdudek/runes/grammars';

const built = await buildGrammars({
  outDir: '/app/grammars',
  only: process.argv.slice(2),
  resolveFrom: '/app',
  log: (line) => console.log(line),
});
console.log(JSON.stringify(built));
