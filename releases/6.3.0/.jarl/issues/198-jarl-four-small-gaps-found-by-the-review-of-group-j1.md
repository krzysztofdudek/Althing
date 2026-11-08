# 198 · Jarl: four small gaps found by the review of group J1

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-173-opus-j1
**Where:** lib/ball.mjs issueRows; lib/resume.mjs near line 112; lib/review.mjs fileOutside; lib/evidence.mjs IN_FLIGHT_MARKS
**Branch:** jarl/194-small-views-and-refusals
**Worker:** w-jarl-194-opus
**Worktree:** /home/me/Worktrees/JarlSkill/194-small-views-and-refusals
**Since:** 2026-11-08 14:42

## What
(1) next --as keeps one row per issue for approves refused for their model instead of grouping them into review units. (2) resume --json shows in-flight next for more marks than references/commands.md says (approved with no code, sent back, model-refused). (3) review --outside at the format edge ends with the review form carrying one --outside, not the profile view its reason names, unlike import after 180. (4) The in-flight text for an issue already merged whose approve is refused for its model says neither the merge queue nor done accepts that, which is only wording.

## Why
Every view should say the same, and a refusal's form should be the one its reason names.

## Acceptance
Each of the four is fixed or said honestly in the docs, with a test where the code changes

## Evidence

