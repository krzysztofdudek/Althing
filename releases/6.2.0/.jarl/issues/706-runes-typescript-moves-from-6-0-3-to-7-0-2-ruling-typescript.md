# 706 · Runes: TypeScript moves from 6.0.3 to 7.0.2 (ruling typescript-bumped)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-gutr
**Tags:** runes, typescript, dependencies
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** the owner, 2026-11-12 (ruling typescript-bumped)
**Branch:** jarl/706-typescript-7
**Worker:** w-706-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:18

## What


## Why
The owner wants the family on a newer TypeScript; 7.0.2 is npm's latest, a major release, so options it dropped or changed have to be met in the build and in the committed dist.

## Acceptance
- [check] npm run check passes with TypeScript 7.0.2 pinned in package.json and the lockfile, with dist rebuilt and fresh · by: npm run check
- [read] Any tsconfig option TypeScript 7 removed or changed is replaced with what keeps the same build, the committed dist and its .d.ts files are compared before and after, and every difference is explained in the evidence

## Changelog
- Runes is now built and checked with TypeScript 7.0.2; the published code and its type declarations are the same as before, so users see no change.

## Evidence

### Proof

- **ran (line 9d3a556c5641):** npm run check · **saw:** exit 0 on the committed tree with typescript 7.0.2 pinned: build, grammars, 2629 tests (2628 pass, 0 fail, 1 skipped), check:dist printed 'dist/ is fresh.'

### Notes

Assumed: Microsoft's bridge package @typescript/typescript6 6.0.2 (resolves to typescript 6.0.3), installed under the name typescript6, supplies the compiler API that the compiler-comparison test, the version-range test and the corpus oracle need, because the typescript 7 package no longer exports it. MODELLED_TYPESCRIPT_VERSION stays 6.0.3: moving it would change how types@ ranges resolve, a change of edges outside this issue.

Compared dist before and after: rebuilt under 7.0.2 from clean, git status and git diff --stat on dist print nothing; 148 tracked files (74 .d.mts) are byte-identical to the committed ones. tsconfig.json and tsconfig.relations.json needed no change (build prints no deprecation or removed-option error). Corpus gate on 15 TypeScript and C# repositories (express koa commander.js ky skywalking-booster-ui vitepress zod next-intl jest CleanArchitecture jellyfin eShop react typeorm shaka-player): passed, 0 added and 0 removed edges against the goldens, TypeScript oracle checks ran with all disagreements explained; the C# oracle is skipped on this host (no dotnet).

