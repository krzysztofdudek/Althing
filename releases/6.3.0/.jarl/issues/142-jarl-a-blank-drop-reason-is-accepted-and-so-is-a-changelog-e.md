# 142 · Jarl: a blank drop reason is accepted, and so is a changelog entry under an unknown section

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096g-opus
**Where:** Review of 096 (rev-jarl-096g-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Worker:** w-jarl-128-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/128-fields-and-refusals
**Since:** 2026-11-05 13:37

## What
set <id> dropped with a blank reason is accepted, and body --changelog with a section heading the changelog does not know is recorded. Both were there before 096.

## Why
A dropped issue without a reason cannot be read later; a changelog entry under an unknown section never reaches the release notes.

## Acceptance
A blank drop reason is refused with the form that gives one, a changelog section outside the known list is refused with the list, and a test holds each

## Changelog
- Fixed: dropping or deferring an issue with a reason of blanks is now refused with the command that gives a reason, and a changelog entry that opens with a word and a colon that is not a changelog section is refused with the list of sections.

## Evidence

- **ran:** node --test --test-name-pattern 'status moves only|changelog' tests/jarl.test.mjs tests/queue-views.test.mjs on the code before the change · **saw:** 2 failed (blank drop reason accepted; 'Bogus: text' recorded), 1 passed
- **ran:** same tests after the change; set 130 dropped ' ' and body Changelog 'Bogus: text' on a copy of the real loop · **saw:** pass 3, fail 0; 'dropped needs a reason' ends with the set form with <text>; the unknown section is refused naming Added, Changed, Deprecated, Removed, Fixed, Security and ending with the field Changelog form; no real changelog entry of the loop opens with an unknown word

