# 671 · Yggdrasil: the architecture parser throws on field-shape failures instead of returning a structured error, against the parser-contract rule

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2229-ansf
**Tags:** yggdrasil, gate
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the jarl's fill of the keys rest package (reviewer verdict on cli/io/parsers/graph)
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 22:29

## What


## Why
The parser-contract rule says field-shape validation never throws; architecture-parser.ts throws on a non-mapping root, node_types, description, aspects/parents, log_required, enforce, relations and their values, unknown keys and the schema floor, so the reviewer now refuses the parsers node and the gate is red on any branch that re-judges it.

## Acceptance
[test] Every field-shape failure of yg-architecture.yaml (the cases at architecture-parser.ts:41-246) returns a structured error with its code instead of throwing, each refused case printed as before, and the parser-contract verdict on the parsers node passes, red before and green after · by: cd source/cli && npm test

## Evidence

