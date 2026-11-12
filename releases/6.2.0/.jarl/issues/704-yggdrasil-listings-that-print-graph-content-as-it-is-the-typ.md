# 704 · Yggdrasil: listings that print graph content as it is (the type column of yg tree, the Type line of yg find, the rules and participants of yg flows, the body of yg context) show a key-shaped name whole

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** light
**Key:** 20261112T0317-snch
**Tags:** yggdrasil, keys
**Files:** 
**Repo:** Yggdrasil
**After:** 683
**Found by:** jarl
**Where:** w-683-sonnet, keys-more package report
**Branch:** jarl/690-small-rest
**Worker:** w-690-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:29

## What


## Why
Every finding and refusal now masks a key-shaped value, but a key pasted as a type, rule or node name still prints whole wherever the graph is listed; whether a listing should mask it, or the name should be refused when the graph loads, is open.

## Acceptance
[test] A key-shaped name in the graph is either refused when the graph loads, with a message that masks it, or masked in every listing that prints it (yg tree, yg find, yg flows, yg context), red before and green after · by: cd source/cli && npm test

## Evidence

