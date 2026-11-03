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

## Changelog
- Fixed: C#: an extension-method call such as `s.Ship()` binds a static class of the global namespace before the namespaces the compilation unit's `using` directives import, as C# does. Where several projects declare such a global method and the project reference graph cannot rule them out, the call can lose its edge (two calls in eShop).

## Evidence

- **ran:** node --test --test-reporter=tap --test-name-pattern='beside-using|other-global-method' test/relations/extractors/csharp-name-resolution-matrix.test.mjs (before the fix) · **saw:** not ok csharp-extension-global-class-beside-using-edge: expected src/c/Use.cs:2->global, got src/c/Use.cs:2->lib and src/c/Use.cs:5->lib; ok the enclosing-namespace and control cases (guards); 3 tests, 2 pass, 1 fail
- **ran:** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs; csharp.test.mjs and the parity tests; npm run check; npm run coverage; node scripts/corpus.mjs verify --tier all (after the fix, commit 63a57bc) · **saw:** all three new cases ok, 166/166 matrix+rev+catalogue, 115/115 csharp and parity; check exit 0; coverage 2048/2048, lines 99.02, branches 94.94, functions 98.93; corpus passed, eShop 2 removed edges explained and golden rewritten

