# 615 · Yggdrasil: an interrupted Copilot review leaves its private configuration folder behind

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1559-nkyl
**Tags:** yggdrasil, reviewers
**Files:** 
**Repo:** Yggdrasil
**After:** 537
**Found by:** jarl
**Where:** w-537-fable, issue 537
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What


## Why
Each interrupted run leaves a folder with a copy of the user's settings; they pile up and the copy outlives the run that needed it.

## Acceptance
[test] A Copilot review interrupted by SIGINT or SIGTERM removes its private folder, as the Claude review does, red before and green after · by: cd source/cli && npm test

## Changelog
- Fixed: an interrupted copilot-cli review (Ctrl-C or SIGTERM during yg check --approve) removes its private configuration folder from the temporary directory once the reviewer has stopped.

## Reviews
- **changes** · by rev-620-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1959-icao
  Important 1 (627) - a live run's folder is removed by another run in the same container when the temporary directory's path is long: source/cli/src/llm/claude-code.ts:318-327 (holdLock), :332-345 (lockState), :361-365. Node does not refuse a Unix socket path longer than the platform limit (108 bytes on Linux, 104 on macOS); it binds, and connects to, the path cut at that length, so the comment at :292-294 (a path too long for a socket has no lock and only its age speaks) does not hold. (a) A folder path of exactly 108 bytes (TMPDIR of 67 characters with a 7-digit process number) cuts the lock path to the folder itself: listen fails, and another run connecting to a directory gets ECONNREFUSED, reads it as released and removes the live folder. Tried: run A ended Not logged in, 5 passed 1 failed; the release build kept the folder, 6 passed. (b) A TMPDIR of 75 characters or more cuts inside or before the process number, so the folders of different runs share one socket (tried 80: yg-claude-config-<tag>-1). After one SIGKILLed run that socket stays for good (clean-up removes the uncut .lock name, and OWN_FOLDER skips names with a dot), no later run can hold a lock, and every clean-up removes every other live run's folder on the machine. Tried: B removed live A's folder, A failed Not logged in. The release build's process check kept the folder in both. Wanted: never bind or ask a lock whose path the platform would cut (treat that folder by age), or give the lock a short path of fixed length, and a test with a long TMPDIR; a stale cut socket must not keep a host broken.
  Important 2 (625) - the kill reaches only the direct child, not the process tree: source/cli/src/utils/binary-check.ts:571 spawns without detached and :589-592 signal child alone, while the review spawn (cli-base.ts:379, :424-432) leads its own group and signals the group. A reviewer CLI behind a wrapper (a shell script without exec, a version-manager shim, and on Windows every probe, which runs through cmd.exe) is never stopped. Tried a stand-in claude that is a sh wrapper running a node program that ignores SIGTERM: aspect-test and check --approve end after 10 to 13 s with did not finish within 10s and the program is left running, orphaned, in the process group of yg; with the wrapper ignoring SIGTERM too, the release build hung (ended at 60 s) and the tip ends but leaves the program running. The line says the CLI is stopped; behind a wrapper it is not. The new tests use only single-process stand-ins; a binary that stops when asked ... without the kill leaves its sleep 30 running and does not show that no kill was sent; answers at the end of the grace even when a helper still holds its output passes as well if the probe waited for the helper, which lives 4 s inside a 20 s limit.
  Important 3 (the jarl's commit d3ee6777e) - scripts/repo-check.sh is red at the tip 9cc402504: tests/unit/repo/e2e-prose-ratchet.test.ts fails, cli-progressive-gate.test.ts holds 23 prose assertions against a baseline of 22, because :351 toContain(measures only what that change reaches) replaced the three-word measured normally again. Green at c899d6040, red after d3ee6777e; the coverage step was therefore not evaluated. Everything else passed: typecheck (both), lint, dead exports, build, pack-smoke, 713 of 714 test files (10633 tests pass, 1 skipped, 1 todo), the AST-cache audit, portal e2e 67 passed, docs build, markdown lint, digest freshness, Graph: check PASS with 8261 pairs.
  Minor 4 (627) - where no lock is held, a killed run's folder now stays up to a day; on Windows the process check of the release answered correctly, and the folder can hold a copy of the user's stored API key (privateConfigEnv). The changelog says so; keeping the process check where no lock can be held would lose nothing. Not run on Windows: whether connecting to the missing .lock there gives ENOENT (absent) and not another code (unknown, never removed).
  Minor 5 (621, 620) - the masking needs the key's prefix, and the YAML library's excerpt cuts a long line on the left: a key written as a value in yg-config.yaml with an unknown tag to its right past column 60 prints 37 characters of its tail in the YAMLWarning; the same in the yaml-invalid excerpt of yg-aspect.yaml with a syntax error to the right of the key. Two mistakes on one line: known-limitation class.
  Minor 6 (620) - the changelog says aspect-unknown-key now names the file from the root as the other findings do; yaml-invalid and the other refusals of a rule file still name it by its absolute path (tried, text and --json; filed outside).
  Minor 7 - d3ee6777e carries two issues (621, 625) in one commit.
  Judged: the 2 s grace is sound; a temporary directory shared between machines is acknowledged; the old dead-run test with released locks is realistic (that is what a SIGKILLed run leaves). Tried and held: a run frozen by SIGSTOP keeps its folder (the system accepts the connection); a SIGKILLed run's folder and lock go at the next run; --trace-warnings prints the masked tag; no whole key in 19 commands for each of a rule-file key, an endpoint, a reference and a config tag; no test asserts elapsed time, and the torn-file case passed 8 of 8 under 6 and 16 CPU burners. Not run: Windows, macOS. The memory caps could not reach the runs inside the dev container (docker exec leaves the scope).
  outside the issue, filed as 647: Yggdrasil: a copilot-cli review's private folder is left after SIGKILL or SIGHUP (a closed terminal, a dropped SSH session) and no later run removes it, unlike claude-code's dead-run clean-up; on SIGHUP the detached reviewer also keeps running, for both providers, because only SIGINT and SIGTERM are handled (cli-base.ts onInterrupt). Tried with a stand-in copilot: after SIGTERM the folder and the helper are gone, after SIGKILL and SIGHUP both stay.
  outside the issue, filed as 648: Yggdrasil: warnings the YAML library raises while reading graph files other than yg-config.yaml (yg-aspect.yaml and the node, flow and architecture parsers, which still call parse) quote the source line unmasked: a key written as a YAML tag in yg-aspect.yaml prints whole on check and aspects (YAMLWarning: Unresolved tag: !sk-ant-...), and a key on a line with another warning prints whole in the excerpt.
  outside the issue, filed as 649: Yggdrasil: a key typed after --aspect or --node is echoed whole by aspect-not-found and node-not-found (aspect-test, check --aspect, drill, context, impact), unlike --tier after 621.
  outside the issue, filed as 650: Yggdrasil: every refusal of a rule's yg-aspect.yaml other than aspect-unknown-key names the file by its absolute path (yaml-invalid, references, name, implies, when; source/cli/src/io/aspect-parser.ts:153-916), in text and --json.

## Evidence

### Proof

- **ran (line 92b87d302004):** cd source/cli && npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts -t 'Copilot review' (before the fix) · **saw:** 2 failed (SIGINT and SIGTERM): the yg-copilot-home- folder was still there after the run ended
- **ran (line 92b87d302004):** cd source/cli && npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/llm tests/unit/repo (after the fix) · **saw:** Test Files 44 passed (44), Tests 405 passed (405): after SIGINT and after SIGTERM the folder is gone and the stand-in reviewer has stopped
- **ran (line 92b87d302004):** npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts -t 'Copilot|ignores' (release/6.2.0 source and build with the branch's tests); then npx vitest run tests/e2e/cli-validation-codes.test.ts tests/e2e/cli-config-tier-validation.test.ts tests/unit/utils/binary-check.test.ts tests/unit/utils/redact.test.ts tests/unit/llm tests/e2e/cli-reviewer-fill-runtime.test.ts tests/e2e/cli-progressive-gate.test.ts tests/e2e/cli-llm-reviewer-mock.test.ts tests/unit/core/checks-credentials.test.ts tests/e2e/cli-committed-endpoint-key.test.ts tests/integration/progressive-scope-resolve.test.ts tests/unit/cli/aspect-test tests/unit/io (tip 9cc402504, built in a scratch copy in the dev container) · **saw:** red: both Copilot cases failed, the yg-copilot-home- folder was still there after SIGINT and after SIGTERM; green: Test Files 91 passed, Tests 1642 passed. A stand-in copilot by hand on the tip: after SIGTERM the folder and the reviewer's helper are gone; after SIGKILL or SIGHUP both stay (outside the issue, filed)

### Notes

Assumed: the Copilot reviewer keeps one private folder for the whole run, as before; it is only registered with the cleanup that also runs on an interrupt. A kill that cannot be caught still leaves it.

