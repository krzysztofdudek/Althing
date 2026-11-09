# 191 · Jarl: three wording and refusal gaps in the tick take-back and the Where log found by the review of group G2

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261108T0902-cjyp
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-187-opus-g2
**Where:** jarl.mjs dispatchCall retract; lib/owner-lines.mjs cmdRetractTick; lib/commands.mjs fieldLine
**Branch:** jarl/122-wording-and-canon
**Merged:** d65727c039b363b868994b0278112710367f6805 in ../../../JarlSkill
**CI:** none

## What
(1) Every refusal of a tick take-back ends with the generic retract form whose placeholder never names tick-<n>. (2) The refusal on a closed issue says a tick is taken back once it is open again, but reopening already voids every tick. (3) A Where change still logs the whole new value.

## Why
A refusal should end with the form that fits, say what is true, and a long Where should not flood the log tail.

## Acceptance
The take-back refusals end with a form that names tick-<n>, the closed-issue wording is true, a Where change logs a bounded excerpt of the new value too, and a test holds each

## Changelog
- Fixed: Changing a long Where of a task keeps only the first 120 characters of the old text and of the new one, and the length of each, in the log.

## Evidence

- **ran (history):** node --test tests/owner-sign-off.test.mjs tests/description.test.mjs without the change (red), then with it (green) · **saw:** red: 3 fail (the take-back refusals end with the generic review-n-or-note-n form, the Where change logs the whole new value); green: 20 pass, 0 fail; seven refusals of retract tick-<n> end with 'retract <id> <tick-n> <why> --by <the-owner-himself>', the closed-issue refusal says opening the issue spends every tick and ends with the reopen step then that form, and a Where change logs the first 120 characters and the length of the new value as of the old one
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on the branch tip · **saw:** tests 1557, pass 1535, fail 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1571, pass 1549, fail 0, skipped 22, merge d65727c

