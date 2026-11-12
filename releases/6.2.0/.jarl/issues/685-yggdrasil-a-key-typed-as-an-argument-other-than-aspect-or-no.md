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

## Changelog
- A key typed as any argument is no longer echoed in full: impact --flow and --type, knowledge read, schemas read, --file of context, owner, aspect-test and type-suggest, owner --files, the query of find --json, and an unknown command or option show it by its first four characters.

## Evidence

### Proof

- **ran (line e816fbf77280):** cd source/cli && npx vitest run tests/e2e/cli-key-arguments.test.ts (before the fix) · **saw:** 17 of 21 cases failed: impact --flow/--type, knowledge read, schemas read, --file of context/owner/aspect-test/type-suggest, owner --files, find --json, unknown command and option printed the key whole
- **ran (line e816fbf77280):** cd source/cli && npx vitest run tests/e2e/cli-key-arguments.test.ts (after the fix) · **saw:** all cases pass (16 passed on the first set; the final set of 18 passes in the full vitest run); the answers show sk-a[REDACTED], text and JSON

### Notes

Assumed: errors, warnings and notes are masked once in the output layer (fail, warn, notice), which covers impact --flow/--type, knowledge read, schemas read, aspect-test --file, the unknown command and option; yg owner, yg type-suggest, yg find --json and the no-owner document of yg context --file mask the path or query they echo themselves. yg-error/1 carries the masked text.

