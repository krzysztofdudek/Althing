# 646 · Runes, TypeScript: the corpus checker ignores call forms for files a tsconfig covers, and Runes adds an extension to an exports pattern target for a file no tsconfig covers, which Node and TypeScript do not

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1954-hmtm
**Tags:** runes, typescript
**Files:** 
**Repo:** Runes
**After:** 550
**Found by:** jarl
**Where:** w-550-opus, the TypeScript package
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


Also (rev-550-fable, minors of 551): a with { 'resolution-mode': … } clause on the line after the specifier makes the line read twice, once without the mode, leaving the file's own format edge beside the right one; an attribute list of two entries is taken as the mode where tsc 6.0.3 reports the list and resolves by the file.

## Why
The checker cannot catch a call-form fault in covered files, and the extension added to a pattern target gives 40 react edges that Node and TypeScript would not resolve (explained as Flow's reading).

## Acceptance
[test] The corpus checker reads the call form of require() and import() in files a tsconfig covers too, and an exports pattern target is resolved without an added extension as Node and TypeScript do, red before and green after · by: npm run check

## Changelog
- Fixed: TypeScript: an `exports` pattern target written without an extension (`"./src/*": "./src/*"`) names that path and no `.js` or `.ts` file beside it, as Node and TypeScript read it, so such an import no longer gives an edge to a file it does not name (react loses 40 edges of this kind); an `import type` whose `with { 'resolution-mode': … }` clause starts on the line after the specifier is read once, with its mode, and an attribute list of more than one entry names no mode.

## Evidence

### Proof

- **ran (line d26d1bfb95ba):** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs; node --test --test-name-pattern='call form of a require' test/corpus.test.mjs (Runes, commits 88b80d6, 7aca46f, e420959, before the fixes) · **saw:** fail typescript-exports-pattern-target-without-extension-silence (unexpected cross-owner edge packages/app/use.js:1->src), typescript-resolution-mode-clause-on-next-line-edge (unexpected edge ->esm), typescript-resolution-mode-two-attributes-file-format-edge (got ->cjs), and the corpus oracle test: 1 disagreements
- **ran (line d26d1bfb95ba):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f); RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared node scripts/corpus.mjs oracles --tier all --only react,next-intl,jest,express,koa,commander.js,ky,skywalking-booster-ui,vitepress,zod,typeorm,shaka-player · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions; oracles: passed, react 514 disagreements all explained (the 40 about exports targets are gone), jest one explanation removed because the oracle now agrees

### Notes

Assumed: only exports targets are taken as written (probeExact): the target itself, or for a JavaScript extension the source it is compiled from, and no directory index or package entry; main, module and types fields keep their probing. react loses 40 edges (explained as a commit, and the 40 oracle explanations of the same references removed), jest loses one oracle explanation because the corpus checker now reads a require() call form in a covered file.

