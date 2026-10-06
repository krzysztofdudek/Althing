# 142 · Yggdrasil: adoption of Runes 1.0.1 (pin, documentation of relation limits, rerun of the reproductions)

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** strong
**Tags:** yggdrasil, runes
**Files:** Yggdrasil/source/cli/package.json, Yggdrasil/source/cli/package-lock.json, Yggdrasil/docs/relations-flows-ports.md
**Repo:** ../../../Yggdrasil
**After:** 009, 073, 013, 074, 010, 012, 011, 017, 015, 016, 075, 018
**Found by:** jarl
**Where:**

## What
The extractor fixes in Runes 1.0.1 reach Yggdrasil only after Runes is published: npm install @chrisdudek/runes@1.0.1 --save-exact in source/cli, an update of the cited lines and of the limits table in docs/relations-flows-ports.md, a rerun of the reproduction of every Runes issue on Yggdrasil.

## Why
Without this the 13 Runes fixes change nothing for Yggdrasil's users.

## Acceptance
Yggdrasil release/6.1.1 pins Runes 1.0.1; the limits documentation matches; reproductions 009–018, 073–075 green on the built Yggdrasil. Requires Runes 1.0.1 to be published first, on the owner's word.

## Evidence


