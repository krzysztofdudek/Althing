# 633 · Grain's C# extract serializer, serCs and deserCs (plugins/grain/engine/relations.mjs:64-71), turns …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1834-yjpt
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-604-opus
**Where:** the review of 604

## What
Grain's C# extract serializer, serCs and deserCs (plugins/grain/engine/relations.mjs:64-71), turns the using scope's aliases and globalAliases Maps into arrays and back, but not the aliasDecls Map that Runes 1.1.0 adds to the scope. With the Runes 1.1.0 build in place of the vendored one, every re-index that reads a cached C# extract fails its relation pass ('relation pass failed: scope.aliasDecls is not iterable'): the model holds no edges and no check-time table until the cache is emptied. Reproduced on a four-file C# repository: export, commit an edit, export again. Issue 475 notes this for Yggdrasil only; it belongs with Grain's adoption of Runes 1.1.0 (143), with a test that indexes a C# repository twice.

## Why


## Acceptance


## Evidence

