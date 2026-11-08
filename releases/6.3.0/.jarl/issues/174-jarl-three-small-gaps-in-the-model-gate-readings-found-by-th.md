# 174 · Jarl: three small gaps in the model gate readings found by the review of group D1

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-169-opus-d1
**Where:** skills/jarl/scripts/lib/base.mjs namesComparison; lib/models.mjs lightMayClear; lib/loop.mjs awaitsMerge
**Branch:** jarl/173-views-and-refusals
**Worker:** w-jarl-173-opus
**Worktree:** /home/me/Worktrees/JarlSkill/173-views-and-refusals
**Since:** 2026-11-08 10:11

## What
(1) The proof-row check for the identical-output tag is a word match: a routine git diff stat row passes and a row saying no differences in output does not. (2) lightMayClear reads every evidence row, including one recorded before a reopen or a round. (3) awaitsMerge also stops the idle mark for an approved issue that carries no code and has nothing to merge, which the docs do not say.

## Why
The tag relaxes a rule, so its evidence should be the evidence for this change; the idle mark should mean what the docs say.

## Acceptance
The comparison row must be recorded after the last reopen or round; the idle mark of an approved issue with no code is decided and documented; a test holds each

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/identical-output.test.mjs (new test: a comparison row before a round or a reopen) and tests/liveness.test.mjs (new test: an approved lease with no code), on the old code · **saw:** both new tests fail: done accepts a light approve of a tagged change whose only comparison row was recorded before a round (expected a refusal, exit 0); status lists no idle lease for an approved issue with no code at 36 minutes (actual [], expected ['001'])
- **ran:** cd skills/jarl/scripts && node --test tests/identical-output.test.mjs tests/liveness.test.mjs at the tip · **saw:** tests 22, pass 22, fail 0: a comparison row before a round or a reopen lets no light approve clear, one recorded after does; an approved lease with no code is idle at 36 minutes; the lease of approved code waiting for its merge is still not idle. the full suite at the branch tip ac6f9bd (cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs) printed tests 1546, pass 1524, fail 0, skipped 22; every view (status, resume, next, next --as jarl and owner, report, models, branches, verify, list, decisions, profile, show, brief, text and --json) on a copy of the loop with the tool repositories linked is the same at a981c80 and at the tip except the ages, and closedGate holds only 028 in both

