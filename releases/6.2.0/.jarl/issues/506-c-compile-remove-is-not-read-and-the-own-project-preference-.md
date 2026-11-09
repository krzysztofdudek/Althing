# 506 · C#: Compile Remove is not read, and the own-project preference now binds the removed file

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-jhsv
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-compremv
**Where:** src/relations/extractors/csharp-reach.mts:261

## What
Claim: A file under <Compile Remove> still declares its types. With the 1.1.0 own-project preference, it outranks the same type in a referenced project, a false edge where v1.0.0 gave silence. A regression.

probes/csharp p22: Api.cs:3->Old at 5227538, silence at v1.0.0, expected Api.cs:3->Core

## Why


## Acceptance
- A file excluded by <Compile Remove> is not part of its project, so it never wins through the own-project preference, with the audit's probe as a catalogue case, red before and green after on 1.1.0 and matching v1.0.0's silence or better
- The C# project and parity tests are unchanged apart from the new case

## Evidence

