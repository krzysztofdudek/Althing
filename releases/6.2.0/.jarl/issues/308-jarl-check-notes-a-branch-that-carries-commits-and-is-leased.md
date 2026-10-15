# 308 · Jarl: check notes a branch that carries commits and is leased by no issue (work done without a ticket), as a note that does not change ok

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-check-note-code-without-an-issue
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280

## What
Claim: Nothing in Jarl notices a change made before its ticket was filed, or never ticketed; a repository whose rule is that everything is ticketed enforces it by hand.

check reads the changed files and the tests of the branch it is given and never asks whether an issue holds a lease or a Branch on it (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280); a field report from a private deployment of 6.1.0, section 3.6 and request 7 (source.md).

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: check --branch lists, as one item that never changes ok (as issue 289 does for loop numbers on added lines), a branch with commits beyond the base to which no issue's Branch or lease points, naming the branch and the commit count. Tests: a branch with a lease gives no item; a branch with commits and no issue gives one; an empty branch gives none. 6.3.0.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

