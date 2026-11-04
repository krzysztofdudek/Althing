# 134 · Jarl: CI on main is red since 3ae1f4e: five tests that hold the README and the loop root to the code fail, and the fix is carried to the release branch

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** ci
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** main 79c12f6: cd skills/jarl/scripts && npm test, 800 tests, 5 failed
**Branch:** jarl/134-main-ci-green
**Worker:** w-jarl-134-sonnet
**Worktree:** /Users/me/.jarl-wt/JarlSkill-134
**Since:** 2026-11-04 13:47

## What
CI on JarlSkill main has failed since the README commit 3ae1f4e of 2026-10-21 and failed again on 2026-11-04 at 79c12f6. Running the full suite on main reproduces five failures out of 800 tests: 'the README copies the whole skills/jarl/ directory for a drop-in, never the single SKILL.md', 'a loop is found at the root of a checkout and never in a subdirectory, which root, --root or JARL_ROOT reach', 'the README says who verifies: the fresh reviewer and the merger, and no more than the record gives', 'rule 7: no comment or title in the tests, and no prose in the skill or the readme, holds a version-shaped token', and 'the tense test: …'. Issue 028 holds an approved fix for the README half, cut from the old main; its README change now conflicts with main's Horde-free README. The owner wants main fixed now, and the fix carried to the release branch even if the release branch already passes.

## Why
A red main is the base every release is cut from, and the README tells people something the tests reject.

## Acceptance
- The five named tests pass on main, with the owner's new README order, its social card and the Horde-free family section kept and no test weakened or removed
- The full suite is green on main and, after the owner's pushed main runs on GitHub, CI on main is green
- The same fix is carried into release/6.2.1 and the full suite there is green

## Evidence

