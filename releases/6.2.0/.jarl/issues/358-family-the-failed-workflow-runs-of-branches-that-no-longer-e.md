# 358 · Family: the failed workflow runs of branches that no longer exist are cleared from the Actions tabs

**Status:** open
**Kind:** process
**Priority:** 3
**Tier:** standard
**Key:** 20261028T1029-oyfm
**Tags:** 
**Files:** 
**Repo:** ../../../Runes, ../../../Grain, ../../../ResearcherSkill
**Found by:** coordinator
**Where:**

## What
The Actions tabs still show failed runs of branches deleted long ago: Runes diag-grammars on tmp/win-grammars (2026-09-27); Grain ci on jarl/448-measure-tar-windows and release/win-481 (2026-09-27/28); Researcher's Copilot code review on pull request 2, merged in April. None of their branches exists any more.

## Why
A tab full of old red hides a new red.

## Acceptance
The list is checked again; on the owner's word the runs are deleted, so each Actions tab shows only runs of existing branches

## Evidence

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

