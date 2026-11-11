# 669 · Yggdrasil: a refusal of a rule's yg-aspect.adapt.yaml still names the file by its absolute path

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T2229-vloy
**Tags:** yggdrasil, keys
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** w-641-sonnet, keys rest package report
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 22:29

## What


## Why
641 and 650 made every refusal of yg-aspect.yaml name the file by its repository-relative POSIX path; the adaptation file beside it still leaks the machine path into text and --json output.

## Acceptance
[test] Every refusal of a rule's yg-aspect.adapt.yaml names the file by its repository-relative POSIX path, in text and --json, red before and green after · by: cd source/cli && npm test

## Evidence

