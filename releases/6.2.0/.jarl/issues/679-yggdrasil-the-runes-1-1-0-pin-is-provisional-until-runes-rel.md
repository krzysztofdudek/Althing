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


Yggdrasil release/6.2.0 pins Runes 1.1.0 through the GitHub archive of commit c5124ca (source/cli/package-lock.json:133, codeload.github.com/krzysztofdudek/Runes/tar.gz/c5124ca0525ea5896c589fbb93a1a4e6ec84e018). Runes' release/1.1.0 was rewritten by issue 565 and is on GitHub at b326704. c5124ca now exists only in a local backup branch of Runes, so GitHub answers 404 for that archive and a fresh npm ci of the pin fails. The pin is redone to a commit that exists on GitHub, with the integrity npm computes from that archive; issue 732 asks for one tagged commit that does not move, and that commit is the one to pin once it exists.

## Why
Yggdrasil takes Runes through a GitHub archive of an exact commit (ruling runes-push-branch); that commit is unpushed, and 565 rewrites Runes' history before it is pushed, which changes the commit, so the pin is redone after the push, not before.

## Acceptance
[check] Yggdrasil release/6.2.0 pins a Runes commit that exists on GitHub (its codeload archive answers 200), with the integrity npm computes from that archive, and a clean npm ci in source/cli and the pack smoke step pass · by: bash scripts/repo-check.sh

## Evidence

### Notes

Checked 2026-11-13: curl -L https://codeload.github.com/krzysztofdudek/Runes/tar.gz/c5124ca0525ea5896c589fbb93a1a4e6ec84e018 answers HTTP 404, and https://github.com/krzysztofdudek/Runes/archive/c5124ca0525ea5896c589fbb93a1a4e6ec84e018.tar.gz ends in 404 after its redirect; the same URLs for b326704fa54185afb9a898c699b4b91e6f498e32 answer 200. git ls-remote origin in Runes lists refs/heads/release/1.1.0 at b326704, so the push this issue waited on has happened and the pin is stale. A fresh install of the pin fails now. Filed again by a second report and merged here instead of as a new issue.

