# 108 · Jarl: the fresh-session question for review — a ratify item moves a review to the owner, 'issues 1,2' holds nothing without saying so, a line with several issues drops each title and worker

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 090
**Found by:** rev-jarl-090c-opus
**Where:** Review of 090 (2026-11-03): lib/ball.mjs
**Branch:** jarl/108-small-gaps
**Merged:** 4e89d0ba43de04503c11bcd97ef430ec04e9fdef in ../../../JarlSkill
**CI:** none

## What
Three small gaps of the question for a fresh session: a ratify item worded as the question moves the review to the owner though ratify items block nothing; a list written without a space after the comma holds nothing and nothing says so; a row naming several issues drops each issue's title and worker.

## Why
The owner's list must show what the question holds.

## Acceptance
Each of the three is fixed or stated in references/jarl.md, with a test where behaviour changes

## Changelog
- Fixed: A question asking the owner to start a fresh session for a review now holds the review only when it is a plain question, not an item to ratify or an escalation, and a list of numbers written with no space after its commas is read as a list. The line for several tasks waiting for a review now names each task with its title and worker.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/lone-agent-review.test.mjs, with the three new cases and the code before the change (ratify item and escalation worded as the question, a list written as 1,2, a line for two proofs) · **saw:** ℹ pass 6 ℹ fail 3: the review stayed moved to the owner by a ratify item, 'issues 1,2' held nothing, and the line for several proofs carried no issues with their title and worker
- **ran:** cd skills/jarl/scripts && node --test tests/lone-agent-review.test.mjs tests/review-units.test.mjs tests/next-as.test.mjs tests/printed-writes.test.mjs tests/docs-true.test.mjs, on commit 74b4b04 of the branch · **saw:** pass 44 fail 0 (lone-agent-review, review-units and docs-true); a ratify item or an escalation worded as the question leaves the review with the jarl, 1,2 holds issues 1 and 2, the line for several proofs ends with the issues named with title and worker. Not changed: the question row's reviewing list stays a list of numbers
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on commit 56dd68a · **saw:** tests 1503 pass 1481 fail 0 skipped 22
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1552, pass 1530, fail 0, skipped 22, merge 4e89d0b

