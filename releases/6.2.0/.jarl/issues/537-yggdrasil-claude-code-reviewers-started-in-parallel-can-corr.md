# 537 · Yggdrasil: claude-code reviewers started in parallel can corrupt the user's ~/.claude.json, and the failure is called permanent

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261111T0927-mdle
**Tags:** yggdrasil, reviewer
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/llm/claude-code.ts:47
**Branch:** jarl/537-reviewer-config
**Worker:** w-537-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 14:22

## What
With four paid fills at once, one reviewer call failed with a JSON parse error of ~/.claude.json, and Claude Code left a .corrupted copy in its backups; the file parsed again afterwards. The likely cause is several claude processes writing the same file: the isolation arguments cover settings and MCP, not this file. Yggdrasil said a re-run would not help, and a re-run did.

## Why
A check should not damage a user file, even for a moment, and a transient failure should be called transient.

## Acceptance
- [read] Each reviewer process runs with a private configuration directory, or reviewers started across runs are limited, with the choice and its reason in the issue
- [test] The parse failure of the user's configuration is classified as transient, so the message invites a re-run · by: cd source/cli && npm test

## Changelog
- Fixed: claude-code reviews running at once leave your Claude Code configuration alone (each review gets a configuration folder of its own, started from a copy of ~/.claude.json and removed afterwards; the sign-in stays where you keep it). Fixed: a review that failed for a moment says a re-run clears it, counted apart as 'failed on a reviewer fault that passes by itself'.

## Evidence

### Proof

- **ran (line cede22230f05):** cd source/cli && npx vitest run tests/unit/llm/claude-code-config.test.ts tests/unit/core/fill-report.test.ts tests/unit/core/fill-llm.test.ts tests/unit/core/aspect-verifier.test.ts (before the fix, at the commit of the tests) · **saw:** 4 files failed, 9 tests red: a reviewer started while another was mid-write got 'claude' exited with code 1: Claude configuration file at <scratch home>/.claude.json is corrupted: JSON Parse error; the summary said 're-running will not help until the connection/config is fixed' and the pair said 'Fix the cause named above'
- **ran (line cede22230f05):** cd source/cli && npx vitest run tests/unit/llm tests/e2e/cli-reviewer-fill-runtime.test.ts tests/e2e/dead-exports.test.ts tests/unit/core/fill-report.test.ts tests/unit/core/fill-llm.test.ts tests/unit/core/aspect-verifier.test.ts (after the fix) · **saw:** Test Files 26 passed (26); the 9 tests red at the commit of the tests are green: a pair whose reviewer could not parse its configuration now reads 'Nothing needs fixing first: re-run: yg check --approve' and the summary '1 pair failed on a reviewer fault that passes by itself — a re-run reviews it again'
- **ran (line cede22230f05):** bash scripts/repo-check.sh at the fix (the whole suite with coverage, which is npm test's suite) · **saw:** exit 1. Test Files 2 failed | 708 passed (710): the 3 failing tests (cli-read-cost-bounds 'yg check --json exits 0', portal-derive-nodes twice) assert that this repository's own graph is fully verified, and 26 reviewer pairs are open after the change; Graph: check and the deterministic cache step fail for the same reason, and coverage was not evaluated because a test failed. Every other step passed

### Notes

Assumed: line 1 is met by a private configuration directory per reviewer process, not by a limit. Reason: the Claude CLI reads its configuration file at startup and can write it at any point of its life, so a limit would be safe only at one reviewer at a time on the whole machine, across every repository; a private directory removes the shared file instead. The CLI honours CLAUDE_CONFIG_DIR (read in the installed CLI 2.1.322 and tried against a scratch directory: a file cut off mid-write there gives 'Claude configuration file at ... is corrupted: JSON Parse error' and a .corrupted backup, exit 1). Credentials are not copied. The CLI finds its credentials store through CLAUDE_SECURESTORAGE_CONFIG_DIR when set, else through CLAUDE_CONFIG_DIR, so the reviewer sets the first to where the user's sign-in already is (the user's own value, else their CLAUDE_CONFIG_DIR, else empty, which the CLI reads as its default place and default keychain entry). Tried with 'claude auth status', which calls no model: a private directory alone answers loggedIn false, with the empty variable loggedIn true. A copy was rejected because a token refreshed in a directory that is then removed would leave the user's sign-in stale. The private directory starts from a copy of the user's .claude.json (read only, skipped if it does not parse) and is removed when the call settles or the run is interrupted.

Assumed: a CLI that cannot find the sign-in from a private directory (one older than CLAUDE_SECURESTORAGE_CONFIG_DIR) must keep working, so the provider asks 'claude auth status' once per run from a private directory, and on anything but loggedIn true runs every review on the user's own configuration as before. Asking beforehand was chosen over running a failed review a second time because the repository's provider-retry-contract rule forbids a provider retrying after a sign-in failure. No real review was run: a paid call would be needed to prove the full path with the real CLI, so that part rests on the two unpaid probes above and on the stand-in tests.

Open for the jarl: 26 reviewer pairs only the paid reviewer can clear. deterministic on fill-report.ts, fill-shared.ts; diagnostic-logging, posix-paths-output, provider-redaction-cascade and what-why-next on fill-llm-phase.ts, fill-llm.ts, fill-report.ts, fill-shared.ts; diagnostic-logging and provider-redaction-cascade on aspect-verifier.ts; provider-retry-contract on claude-code.ts; test-deterministic on cli-reviewer-fill-runtime.test.ts, aspect-verifier.test.ts, fill-llm.test.ts, fill-report.test.ts and the new claude-code-config.test.ts. Branch coverage could not be read until they are filled.

