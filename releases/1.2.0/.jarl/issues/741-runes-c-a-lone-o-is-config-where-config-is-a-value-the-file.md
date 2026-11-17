# 741 · Runes, C#: a lone o is Config, where Config is a value the file declares, is still read as a type

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-imsh
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** w-696-opus
**Where:** jarl/696-csharp at 7693a11, the C# is-pattern reading
**Branch:** jarl/743-csharp-patterns
**Worker:** w-743-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:00

## What
After 708, a dotted head of an is chain that the file declares as a value reads nothing. A lone o is Config, where Config is a field, a property or a local the file declares, is still read as the type Config, which can give an edge to a file that declares a type of that name.

Moved from issue 741 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
An edge to a type named like a value of the file is a false edge where such a type exists elsewhere in the repository.

## Acceptance
[test] Where the file declares a value Config, a switch arm Config =>, case Config:, o is not Config, and Config inside an or, and or parenthesized pattern give no edge to a type Config, while o is Config (the is-type operator, which C# binds to the type first) keeps its edge, and a type Config the file does not shadow keeps its edge everywhere; catalogue cases red at v1.1.0 and green after, and every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: where a file declares a value `Config` (a constant, a field, a property, a local), a switch arm `Config =>`, `case Config:`, `o is not Config` and `Config` in an `or`, `and` or parenthesized pattern no longer give an edge to a type `Config`, since C# binds the name to the value there; `o is Config` keeps its edge to the type, which C# binds first. An edge that goes away can leave a declared relation with no code behind it.

## Evidence

### Proof

- **ran (line 51e36b583a18):** node --test --test-name-pattern='value-of-file|value-of-its-name' test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on the source at 659e2c1 (whose lone-name pattern reading is v1.1.0's) with the two new cases · **saw:** red: case csharp-pattern-constant-value-of-file-silence: unexpected cross-owner edge src/c/Use.cs:5->lib; csharp-is-type-test-beside-value-of-its-name-edge passes
- **ran (line 51e36b583a18):** npm run check, at 619bccf (the clean branch tip) · **saw:** green: tests 2760, pass 2757, fail 0, skipped 3; both new cases pass; The build compiler is the pinned one; dist/ is fresh

### Notes

Ruling ask-3 (stuck, by jarl): The jarl chose option b, the C# reading: a lone name the file declares as a value gives no edge where C# binds the pattern's expression first (a switch arm Config =>, case Config:, o is not Config, an or or and pattern, a parenthesized pattern, a positional subpattern), while o is Config, the is-type operator, keeps the edge to the type, as C# tests the type first there. The line as filed would drop a true edge, a false green; 741's acceptance line is rewritten to this reading.

Assumed: the value test is the file-wide one the receiver reading uses (a name the file declares as a value and not only as a type), as the line says 'where the file declares a value Config'; C# finds only a value in scope, so a value of that name in another member drops a true edge in these pattern forms. npm run coverage at 619bccf passes (all files 99.21% lines, 95.82% branches, 99.04% functions); the corpus of CleanArchitecture, eShop and jellyfin does not move.

