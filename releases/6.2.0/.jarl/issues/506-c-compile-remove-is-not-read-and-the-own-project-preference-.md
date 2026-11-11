# 506 · C#: Compile Remove is not read, and the own-project preference now binds the removed file

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-jhsv
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp-reach.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-compremv
**Where:** src/relations/extractors/csharp-reach.mts:261
**Branch:** jarl/506-csharp-reach
**Worker:** w-506b-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 09:55

## What
Claim: A file under <Compile Remove> still declares its types. With the 1.1.0 own-project preference, it outranks the same type in a referenced project, a false edge where v1.0.0 gave silence. A regression.

probes/csharp p22: Api.cs:3->Old at 5227538, silence at v1.0.0, expected Api.cs:3->Core

## Why


## Acceptance
- A file excluded by <Compile Remove> is not part of its project, so it never wins through the own-project preference, with the audit's probe as a catalogue case, red before and green after on 1.1.0 and matching v1.0.0's silence or better
- The C# project and parity tests are unchanged apart from the new case

## Changelog
- Fixed: C#: a file a project takes out of its compilation with `<Compile Remove>` no longer declares types, so it no longer outranks the same type of a referenced project.
- Fixed: C#: a `<Compile Include>` that links a file from outside the project adds that file and nothing else, so a project that compiles a shared file, and every project that references it, keeps the edges only its own references allow. An `internal` type or extension class of another project is no longer a candidate unless that project names the caller with `InternalsVisibleTo`. Both can give a consumer's graph new edges where a call was ambiguous before; a stored C# extract is stale by the extractor's rev.

## Evidence

### Notes

The worker was killed when the machine ran out of memory with six workers running; no commit, one uncommitted file in the worktree. A new worker resumes the lease.

Assumed: a Compile Remove is read only when it always applies; one under a condition (on the item, its ItemGroup or a Choose branch) or inside a Target is ignored, a file that a Compile Include of the same project names again is kept whatever the order, and a removal is read against the project being built only, so an uncertain removal never takes out code the project compiles. A file in no compilation is unreachable as a target and unknown as a caller. The C# project and parity test files (csharp-project.test.mjs, csharp-parity.test.mjs) are unchanged.

