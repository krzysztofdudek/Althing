# 679 · Yggdrasil: the Runes 1.1.0 pin is provisional until Runes' release branch is on GitHub: npm ci and the pack smoke step cannot fetch it, and the lock's integrity comes from a local pack

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** light
**Key:** 20261111T2330-kdah
**Tags:** yggdrasil, runes, release
**Files:** 
**Repo:** Yggdrasil
**After:** 565
**Found by:** jarl
**Where:** w-530-sonnet, Runes 1.1.0 adoption report

## What


## Why
Yggdrasil takes Runes through a GitHub archive of an exact commit (ruling runes-push-branch); that commit is unpushed, and 565 rewrites Runes' history before it is pushed, which changes the commit, so the pin is redone after the push, not before.

## Acceptance
[check] After 565's rewrite and the push of Runes' release branch, Yggdrasil release/6.2.0 pins the pushed commit's archive with the integrity npm computes from it, and npm ci and the pack smoke step pass · by: bash scripts/repo-check.sh

## Evidence

