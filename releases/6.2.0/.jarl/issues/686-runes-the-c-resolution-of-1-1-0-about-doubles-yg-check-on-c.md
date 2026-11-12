# 686 · Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one no…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0009-llpz
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-530-opus
**Where:** the review of 475, 530, 536, 562
**Branch:** jarl/686-csharp-speed
**Worker:** w-686-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one node per directory of .cs files, yg check --no-approve --full: eShop @913acea warm 7.8 s with release/6.2.0 (Runes 1.0.0) against 14.4 s with jarl/530-runes-110 (Runes 1.1.0), cold 9.0 against 16.7 s; jellyfin @305a964 warm 58 s against 116 s, cold 76 against 144 s. A CPU profile of the eShop run puts 11.3 of its 14.7 s under resolver.mjs hintFiles, with csharpKeys (4.8 s self) and symbol-table defCount (2.6 s self) on top; Grain's export of eShop on the same Runes takes 17 s. Found in the review of 475, 530, 536, 562.

## Why


## Acceptance


- [test] The hot paths named by the profile (hintFiles, csharpKeys, the symbol table's defCount) have a test that bounds their work on a generated project of many C# files, red before and green after · by: npm run check
- [compare] yg check on eShop and jellyfin with Runes after the change takes no more than 1.25 times its time with Runes 1.0.0, warm and cold, measured on one machine and written in the evidence, with the same edges as before the change · by: npm run corpus

## Evidence

