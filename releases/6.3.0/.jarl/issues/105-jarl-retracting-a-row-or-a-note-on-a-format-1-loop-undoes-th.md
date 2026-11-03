# 105 · Jarl: retracting a row or a note on a format-1 loop undoes the raise's rewrite of that issue's Repo field

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-019-opus
**Where:** Review of 019 (2026-11-03): lib/evidence.mjs

## What
On a format-1 loop, retracting a row or a note raises the format and rewrites a bare-word Repo path to ./<word>, then the retraction's own write puts the old Repo value back. Reproduced on both the release branch and 019's branch.

## Why
The raise's rewrite must stay in the issue file the retraction writes.

## Acceptance
After a retraction on a format-1 loop the issue's Repo field keeps the raised form, with a test

## Evidence

