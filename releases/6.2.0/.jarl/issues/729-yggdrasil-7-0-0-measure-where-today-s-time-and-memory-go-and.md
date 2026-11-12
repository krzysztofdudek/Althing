# 729 · Yggdrasil 7.0.0: measure where today's time and memory go, and decide the implementation language of the rewrite

**Status:** open
**Kind:** research
**Priority:** 2
**Tier:** strong
**Key:** 20261112T0655-ysom
**Tags:** 
**Files:** 
**Found by:** jarl
**Where:**
**Repo:** Yggdrasil
**After:** 725

## What


## Why


The owner, 2026-11-12: 7.0.0 is designed from zero with no compatibility, and he considered writing Yggdrasil anew in a faster, leaner language. The choice should rest on where the cost actually lies (parsing, hashing, classification, reviewer calls, process start) and on what the language means for script rules, which users write in JavaScript today, for Runes, the code shared with Grain and Jarl, and for distribution through npm.

## Acceptance


[read] a profile of yg check and yg check --approve --only-deterministic on Yggdrasil, Grain and one large public repository gives time and peak memory per phase; a small prototype of the 7.0.0 core (types by when, imports between types, one script rule) in the strongest candidate language is measured against it; the report recommends the language with what it costs for script rules, Runes and distribution

## Evidence

