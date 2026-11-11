# 650 · Yggdrasil: every refusal of a rule's yg-aspect.yaml other than aspect-unknown-key names the file by…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-ecxh
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620-opus
**Where:** the review of 615, 620, 621, 625, 627
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:38

## What
Yggdrasil: every refusal of a rule's yg-aspect.yaml other than aspect-unknown-key names the file by its absolute path (yaml-invalid, references, name, implies, when; source/cli/src/io/aspect-parser.ts:153-916), in text and --json.

## Why


## Acceptance


[test] Every refusal of a rule's yg-aspect.yaml names the file by its repository-relative POSIX path, in text and --json, red before and green after · by: cd source/cli && npm test

## Evidence

