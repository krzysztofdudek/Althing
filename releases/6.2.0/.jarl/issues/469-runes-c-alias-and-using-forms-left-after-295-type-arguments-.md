# 469 · Runes: C# alias and using forms left after 295 (type arguments of an alias target, using static inside a namespace body, a namespace and a global type of one name, usings in an outer namespace block, S::A.Gen<T> as an attribute)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261102T2152-iuri
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**Found by:** rev-runes-185-opus2
**Where:** Items 2 to 6 of the second review of 185, folded into 295 on 2026-10-11; the 295 worker left them, and rev-runes-295-opus agreed they can be split (2026-11-02)
**After:** 295
**Branch:** jarl/469-csharp-alias-forms
**Merged:** f2ad16b in ../../../Runes
**CI:** red

## What
Five C# forms are still read differently from the language's lookup rules: an alias whose target carries type arguments, using static inside a namespace body, a namespace and a global type with the same name, usings in an outer namespace block seen from an inner one, and the comments at the S::A.Gen<T> attribute path, which may not say what the code does.

## Why
Each form either loses a real edge or binds the wrong type, and a consumer cannot tell which.

## Acceptance
- Each of the five forms gives the edge the C# lookup rules give, or is a documented silence, with a catalogue case each, red before and green after
- The comments on the S::A.Gen<T> attribute path say what the code does, checked by a case

## Changelog
- Fixed: the type arguments of a using alias target (`using R = Repo<Order>;`) and a `using static` type are read where the directive stands, in its namespace body with no using beside it, and a generic `using static Repo<Order>;` now gives the edges of `Repo` and `Order`; the using directives of an enclosing namespace block take part in reading an alias target, on its uses as on its directive; inside a namespace body the directive line of a plain alias target reads only its nearest namespace, so `namespace App; using M = Models;` no longer gives an edge to a global type `Models` beside a namespace `App.Models` (an unused alias to a farther type there now gives no directive edge); `[S::Core.Mark]`, `[S::Core.Gen<T>]` and an unnamed tuple element `(int I, S::Core.Customer)` give their edge in the namespace the alias names. The new edges can make a graph that was green show new refusals.

## Evidence

- **ran (history):** nice -n 15 timeout 300 node --test --test-name-pattern=directive-scope test/relations/extractors/csharp-name-resolution-matrix.test.mjs (case added, extractor at 86bd33b) · **saw:** fail 1: expected edge src/c/Use.cs:2->o not emitted (got src/c/Use.cs:2->r, src/c/Use.cs:2->app, ...): the type argument Order of using R = Repo<Order>; above namespace App; bound App.Order
- **ran (history):** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (commit 53cf7bb) · **saw:** tests 141, pass 141, fail 0
- **ran (history):** nice -n 15 timeout 300 node --test --test-name-pattern=namespace-body-generic test/relations/extractors/csharp-name-resolution-matrix.test.mjs (case added, extractor at 53cf7bb) · **saw:** fail 1: expected edge src/c/Use.cs:2->near not emitted (got src/c/Use.cs:2->far); using static Repo<Order>; gave nothing
- **ran (history):** same, commit d227c88, with the C# matrix, csharp-parity, candidate-parity, catalogue and rev tests · **saw:** pass, fail 0
- **ran (history):** nice -n 15 timeout 300 node --test --test-name-pattern=beside-global-type test/relations/extractors/csharp-name-resolution-matrix.test.mjs (case added, extractor at d227c88) · **saw:** fail 1: unexpected cross-owner edge src/c/Use.cs:2->global (namespace App; using M = Models; bound the global type Models)
- **ran (history):** same, commit 93f62f8, with the C# suites · **saw:** tests 315, pass 315, fail 0
- **ran (history):** nice -n 15 timeout 300 node --test --test-name-pattern=outer-block-using test/relations/extractors/csharp-name-resolution-matrix.test.mjs (case added, extractor at 93f62f8) · **saw:** fail 1: expected edge src/c/Use.cs:7->core not emitted (got 7->r, 7->global, 8->global, src/d/Use.cs:7->x)
- **ran (history):** same, commit 6278c78, with the C# suites · **saw:** tests 316, pass 316, fail 0
- **ran (history):** nice -n 15 timeout 300 node --test --test-name-pattern=dotted-attribute test/relations/extractors/csharp-name-resolution-matrix.test.mjs (case added, extractor at 6278c78) · **saw:** fail 1: expected edge src/web/Handler.cs:4->attrs not emitted (got src/web/Handler.cs:5->data): [S::Core.Mark] and [S::Core.Gen<Order>] gave no attribute edge
- **ran (history):** same, commit 7f10e9c, with the C# suites · **saw:** tests 317, pass 317, fail 0
- **ran (history):** nice -n 15 timeout 300 node --test --test-name-pattern=alias-qualified-element test/relations/extractors/csharp-name-resolution-matrix.test.mjs (case added, extractor at 7f10e9c) · **saw:** fail 1: expected edge src/web/Use.cs:3->core not emitted (got none)
- **ran (history):** same, commit dc2d199, with the C# suites · **saw:** tests 318, pass 318, fail 0
- **ran (history):** nice -n 15 timeout 1800 npm run check; nice -n 15 timeout 1800 npm run coverage (on dc2d199, clean tree) · **saw:** tests 1952, pass 1952, fail 0; dist/ is fresh; coverage all files lines 99.06, branches 94.79, functions 99.14; catalogue 596 to 602; csharp rev 7 to 8

open question for the owner: a namespace of the repository cannot be seen from type keys, so the directive line of a plain alias target inside a namespace body now reads only its nearest namespace (a silence for an unused alias to a farther type). Options: (a) keep the silence (no cost now; an unused alias in a namespace body loses its directive edge); (b) add an optional symbol-hint field that silences a reading when a nearer namespace holding repository types exists, with a namespace index in the symbol table and a docs/api.md paragraph (a new contract field, resolver change); (c) read every namespace again and accept the rare false edge

found (not in this diff): Yggdrasil source/cli/src/relations/facts-cache.ts serializes a CsharpExtract scope without aliasDecls, which 295 added as a Map; a cached C# extract reloads with scope.aliasDecls undefined, and assembleCsharpCandidates then throws on scope.aliasDecls.get (and its types will not compile against release/1.1.0); the cache must flatten aliasDecls like aliases. Also: plain using directives are read file-wide for ordinary references, so a using inside one namespace block reaches a sibling block, and a nearer block's usings are not read before an outer namespace's members
- **ran (history):** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 1963, pass 1963, fail 0, dist/ is fresh; corpus verify: passed after e377daf regenerated eShop's golden and explained its one removed directive-line reference (merge f2ad16b on release/1.1.0)

For the ratify item a-029: the corpus shows the cost of the silence on a real repository. In eShop, using Order = eShop.Ordering.API.Application.Queries.Order; inside a file-scoped namespace lost its directive-line edge, although its first segment names no nearer namespace; lines 110, 119 and 120 that use the alias keep the edge. Filed as 479

CI on 8551da6 and e377daf was red in the corpus job only: the Go oracle, which first ran on GitHub's runner, reported three gin testdata imports; explained in bf4a24d, whose CI is green, as is every later tip; the oracle itself is fixed under 477

Ruling ask-029 (ratify, by owner): Ratified: Krzysztof approved all three open ratify items at once (option 1 of: ratify all three, discuss each); the option label is not his wording.

