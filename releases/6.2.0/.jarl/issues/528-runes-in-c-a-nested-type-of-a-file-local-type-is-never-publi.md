# 528 · Runes: in C#, a nested type of a file-local type is never published, and an alias-qualified name with a generic middle segment drops that segment's arity

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 492
**Found by:** rev-runes-492-opus
**Where:** Review of 492 and 495 (2026-11-03); the 492 worker's report

## What
A type nested inside a file type is not declared, so a use of it inside that file falls through to namespace readings and can bind a same-named type elsewhere. S::A<int>.B keeps no arity for A<int>.

## Why
A false edge in the first case, a possibly wrong target in the second.

## Acceptance
A nested type of a file type binds inside its file, and S::A<int>.B reads A with its arity, each with a case red before and green after

## Evidence

