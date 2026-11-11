# 504 · C#: a file-local type loses to a same-named type of another file inside its own file

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-ksqx
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-filelocl
**Where:** src/relations/extractors/csharp.mts:426
**Branch:** jarl/500-csharp-lookup-levels
**Worker:** w-500-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 11:23

## What
Claim: A file-local type is never published, so inside its own file the name falls through to a public type of the same name in another node, a false edge. The C# 11 file-local types specification has the file-local type win in its file; this reading is from memory of that specification and needs checking against its text. Pre-existing in v1.0.0.

probes/csharp p16: Use.cs:4->util, expected silence; same on v1.0.0

## Why


## Acceptance
- [test] Inside the file that declares a file-local type, a reference to its name binds no type of another file at that namespace or a farther one, with the audit's probe p16 as a catalogue case (silence), red before and green after; the C# 11 file-local types proposal, Lookup: "if the set of accessible members contains file-local types, all members which are not file-local types are removed from the set", and its remarks: these rules "permit a file-local type to shadow a namespace or a non-file-local type" · by: npm run check
- [test] A type nearer than the file-local one (a nested type of an enclosing type, or a type of an inner enclosing namespace) still binds, with a case · by: npm run check
- [test] In every other file the file-local type hides nothing, and a reference there binds the public type as before, with a case · by: npm run check

## Changelog
- C#: `using static T;` imports the nested types and the extension methods of `T` at the level of its directive (the compilation unit, a namespace body, or the whole project for `global using static`), so `Circle` for `T.Circle` and `s.Shout()` for an extension method of `T` now give their edges, and inside a namespace body a farther global type of the same name no longer binds; a `file` type and a type nested in one is found by its name inside its own file, so a public type of the same name in another file no longer gets an edge from that file. A relation pass can show new edges, and so new refusals, where a using static now imports a type or a call; a consumer that runs its own pass passes the optional `globalStatics` of each file to `buildCsharpProjectScopes` and `projectGlobalStatics` in the uses options to get the project-wide form.

## Evidence

### Proof

- **ran (line bc03d7f3efc6):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** red at fa044eb: csharp-file-local-type-in-own-file-silence (unexpected edge Use.cs:4->util), csharp-file-local-type-hides-outer-namespace-type-silence (Use.cs:5->util), csharp-file-local-type-hides-using-imported-type-silence (Use.cs:5->lib); green at c201fb5: 2203 tests, 2202 pass, 0 fail, 1 skipped, dist/ is fresh
- **ran (line 856e00e24137):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** cases csharp-file-local-type-nearer-nested-type-edge (nested type of the enclosing partial class from another file, Use.cs:4->part) and csharp-file-local-type-nearer-inner-namespace-type-edge (App.Inner.Helper, Use.cs:5->inner) pass at fa044eb already and stay green at c201fb5: 2203 tests, 2202 pass, 0 fail, dist/ is fresh
- **ran (line a6174899c3ab):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** case csharp-file-local-type-other-file-hides-nothing-edge (Other.cs:3->util) passes at fa044eb and stays green at c201fb5: 2203 tests, 2202 pass, 0 fail, dist/ is fresh

### Notes

Assumed: a file-local type is modelled by ending the candidate group of a reference at the reading that names it (a nearer reading stays, nothing farther is a candidate), rather than by publishing it under a key of its own; the extract carries the keys of such types (fileLocalTypes). The rev stays at 19, raised once for the branch by issue 500.

