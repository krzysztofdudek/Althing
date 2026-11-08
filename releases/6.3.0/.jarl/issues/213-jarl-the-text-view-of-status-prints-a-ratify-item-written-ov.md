# 213 · Jarl: the text view of status prints a ratify item written over several lines on several lines, while resume keeps it to one row

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-194-opus-n1
**Where:** lib/import.mjs near line 404
**Branch:** jarl/206-queue-and-view-gaps
**Worker:** w-jarl-206-haiku
**Worktree:** /home/me/Worktrees/JarlSkill/206-queue-and-view-gaps
**Since:** 2026-11-08 15:36

## What
status text view and resume print a multi-line ratify item differently.

## Why


## Acceptance
status prints a ratify item on one row, as resume does

## Changelog
- Fixed: The status now shows each item to ratify on one line, even one written over several lines. The question itself is kept as it was asked.

## Evidence

- **ran:** node --test tests/jarl.test.mjs · **saw:** red before the fix: jarl tests 186, pass 184, fail 1, skipped 1 (JARL_LIVE_LOOP is unset); the status line of an item to ratify ends at the first line of its question: 'ratify a-1 (issue 1) · raised the prompt limit', and the rest is printed on the next row
- **ran:** node --test tests/jarl.test.mjs · **saw:** green after the fix: jarl tests 186, pass 185, fail 0, skipped 1 (JARL_LIVE_LOOP is unset); the status prints 'ratify a-1 (issue 1) · raised the prompt limit to 96000 under the mandate' on one row
- **ran:** node --test tests/jarl.test.mjs · **saw:** on the merged tree, dd95967: jarl tests 186, pass 185, fail 0, skipped 1 (JARL_LIVE_LOOP is unset); the status prints the ratify item on one row

