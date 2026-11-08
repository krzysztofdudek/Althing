# 231 · Jarl 6.3.0: the largest code files are cut up by command, with no change of behaviour

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 225
**Found by:** owner
**Where:** skills/jarl/scripts/lib/commands.mjs (2306 lines), skills/jarl/scripts/jarl.mjs (1682 lines)
**Branch:** jarl/231-cut
**Worker:** w-jarl-231-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/231-cut
**Since:** 2026-11-08 20:51

## What
Workers spend about half of their commands finding where things are, and the largest file was touched by 76 commits in one week, so merges collide there. Cut the largest files into smaller modules, each named for what it holds, moving code only.

## Why
The owner asked for it on 2026-11-08, to make the workers' work on the release faster; done between piece 1 and piece 2 because piece 1 is changing these files now.

## Acceptance
- [compare] every read view of a copy of this loop is unchanged, text and --json · by: the comparison of views the release workers use, base against tip
- [check] the full suite passes on the merged result
- [check] no file under skills/jarl/scripts/lib holds more than 800 lines · by: wc -l on the files of skills/jarl/scripts/lib
- [read] an independent examiner: the change moves code and nothing else, and the exports of record.mjs are the same

## Evidence

