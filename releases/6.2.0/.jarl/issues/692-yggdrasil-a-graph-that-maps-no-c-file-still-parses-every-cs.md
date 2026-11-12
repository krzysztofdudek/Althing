# 692 · Yggdrasil: a graph that maps no C# file still parses every .cs file cold, for project-wide facts nothing uses

**Status:** open
**Kind:** cleanup
**Priority:** 3
**Tier:** light
**Key:** 20261112T0058-pepj
**Tags:** yggdrasil, performance
**Files:** 
**Repo:** Yggdrasil
**After:** 530
**Found by:** jarl
**Where:** rev-530b-opus, round 2 (source/cli/src/relations/pass.ts:432, :986)

## What


## Why
Reading every C# file of a project for its friend grants and global usings is needed only when some C# file is mapped; otherwise it is a cold parse of a whole tree for nothing.

## Acceptance
[test] With no C# file mapped, the relation pass parses no .cs file, red before and green after · by: cd source/cli && npm test

## Evidence

