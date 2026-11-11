# 647 · Yggdrasil: a copilot-cli review's private folder is left after SIGKILL or SIGHUP (a closed terminal…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-jktr
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620-opus
**Where:** the review of 615, 620, 621, 625, 627
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:38

## What
Yggdrasil: a copilot-cli review's private folder is left after SIGKILL or SIGHUP (a closed terminal, a dropped SSH session) and no later run removes it, unlike claude-code's dead-run clean-up; on SIGHUP the detached reviewer also keeps running, for both providers, because only SIGINT and SIGTERM are handled (cli-base.ts onInterrupt). Tried with a stand-in copilot: after SIGTERM the folder and the helper are gone, after SIGKILL and SIGHUP both stay.

## Why


## Acceptance


[test] After SIGKILL or SIGHUP of yg during a copilot-cli review, the review's private folder is removed by a later run as claude-code's dead-run folders are, and on SIGHUP the detached reviewer of either provider is stopped as on SIGTERM, red before and green after · by: cd source/cli && npm test

## Changelog
- A closed terminal or a dropped SSH session now stops the reviewer a yg run had started and removes its private folder, for claude-code and copilot-cli, and a folder that a Copilot review killed beyond catching left behind is removed by the next copilot-cli run.

## Evidence

### Proof

- **ran (line f71836a6a96f):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io/aspect-adapt-merge.test.ts tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/repo/e2e-prose-ratchet.test.ts · **saw:** 108 passed; SIGHUP during a Copilot review, SIGHUP mid-fill with claude-code, and a SIGKILLed Copilot review whose folder a later run removes (a live review's folder kept) failed on the release build, pass on this branch

### Notes

Assumed: the lock and the dead-run clean-up were moved out of the claude-code provider into the subprocess base (a separate module did not fit the architecture's node types), and copilot-cli keeps one folder for the whole run, as before, with the lock held for the run's life.

