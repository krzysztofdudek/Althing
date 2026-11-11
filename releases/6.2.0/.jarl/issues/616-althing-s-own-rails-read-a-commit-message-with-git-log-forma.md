# 616 · Althing's own rails read a commit message with git log --format=%B (rails/run.mjs:97) and every obj…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1609-uubf
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363c-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's own rails read a commit message with git log --format=%B (rails/run.mjs:97) and every object through git's replacement objects, so a repository's i18n.logOutputEncoding or a local git replace changes what the local rails read from what a push sends; CI, in a fresh clone, still reads the original (by reading; the same calls fail in names-range, round 3 of 363, Minors 2 and 6)

## Why


## Acceptance


[test] Althing's own rails read a commit message independent of i18n.logOutputEncoding and scan with replace objects and grafts as a push sends (or refuse while a graft file is in force), red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line 9b56340687a9):** node --test rails/test/run.test.mjs (a git archive export of df39a35, the code before the fix, with the file's 13 tests as they stand at 31111f2) · **saw:** the test of 616 fails with 10 others: under i18n.logOutputEncoding=ISO-8859-2 a message with a test entry in Polish letters passes as clean, and under a graft file the range and the history answer instead of ending with exit 2
- **ran (line 9b56340687a9):** node --test rails/test/run.test.mjs (the tree of 83df69c, the fix) · **saw:** tests 13, pass 13, fail 0: the message is refused at message:3 whatever i18n.logOutputEncoding says, a commit behind a replacement object is refused at its file, and under a graft file (info/grafts or GIT_GRAFT_FILE) range and history end with exit 2 and one line; a graft file of comments alone is not in force

