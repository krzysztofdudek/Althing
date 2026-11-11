# 556 · Runes: jellyfin's corpus verify shows 18 unexplained added edges on release/1.1.0

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1133-zebu
**Tags:** runes, corpus, csharp
**Files:** 
**Repo:** Runes
**Found by:** w-505-sonnet
**Where:** npm run corpus -- verify, heavy tier, jellyfin

## What
The worker of 505 ran verify on jellyfin and saw 18 added edges that corpus/explained.md does not explain, on a copy of release/1.1.0 without 505 too, so a merged C# change moved jellyfin's golden without an explanation.

## Why
An unexplained golden change hides whether the edges are true or false.

## Acceptance
[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained

## Evidence

