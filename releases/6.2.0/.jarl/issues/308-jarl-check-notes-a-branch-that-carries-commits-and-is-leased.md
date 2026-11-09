# 308 · Jarl: check notes a branch that carries commits and is leased by no issue (work done without a ticket), as a note that does not change ok

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261015T1110-jkyf
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-check-note-code-without-an-issue
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280
**After:** 289
**Branch:** jarl/289-check-notes
**Merged:** 8fc18c889cc2d6ff0cdf1cf1b1f0eb24cae35e2a in ../../../JarlSkill
**CI:** pending

## What
Claim: Nothing in Jarl notices a change made before its ticket was filed, or never ticketed; a repository whose rule is that everything is ticketed enforces it by hand.

check reads the changed files and the tests of the branch it is given and never asks whether an issue holds a lease or a Branch on it (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280); a field report from a private deployment of 6.1.0, section 3.6 and request 7 (source.md).

## Why


## Acceptance
- check --branch refuses a branch that no issue records, and the refusal names the branch, the commit count beyond the base and what to file (file the issue, then set it in progress on that branch); the refusal is the one message, so a script reads the same count. Tests: a branch with commits and no issue is refused with its count; a branch with no commits gets the refusal as before
- branches marks with NO ISSUE a branch with commits beyond the base that no issue's Branch or lease points to, in the text view and in --json (unticketed); a branch with a lease, an empty branch, and the base and release branches get no mark. Tests: a branch with commits and no issue is marked; a leased, an empty and a release branch are not
- One package with 289, after the ids section of 325 (architect scope review of 2026-10-18, section 4, item 3, and code review of the same day, section 5): the branches and the ids on branch names are read through what branches already reads (branchesIn and the one worktree-list parser of 325), with no parser of its own

## Changelog
- Added: branches marks with NO ISSUE a branch that holds commits but no issue. A check of such a branch says how many commits it carries and what to file before it can run.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).
- **ran (history):** node --test --test-name-pattern 'refuses a branch no issue holds|marks with NO ISSUE' tests/jarl.test.mjs · **saw:** before the change both new tests failed (2 fail); after it both pass (2 pass, 0 fail), at commit ab2a921 in the worker branch
- **ran (history):** cd skills/jarl/scripts && npm test · **saw:** full suite at commit ab2a921: 588 tests, 567 pass, 0 fail, exit 0
- **ran (history):** status, resume, next --all, report, list --all, tips, queue, branches and show --full for 247, 289 and 308 on a copy of the release loop, before and after the change · **saw:** byte-identical outputs: diff -r of the baseline and the after directories exit 0; the copy holds no branch without an issue, so the NO ISSUE mark is not exercised by it
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 8fc18c8 · **saw:** 588 tests, 567 pass, 0 fail, 21 skipped; model test: worker haiku-5.5, one round (one honest stop on a contradiction in the premise of 308), reviewer sonnet-5.5 approved with minors only

