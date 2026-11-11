# 625 · Yggdrasil: the reviewer availability check (source/cli/src/utils/binary-check.ts:41, '<cli> --versi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1657-iajt
**Tags:** 
**Files:** Yggdrasil/source/cli/src/utils/binary-check.ts
**Repo:** Yggdrasil
**Found by:** rev-537-opus
**Where:** the review of 537
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Yggdrasil: the reviewer availability check (source/cli/src/utils/binary-check.ts:41, '<cli> --version' through execFile with a timeout) sends SIGTERM only, with no SIGKILL escalation, so a CLI that ignores SIGTERM there hangs yg check --approve, yg aspect-test and yg drill before any review, with no message; the review spawn in cli-base escalates for exactly this case

## Why


## Acceptance


[test] A reviewer CLI that ignores SIGTERM when asked for its version is stopped within the availability check's timeout plus a bounded grace and reported as unavailable, so yg check --approve, yg aspect-test and yg drill end with a message instead of hanging, red before (the check never returns) and green after · by: cd source/cli && npm test

## Changelog
- Fixed: yg check --approve, yg aspect-test and yg drill no longer wait for good on a reviewer CLI that does not answer --version; a CLI that ignores the request to stop is ended two seconds after the ten the question gets, and the command says the reviewer is unavailable.

## Evidence

### Proof

- **ran (line cc8125ad92eb):** cd source/cli && npx vitest run tests/unit/utils/binary-check.test.ts ; npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts -t 'ignores the request' (both on the old availability check) · **saw:** unit: 3 failed, two with 'Test timed out in 20000ms' (the check never returned); end to end: 1 failed, check --approve had to be ended with SIGKILL after 40s
- **ran (line cc8125ad92eb):** cd source/cli && npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/utils/binary-check.test.ts (after the fix) · **saw:** Tests 18 passed (18): the probe answers within limit plus grace, and check --approve, aspect-test and drill each end by themselves naming '--version' did not finish within 10s

### Notes

Assumed: the grace between the request to stop and the kill is 2 seconds, so the availability check answers within 12 seconds at most; the message keeps its wording (did not finish within 10s).

