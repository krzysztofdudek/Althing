# 469 · Runes: C# alias and using forms left after 295 (type arguments of an alias target, using static inside a namespace body, a namespace and a global type of one name, usings in an outer namespace block, S::A.Gen<T> as an attribute)

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**Found by:** rev-runes-185-opus2
**Where:** Items 2 to 6 of the second review of 185, folded into 295 on 2026-10-11; the 295 worker left them, and rev-runes-295-opus agreed they can be split (2026-11-02)
**After:** 295

## What
Five C# forms are still read differently from the language's lookup rules: an alias whose target carries type arguments, using static inside a namespace body, a namespace and a global type with the same name, usings in an outer namespace block seen from an inner one, and the comments at the S::A.Gen<T> attribute path, which may not say what the code does.

## Why
Each form either loses a real edge or binds the wrong type, and a consumer cannot tell which.

## Acceptance
- Each of the five forms gives the edge the C# lookup rules give, or is a documented silence, with a catalogue case each, red before and green after
- The comments on the S::A.Gen<T> attribute path say what the code does, checked by a case

## Evidence

