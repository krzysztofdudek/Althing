# 682 · Yggdrasil: a refusal of yg-architecture.yaml prints a key-shaped value whole (an unknown top-level key, for one), unmasked as the rule parser's refusals are

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** light
**Key:** 20261111T2333-jgmx
**Tags:** yggdrasil, keys
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** w-641-sonnet, keys rest package round 2 report
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 23:33

## What


## Why
641 to 650 mask a key-shaped value in every refusal and warning of the rule and graph files; the architecture file's own refusals still echo it, so a key pasted there leaks into text and --json output.

## Acceptance
[test] Every refusal of yg-architecture.yaml masks a key-shaped value in text and --json, as the rule parser's refusals do, red before and green after · by: cd source/cli && npm test

## Changelog
- A key pasted into yg-architecture.yaml is shown by its first four characters in every message yg check prints about that file, in text and with --json.

## Evidence

### Proof

- **ran (line 8b6bb37dceba):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io/architecture-parser*.test.ts tests/unit/core · **saw:** M1-M5 (a key as an unknown top-level key, a type key, a relation type, a type name, a predicate key of yg-architecture.yaml) failed 5 of 5 before the fix, pass after; 124 files, 2367 tests pass

