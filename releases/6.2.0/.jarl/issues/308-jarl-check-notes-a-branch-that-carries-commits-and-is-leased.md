# 308 · Jarl: check notes a branch that carries commits and is leased by no issue (work done without a ticket), as a note that does not change ok

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-check-note-code-without-an-issue
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280
**After:** 289
**Branch:** jarl/289-check-notes
**Worker:** w-notes-haiku
**Since:** 2026-10-19 10:48

## What
Claim: Nothing in Jarl notices a change made before its ticket was filed, or never ticketed; a repository whose rule is that everything is ticketed enforces it by hand.

check reads the changed files and the tests of the branch it is given and never asks whether an issue holds a lease or a Branch on it (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280); a field report from a private deployment of 6.1.0, section 3.6 and request 7 (source.md).

## Why


## Acceptance
- Proposed by the finding — make it checkable before a worker starts: check --branch lists, as one item that never changes ok (as issue 289 does for loop numbers on added lines), a branch with commits beyond the base to which no Branch or lease of an issue points, naming the branch and the commit count. Tests: a branch with a lease gives no item; a branch with commits and no issue gives one; an empty branch gives none
- One package with 289, after the ids section of 325 (architect scope review of 2026-10-18, section 4, item 3, and code review of the same day, section 5): the same note channel of cmdCheck carries both kinds of note, and --json carries this item beside the list of 289; the branches and the ids on branch names are read through what branches already reads (branchesIn and the one worktree-list parser of 325), with no parser of its own

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).

