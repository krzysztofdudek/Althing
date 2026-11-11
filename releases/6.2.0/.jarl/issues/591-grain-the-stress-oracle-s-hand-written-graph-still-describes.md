# 591 · Grain: the stress oracle's hand-written graph still describes the removed agent hooks (the hooks node, the hooks aspects, the verb-parity exemptions and their README scores)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1420-updd
**Tags:** grain, stress
**Files:** 
**Repo:** Grain
**After:** 569
**Found by:** jarl
**Where:** w-569-sonnet, issue 569
**Branch:** jarl/596-grain-tidy
**Worker:** w-596-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 18:04

## What


## Why
tests/stress/oracles/grain/ is the ground truth a stress run scores against; once 569 removes the hooks, an oracle that still expects them scores Grain against code that does not exist.

## Acceptance
[read] The oracle names no hook node, hook aspect or hook exemption, its README's scores are re-measured on the tree without hooks, and the README says when and why they changed

## Evidence

