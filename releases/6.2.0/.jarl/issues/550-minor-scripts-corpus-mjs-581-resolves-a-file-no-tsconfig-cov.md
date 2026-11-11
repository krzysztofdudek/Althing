# 550 · Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1042-pzbh
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-526-opus
**Where:** the review of 491, 526
**Branch:** jarl/550-typescript
**Worker:** w-550-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:37

## What
Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports, so the TypeScript oracle cannot check the exports reading Runes now applies to such files (react keeps 94 explained mismatches); an oracle that resolves those files as Node16 or Bundler would check it.

## Why


## Acceptance


[test] The corpus's TypeScript oracle resolves a file no tsconfig covers with a resolution that reads exports (Node16 or Bundler), so react's explained mismatches from that cause are checked rather than explained, red before and green after · by: npm run check

## Evidence

