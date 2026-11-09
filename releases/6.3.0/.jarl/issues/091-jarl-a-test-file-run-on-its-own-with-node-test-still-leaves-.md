# 091 · Jarl: a test file run on its own with node --test still leaves its temporary directories, and directories made without mkdtempSync are never tracked

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T1052-zjlk
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 075
**Found by:** rev-jarl-075-opus
**Where:** Review of 075 (2026-11-03): the cleanup is preloaded only by npm test's script
**Branch:** jarl/091-test-tmp-cleanup
**Merged:** 9f5e31f in ../../../JarlSkill
**CI:** none

## What
Workers run single test files with a bare node --test, which skips the preload, so each run still leaks; directories made with mkdirSync, by a child process a test starts, or by git, are never removed; on a signal the cleanup exits with 128 instead of 128 plus the signal, replacing the runner's own handling.

## Why
Single-file runs are what workers do most, so the leak that filled the machine continues at a smaller rate.

## Acceptance
- A single test file run with a bare node --test leaves nothing in TMPDIR (the preload reached through a setup each test file imports, or the files' own after hooks), with a test
- A test fails when the suite leaves any entry in an empty TMPDIR, run as part of npm test
- On a signal the process exits with 128 plus the signal number

## Evidence

- **ran (history):** TMPDIR=<empty dir> node --test tests/tmp-cleanup.test.mjs, with the previous tests/tmp-cleanup.mjs in place (red) · **saw:** tests 14, pass 7, fail 7: the mkdir/child-process/git case, the three signal cases (status was 128 not 128 plus the signal), the unreadable-directory case, a bare node --test of a fixture (left entries), and the suite runner case failed; the old cleanup also left jarl-tmp-cleanup-* directories in the empty TMPDIR
- **ran (history):** TMPDIR=<empty dir> node --test tests/tmp-cleanup.test.mjs tests/seams.test.mjs (green); then bare node --test of lock-scope, record-contract, runes-vendor, mcp, merge-check each in an empty TMPDIR · **saw:** tmp-cleanup and seams: tests 30, pass 30, fail 0; the five bare runs all passed (3, 10, 5, 34, 13 tests) and the TMPDIR held 0 entries afterwards
- **ran (history):** TMPDIR=<scratch> nice -n 15 timeout 2400 npm test in skills/jarl/scripts at the branch tip · **saw:** tests 1124, pass 1102, fail 0, skipped 22; exit 0; the suite runner reported no leftover entries and the scratch TMPDIR held no new entry
- **ran (history):** TMPDIR=<empty dir> node --test tests/tmp-cleanup.test.mjs, with the previous tests/suite.mjs in place (red), then with the new one (green) · **saw:** red: tests 15, pass 14, fail 1 (the suite runner names the leftovers before it removes them); green: tests 15, pass 15, fail 0, skipped 0, and the TMPDIR held no entry
- **ran (history):** TMPDIR=<scratch> nice -n 15 timeout 2400 npm test in skills/jarl/scripts at the branch tip after round 1 · **saw:** tests 1125, pass 1103, fail 0, skipped 22; exit 0; no leftover entry reported
- **ran (history):** npm test in skills/jarl/scripts of the release worktree, at 9f5e31f with 091 merged (TMPDIR under ~/Temp/tmp) · **saw:** tests 1125, pass 1103, fail 0, skipped 22, exit 0

