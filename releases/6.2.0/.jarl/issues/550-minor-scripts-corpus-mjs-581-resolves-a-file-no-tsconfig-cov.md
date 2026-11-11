# 550 · Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1042-pzbh
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-526-opus
**Where:** the review of 491, 526

## What
Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports, so the TypeScript oracle cannot check the exports reading Runes now applies to such files (react keeps 94 explained mismatches); an oracle that resolves those files as Node16 or Bundler would check it.

## Why


## Acceptance


## Evidence

