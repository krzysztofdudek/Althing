# 341 · Family: the README commits made on main after the release branches were cut enter Yggdrasil's and Grain's release branches

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil, ../../../Grain
**Found by:** coordinator
**Where:**

## What
Between 2026-10-05 and 2026-10-21 main moved on in both repositories with README and family-section commits that the release branches do not hold: Yggdrasil 3 (Skald leaves the family, start at the step where it hurts, what you install and why), Grain 4 (the same three and the family section without em dashes). A release that fast-forwards main would fail, and one that merges would have to resolve them at the last moment.

## Why
The release branch is what ships; text written on main since must not be lost or fought over during the release steps.

## Acceptance
- Each release branch holds every commit of its origin/main, merged with conflicts resolved in favour of the newer text, and the repository's check is green on the merge
- git rev-list release/6.2.0..origin/main is empty in both repositories, recorded as a row

## Evidence

