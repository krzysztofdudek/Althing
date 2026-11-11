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

## Evidence

### Proof

- **ran (line 92b87d302004):** cd source/cli && npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts -t 'Copilot review' (before the fix) · **saw:** 2 failed (SIGINT and SIGTERM): the yg-copilot-home- folder was still there after the run ended
- **ran (line 92b87d302004):** cd source/cli && npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/llm tests/unit/repo (after the fix) · **saw:** Test Files 44 passed (44), Tests 405 passed (405): after SIGINT and after SIGTERM the folder is gone and the stand-in reviewer has stopped

### Notes

Assumed: the Copilot reviewer keeps one private folder for the whole run, as before; it is only registered with the cleanup that also runs on an interrupt. A kill that cannot be caught still leaves it.

