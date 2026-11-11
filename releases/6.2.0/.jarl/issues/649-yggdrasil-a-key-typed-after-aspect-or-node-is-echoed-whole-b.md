# 649 · Yggdrasil: a key typed after --aspect or --node is echoed whole by aspect-not-found and node-not-fo…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-zjld
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
Yggdrasil: a key typed after --aspect or --node is echoed whole by aspect-not-found and node-not-found (aspect-test, check --aspect, drill, context, impact), unlike --tier after 621.

## Why


## Acceptance


[test] A key-shaped value given to --aspect or --node is masked in aspect-not-found and node-not-found on aspect-test, check --aspect, drill, context and impact, as --tier is, red before and green after · by: cd source/cli && npm test

## Evidence

