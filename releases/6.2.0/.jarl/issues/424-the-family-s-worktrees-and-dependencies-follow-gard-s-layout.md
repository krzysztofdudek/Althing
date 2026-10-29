# 424 · The family's worktrees and dependencies follow Gard's layout

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** strong
**Tags:** althing, workplace, worktrees, briefs, needs-owner
**Files:** Althing/method/environment.md, Althing/method/loops.md, Althing/.claude/skills/directing-a-release-loop/SKILL.md, Althing/releases/6.2.0/briefs
**Repo:** ../..
**After:** 380, 388, 362
**Found by:** owner
**Where:** method/loops.md: worktrees go under ~/.jarl-wt/; issue 346: workers in the Yggdrasil container use clones on a volume instead of worktrees; the owner's ruling of 2026-10-29 that a Jarl loop applies Gard's place for worktrees

## What
Once the owner has answered the question this loop records on it: the method, the release skill and the briefs say that a worker's worktree is a view of Gard (gard worktree add with the release's topic and the issue's NNN-slug as the view), that its dependencies live in the view's own volume, and that the merger removes the view after the merge; ~/.jarl-wt and clones on a volume are named only as what came before. Issues 346 to 354 are read against it, and each says whether it waits for Gard or keeps its own pattern until then.

## Why
Three tools keep worktrees in three places today; the container must see them, and Gard is the one that owns the place.

## Acceptance
- method/environment.md and loops.md state the layout once with the ruling's slug, and the worker brief cuts a worktree with Gard's command
- Each of 346 to 354 carries an evidence note saying how it relates to this issue

## Evidence

