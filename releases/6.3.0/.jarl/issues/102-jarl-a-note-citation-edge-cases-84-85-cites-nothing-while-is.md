# 102 · Jarl: a note citation edge cases: (84, 85) cites nothing while issue 84 does, issues 084,085 cite neither, and the chain-walk cache checks only the size

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 089
**Found by:** rev-jarl-089c-opus
**Where:** Review of 089 round 2 (2026-11-03): lib/ids.mjs

## What
A bracket list of two-digit numbers cites nothing, a comma without a space joins nothing, the cost sentence is not exact when the cited issue waits on the citing one, and the cache checks only the size of the loop.

## Why
Each is a limit of the explicit-citation rule worth either fixing or stating.

## Acceptance
Each is fixed or stated in references/jarl.md, with a test where behaviour changes

## Evidence

