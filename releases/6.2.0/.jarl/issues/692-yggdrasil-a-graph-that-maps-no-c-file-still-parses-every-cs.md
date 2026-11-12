# 692 · Yggdrasil: a graph that maps no C# file still parses every .cs file cold, for project-wide facts nothing uses

**Status:** in-progress
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
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
Reading every C# file of a project for its friend grants and global usings is needed only when some C# file is mapped; otherwise it is a cold parse of a whole tree for nothing.

## Acceptance
[test] With no C# file mapped, the relation pass parses no .cs file, red before and green after · by: cd source/cli && npm test

## Changelog
- yg check no longer parses the C# files of a repository that maps none; they are read only when a mapped C# file can see their project-wide facts.

## Evidence

### Proof

- **ran (line cc0bff4be22e):** cd source/cli && npx vitest run tests/unit/relations/csharp-unmapped-parse.test.ts (before the fix) · **saw:** 1 failed, 1 passed: with no C# file mapped the pass parsed 2 .cs files; the control with a mapped C# file passed
- **ran (line cc0bff4be22e):** cd source/cli && npx vitest run tests/unit/relations tests/e2e/relation-csharp-projects.test.ts tests/integration/relation-pass.test.ts (after the fix) · **saw:** Tests 146 passed: no .cs file is parsed when none is mapped; with one mapped the unmapped ones are still read

### Notes

Assumed: with no C# file mapped, the unmapped C# files are skipped whole, including for the C# project reachability, which was already skipped in that case.

