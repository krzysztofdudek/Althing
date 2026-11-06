# 153 · Jarl: the liveness views leave some loose ends: the default is still said to be six hours, the as-list ignores --stale-hours, idle rows sort past the first seven lines, and branch gone is judged from local branches only

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-042-opus
**Where:** Review of 042 and 068 (rev-jarl-042-opus), Minor findings and Outside the issue
**Branch:** jarl/099-views-and-printed-commands
**Worker:** w-jarl-099-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/099-views-and-printed-commands
**Since:** 2026-11-06 20:34

## What
(1) references/repositories.md line 16 still says the default idle threshold is 6 hours. (2) In one status --stale-hours n --as call the as-list ignores the override and keeps the goal's threshold. (3) The 'What is on whom' table has no row for an idle lease and the idle field of next --as --json is not documented. (4) An idle row is ordered like any other row on a holder's list, so on a long list it falls past the first seven lines (lib/ball.mjs). (5) 'branch gone' is judged from local branches only while the ages now also read fetched refs, so a lease whose branch exists only as origin/<branch> reads as gone and is dated by that ref at once (lib/rounds.mjs leaseState). (6) A move from done to dropped counts as reopened after done in report, and writer names are grouped by exact spelling.

## Why
Each is small, and together they make the new views less trustworthy than they should be.

## Acceptance
Each of the six points is corrected or said honestly in the docs, with a test where the code changes, and an idle row sorts before ordinary rows

## Evidence

