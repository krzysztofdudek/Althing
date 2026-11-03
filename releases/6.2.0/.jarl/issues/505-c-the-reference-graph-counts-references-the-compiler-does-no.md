# 505 · C#: the reference graph counts references the compiler does not see

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-refnoout
**Where:** src/relations/extractors/csharp-reach.mts:221

## What
Claim: ProjectReference metadata is not read and references are closed transitively, so ReferenceOutputAssembly="false" (a build-order reference) and a reference hidden by PrivateAssets="all" count as visible. The extra reach loses edges through false ambiguities. The PrivateAssets reading is documented as deliberate; ReferenceOutputAssembly is not mentioned. New with the 1.1.0 reference graph.

probes/csharp p21 (silence, expected ApiTests.cs:4->Api), p39 (silence, expected Api.cs:5->Lib)

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Skip a ProjectReference whose ReferenceOutputAssembly is false, and, if the trade-off is reopened, stop the transitive walk at a PrivateAssets="all" edge.

## Evidence

