# 633 · Grain's C# extract serializer, serCs and deserCs (plugins/grain/engine/relations.mjs:64-71), turns …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1834-yjpt
**Tags:** adoption, grain
**Files:** 
**Repo:** Grain
**Found by:** rev-604-opus
**Where:** the review of 604
**After:** 143
**Branch:** jarl/143-runes-110
**Worker:** w-143-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
Grain's C# extract serializer, serCs and deserCs (plugins/grain/engine/relations.mjs:64-71), turns the using scope's aliases and globalAliases Maps into arrays and back, but not the aliasDecls Map that Runes 1.1.0 adds to the scope. With the Runes 1.1.0 build in place of the vendored one, every re-index that reads a cached C# extract fails its relation pass ('relation pass failed: scope.aliasDecls is not iterable'): the model holds no edges and no check-time table until the cache is emptied. Reproduced on a four-file C# repository: export, commit an edit, export again. Issue 475 notes this for Yggdrasil only; it belongs with Grain's adoption of Runes 1.1.0 (143), with a test that indexes a C# repository twice.

## Why


## Acceptance


[test] A C# extract of Runes 1.1.0 written to Grain's cache and read back carries every part of the using scope (aliasDecls among them) and gives the same edges as a cold run; a re-index from a warm cache made by the previous Runes rebuilds instead of failing, red before and green after · by: cd plugins/grain && npm test

## Evidence

