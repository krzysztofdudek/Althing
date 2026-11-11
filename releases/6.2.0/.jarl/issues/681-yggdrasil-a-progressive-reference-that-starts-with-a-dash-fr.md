# 681 · Yggdrasil: a progressive reference that starts with a dash (from --reference, the variable or the committed block) reaches git merge-base as an option, with no input refusal

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** light
**Key:** 20261111T2332-mqbp
**Tags:** yggdrasil, progressive, security
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** w-226-sonnet, round 2 report
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 23:32

## What


## Why
A reference is user and pipeline input; passed to git as an argument it can be read as an option, changing what git does instead of refusing the value.

## Acceptance
[test] A progressive reference starting with a dash, from the flag, the variable and the committed block, is refused with a message naming the value and the way to give a real reference, and no git command receives it as an argument, red before and green after · by: cd source/cli && npm test

## Evidence

