# 710 · Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 't…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0326-zick
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-560-opus
**Where:** the review of 560, 580, 581, 611, 639, 655, 656, 663, 688, 689
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:30

## What
Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say

## Why


## Acceptance


[test] A script rule's parser-memory report ends with yg check --approve --only-deterministic, not a step that starts paid reviewer pairs, as 611's tree report does, red before and green after · by: cd source/cli && npm test

## Evidence

