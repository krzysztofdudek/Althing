# 647 · Yggdrasil: a copilot-cli review's private folder is left after SIGKILL or SIGHUP (a closed terminal…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-jktr
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620-opus
**Where:** the review of 615, 620, 621, 625, 627

## What
Yggdrasil: a copilot-cli review's private folder is left after SIGKILL or SIGHUP (a closed terminal, a dropped SSH session) and no later run removes it, unlike claude-code's dead-run clean-up; on SIGHUP the detached reviewer also keeps running, for both providers, because only SIGINT and SIGTERM are handled (cli-base.ts onInterrupt). Tried with a stand-in copilot: after SIGTERM the folder and the helper are gone, after SIGKILL and SIGHUP both stay.

## Why


## Acceptance


## Evidence

