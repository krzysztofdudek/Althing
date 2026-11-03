# 487 · Runes: in C#, extension-method lookup still reads the compilation unit's usings before the global namespace's own members

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 485
**Found by:** w-runes-485-opus
**Where:** The 485 worker's report (2026-11-03); C# specification 12.8.10.3 (extension method invocations) and 7.8.1
**Branch:** jarl/487-csharp-extension-lookup-order
**Worker:** w-runes-487-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-487
**Since:** 2026-11-03 03:38

## What
485 makes a type of the global namespace bind before the compilation unit's usings for type names. Extension-method candidates are still gathered from the compilation unit's usings first, so a static class of the global namespace may lose to an imported one.

## Why
A false edge to the imported static class and a lost edge to the real one.

## Acceptance
Extension-method lookup follows the specification's order of enclosing namespaces and their usings, with a case where a global static class wins and a control

## Evidence

