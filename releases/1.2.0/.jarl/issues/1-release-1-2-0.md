# 1 · Release 1.2.0

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** strong
**Key:** 20261117T1031-jocb
**Tags:** release, needs-owner
**Files:** 
**Found by:** jarl
**Where:**
**Repo:** Runes

## What
Ship release 1.2.0: in every repository with work, release/<version> green on its exact commit, the corpus gate and the candidate verdict green, the bump commits, the order to main, the tags through each repository's release workflow, the publish verified, the branches cleaned up.

## Why
A release that skips a step is found by a user after the tag.

## Acceptance
- [read] every step of the shipping checklist in the releasing-the-family skill is recorded on this issue
- [owner] the owner said to start it, and each push and publish happened on his word · material: the release checklist · check: go

## Evidence

### Notes

Candidate: Runes release/1.2.0 at cb801ebab34be28a2d810af56dbcabcc15dba585 on GitHub, CI run 44174467764 green on every job; npm run check 3013 tests 0 failed, Rust build tests 6 of 6 under rustc 1.99.1, routine corpus gate passed (the heavy tier last ran in full at 586's merge; CI runs it on a dispatch with tier all). Every issue of the loop is done or deferred with its reason. Waiting for the owner's word to start this issue: the tag v1.2.0 and the publish through Runes' release workflow.

