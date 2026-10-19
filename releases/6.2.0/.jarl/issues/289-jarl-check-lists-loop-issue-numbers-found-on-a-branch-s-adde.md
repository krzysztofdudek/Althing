# 289 · Jarl: check lists loop issue numbers found on a branch's added lines, as a note that does not change ok

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, check
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-11-jarl-model-calibration-and-field-notes#jarl-mc-check-issue-numbers
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280 at 2c12aa3 (check reads changed file names, never their lines)
**After:** 247
**Branch:** jarl/289-check-notes
**Merged:** 8fc18c889cc2d6ff0cdf1cf1b1f0eb24cae35e2a in ../../../JarlSkill
**CI:** pending

## What
check reports commits, the diff inside the declared files and the change in tests and assertions, but never reads the lines a branch adds. A loop issue number (issue NNN, #NNN for an id of this loop) written into code, a comment, a test, a doc or a graph entry points nowhere once the loop ends, and nothing catches it. The brief asks workers not to (issue 250); this is the mechanical counterpart.

## Why
A brief is testimony and weaker models drop it; a note from the check the jarl already runs before merging makes the slip visible while the branch can still be fixed. It stays a note: numbers, never a verdict.

## Acceptance
- check lists, per file and line, each added line that names an id of this loop as issue N or #N, as a note; ids are read through the one ids section of 325 as 322 leaves it, and only ids the loop holds count, so a year, a date or a hash is never read as an id unless the loop holds that number in one of those two forms; the commit subject is not read; ok does not change; --json carries the list
- One package with 308, after the ids section of 325 and after 322: both are notes of check that never change ok, delivered through one note channel in cmdCheck (architect scope review of 2026-10-18, section 4, item 3, and code review of the same day, section 5); no id pattern is written outside the ids section, checked by seams.test.mjs
- Tests: a branch adding both forms is listed, a number that is not an id of the loop is not, a four-digit year on an added line is not, removed lines and the commit subject are ignored, and ok is unchanged

## Changelog
- Added: check on a branch now lists each added line that cites a loop issue by its number, so a stale reference shows before the merge. The check passes or fails as before.

## Evidence

Deferred: Next release (6.3.0), per the design research/2026-10-11-jarl-model-calibration-and-field-notes/design.md, Proposed changes

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).
- **ran:** cd skills/jarl/scripts && npm test · **saw:** full suite at commit e83c210 in the worker branch: 586 tests, 565 pass, 0 fail, exit 0
- **ran:** node --test --test-name-pattern 'notes each added line|at most twenty issue notes' tests/jarl.test.mjs · **saw:** before the change the two new tests failed (2 fail): notes undefined, notesOmitted undefined; after it both pass (2 pass, 0 fail)
- **ran:** status, resume, next --all, report, list --all, tips, queue, branches and show --full for 247, 289 and 308 on a copy of the release loop, before and after the change · **saw:** byte-identical outputs: diff -r of the baseline and the after directories exit 0
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 8fc18c8 · **saw:** 588 tests, 567 pass, 0 fail, 21 skipped; model test: worker haiku-5.5, one round (one honest stop on a contradiction in the premise of 308), reviewer sonnet-5.5 approved with minors only

