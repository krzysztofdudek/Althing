# 479 · Runes: a fully qualified using alias target inside a namespace body gives no edge on its directive line, although its first segment names no nearer namespace (eShop)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261103T0035-qvxb
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 469
**Found by:** jarl
**Where:** Corpus run on release/1.1.0 after merge f2ad16b (2026-11-03): eShop tests/Ordering.UnitTests/Application/OrdersWebApiTest.cs:5
**Branch:** jarl/476-csharp-using-block-scope
**Merged:** 6d01d91 in ../../../Runes
**CI:** green

## What
Since 469, the directive line of a plain alias target in a namespace body reads only the nearest namespace, to avoid a false edge when a nearer namespace and a global type share a name. A fully qualified target whose first segment matches no namespace of the repository nearer than the global one is unambiguous, yet it loses its directive-line edge too.

## Why
An unused alias to a real type is a real dependency the graph should show; the uses keep their edges today, the bare directive does not.

## Acceptance
- A fully qualified alias target whose first segment names no nearer namespace of the repository gives its edge on the directive line, with a catalogue case red before and green after, and the nearer-namespace case stays silent
- eShop's golden regains the line and the change is explained

## Changelog
- Fixed: in C#, the directive line of an unused `using O = Shop.Ordering.Order;` inside a namespace body gives its edge again when the repository declares no nearer namespace or type named `Shop`; beside a nearer namespace of that name it stays silent. The new edges can make a graph that was green show new refusals.

## Evidence

- **ran (history):** nice -n 15 timeout 300 node --test --test-name-pattern=qualified-target-directive test/relations/extractors/csharp-name-resolution-matrix.test.mjs (case added, extractor at 2a26e66) · **saw:** fail 1: expected edge src/t/Test.cs:2->order not emitted (got none)
- **ran (history):** same, commit 83b0dea, with the C# suites; corpus verify --tier all --only eShop,jellyfin,CleanArchitecture · **saw:** pass, fail 0; eShop 1 added (OrdersWebApiTest.cs:5 -> OrderViewModel.cs, regained and explained), jellyfin and CleanArchitecture unchanged; the nearer-namespace line of csharp-alias-namespace-beside-global-type-edge stays silent
- **ran (history):** nice -n 15 timeout 590 npm run check; nice -n 15 timeout 590 npm run coverage (on 83b0dea, clean tree) · **saw:** tests 1995, pass 1995, fail 0; dist/ is fresh; coverage all files lines 99.01, branches 94.91, functions 98.91; catalogue 602 to 611; csharp rev 8 to 10
- **ran (history):** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 1997, pass 1997, fail 0, dist/ is fresh; corpus verify: passed on all 33 repositories (605254d on release/1.1.0: 476 and 479 merged at 6d01d91, 271 at 605254d)

