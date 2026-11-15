# 748 · Runes, C#: an extended property pattern's member path gives a false edge to a type of its first nam…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261115T0559-ghny
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708, 744
**Branch:** jarl/748-property-pattern
**Merged:** 5a7f1eebd5d8d5a8e7c9244632ff5312a7aa9206 in Runes
**Merge check:** npm run check · saw ℹ tests 2751, pass 2748, fail 0, skipped 3; dist/ is fresh; exit 0 (catalogue 992)

## What
Runes, C#: an extended property pattern's member path gives a false edge to a type of its first name: x is { Order.Id: 3 } on a Holder whose field Order has the type Order gives an edge from the file to Order at 8d31e57, 7693a11 and f396769, where x.Order.Id == 3 and x is { Order: { Id: 3 } } give none. The grammar reads the path as a member access inside the subpattern, and the member-access reading takes its first name for a type.

## Why


## Acceptance


[test] In an extended property pattern (x is { Order.Id: 3 }, and in a switch arm or a nested pattern), the member path before the colon gives no edge, as x is { Order: { Id: 3 } } gives none, while a type pattern or a constant pattern inside the subpattern (x is { Order: Models.Order }, x is { Kind: Kinds.A }) keeps its edge; a catalogue case red at c21ceca and green after; the corpus's C# repositories show every removed edge explained as one of these paths · by: npm run check

## Changelog
- The member path of an extended property pattern (`x is { Order.Id: 3 }`, `{ Order.Customer.Name: "a" } =>` in a switch) names members of the value tested and gives no edge to a type named like one of them, as `x is { Order: { Id: 3 } }` gives none; a constant or a type pattern after the colon (`{ Order.Kind: Kind.A }`, `{ Order: Orders.Order }`) still gives its edge.

## Reviews
- **approve** · by rev-748-opus (fresh) · 2026-11-15 · model claude-opus-5-5
  Line 1 [test] met. Red at f2b669b for the right reason (the two new cases fail on the path edges to orders, nothing else), green at d97e722 (315 of 315), the suite at d97e722 2748 pass, 0 fail, 3 skipped, dist/ identical to a rebuild, corpus jellyfin, eShop and CleanArchitecture unchanged before and after (32213, 2017, 452; 0 added, 0 removed; none of the three writes a dotted property path). The fix reads nothing inside a member access that is the first child of a subpattern; the grammar gives a subpattern a member access there only as a path (its pattern child is always wrapped in a pattern node), so only paths go silent. Probed with four cases of my own through the catalogue runner, at both commits: after the colon a dotted type pattern ({ Order: Models.Order }, { Sale.Order: Models.Order }, with { }, with a designation, or null), a dotted constant ({ Kind: Kinds.A }, { Sale.Kind: Kind.A }, App.Kinds.Kind.B, or, not, relational, a cast), a bare type ({ Sale.Order: Order }, Customer or Order), nested, list and positional elements (x is (Kinds.A, _)), switch arms and case labels all keep every edge (21 of 21 at both); the Color Color forms of 744 (a property Kind Kind beside { Sale.Kind: Kind.A }, { Num: Kind.B }, a switch arm, a local Kinds shadowing App.Kinds.Kinds.A) keep theirs; 18 path forms (a designation, a type before the clause, a first name that is a type of the repository in another node: Order, Kinds, Kind; a namespace first name, nested and list patterns, a tuple of property patterns, and, or, not, a when clause, spacing, a comment inside or before the path, @Order, three paths in one clause, a catch filter, a lambda field initializer, this is { … }) give 20 false edges at f2b669b and none at d97e722. Nothing protective moved: the catalogue count 990 to 992 and the rev 43 to 44 are raised, no test or assertion is removed, two commits each name the issue, dist/ rebuilt in the fix commit. No finding inside the issue. Outside, Minor: a type in a positional pattern beside a discard or a constant gives no edge, before and after (filed with --outside).
  outside the issue, filed as 750: Runes, C#: a type in a positional pattern beside a discard or a constant (x is (Order, _), x is (Models.Order, _), x is (App.Models.Order, 1), a switch arm (Models.Order, _) =>) gives no edge, at c21ceca and at d97e722 alike: the grammar reads the parenthesized list as a constant_pattern over a tuple_expression, which the constant-pattern reading does not take, and the member access inside it reads only its namespace prefix as a receiver. A type pattern in a positional pattern is C# 9 (spec §11.2.6, §11.2.5); a declaration pattern there (x is (Models.Order o, _)) is parsed as a positional subpattern and keeps its edge. A false negative 748 did not touch.

