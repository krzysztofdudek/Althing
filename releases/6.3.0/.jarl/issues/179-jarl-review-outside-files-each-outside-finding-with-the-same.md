# 179 · Jarl: review --outside files each outside finding with the same next number, so two of them at the edge of a scheduler profile's numbers file one and then refuse

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-094-opus-h1b
**Where:** skills/jarl/scripts/lib/review.mjs fileOutside

## What
With two --outside findings on a loop whose profile names an external scheduler and whose highest issue is 998, review files 999 and then refuses the second, saying nothing was written. The base does the same.

## Why
A message that says nothing was written must be true, as issue 103 now makes import.

## Acceptance
review checks every outside finding with the number it would be filed under before the first write, and a test holds the 998 case

## Evidence

