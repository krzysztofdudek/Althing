# 686 · Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one no…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0009-llpz
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-530-opus
**Where:** the review of 475, 530, 536, 562

## What
Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one node per directory of .cs files, yg check --no-approve --full: eShop @913acea warm 7.8 s with release/6.2.0 (Runes 1.0.0) against 14.4 s with jarl/530-runes-110 (Runes 1.1.0), cold 9.0 against 16.7 s; jellyfin @305a964 warm 58 s against 116 s, cold 76 against 144 s. A CPU profile of the eShop run puts 11.3 of its 14.7 s under resolver.mjs hintFiles, with csharpKeys (4.8 s self) and symbol-table defCount (2.6 s self) on top; Grain's export of eShop on the same Runes takes 17 s. Found in the review of 475, 530, 536, 562.

## Why


## Acceptance


## Evidence