## Evidence

### Proof

- **ran (line 2f74461f87c5):** node --test --test-name-pattern='property-path|catalogue holds' test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at f2b669b, the cases on c21ceca's extractor) · **saw:** red: csharp-pattern-property-path-silence: unexpected cross-owner edge src/web/Check.cs:4->orders (all five paths, lines 4 to 8, gave an edge to orders); csharp-pattern-property-path-beside-types-edge: unexpected cross-owner edge src/web/Check.cs:6->orders (also 8 and 14)
- **ran (line 2f74461f87c5):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractor-rev.test.mjs (at d97e722) · **saw:** green: tests 315, pass 315, fail 0; the silence case gives no edge, the edge case gives exactly its 10 expected edges (the constant and type patterns after the colon kept)
- **ran (line 2f74461f87c5):** npm run check (at d97e722, clean tree) · **saw:** exit 0: tests 2751, pass 2748, fail 0, skipped 3; dist/ is fresh; the catalogue holds 992 cases
- **ran (line 2f74461f87c5):** node scripts/corpus.mjs verify --only jellyfin,eShop,CleanArchitecture --tier all, with RUNES_CORPUS_DIR on the shared corpus cache, at c21ceca's extractor and again at d97e722 · **saw:** before and after identical, passed: jellyfin 32213 edges, eShop 2017, CleanArchitecture 452, 0 added, 0 removed; a search of the three repositories finds no extended property pattern (45 property patterns, none with a dotted path), so no edge is removed and none is explained
- **ran (line 2f74461f87c5):** npm run coverage (at d97e722) · **saw:** exit 0: all files 99.21 lines, 95.86 branches, 99.03 functions; the new subpattern lines are covered
- **ran (line 2f74461f87c5):** node --test --test-name-pattern='property-path|catalogue holds' test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (git archive of f2b669b, npm ci, npm run grammars, MemoryMax=8G) · **saw:** red: tests 3, pass 1, fail 2; csharp-pattern-property-path-silence: unexpected cross-owner edge src/web/Check.cs:4->orders; csharp-pattern-property-path-beside-types-edge: unexpected cross-owner edge src/web/Check.cs:6->orders; the catalogue holds 992 cases passes
- **ran (line 2f74461f87c5):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractor-rev.test.mjs (git archive of d97e722, MemoryMax=8G) · **saw:** green: tests 315, pass 315, fail 0; both property-path cases pass
- **ran (line 2f74461f87c5):** npm run check:compiler && npm test -- --test-concurrency=6, then dist/ of d97e722 compared with the rebuilt dist/ by diff -r (check:dist needs a git checkout; git archive of d97e722, MemoryMax=12G) · **saw:** exit 0 for the compiler check and the suite: tests 2751, pass 2748, fail 0, skipped 3; check:dist refused only for want of git; diff -r of the committed and the rebuilt dist/ is empty
- **ran (line 2f74461f87c5):** node scripts/corpus.mjs verify --only jellyfin,eShop,CleanArchitecture --tier all, RUNES_CORPUS_DIR on the shared corpus cache, at f2b669b (c21ceca's extractor in dist/) and at d97e722 (MemoryMax=12G) · **saw:** passed at both: CleanArchitecture 452 edges, jellyfin 32213, eShop 2017, each 0 added, 0 removed, 0 explained; a search of the three for a dotted path before a colon in a property pattern finds none

### Notes

rev-748-opus, a correction to the count in my verdict: the path probes were two cases, 18 forms in one (20 false edges at f2b669b, none at d97e722) and 5 more in another (a comment before and inside the path, a catch filter, a lambda field initializer, this is { … }, a path beside a constant subpattern: 5 false edges at f2b669b, none at d97e722); 25 false edges in all, none left after the fix.

