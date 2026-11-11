# 562 · Yggdrasil's facts cache copies the C# extract field by field (source/cli/src/relations/facts-cache.…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1203-uqfg
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-500-fable
**Where:** the review of 500, 504, 528

## What
Yggdrasil's facts cache copies the C# extract field by field (source/cli/src/relations/facts-cache.ts, serializeCsharp and deserializeCsharp), so the adoption of Runes 1.1.0 (issue 530) must carry scope.staticDecls, scope.globalStatics and fileLocalTypes through it, beside passing globalStatics and projectGlobalStatics; the note on 530 names only the two inputs

## Why


## Acceptance


## Evidence

