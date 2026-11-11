# 505 · C#: the reference graph counts references the compiler does not see

**Status:** in-progress
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
**Branch:** jarl/505-csharp-reference-flags
**Worker:** w-505-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 11:24

## What
Claim: ProjectReference metadata is not read and references are closed transitively, so ReferenceOutputAssembly="false" (a build-order reference) and a reference hidden by PrivateAssets="all" count as visible. The extra reach loses edges through false ambiguities. The PrivateAssets reading is documented as deliberate; ReferenceOutputAssembly is not mentioned. New with the 1.1.0 reference graph.

probes/csharp p21 (silence, expected ApiTests.cs:4->Api), p39 (silence, expected Api.cs:5->Lib)

## Why


## Acceptance
- [test] A ProjectReference with ReferenceOutputAssembly="false" gives the referencing project no sight of the referenced project's types, with the sceptic's probe s02 as a catalogue case (ClockTests.cs:3 -> Api), red before and green after · by: npm run check
- [test] A ProjectReference with PrivateAssets="all" is not passed on to the projects that reference the referencing project, with the sceptic's probe s04 as a catalogue case (Api.cs:5 -> Lib), red before and green after · by: npm run check
- [test] An assembly reference (a Reference with a HintPath) gives sight of that assembly only, never of the references of the project that built it, with a case in the shape of the jellyfin fuzz projects named in the evidence · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- C#: a `ProjectReference` with `ReferenceOutputAssembly="false"` (as an attribute or a child element) no longer gives the referencing project sight of the referenced project's types, a `ProjectReference` with `PrivateAssets="all"` is not passed on to the projects that reference the referencing project, and a `Reference` with a `HintPath` gives sight of that assembly only; a type name that two projects declare now binds the one the compiler sees, so edges that were dropped as ambiguous appear. A consumer's graph can also show a refusal where a hidden project's type was the only candidate.

## Evidence

From the 477 worker's heavy-tier read (2026-11-03): jellyfin fuzz/*.csproj gives 17 false reaches because Runes carries an assembly reference with a HintPath on to that project's own references, which the compiler never sees; the same gap on a real repository
- **ran (line fcc4fcaed0ef):** npm run check (clean committed tree; the matrix test red on 9b97f53 for the ReferenceOutputAssembly, PrivateAssets and HintPath cases, green on 93b1594) · **saw:** tests 2175, pass 2174, fail 0; dist/ is fresh; cases csharp-project-reference-without-output-assembly-edge (src/Tests/ClockTests.cs:3 -> Api) passes
- **ran (line d1232907c940):** npm run check (same run) · **saw:** csharp-private-assets-reference-not-passed-on-edge (src/Web/Api.cs:5 -> Lib) red before and green after; csharp-private-assets-reference-own-project-edge green
- **ran (line 7031ea6c9377):** npm run check (same run) · **saw:** csharp-assembly-reference-sees-assembly-only-edge (fuzz/ApiFuzz/Program.cs:4 -> Acme.Lib) red before and green after; csharp-hintpath-reference-edge still green
- **ran (line d0bad6f909cb):** npm run corpus · **saw:** corpus gate: passed (routine tier; CleanArchitecture 452 edges, 0 added, 0 removed). node scripts/corpus.mjs verify --tier all --only CleanArchitecture,jellyfin,eShop: CleanArchitecture and eShop 0 added 0 removed; jellyfin shows 18 added, identical on a copy of release/1.1.0 without this change, so no golden line is moved by 505

Assumed: with ReferenceOutputAssembly=false the referenced project's own references are still followed (the restore graph is not told otherwise), so only the project's own types are hidden; a wildcard reference with the metadata hides every project it matches.

Assumed: a Reference (with or without HintPath) is never passed on by the project that holds it, because MSBuild hands a consumer of a project the project's assembly and its project and package references, not its plain assembly references; so at depth one and beyond Reference edges are not followed.

Assumed: only PrivateAssets containing 'all' stops the flow; 'compile' alone is not read (more reach). A metadata value under a Condition, in a Target, or with an unknown property reads as not written.

README paragraph check: none of the README behaviour paragraphs name PrivateAssets or ReferenceOutputAssembly. Catalogue delta +6 (709 -> 715 in the test name, assertion and first-line comment).

