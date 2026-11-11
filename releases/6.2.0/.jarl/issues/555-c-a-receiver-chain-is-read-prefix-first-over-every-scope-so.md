# 555 · C#: a receiver chain is read prefix first over every scope, so a type of the same name as a nearer …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1119-ccnx
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** rev-499b-fable
**Where:** the review of 496, 499, 501
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
C#: a receiver chain is read prefix first over every scope, so a type of the same name as a nearer namespace takes the edge (in namespace App.Web, Data.Row.Parse() or o is Data.Row beside a namespace App.Data and a global class Data gives the edge to the class Data, where C# binds the namespace App.Data first); the plain type reading of Data.Row binds it right. Present on the base release/1.1.0, src/relations/extractors/csharp.mts:2118.

## Why


## Acceptance


[test] A catalogue case in namespace App.Web with a namespace App.Data and a global class Data: Data.Row.Parse() and o is Data.Row give the edge through the nearer namespace App.Data, not to the class Data, as the plain type reading of Data.Row does, red before and green after · by: npm run check

## Changelog
- C#: a dotted receiver binds its first name at the nearest namespace or type first: in `namespace App.Web`, `Data.Row.Parse()` and `o is Data.Row` name `App.Data.Row`, not a class `Data` of the global namespace. A consumer's graph can show the edge at a different target.

## Evidence

### Proof

- **ran (line 20faab0f6a9d):** node --test --test-name-pattern=csharp-receiver-nearer-namespace-before-global-type-edge test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on 2bafe8b with the new case, then on e0ddd65 · **saw:** before: fail, got src/web/Page.cs:3->data, 5->legacy, 6->legacy; after: pass, all three lines to data
- **ran (line 20faab0f6a9d):** the branch's 13 new catalogue cases and its matrix test file copied into a scratch extraction of a94d31b (the branch's merge base), run with node --test --test-name-pattern=<the 13 case ids> test/relations/extractors/csharp-name-resolution-matrix.test.mjs; then the full suite on a scratch extraction of 9eb9987 (build, grammars, node --test --test-concurrency=6 on every test file, dist compared with the committed dist) · **saw:** before: fail, got src/web/Page.cs:3->data, 5->legacy, 6->legacy; after: the full suite 2512 tests, 2511 pass, 0 fail, 1 skipped; rebuilt dist identical to the committed dist

### Notes

Assumed: the readings of a receiver are ordered by the step of the lookup (every prefix at a nearer type or namespace before any farther one) and carry no condition on a nearer namespace. A first version voided the farther readings where the repository declares a nearer namespace of the first name; it removed 4 true references (CleanArchitecture 3, eShop 1) where that namespace belongs to a project the caller does not reference. So where the nearer namespace exists and holds no such type, the farther readings are still read.

