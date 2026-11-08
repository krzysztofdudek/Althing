# 178 · Jarl: a refusal of a code issue holding a bot's approve and the coordinator's names the coordinator, not the bot

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-041-opus-d3b
**Where:** skills/jarl/scripts/lib/loop.mjs gateOf and lib/commands.mjs doneGateIn
**Branch:** jarl/173-views-and-refusals
**Worker:** w-jarl-173-opus
**Worktree:** /home/me/Worktrees/JarlSkill/173-views-and-refusals
**Since:** 2026-11-08 10:11

## What
With no clears definition, a code issue that holds a bot's approve and the coordinator's is refused under the fresh-review rule, and the message names the coordinator because the coordinator's approve outranks the bot's, so the bot goes unnamed.

## Why
The refusal should name every approve that did not clear.

## Acceptance
The refusal names the bot as well as the coordinator, with a test

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/bot-reviews.test.mjs with the new test of a coordinator's and a bot's approve, before the fix · **saw:** fails: done says '1 carries code (Merged is recorded) and its live approve is by jarl (coordinator) — the fresh-review rule: ...' and does not name coderabbit (bot)
- **ran:** cd skills/jarl/scripts && node --test tests/review-units.test.mjs tests/bot-reviews.test.mjs at the tip · **saw:** tests 18, pass 18, fail 0: done says 'its live approve is by jarl (coordinator), and it holds the approve of coderabbit (bot) as well' and that a bot's clears only where the done gate names that bot. the full suite at the branch tip ac6f9bd (cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs) printed tests 1546, pass 1524, fail 0, skipped 22; every view (status, resume, next, next --as jarl and owner, report, models, branches, verify, list, decisions, profile, show, brief, text and --json) on a copy of the loop with the tool repositories linked is the same at a981c80 and at the tip except the ages, and closedGate holds only 028 in both

