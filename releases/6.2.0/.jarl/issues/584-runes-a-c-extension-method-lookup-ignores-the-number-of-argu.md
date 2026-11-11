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
- **ran (line f1f9921e6843):** the branch's 13 new catalogue cases and its matrix test file copied into a scratch extraction of a94d31b (the branch's merge base), run with node --test --test-name-pattern=<the 13 case ids> test/relations/extractors/csharp-name-resolution-matrix.test.mjs; then the full suite on a scratch extraction of 9eb9987 (build, grammars, node --test --test-concurrency=6 on every test file, dist compared with the committed dist) · **saw:** before: csharp-extension-other-argument-count-silence fail (unexpected edge src/core/Report.cs:7->ext) and csharp-extension-argument-count-fits-edge fail (src/web/Page.cs:6->kit where lib is expected); after: the full suite 2512 tests, 2511 pass, 0 fail, 1 skipped; rebuilt dist identical to the committed dist
- **ran (line 5fe1457145a0):** RUNES_CORPUS_DIR=<the shared corpus cache> node scripts/corpus.mjs gate --tier all on a scratch extraction of 9eb9987; git diff of corpus/goldens/jellyfin.edges a94d31b..447cc91; each of the 516 removed lines read in the jellyfin source with the extension methods of its target · **saw:** corpus gate: passed (jellyfin 32133 edges, 0 added, 0 removed); 447cc91 removes 516 lines and adds none; every removed call passes a count the target's extension methods cannot take: Contains with 1 argument against Contains(this IEnumerable<string>, ReadOnlySpan<char>, StringComparison), FirstOrDefault with a predicate against FirstOrDefault<T>(this IReadOnlyList<T>), Count() against Count(this ReadOnlySpan<char>, char), Split with 2 or 3 against Split(this ReadOnlySpan<char>, char), IndexOf with 2 or 3, SetImagePath with 3, CopyTo with 4, GetImagePath with 2, GetItemById<BaseItem>(id) against a non-generic extension, GetAllArtists(x) against one of no argument

### Notes

Assumed: an extension reading is refused only where it would bind one owner and no extension method of that key in its definers takes the call's counts; a name two owners declare at one level stays ambiguous. Dropping each definer that cannot take the call before the owners are counted added about 650 references on jellyfin, true ones (genres.Contains(v, comparison)) mixed with false ones (years.Contains(x) on an int list bound a Contains on a day-of-week type), because the receiver's type is not read. jellyfin loses 516 references, not 10: every call whose only candidate could not take its arguments, the 10 the issue names among them.

