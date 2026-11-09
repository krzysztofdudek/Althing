# 424 · The family's worktrees and dependencies follow Gard's layout

**Status:** dropped
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261029T1429-nrty
**Tags:** althing, briefs, workplace, worktrees
**Files:** Althing/method/environment.md, Althing/method/loops.md, Althing/.claude/skills/directing-a-release-loop/SKILL.md, Althing/releases/6.2.0/briefs
**Repo:** ../..
**After:** 380, 388, 362
**Found by:** owner
**Where:** method/loops.md: worktrees go under ~/.jarl-wt/; issue 346: workers in the Yggdrasil container use clones on a volume instead of worktrees; the owner's ruling of 2026-10-29 that a Jarl loop applies Gard's place for worktrees

## What
The method, the release skill and the briefs say that a worker's worktree is a view of Gard (gard worktree add with the release's topic and the issue's NNN-slug as the view), that its dependencies live in the view's own volume, that every check runs through gard run, and that the merger removes the view after the merge; ~/.jarl-wt and clones on a volume are named only as what came before. Issues 346 to 354 wait on this one and are done through Gard (ruling family-repos-through-gard).

## Why
Three tools keep worktrees in three places today; the container must see them, and Gard is the one that owns the place.

## Acceptance
- method/environment.md and loops.md state the layout once with the rulings' slugs (worktrees-follow-gard, family-repos-through-gard), and the worker brief cuts a worktree with Gard's command
- The release skill's steps for workers, reviewers and the merger use gard worktree add and gard run

## Evidence

Ruling ask-026 (charter): Krzysztof, 2026-10-29 (translated from Polish): "For later; we use only Gard, right away." Asked again in plainer words after the first question, he chose to postpone the work of 346 to 354 and do it through Gard alone, with no interim pattern; this is closest to option (a), but in his own words.

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: This work runs through Gard alone, and Gard is out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

