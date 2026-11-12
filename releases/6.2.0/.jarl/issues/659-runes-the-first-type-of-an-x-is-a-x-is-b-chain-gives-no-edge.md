# 659 · Runes: the first type of an 'x is A || x is B' chain gives no edge in C#, three jellyfin Program.cs explanations judge nothing, and Kotlin recovery repairs a broken declaration depending on how far down the file it sits

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2034-rldw
**Tags:** runes, csharp, kotlin
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-233-opus, the JVM and tooling package
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
A missing edge for a type the code tests against, explanation entries that do not say why an edge is right, and a recovery whose result depends on position rather than on the code.

## Acceptance
[test] x is A || x is B gives an edge to A and to B, a catalogue case; jellyfin's Program.cs explanations say why each edge is right; Kotlin recovery gives the same result for a broken declaration wherever it sits in the file, red before and green after · by: npm run check

## Evidence

