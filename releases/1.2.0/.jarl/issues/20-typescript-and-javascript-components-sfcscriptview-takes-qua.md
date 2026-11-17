# 20 · TypeScript and JavaScript components: sfcScriptView takes quadratic time on a run of script opening…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1351-lbds
**Tags:** performance, runes, typescript
**Files:** 
**Repo:** Runes
**Found by:** rev-762-opus
**Where:** the review of 762
**Branch:** jarl/755-bundler-alias
**Worker:** w-755-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:52

## What
TypeScript and JavaScript components: sfcScriptView takes quadratic time on a run of script opening tags that never reach a > ('<script ' or '<script a="' repeated): 256 KB takes about 3.4 s at v1.1.0 and 6.3 s at the 1.2.0 branch, since each <script retries the opening-tag pattern to the end of the file; once one attempt finds no >, no later one can match

## Why


A crafted or damaged component can stall every consumer that reads the repository, against the extractor's linear-time guarantee.

## Acceptance


[test] A Vue or Svelte component holding a long run of <script openings with no > (both '<script ' and '<script a="' repeated, 1 MB) is read in linear time, in a test bounded in the style of the extractor's existing linear-time tests, red before and green after; every existing answer stays as it is · by: npm run check

## Evidence

