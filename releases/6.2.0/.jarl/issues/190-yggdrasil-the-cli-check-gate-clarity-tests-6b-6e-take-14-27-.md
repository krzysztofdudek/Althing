# 190 · Yggdrasil: the cli-check-gate-clarity tests 6b–6e take 14–27 s against a 30 s limit and fail under parallel load

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T1550-wntq
**Tags:** yggdrasil, flaky
**Files:** Yggdrasil/source/cli/tests/e2e/cli-check-gate-clarity.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** ygg-023
**Where:**
**Branch:** jarl/166-ignores-and-leftovers
**Merged:** d63857afc4f7750c2502c67c314d60f4bcc7385d
**CI:** none

## What
Under parallel gates two pre-commit runs failed on a timeout of these tests; on their own they pass.

## Why
Niestabilna bramka pre-commit i CI.

## Acceptance
The tests have time headroom or are faster; they pass under artificial load.

## Changelog
- none: test-only change, nothing a user sees

## Evidence

- **ran (history):** git commit (merge of jarl/166-ignores-and-leftovers into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.25%; [repo-check] All checks passed; [release/6.1.1 d63857afc] Merge jarl/166-ignores-and-leftovers

