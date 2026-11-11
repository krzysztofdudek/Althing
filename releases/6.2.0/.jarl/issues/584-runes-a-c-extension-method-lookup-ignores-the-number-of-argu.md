# 584 · Runes: a C# extension method lookup ignores the number of arguments, so a call binds an extension that cannot take it (10 false edges on jellyfin)

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1353-ybih
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**After:** 494
**Found by:** jarl
**Where:** w-494-fable, the C# base-class package
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What


## Why
A call with two arguments binds an extension method of one parameter; the consumer's graph shows a dependency that does not exist.

## Acceptance
- [test] An extension method call binds only extensions whose parameter count (beyond this) can take the call's arguments, with a catalogue case each way, red before and green after · by: npm run check
- [compare] The jellyfin golden loses the false extension edges and gains none, each explained · by: npm run corpus

## Changelog
- C#: an extension method takes a call only when it can take the number of its arguments: `sessions.FirstOrDefault(s => s.Active)` gives no edge to a `FirstOrDefault<T>(this IReadOnlyList<T>)` that takes none. A consumer's graph loses such edges; the new keys `shapes:<key>` go to the symbol table like the other keys with a tab.

## Evidence

### Proof

- **ran (line f1f9921e6843):** node --test --test-name-pattern=<case id> test/relations/extractors/csharp-name-resolution-matrix.test.mjs for csharp-extension-other-argument-count-silence and csharp-extension-argument-count-fits-edge, on 406c682 with the new cases, then on 447cc91 · **saw:** before: both fail (unexpected edge src/core/Report.cs:7->ext; the nearer extension took every call); after: both pass
- **ran (line 5fe1457145a0):** node scripts/corpus.mjs update --tier all --only jellyfin, on the tree of 447cc91, against the golden of release/1.1.0 · **saw:** jellyfin 32124 edges: 0 added, 516 removed, 516 explained; eShop 2017 and CleanArchitecture 452: 0 added, 0 removed; corpus passed
- **ran (line 5fe1457145a0):** node scripts/corpus.mjs verify --tier all --only jellyfin,eShop,CleanArchitecture --runes <the dist of 447cc91> --goldens <the goldens of 44a06cc> · **saw:** jellyfin 32124 edges: 0 added, 516 removed, 516 explained; eShop 2017 and CleanArchitecture 452: 0 added, 0 removed; corpus passed

### Notes

Assumed: an extension reading is refused only where it would bind one owner and no extension method of that key in its definers takes the call's counts; a name two owners declare at one level stays ambiguous. Dropping each definer that cannot take the call before the owners are counted added about 650 references on jellyfin, true ones (genres.Contains(v, comparison)) mixed with false ones (years.Contains(x) on an int list bound a Contains on a day-of-week type), because the receiver's type is not read. jellyfin loses 516 references, not 10: every call whose only candidate could not take its arguments, the 10 the issue names among them.

