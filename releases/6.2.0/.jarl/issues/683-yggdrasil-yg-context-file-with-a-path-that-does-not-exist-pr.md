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

## Changelog
- yg context --file and yg impact --file no longer print the repository's absolute path when the file does not exist; the error, its next step and the explanation of the --json document name the path from the repository root.

## Evidence

### Proof

- **ran (line c76dc8422231):** cd source/cli && npx vitest run tests/e2e/cli-file-arg-missing.test.ts (before the fix) · **saw:** 1 failed, 6 passed: context --file with a missing path printed the repository root's absolute path
- **ran (line c76dc8422231):** cd source/cli && npx vitest run tests/e2e/cli-file-arg-missing.test.ts tests/e2e/cli-impact.test.ts tests/unit/cli (after the fix) · **saw:** Test Files 71 passed, Tests 1333 passed: the error, the next step and the --json explanation name the path from the repository root, with no absolute path

### Notes

Assumed: the answer says 'relative to the repository root' without naming the root; the old test that required the root's path in the answer now requires its absence.

