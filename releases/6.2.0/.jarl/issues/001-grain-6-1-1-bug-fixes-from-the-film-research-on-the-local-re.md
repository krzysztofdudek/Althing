# 001 · Grain 6.1.1: bug fixes from the film research on the local release/6.1.1 branch

**Status:** dropped
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** grain, patch
**Files:** 
**Repo:** ../../../Grain
**Found by:** film-research
**Where:**

## What
Five commits on the local release/6.1.1 branch in Grain (d318ce4, 0e39caa, d52af01, 076adf4, 0e0093a): a reserved root type name and the propose exit code when the adopt preview is rejected; the rule's scope narrowed to the files and units it was counted on, so the 'N break it today' number agrees with yg check (12/12 enforced rules on express, flask, gin, koa, petclinic and Yggdrasil); a 'non-merge commits' counter; the README numbers measured anew; the placement example labelled as a fixture result; version and CHANGELOG 6.1.1.

## Why
Bugs found in real runs of Grain on express and six other repositories during the work on the film; the number from propose diverged from yg check after adoption, and gin could not be adopted at all.

## Acceptance
- The owner decides on the release; until then the branch stays local (no push, no tag).
- Before a release after 2026-10-02, the date in the [6.1.1] header in CHANGELOG is corrected.

## Evidence

- **ran:** npm test (Grain, release/6.1.1) · **saw:** 1853 tests: 1827 green, 0 red, 26 skipped (YG_BIN or Windows); with YG_BIN and the corpus: 1852 green, 1 skipped; seams 10/10, corpus 31/31
- **ran:** git log --oneline main..release/6.1.1; git ls-remote --heads origin (Grain) · **saw:** 5 commits d318ce4..0e0093a only locally; on origin only main

docs pass merged at 34b648c, gate 2296 tests, 2294 pass, 0 fail, 2 skipped; README/results (131), CHANGELOG and stamps wait for the Runes 1.0.1 pickup
- **ran:** git merge-base --is-ancestor <commit> release/6.2.0 for d318ce4, 0e39caa, d52af01, 076adf4, 0e0093a (Grain); git branch --list release/6.1.1 · **saw:** all five commits are in release/6.2.0; the release/6.1.1 branch no longer exists; Grain's last tag is v6.1.0, so 6.1.1 was never published

Dropped: absorbed into 6.2.0: its five commits are on release/6.2.0 and Grain 6.1.1 was never published (the owner, 2026-10-28: everything is 6.2.0); the CHANGELOG section it left is issue of its own

