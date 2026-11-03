# 109 · Jarl: declaring files or resources after a lease bypasses the guard that refuses a file another lease holds

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 008
**Found by:** rev-jarl-008-opus
**Where:** Review of 008 (2026-11-03): files, field resources

## What
The held-file refusal runs at the lease. Declaring files or resources with the files command or field resources after the lease is not checked against other leases.

## Why
The guard is only as good as the places that can set what it guards.

## Acceptance
files and field resources refuse a file or resource another lease holds, naming the holder, with tests

## Evidence

