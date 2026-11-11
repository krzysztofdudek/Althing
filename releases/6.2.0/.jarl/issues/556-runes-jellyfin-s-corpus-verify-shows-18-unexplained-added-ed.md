# 556 · Runes: jellyfin's corpus verify shows 18 unexplained added edges on release/1.1.0

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1133-zebu
**Tags:** runes, corpus, csharp
**Files:** 
**Repo:** Runes
**Found by:** w-505-sonnet
**Where:** npm run corpus -- verify, heavy tier, jellyfin
**Branch:** jarl/233-jvm-and-tools
**Worker:** w-233-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:23

## What
The worker of 505 ran verify on jellyfin and saw 18 added edges that corpus/explained.md does not explain, on a copy of release/1.1.0 without 505 too, so a merged C# change moved jellyfin's golden without an explanation.

## Why
An unexplained golden change hides whether the edges are true or false.

## Acceptance
[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained

## Evidence

### Notes

Reproduced on an extraction of release/1.1.0 at 176abca (the commit the worker of 505 named): verify --only jellyfin, 18 added, 0 removed, 0 explained. Attributed by running the same verify on extractions of 33ba2bc (0 added), 47680c4 (1 added: ApplicationHost.cs:394, a delegate declaration read as a type) and 9ea4980 (the 18: a type in a pattern, the grammar reading item is A || item is B || item is C as one constant pattern). Since then commit 63e9cd8 put them in the golden with the note 'release/1.1.0 gave this reference at merge a1ef8c4', which judges nothing. All 18 judged true against the source and the C# lookup rules; commit 2ed35b5 rewrites their 18 entries in corpus/explained.md with the judgment. The current golden holds all 18, and node scripts/corpus.mjs verify --only jellyfin on that commit: ok, 32640 edges, 0 added, 0 removed; corpus verify: passed.

