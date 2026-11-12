# 694 · Minor, outside the issue: yg context (source/cli/src/cli/build-context.ts:715-736) prints the first…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0127-rkzj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641c-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Minor, outside the issue: yg context (source/cli/src/cli/build-context.ts:715-736) prints the first line of the validator's findings without the mask yg check now applies at its assembly, so a key-shaped type name in type-when-mismatch is printed whole by yg context --node and --file (the same on the release build; adopt.ts:172 reads validate() the same way and was not tried).

## Why


## Acceptance


[test] yg context --node and --file, and adopt, mask a key-shaped type name in the validator's findings as yg check does, red before and green after · by: cd source/cli && npm test

## Changelog
- yg context and yg adopt show a key from the graph by its first four characters in the errors and problems they list, as yg check does.

## Evidence

### Proof

- **ran (line a6bd482a09d5):** cd source/cli && npx vitest run tests/e2e/cli-adopt.test.ts tests/e2e/cli-validation-codes.test.ts -t 'adopt shows a key|G17:' (before the fix) · **saw:** 3 failed: yg adopt (previewed and accepted) and yg context --file printed a key-shaped type name whole
- **ran (line a6bd482a09d5):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/e2e/cli-adopt.test.ts tests/unit/core (after the fix) · **saw:** Test Files 123 passed; the adopt cases and G17 pass: the key shows as sk-a[REDACTED]

### Notes

Assumed: masking sits in validate() itself, so yg check, yg context, yg adopt and the fill gate read the same masked findings; the mask at the place yg check assembles its report stays, as it covers findings that do not come from validate().

