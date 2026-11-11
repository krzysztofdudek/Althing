# 220 · Yggdrasil: an API key pasted as a reviewer tier name in yg-config.yaml is printed in full in the unknown-tier message

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261004T1753-rsud
**Tags:** yggdrasil, config, 6.2
**Files:** Yggdrasil/source/cli/src/core/checks/aspect-contracts.ts, Yggdrasil/source/cli/src/io/config-parser.ts, Yggdrasil/source/cli/src/core/tier-selection.ts
**Repo:** Yggdrasil
**Found by:** rev-ygg-020
**Where:**
**Branch:** jarl/220-cli-messages
**Worker:** w-220-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 12:51

## What
The reviewer of package 020 (064): after all leak paths from yg-secrets.yaml are closed, there remains the case of a key pasted as a tier name in yg-config.yaml — a file that is committed anyway, so the key is already exposed; the message repeats it.

## Why



## Acceptance
The unknown-tier message does not repeat a name that looks like a secret (or shortens it); test red→green.

## Changelog
- Security: An API key written as a reviewer tier name, as reviewer.default, as a rule's reviewer.tier: or as a mapping key in the configuration is no longer printed in full. Every message that quotes such a value shows only its first four characters, wherever the key sits in the text (also inside a longer name), and also for the keys of the OpenAI-compatible hosts that start with gsk_, xai- or hf_.
- Before you upgrade: yg check refuses a reviewer tier named like an API key, in yg-config.yaml and in yg-secrets.yaml. A tier name that holds a provider key (a sk-, sk-ant-, sk-proj-, AIza, ghp_, gho_, ghu_, ghs_, github_pat_, gsk_, xai- or hf_ prefix, then at least twenty key characters of which at least one is a digit or a capital letter), alone or inside a longer name, now fails with config-tier-name-invalid, showing only its first four characters. Such a name used to load when it was 63 characters or fewer (the rule for tier names), and the key then appeared in full in later messages. A reviewer.default shaped like a key fails with config-default-tier-unknown, also masked. A plain name you chose is refused too if it has a key prefix and a long tail with a digit or a capital letter in it; a name of lowercase letters and dashes only still loads. To clear it, rename the tier to a plain name and every reviewer.tier: in your rules that names it; if the name was a key, move the key to yg-secrets.yaml (as the tier's config.api_key) and rotate it, since a key in the committed file has already been exposed.

## Evidence


- **ran (history):** npx vitest run tests/unit/utils/redact.test.ts tests/unit/io/config-parser.test.ts tests/e2e/cli-config-tier-validation.test.ts (before the fix, source unchanged) · **saw:** the new assertions fail: 15 failed in the three files (looksLikeSecret not a function; the key printed whole in the e2e output and the unit messages)
- **ran (history):** npx vitest run tests/unit/utils/redact.test.ts tests/unit/io/config-parser.test.ts tests/e2e/cli-config-tier-validation.test.ts (after the fix, dist rebuilt) · **saw:** Test Files 3 passed (3); Tests 193 passed (193)
- **ran (history):** npx vitest run tests/e2e/cli-config-tier-validation.test.ts -t D1 (round two tests, dist still from the first commit) · **saw:** 7 failed, 2 passed: a key-named tier with a misspelled config key printed config-tier-unknown-key with the whole key; a key as a mapping key (top level, under reviewer, in a tier, in a tier config) and as an aspect reviewer.tier printed whole
- **ran (history):** npx vitest run tests/unit/utils/redact.test.ts tests/unit/io/config-parser.test.ts tests/unit/io/config-parser-secret-names.test.ts tests/e2e/cli-config-tier-validation.test.ts tests/unit/repo/e2e-prose-ratchet.test.ts (dist rebuilt) · **saw:** all pass: real 108-character sk-ant- names, 51-character sk- and 39-character AIza names, gsk_, xai-, hf_ shapes, embedded keys, overlay refusal, mapping keys, aspect reviewer.tier masked; 270 passed with the repo guards (issue-code tables, file-schema tables, knowledge reference), 632 passed in the aspect, marketplace and repo-guard files
- **ran (history):** node source/cli/dist/bin.js check --approve --only-deterministic · **saw:** 216 passed, 2 refused (function-length warnings only), 0 failed; left unverified: 21 reviewer-only pairs (the owner's reviewer step): cli-command-contract, deterministic, diagnostic-logging, what-why-next, posix-paths-output, silent-missing-files on the changed sources and parser-contract on the two parsers, plus test-deterministic on the changed and new test files (config-parser-secret-names.test.ts has no verdict yet)

2026-10-28 tidy-up: the worktree is gone (the dev container that held it was removed); branch jarl/220-tier-secret keeps 1 commit beyond release/6.2.0 (d18ab15a6), reviewed in round history above; the lease ends and the issue returns to the queue

correction to the line above: 'reviewed in round history above' means only that the worker's rows above describe that commit; no reviewer verdict is recorded on it
- **ran (line bed947eeeb56):** npx vitest run tests/unit/utils/redact.test.ts tests/unit/io/config-parser.test.ts tests/unit/core/tier-selection.test.ts tests/unit/core/checks-aspects-branch-coverage.test.ts tests/e2e/cli-config-tier-validation.test.ts (src reverted: 39 failed; with the fix: 274 passed) · **saw:** red before the change (39 failed, the key printed whole / no masking), green after (Test Files 5 passed, Tests 274 passed); the e2e D1b run shows config-tier-name-invalid with sk-a[REDACTED] in both check and check --json and not the key

Assumed: the refusal of a key-shaped tier name covers yg-secrets.yaml too, and every ConfigParseError passes through one masking step, so mapping keys in the committed file are masked wherever they are named. aspect-parser and the pack marketplace check also quote an aspect's reviewer.tier; they are outside the issue's files and left as they are (listed under Found).
- **ran (line bed947eeeb56):** npx vitest run tests/unit/io/aspect-parser-deterministic.test.ts tests/unit/core/marketplace-check.test.ts (before the fix), then with aspect-parser.test.ts, cli-validation-codes.test.ts and redact.test.ts (after); typecheck, lint, dead-exports · **saw:** red before: 2 failed (the aspect refusal and the marketplace warning printed the whole key); green after: 5 files, 155 tests passed; typecheck, lint and dead-exports clean; full repo-check not run, as instructed
- **ran (line bed947eeeb56):** npx vitest run validator-aspect-files, marketplace-check, aspect-review-overdue (src reverted, then fixed); typecheck, lint, dead-exports · **saw:** red before: 6 failed (both-sources step, companion path, manifest key step, unreadable file, overdue step); green after; commit 1ad471e58

Assumed: the overdue-review step keeps one shared text for every listed rule (it names .yggdrasil/aspects/<rule id>/yg-aspect.yaml) because the grouped report collapses identical steps into one block; a per-rule path would split that block.
- **ran (line bed947eeeb56):** npx vitest run aspect-review-overdue (src reverted, then fixed), with marketplace-check, advise, golden corpus, ratchet; typecheck, lint, dead-exports · **saw:** red before: the overdue step and the new one-block test failed; green after; commit 49ee290d4

