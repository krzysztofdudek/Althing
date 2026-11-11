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

## Evidence

