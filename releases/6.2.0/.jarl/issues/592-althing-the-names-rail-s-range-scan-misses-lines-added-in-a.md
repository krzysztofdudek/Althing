# 592 · Althing: the names rail's range scan misses lines added in a merge commit, a name split across an old and an added line, and author e-mails, and passes an unreadable range as 0 commits

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261111T1421-uzsy
**Tags:** althing, rails, names, security
**Files:** Althing/rails
**Repo:** Althing
**Found by:** jarl
**Where:** w-363-fable, issue 363
**After:** 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What


## Why
Althing's pre-push gate is the last check before its commits go public; each gap is a way a private name leaves without being seen, and an unreadable range that reads as clean is a false green.

## Acceptance
[test] A fixture with a planted test-list word in a merge commit's added lines, split across an old and an added line, and in an author e-mail is refused with the commit and file, and an unreadable range is an error, not 0 commits · by: yg check && npm test

## Evidence

### Proof

- **ran (line 9fba42f24c17):** node --test rails/test/run.test.mjs (a git archive export of df39a35, the code before the fix, with the file's 13 tests as they stand at 31111f2) · **saw:** tests 13, fail 11, pass 2: among the failing a name or a secret a merge adds, a name split over an old line and an added one, a name in an author e-mail or a committer name, a range that cannot be read (answered as 0 commits, clean); the 2 passing are the tests of 602 and 608
- **ran (line 9fba42f24c17):** node --test rails/test/names.test.mjs workspace/test/names-range.test.mjs (a git archive export of df39a35 with the two test files of 59e2290) · **saw:** tests 46, fail 4, pass 42: the window that carries its last line, the two expected values that gained it, and the names-range test of a removed line, a line of punctuation and a line added after a public name
- **ran (line 9fba42f24c17):** node --test rails/test/*.test.mjs workspace/test/names-range.test.mjs (the tree of 83df69c, the fix) · **saw:** tests 115, pass 114, fail 0, todo 1 (rails/english.mjs through a link, a-35): a merge's own name and secret refused at the merge with the file and the line, a split name refused in the staged lines and in a pushed commit, an author e-mail and a committer name refused with the commit, an unreadable range exit 2 with one line and never clean
- **ran (line 9fba42f24c17):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test (at 9b15fcf, the worktree clean); timeout 300 yg check --no-approve · **saw:** tests 190, pass 178, fail 0, skipped 11, todo 1; yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified

