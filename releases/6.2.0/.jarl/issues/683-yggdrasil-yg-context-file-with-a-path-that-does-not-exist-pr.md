# 683 · Yggdrasil: yg context --file with a path that does not exist prints the repository root's absolute …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0004-etkf
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
Yggdrasil: yg context --file with a path that does not exist prints the repository root's absolute path in its error, next step and --json explanation (same on release/6.2.0)

## Why


## Acceptance


[test] yg context --file with a path that does not exist names it by its repository-relative POSIX path in the error, the next step and --json, red before and green after · by: cd source/cli && npm test

## Evidence

