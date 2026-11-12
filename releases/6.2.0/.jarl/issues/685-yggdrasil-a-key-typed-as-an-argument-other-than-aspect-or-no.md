# 685 · Yggdrasil: a key typed as an argument other than --aspect or --node is echoed whole: impact --flow …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0004-qbyk
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: a key typed as an argument other than --aspect or --node is echoed whole: impact --flow and --type, knowledge read, schemas read, --file of context, owner, aspect-test and type-suggest, find --json, and an unknown command or option (same on release/6.2.0)

## Why


## Acceptance


[test] A key-shaped value typed as any argument (impact --flow and --type, knowledge read, schemas read, --file of context, owner, aspect-test and type-suggest, find --json, an unknown command or option) is masked in every answer, red before and green after · by: cd source/cli && npm test

## Evidence

