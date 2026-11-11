# 619 · Runes, C#: an explicit interface implementation (ISettings IHasSettings.Settings => ...) counts as …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1611-tkuy
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-494b-opus
**Where:** the review of 493, 494, 497, 498
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Runes, C#: an explicit interface implementation (ISettings IHasSettings.Settings => ...) counts as a name the file declares, so Settings.Get() in the same class gives no edge to a static class Settings, though C# finds no member of that name in the class (an explicit implementation is reached through the interface alone) and binds the type. The same on 28e52cf and 520a82d. Probe: IHasSettings with a property Settings in node core, a static class Settings in node legacy, and class C : IHasSettings in node web implementing it explicitly and calling Settings.Get().

## Why


## Acceptance


[test] A catalogue case with IHasSettings declaring a property Settings in node core, a static class Settings in node legacy, and class C : IHasSettings in node web implementing it explicitly (ISettings IHasSettings.Settings => ...) and calling Settings.Get(): the call gives the edge to the static class Settings, red before and green after · by: npm run check

## Changelog
- C#: an explicit interface implementation (`ISettings IHasSettings.Settings => …`) no longer hides a type of that name: `Settings.Get()` in the same class gives the edge to the class `Settings`. A consumer's graph can show new edges.

## Evidence

### Proof

- **ran (line fa718df58294):** node --test --test-name-pattern=<case id> test/relations/extractors/csharp-name-resolution-matrix.test.mjs for csharp-explicit-interface-implementation-type-receiver-edge, on 2136343 with the new case, then on 273856b · **saw:** before: fail, expected edge src/web/C.cs:4->legacy not emitted; after: pass
- **ran (line fa718df58294):** the branch's 13 new catalogue cases and its matrix test file copied into a scratch extraction of a94d31b (the branch's merge base), run with node --test --test-name-pattern=<the 13 case ids> test/relations/extractors/csharp-name-resolution-matrix.test.mjs; then the full suite on a scratch extraction of 9eb9987 (build, grammars, node --test --test-concurrency=6 on every test file, dist compared with the committed dist) · **saw:** before: fail, expected edge src/web/C.cs:4->legacy not emitted; after: the full suite 2512 tests, 2511 pass, 0 fail, 1 skipped; rebuilt dist identical to the committed dist

