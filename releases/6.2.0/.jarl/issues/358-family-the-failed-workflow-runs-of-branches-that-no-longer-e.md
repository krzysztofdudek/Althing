# 358 · Family: the failed workflow runs of branches that no longer exist are cleared from the Actions tabs

**Status:** open
**Kind:** process
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Runes, ../../../Grain, ../../../Horde, ../../../ResearcherSkill
**Found by:** coordinator
**Where:**

## What
The Actions tabs still show failed runs of branches deleted long ago: Runes diag-grammars on tmp/win-grammars (2026-09-27); Grain ci on jarl/448-measure-tar-windows and release/win-481 (2026-09-27/28); Horde ci on release/win-481, jarl/481-lock-windows, tmp/grain-517 and tmp/grain-seam (2026-09-27/28); Researcher's Copilot code review on pull request 2, merged in April. None of their branches exists any more.

## Why
A tab full of old red hides a new red.

## Acceptance
The list is checked again; on the owner's word the runs are deleted, so each Actions tab shows only runs of existing branches

## Evidence

