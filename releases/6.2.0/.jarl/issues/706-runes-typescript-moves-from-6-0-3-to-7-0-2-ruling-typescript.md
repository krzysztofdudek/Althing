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

