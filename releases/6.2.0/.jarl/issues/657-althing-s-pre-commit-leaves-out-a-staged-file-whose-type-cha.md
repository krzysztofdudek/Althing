# 657 · Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, s…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2033-qxiy
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-592-opus
**Where:** the review of 592, 593, 602, 603, 608, 609, 613, 616, 622, 626, 629, 630
**Branch:** jarl/658-names-remote-asked
**Worker:** w-658-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:36

## What
Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, so a link turned into a file is not read, though line 284 treats a type change as handled): a link replaced by a note holding a test entry passed pre-commit with the key; the pre-push refused it. The filter predates this change.

## Why


## Acceptance


[test] Althing's pre-commit reads a staged file whose type changed (a symlink replaced by a regular file, and the reverse) and refuses a test word in it, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line 9b58cd0a7dc0):** node --test rails/test/run.test.mjs (the test for this line) against the old rails/git.mjs, at c71a985 (tests only) · **saw:** the test for line 1 failed: 657 'rails staged: clean.' for a staged type change; 658 'rails range (1 commit): clean.' for a forged armor in a header of another name
- **ran (line 9b58cd0a7dc0):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test · **saw:** tests 201, pass 189, fail 0, skipped 11, todo 1 (the todo is the existing direct.test.mjs one); rails/test/run.test.mjs 23/23 pass, the new tests green at d9792bf
- **ran (line 9b58cd0a7dc0):** timeout 300 yg check --no-approve · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script)

