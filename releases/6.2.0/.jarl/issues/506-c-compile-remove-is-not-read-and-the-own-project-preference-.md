# 506 · C#: Compile Remove is not read, and the own-project preference now binds the removed file

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-compremv
**Where:** src/relations/extractors/csharp-reach.mts:261

## What
Claim: A file under <Compile Remove> still declares its types. With the 1.1.0 own-project preference, it outranks the same type in a referenced project, a false edge where v1.0.0 gave silence. A regression.

probes/csharp p22: Api.cs:3->Old at 5227538, silence at v1.0.0, expected Api.cs:3->Core

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Read Compile Remove patterns of a project and drop the matching files from its declarations, or at least from the own-project preference.

## Evidence

