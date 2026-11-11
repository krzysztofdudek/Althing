# 620 · Yggdrasil: an API key pasted into a rule's yg-aspect.yaml as a mapping key is printed whole by aspe…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1625-icmm
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-220-fable
**Where:** the review of 220, 296, 297
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Yggdrasil: an API key pasted into a rule's yg-aspect.yaml as a mapping key is printed whole by aspect-unknown-key and aspect-reviewer-unknown-key (text and --json), and the excerpt of a yaml-invalid yg-aspect.yaml prints the reviewer.tier line whole; aspect-unknown-key also prints the absolute path of the file. Existed before this change.

## Why


## Acceptance


- [test] A yg-aspect.yaml whose mapping key is shaped like an API key makes aspect-unknown-key and aspect-reviewer-unknown-key print it redacted, in text and in --json, and the excerpt of a yaml-invalid yg-aspect.yaml prints its reviewer.tier line redacted, red before and green after · by: cd source/cli && npm test
- [test] aspect-unknown-key names the file by its project-relative path, not its absolute path, in text and in --json · by: cd source/cli && npm test

## Changelog
- Security: an API key pasted into a rule's yg-aspect.yaml (as a key of the file or of its reviewer block, or on a line of a file that does not parse) is shown by its first four characters in every message yg check prints about that rule, in text and with --json; the aspect-unknown-key finding names the rule's file from the repository root.

## Evidence

### Proof

- **ran (line 2490cab9baab):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts -t 'K[1-4]' (before the fix, on the release build) · **saw:** 4 failed: K1, K2, K3 expected the output to contain sk-a[REDACTED] and it held the whole key; 20 skipped
- **ran (line 2490cab9baab):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io tests/unit/utils/redact.test.ts tests/e2e/cli-config-tier-validation.test.ts tests/unit/repo (after the fix, commit e23801818) · **saw:** Test Files 84 passed (84), Tests 1393 passed (1393); K1 to K3 pass in text and --json
- **ran (line 63e3fc5fb1b1):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts -t 'K4' (before the fix, on the release build) · **saw:** K4 failed: aspect-unknown-key printed the absolute path of yg-aspect.yaml in text and --json
- **ran (line 63e3fc5fb1b1):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io tests/unit/repo (after the fix, commit e23801818) · **saw:** Test Files 84 passed (84), Tests 1393 passed (1393); K4 passes: the finding names .yggdrasil/aspects/ref-aspect/yg-aspect.yaml and no absolute path, in text and --json

### Notes

Assumed: the full repository check ran on the first commit and once on the final state; between them each commit passed typecheck, lint, the dead-export check, the build, the free graph check and the test files it touches, because one full check takes most of an hour here.

