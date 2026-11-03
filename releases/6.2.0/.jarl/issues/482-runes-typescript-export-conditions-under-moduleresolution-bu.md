# 482 · Runes: TypeScript export conditions under moduleResolution Bundler read the import branch, but Runes takes the first export target that exists (next-intl e2e apps)

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-473-opus
**Where:** Review of 473 (2026-11-03): next-intl e2e/* at the pinned commit, five references
**Branch:** jarl/482-ts-export-conditions
**Worker:** w-runes-482-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-482
**Since:** 2026-11-03 03:38

## What
With moduleResolution Bundler, TypeScript resolves a package's exports through the import (and types) conditions. Runes takes the first target that exists on disk, plugin.d.cts from the require branch, so where the import branch's file is missing it binds an edge TypeScript does not.

## Why
A false edge to a file the compiler never reads.

## Acceptance
- Export targets are chosen by the conditions the importing file's moduleResolution and module settings select, with catalogue cases for Bundler, Node16 import and Node16 require, red before and green after
- next-intl's tracked false edges leave explained.md and its golden changes only by the lines this explains

## Changelog
- Fixed: an import of a package whose `exports` or `imports` lists conditions binds the target TypeScript chooses for the importing file (`import` or `require` by its module format, `types`, `node` except under Bundler, and its `customConditions`) where its tsconfig names the resolution, so `next-intl/plugin` under Bundler no longer binds the `require` branch; a solution tsconfig's references are searched as tsserver searches them. A consumer's graph can lose edges that only the wrong branch gave.

## Evidence

From the review of 473 round 2 (2026-11-03): six next-intl examples/* lines (dependency ^4.0.0, apps on moduleResolution Bundler, no dist/ at the pinned commit) share the export-conditions false edge of the five e2e lines; all eleven are this issue's

From the review of 473 round 3 (2026-11-03): the references search in 473 is level by level, but tsserver checks one project's direct references and then each child's whole subtree in turn, so from three levels deep the two can choose differently; the comment and the direct-before-nested case overstate the match. Part of this issue: say or do what tsserver does
- **ran:** node --test --test-name-pattern=subtree-order test/relations/extractors/typescript-name-resolution-matrix.test.mjs (build without the references fix) · **saw:** fail 1: expected edge src/use.ts:1->lib not emitted (got src/use.ts:1->wrong)
- **ran:** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (commit b2eab78) · **saw:** pass 94, fail 0
- **ran:** node --test --test-name-pattern=typescript-exports- test/relations/extractors/typescript-name-resolution-matrix.test.mjs (build without the conditions fix) · **saw:** pass 2, fail 4: bundler-import-branch-silence and unmatched-custom-condition-silence emit an edge; node16-import-branch-edge got cjs, node16-require-branch-edge got esm
- **ran:** node --test --test-name-pattern=typescript-exports- test/relations/extractors/typescript-name-resolution-matrix.test.mjs (commit d680c05) · **saw:** pass 6, fail 0
- **ran:** node scripts/corpus.mjs verify --only zod,next-intl; then oracles on the JS/TS repositories · **saw:** next-intl 11 removed and zod 34 removed, exactly the 45 tracked typescript:false-edge oracle lines; oracles ok on zod and next-intl with 0 disagreements
- **ran:** npm run check; npm run coverage; node scripts/corpus.mjs verify --tier all; node scripts/corpus.mjs oracles --tier all (tip 39a3b3b) · **saw:** check 2071 pass 0 fail, dist fresh; coverage 99.00 lines, 95.08 branches, 98.96 functions; verify passed on 33; oracles fail only jellyfin 19, react 1575, shaka-player 1, each already failing on release/1.1.0 (19, 1551, 1)

