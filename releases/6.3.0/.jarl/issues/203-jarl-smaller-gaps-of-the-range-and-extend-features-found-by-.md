# 203 · Jarl: smaller gaps of the range and extend features found by the review of group L1

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-043-opus-l1
**Where:** lib/import.mjs dry check; goal --set Range in a composer loop; the profile validator; lib/commands.mjs cmdExtend
**Branch:** jarl/203-range-extend-inplace
**Worker:** w-jarl-203-opus
**Worktree:** /home/me/Worktrees/JarlSkill/203-range-extend-inplace
**Since:** 2026-11-08 14:42

## What
(1) The import dry check numbers findings first+k without stepping past declared ranges, so in a composer loop it files 998 and refuses the second finding while saying nothing was written. (2) goal --set Range is accepted in a composer loop where no range number can ever be filed. (3) The profile validator shared with profile <file> accepts a field named Title or Model, and a field and a section with the same name. (4) extend has no undo for a part it added. (5) After extend a loop with no profile reads as profile custom and status --json nests its counts under statuses, which is documented for profile loops but not where extend is described, and ws status reads the top-level counts. (6) extend writes its log line before the profile, so a failed profile write leaves a log line for nothing. (7) A range number filed in a clone with an older reader is possible until the first range number raises the loop.

## Why
The features should refuse what they cannot honour and say the same in every view.

## Acceptance
Each of the seven is fixed or said honestly in the docs or on the known-limitations list, with a test where the code changes

## Evidence

