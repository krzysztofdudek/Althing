# 528 · Runes: in C#, a nested type of a file-local type is never published, and an alias-qualified name with a generic middle segment drops that segment's arity

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0526-ugkn
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**After:** 492
**Found by:** rev-runes-492-opus
**Where:** Review of 492 and 495 (2026-11-03); the 492 worker's report
**Branch:** jarl/500-csharp-lookup-levels
**Worker:** w-500-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 11:23

## What
A type nested inside a file type is not declared, so a use of it inside that file falls through to namespace readings and can bind a same-named type elsewhere. S::A<int>.B keeps no arity for A<int>.

## Why
A false edge in the first case, a possibly wrong target in the second.

## Acceptance
A nested type of a file type binds inside its file, and S::A<int>.B reads A with its arity, each with a case red before and green after

## Changelog
- C#: `using static T;` imports the nested types and the extension methods of `T` at the level of its directive (the compilation unit, a namespace body, or the whole project for `global using static`), so `Circle` for `T.Circle` and `s.Shout()` for an extension method of `T` now give their edges, and inside a namespace body a farther global type of the same name no longer binds; a `file` type and a type nested in one is found by its name inside its own file, so a public type of the same name in another file no longer gets an edge from that file. A relation pass can show new edges, and so new refusals, where a using static now imports a type or a call; a consumer that runs its own pass passes the optional `globalStatics` of each file to `buildCsharpProjectScopes` and `projectGlobalStatics` in the uses options to get the project-wide form.

## Evidence

### Proof

- **ran (line e70d885f2ca5):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** case csharp-file-local-nested-type-in-own-file-silence red at fa044eb (unexpected edge Use.cs:4->util), green at c201fb5; case csharp-alias-colon-colon-generic-middle-arity-edge (S::A<int>.B -> A`1, Use.cs:3->lib) already green at fa044eb, so the arity half only gains its pinning case; 2203 tests, 2202 pass, 0 fail, dist/ is fresh

### Notes

Checked on 2026-11-09 against Runes release/1.1.0: the arity of S::A<int>.B looks fixed by 495, but no test names that case. The nested type of a file-local type is still not published.

Assumed: the arity half of 528 was already fixed by 495, so S::A<int>.B only gains its pinning case (csharp-alias-colon-colon-generic-middle-arity-edge, green before and after); the nested-type half is fixed with 504 by the same mechanism. Line 1 of 528 is tagged [read] in the lease, so the row I recorded for it is extra.

