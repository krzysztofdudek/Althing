# 744 · Runes, C#: a dotted constant pattern led by a member, local or parameter of the file named as its o…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261113T1825-tyvd
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708
**Branch:** jarl/696-csharp
**Worker:** w-696-opus
**Model:** claude-opus-5-5@xhigh
**Since:** 2026-11-13 18:25

## What
Runes, C#: a dotted constant pattern led by a member, local or parameter of the file named as its own type (C#'s Color Color rule: public Status Status { get; set; } or var Status = Factory.Make(), then x is Status.Active) gives no edge to the type Status, alone at 8d31e57 and 7693a11 and, since 708, in a chain the grammar tears apart, where C# binds Status to the type. For a var local or an implicitly typed lambda parameter the file then has no edge to Status at all.

## Why


## Acceptance


[test] In a constant pattern (x is Status.Active, alone and in an is chain the grammar tears apart), a dotted head that the file also declares as a member, local or parameter reads as the type, as C# binds it under its Color Color rule (a constant pattern can only name a constant, so a compiling file's Status there is the type): public Status Status { get; set; } and var Status = Factory.Make() each give the edge to the file declaring the type Status; catalogue cases red at 7693a11 and green after; the corpus's C# repositories show no edge removed · by: npm run check

## Changelog
- A dotted constant in a pattern whose first name the file also declares as a property, a local or a parameter (`public Status Status { get; set; }` with `x is Status.Active`, a switch arm `Status.Done =>` beside `var Status = ...`) gives its edge to the type, so a graph may show new refusals where such a pattern names a type of another component.

## Evidence

### Proof

- **ran (line db26c2fdf234):** nice -n 15 node --test --test-name-pattern='pattern-constant-led|led by a name the file|constant pattern led by' test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractors/csharp.test.mjs in a git archive extraction of 7693a11 with the three cases and both test files of 46384cb copied in, and at 46384cb (the fix) · **saw:** 7693a11: 0 pass, 5 fail: csharp-pattern-constant-led-by-same-named-property-edge, -local-edge and -lambda-parameter-edge each miss their pattern edges (the local case: expected src/web/Check.cs:4->model, got none), and both unit tests find no Status.Active reading. 46384cb: all 5 pass; the catalogue holds 965 cases; the C# rev is 43
- **ran (line db26c2fdf234):** RUNES_CORPUS_DIR=<the shared corpus cache> node scripts/corpus.mjs gate --only eShop,jellyfin,CleanArchitecture --tier all at 46384cb; node scripts/corpus.mjs update --only jellyfin --tier all after 17 explanations in corpus/explained.md; the gate again at f396769; then nice -n 15 npm run check and npm run coverage at f396769 under MemoryMax=12G · **saw:** at 46384cb: jellyfin 17 added, 0 removed, all unexplained (LibraryManager.cs:3517 and 3608 to 3618 to ExtraType.cs, StreamInfo.cs:283 to PlayMethod.cs, MediaStream.cs:859, 860, 876, 877 to VideoRangeType.cs), eShop and CleanArchitecture 0 added 0 removed. Each line read against the source: an enum constant whose first name the file also declares as a property or record parameter of that enum's type. update: 17 added, 0 removed, 17 explained, golden rewritten. f396769: corpus gate passed, 0 added 0 removed (CleanArchitecture 452, jellyfin 32213, eShop 2017 edges); npm run check 2689 tests, 2686 pass, 0 fail, 3 skipped, dist fresh; coverage 2686 pass, 99.19% lines, 95.86% branches, 99.06% functions

### Notes

Assumed: the property case first wrote the property's type in full with no using of its namespace, where C# reads Status as the property alone and the pattern does not compile; the fix commit corrects it to compiling C# (a using and the short name), and the corrected case fails at 7693a11 as the others do. A third case first planned, a member named as its own type in another part of a partial class, already gave its edge at 7693a11 (such a member is never listed as a value) and is covered by csharp-member-named-as-its-type-receiver-edge, so it became the implicitly typed lambda parameter case the issue names. The unit test from issue 499 expected no type after Mode Config; o is Config.Limit, a pattern that does not compile; it now expects the type for a property, a local and a lambda parameter of the name, as the ruling reads the pattern.

