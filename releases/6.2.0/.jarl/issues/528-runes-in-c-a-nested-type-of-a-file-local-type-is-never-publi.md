# 528 · Runes: in C#, a nested type of a file-local type is never published, and an alias-qualified name with a generic middle segment drops that segment's arity

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0526-ugkn
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
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

## Evidence

### Notes

Checked on 2026-11-09 against Runes release/1.1.0: the arity of S::A<int>.B looks fixed by 495, but no test names that case. The nested type of a file-local type is still not published.

