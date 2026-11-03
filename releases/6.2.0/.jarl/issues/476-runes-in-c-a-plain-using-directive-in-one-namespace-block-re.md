# 476 · Runes: in C#, a plain using directive in one namespace block reaches references in a sibling block

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 469
**Found by:** w-runes-469-opus
**Where:** The 469 worker's report (2026-11-03): ordinary references read plain usings file-wide
**Branch:** jarl/476-csharp-using-block-scope
**Merged:** 6d01d91 in ../../../Runes
**CI:** green

## What
Aliases now reach only the namespace block that holds their directive, but a plain using directive (using Shop.Core;) still applies to every reference in the file, so a reference in a sibling namespace block can bind a type that block cannot see.

## Why
A false edge of this kind can force a cycle a team cannot remove.

## Acceptance
- A plain using directive applies only inside the block that holds it, with catalogue cases for a sibling block (silence) and a nested block (edge), red before and green after
- The C# matrix, csharp-parity and candidate-parity tests are unchanged apart from the new cases

## Changelog
- Fixed: a C# `using N;` inside a namespace block now reaches only the references of that block and the blocks nested in it, at that namespace, before the next namespace outward and before the project's global usings; the namespace it names is read where it stands (`using Core;` inside `namespace A` names `A.Core` when the repository declares it), for extension methods too; a using alias target reads an enclosing block's alias of its first name and the nested types an enclosing `using static` imports. `TargetHint` and `SymbolSetMember` gain the optional `shadow`, and `SymbolTable` gains `hasNamespace`. A reference can now bind a different type than before, so a graph that was green can show new refusals.

## Evidence

From the review of 469 (rev-runes-469-fable, 2026-11-03), part of this issue: an outer block's plain using is read by its written text, so namespace A { using Core; namespace B { using O = Order; } } with namespace A.Core and a global Core.Order binds the global type where C# binds A.Core.Order (spec 14.5.3), as every ordinary reference under that using already does on release/1.1.0; an outer block's alias of a target's first name ends the lookup unread; an outer block's using static is not read for a target (it imports nested types, 14.5.4)
- **ran:** nice -n 15 timeout 300 node --test --test-name-pattern='block|outer-using|outer-alias' test/relations/extractors/csharp-name-resolution-matrix.test.mjs (8 cases added, extractor at release/1.1.0 5cbcc8c) · **saw:** fail 8: sibling-block-silence unexpected 8->core; nested-block-edge got far not near; block-namespace-shadow-silence unexpected 4->far; block-before-outer-member-edge got app not lib; extension-using-sibling-block-silence unexpected 8->ext; alias-target-outer-using-namespace-read-edge got far; alias-target-outer-using-static-edge got 7->global; alias-target-outer-alias-edge got none
- **ran:** same, commit 2a26e66, with the C# matrix, csharp-parity, candidate-parity, catalogue, rev, resolver and symbol-table tests · **saw:** pass, fail 0 (C# matrix 159 with parity and catalogue); csharp.test.mjs DECISIVE FP group order updated: a using below a file-scoped namespace is now read at that namespace, before the outer one
- **ran:** nice -n 15 timeout 590 node scripts/corpus.mjs verify --tier all (at 2a26e66 before the golden update) · **saw:** 32 ok; eShop 9 added, 7 removed: each a using below a file-scoped namespace now binding before the project's global usings (Order, CardType), judged right and explained; golden regenerated in 2a26e66
- **ran:** nice -n 15 timeout 300 node --test --test-name-pattern=rooted-block test/relations/extractors/csharp-name-resolution-matrix.test.mjs (2 cases added, extractor at 83b0dea) · **saw:** fail 2: rooted-block-global-edge got 4->near, b 6->near, 7->near (expected far); rooted-block-beside-namespace-edge got none
- **ran:** same, commit e5e9278, with C# matrix, parity and catalogue; npm run check; npm run coverage; corpus.mjs verify --tier all · **saw:** pass, fail 0; check 1997 pass, dist/ fresh; coverage lines 99.01, branches 94.92, functions 98.91; corpus 33 ok, no golden changed; catalogue 611 to 613; csharp rev 10 to 11
- **ran:** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 1997, pass 1997, fail 0, dist/ is fresh; corpus verify: passed on all 33 repositories (605254d on release/1.1.0: 476 and 479 merged at 6d01d91, 271 at 605254d)

