# 150 · C#: a comparison pair with a qualified name (x.i < Count, j > Max) read as a generic declaration gives a false edge (from before 016)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 016
**Found by:** rev-runes-016
**Where:**
**Branch:** jarl/138-csharp-followups
**Merged:** 6a1dea0 in ../../../Runes
**CI:** none

## What
The tree-sitter grammar reads 'x.i < Count, j > Max' in arguments as one generic declaration instead of two comparisons (the C# specification §6.2.5 resolves it as comparisons); the extractor reports i, Count, j as types. It existed before 016; 016 fixes the unqualified variant in its package.

## Why
A false edge on valid code blocks yg check and cannot sensibly be declared.

## Acceptance
A comparison pair in arguments, also with a qualified name, gives no edge; a silence case in the catalogue red before, green after.

## Changelog
- Fixed: in C#, a comparison pair in an argument list whose left operand is a member access (`Within(x.Low < Order, j > Max)`), which the grammar reads as a declaration of the generic type `x.Low<Order, j>`, no longer reports `Order` or `j` as types.

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1649, pass 1649, fail 0, catalogue 501 cases, dist/ is fresh; npm run coverage: tests 1649, pass 1649, fail 0, all files 98.78 / 94.07 / 98.76, exit 0; merge 6a1dea0 (catalogue count conflict resolved to 492 + 9 = 501; rebuilt dist matches)

