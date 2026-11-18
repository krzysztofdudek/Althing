# 1 · Release 1.2.0

**Status:** done
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

## Reviews
- **approve** · by rev-runes-1-2-0-release (fresh) · 2026-11-18 · model claude-sonnet-5-5
  Read issue 1, the Shipping section of the releasing-the-family skill (applied to a Runes-only release), asks a-6 and a-7 and ruling runes-1-2-0-ship, then checked each claim myself. After fetching tags, v1.2.0 resolves to cb801ebab34be28a2d810af56dbcabcc15dba585 and origin/main is the same commit. CI runs 44174467764 and 44176976067 are completed with success on that head sha, and Release run 44179491213 is success on it too. npm dist-tags show latest 1.2.0 and @chrisdudek/runes@1.2.0 answers. The GitHub release v1.2.0 exists (not draft, not prerelease), and its notes equal the CHANGELOG [1.2.0] section at cb801eb plus a trailing Install block (npm command and vendoring line). The remote has only main and release/1.1.0, so release/1.2.0 is gone. releases/1.2.0/family.json has state published with the runes commit cb801eb, and FROZEN.sha256 exists. The owner's word is recorded: a-6 (option a, tag, publish and merge, 2026-11-17) with ruling runes-1-2-0-ship, and a-7 (option a, branch deletion and close, 2026-11-18). Every check holds.

## Evidence

### Notes

Candidate: Runes release/1.2.0 at cb801ebab34be28a2d810af56dbcabcc15dba585 on GitHub, CI run 44174467764 green on every job; npm run check 3013 tests 0 failed, Rust build tests 6 of 6 under rustc 1.99.1, routine corpus gate passed (the heavy tier last ran in full at 586's merge; CI runs it on a dispatch with tier all). Every issue of the loop is done or deferred with its reason. Waiting for the owner's word to start this issue: the tag v1.2.0 and the publish through Runes' release workflow.

Shipped on the owner's word (a-6, runes-1-2-0-ship): CI green at cb801eb on Linux, macOS and Windows (run 44174467764) and the full corpus tier green (run 44176976067); tag v1.2.0 at cb801eb; release run 44179491213 success; npm @chrisdudek/runes dist-tags latest 1.2.0; GitHub release https://github.com/krzysztofdudek/Runes/releases/tag/v1.2.0; Runes main fast-forwarded to cb801eb; manifest state published.

