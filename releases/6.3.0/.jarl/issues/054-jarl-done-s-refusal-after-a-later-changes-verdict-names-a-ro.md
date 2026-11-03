# 054 · Jarl: done's refusal after a later changes verdict names a round that was never recorded

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-25f66d4e
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**Branch:** jarl/046-refusal-texts
**Worker:** w-jarl-046-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-046
**Since:** 2026-11-03 10:58

## What
Claim: Done should refuse while a review asks for changes with no later approve.

It already refuses: approve, then changes, then set 530 done on the loop copy was refused with 'no approving review newer than its last round', though no round was recorded. Map row fr-19.

## Why


## Acceptance
- set done after an approve followed by a changes verdict is refused naming that changes verdict (its reviewer and time) as the cause, never a round that was not recorded
- Tested; red on 71ebc5b

## Changelog
- Fixed: When an issue cannot be finished because its latest review asks for changes, the message now names that review, with its reviewer and date, instead of a review round that was never recorded.

## Evidence

- **ran:** node --test --test-name-pattern="changes verdict" tests/gate-decide-tips.test.mjs (before the change) · **saw:** ℹ tests 1, ℹ pass 0, ℹ fail 1: AssertionError, the refusal reads '1 has no approving review newer than its last round or reopen', not the changes verdict
- **ran:** TMPDIR=~/Temp/tmp/w046 nice -n 15 timeout 600 node --test --test-name-pattern="changes verdict" tests/gate-decide-tips.test.mjs · **saw:** ℹ tests 1, ℹ pass 1, ℹ fail 0: the refusal after an approve and a later changes verdict names that verdict by its reviewer and day
- **ran:** TMPDIR=~/Temp/tmp/w046 nice -n 15 timeout 1800 npm test (in skills/jarl/scripts, on the branch tip 0be663a) · **saw:** ℹ tests 849, ℹ pass 826, ℹ fail 0, ℹ skipped 23

