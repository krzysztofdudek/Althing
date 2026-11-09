# 209 · Jarl: the coordinator's guidance allows packages and shared reviews but never tells a coordinator to group small neighbouring issues, and the package size (two to ten) and the shared review size (four) are not put side by side

**Status:** dropped
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** references/jarl.md (steps 3 and 4, Coordinators), references/repositories.md (Packages and leases), references/reviewer.md

## What
The skill describes a package (one worker, one branch, several small issues) and a shared review (one contract or one screen, at most four) as possible, and next --as cuts review units. The section for coordinators never says that small neighbouring issues are handed out as a package by default and reviewed together, so a coordinator that reads only its own section works and reviews one issue at a time. The package size (two to ten) and the review unit (at most four) are stated in two files and not together.

## Why
The owner wants grouped work and grouped reviews to be how Jarl 6.3.0 behaves, not only what it allows.

## Acceptance
- the coordinator's section says that small neighbouring issues of one slice are leased as a package and reviewed in units of at most four, and names the cases that are never grouped (a record format change, an issue with an owner-only line)
- the package size and the review unit size are stated together in one place that the other mentions point to
- the added words stay within the guidance word budget of issue 088

## Evidence

Dropped: absorbed by piece 4 (issue 228), landed

