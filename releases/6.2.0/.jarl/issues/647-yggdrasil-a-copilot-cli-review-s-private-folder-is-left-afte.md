# 647 · Yggdrasil: a copilot-cli review's private folder is left after SIGKILL or SIGHUP (a closed terminal…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-jktr
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620-opus
**Where:** the review of 615, 620, 621, 625, 627
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:38

## What
Yggdrasil: a copilot-cli review's private folder is left after SIGKILL or SIGHUP (a closed terminal, a dropped SSH session) and no later run removes it, unlike claude-code's dead-run clean-up; on SIGHUP the detached reviewer also keeps running, for both providers, because only SIGINT and SIGTERM are handled (cli-base.ts onInterrupt). Tried with a stand-in copilot: after SIGTERM the folder and the helper are gone, after SIGKILL and SIGHUP both stay.

## Why


## Acceptance


[test] After SIGKILL or SIGHUP of yg during a copilot-cli review, the review's private folder is removed by a later run as claude-code's dead-run folders are, and on SIGHUP the detached reviewer of either provider is stopped as on SIGTERM, red before and green after · by: cd source/cli && npm test

## Evidence

