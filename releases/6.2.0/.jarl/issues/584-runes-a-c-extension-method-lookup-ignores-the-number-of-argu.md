# 584 · Runes: a C# extension method lookup ignores the number of arguments, so a call binds an extension that cannot take it (10 false edges on jellyfin)

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1353-ybih
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**After:** 494
**Found by:** jarl
**Where:** w-494-fable, the C# base-class package

## What


## Why
A call with two arguments binds an extension method of one parameter; the consumer's graph shows a dependency that does not exist.

## Acceptance
- [test] An extension method call binds only extensions whose parameter count (beyond this) can take the call's arguments, with a catalogue case each way, red before and green after · by: npm run check
- [compare] The jellyfin golden loses the false extension edges and gains none, each explained · by: npm run corpus

## Evidence

