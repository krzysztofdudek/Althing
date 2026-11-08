# 206 · Jarl: review --outside numbers several findings without stepping past declared ranges, and the NO PROOF note of merged prints the evidence form without --line in a loop that names lines

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-203-opus
**Where:** lib/review.mjs (outside findings), lib/commands.mjs (merged note)
**Branch:** jarl/206-queue-and-view-gaps
**Worker:** w-jarl-206-haiku
**Worktree:** /home/me/Worktrees/JarlSkill/206-queue-and-view-gaps
**Since:** 2026-11-08 15:36

## What
Two small gaps found while fixing 203 and 205. review --outside with several findings numbers them the way import did before 203 (the next free numbers, not stepping past a declared Range). The NO PROOF FROM THE WORKER note printed by merged shows the evidence form without --line in a loop that names lines.

## Why


## Acceptance
- review --outside with several findings gives each the number new would give it, stepped past declared ranges
- the NO PROOF note of merged prints the evidence form with --line in a loop that names lines, and without it in a loop that does not

## Evidence

- **ran:** node --test tests/outside-findings.test.mjs tests/proof-notes.test.mjs · **saw:** red before the fix: outside-findings tests 17, pass 16, fail 1 (the test with a declared range: the second finding is refused by the filing, its message without the dry check's form); proof-notes tests 25, pass 24, fail 1 (the NO PROOF note of merged prints the form without --line in a loop that names lines)
- **ran:** node --test tests/outside-findings.test.mjs tests/proof-notes.test.mjs tests/number-ranges.test.mjs tests/proof-lines.test.mjs · **saw:** green after the fix: outside-findings tests 17, pass 17, fail 0; proof-notes tests 25, pass 25, fail 0; number-ranges tests 6, pass 6, fail 0; proof-lines tests 21, pass 21, fail 0. On a copy of the loop, merged prints the NO PROOF note with --line "<line-number>" in a loop that holds a line row, and review files two outside findings with the numbers after the held ones

