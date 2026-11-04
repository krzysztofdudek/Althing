# 132 · Althing: the workspace guard and the skills and briefs use command forms that Jarl 6.3.0 removes, to move when the driver moves

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../..
**After:** 096
**Found by:** rev-jarl-096b-opus
**Where:** Review of 096 (rev-jarl-096b-opus), Outside the issue

## What
workspace/ws.mjs:50 lists the writing commands of the pinned driver (JARL_WRITES) and lacks field and base, so once the driver is Jarl 6.3.0 its off-pin guard lets those writes through. These texts use forms that 6.3.0 removes and keep working only while the driver stays pinned: .claude/skills/handling-issues/SKILL.md:35 (ws jarl source), releases/6.3.0/briefs/merger.md:33 (jarl queue), releases/6.3.0/briefs/worker-jarl.md:39 and :87 (jarl body --changelog).

## Why
The day the driver moves, the guard and the texts must be true; this is the list of what to move, found by the review of 096.

## Acceptance
At the driver switch, JARL_WRITES holds exactly the writing commands of the 6.3.0 table (a test compares it with jarl --help), and the skills and brief templates name field, resume and the other new forms only

## Evidence

