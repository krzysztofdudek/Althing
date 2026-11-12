# 708 · Minor: Runes, C#: a dotted type at the head of an is chain gives no edge, and neither does a dotted…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-bnzs
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693

## What
Minor: Runes, C#: a dotted type at the head of an is chain gives no edge, and neither does a dotted type later in the chain: x is Models.Order || b and x is App.Models.Order || x is App.Models.Line give nothing on c5124ca and 90c330f, while a lone x is Models.Line gives the edge; 659's first-type reading leaves a member-access head to the existing reading, which reads none.

## Why


## Acceptance


## Evidence

