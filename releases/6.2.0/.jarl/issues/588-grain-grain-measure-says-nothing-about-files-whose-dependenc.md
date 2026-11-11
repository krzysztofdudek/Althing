# 588 · Grain: grain measure says nothing about files whose dependencies it could not read (a source over t…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1414-refp
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-169c-fable
**Where:** the review of 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What
Grain: grain measure says nothing about files whose dependencies it could not read (a source over the parse limit whose read gave no facts, a source the parser failed on), in its text or its JSON, so its counts of imports and undeclared dependencies read as complete. On the release branch every over-limit file was missing from those counts without a word.

## Why


## Acceptance


[test] grain measure names, in its text and in its JSON, the files whose dependencies it could not read (a source over the parse limit whose read gave no facts, a source the parser failed on), so its counts of imports and undeclared dependencies are not presented as complete, red before and green after · by: cd plugins/grain && npm test

## Evidence

