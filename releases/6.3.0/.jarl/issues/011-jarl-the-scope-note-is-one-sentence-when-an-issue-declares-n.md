# 011 · Jarl: the scope note is one sentence when an issue declares no files

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/011-scope-note-one-sentence
**Worker:** w-jarl-011-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-011
**Since:** 2026-11-03 10:17

## What
Nearly every merge in a long loop ended with a scope note listing every changed file as outside the declared scope, because the issues declared no files or one directory. The note never changed a decision.

## Why
A note that always fires is read as noise, and then the one that matters is missed too.

## Acceptance
- An issue with no declared files gets one sentence saying so, not a list of files
- A declared directory covers everything under it; only files outside every declared place are listed
- Scope is never inferred from the worker's own commits, so a worker does not set its own bounds; the reference says why
- Tests for each

## Changelog


## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran:** node --test (tests/jarl.test.mjs) on the original rounds.mjs: package-with-undeclared-issue and declared-directory tests · **saw:** 2 failed: the file list printed (outside deep/: other.txt, src/b.mjs, src/deep/a.mjs) instead of the one sentence / directory coverage
- **ran:** same tests with the change · **saw:** all check tests pass (12 of 12 in the check group)
- **ran:** npm test in skills/jarl/scripts at the branch tip · **saw:** 844 tests, 821 pass, 0 fail
- **ran:** node --test tests/jarl.test.mjs (package and same-named-directory tests) on a97e422's rounds.mjs · **saw:** 2 failed, 0 passed
- **ran:** same tests on the fix; all 11 check tests · **saw:** 11 pass, 0 fail
- **ran:** npm test at tip · **saw:** 845 tests, 822 pass, 0 fail, 23 skipped
- **ran:** scope on a copy of the loop and on the release branch's own code, single and package cases · **saw:** the field report's defect could not be reproduced on release/6.2.1; the tests now hold the behaviour; changelog entry removed

