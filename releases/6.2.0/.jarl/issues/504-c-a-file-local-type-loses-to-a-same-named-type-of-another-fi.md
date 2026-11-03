# 504 · C#: a file-local type loses to a same-named type of another file inside its own file

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-filelocl
**Where:** src/relations/extractors/csharp.mts:426

## What
Claim: A file-local type is never published, so inside its own file the name falls through to a public type of the same name in another node, a false edge. The C# 11 file-local types specification has the file-local type win in its file; this reading is from memory of that specification and needs checking against its text. Pre-existing in v1.0.0.

probes/csharp p16: Use.cs:4->util, expected silence; same on v1.0.0

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Collect the file-local type names per file and silence any reference in that file whose first segment names one.

## Evidence

