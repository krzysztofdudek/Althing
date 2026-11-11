# 505 · C#: the reference graph counts references the compiler does not see

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-ncyc
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp-reach.mts, Runes/src/relations/extractors/csharp-project.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-refnoout
**Where:** src/relations/extractors/csharp-reach.mts:221

## What
Claim: ProjectReference metadata is not read and references are closed transitively, so ReferenceOutputAssembly="false" (a build-order reference) and a reference hidden by PrivateAssets="all" count as visible. The extra reach loses edges through false ambiguities. The PrivateAssets reading is documented as deliberate; ReferenceOutputAssembly is not mentioned. New with the 1.1.0 reference graph.

probes/csharp p21 (silence, expected ApiTests.cs:4->Api), p39 (silence, expected Api.cs:5->Lib)

## Why


## Acceptance
- [test] A ProjectReference with ReferenceOutputAssembly="false" gives the referencing project no sight of the referenced project's types, with the sceptic's probe s02 as a catalogue case (ClockTests.cs:3 -> Api), red before and green after · by: npm run check
- [test] A ProjectReference with PrivateAssets="all" is not passed on to the projects that reference the referencing project, with the sceptic's probe s04 as a catalogue case (Api.cs:5 -> Lib), red before and green after · by: npm run check
- [test] An assembly reference (a Reference with a HintPath) gives sight of that assembly only, never of the references of the project that built it, with a case in the shape of the jellyfin fuzz projects named in the evidence · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

From the 477 worker's heavy-tier read (2026-11-03): jellyfin fuzz/*.csproj gives 17 false reaches because Runes carries an assembly reference with a HintPath on to that project's own references, which the compiler never sees; the same gap on a real repository

