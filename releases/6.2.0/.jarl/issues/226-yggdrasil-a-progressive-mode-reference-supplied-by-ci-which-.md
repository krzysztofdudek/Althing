# 226 · Yggdrasil: a progressive-mode reference supplied by CI, which a branch cannot move (the full 008)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-rnqt
**Tags:** yggdrasil, progressive, partial
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Source:** decisions#yggdrasil-scope
**Where:**
**After:** 021, 028
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:54

## What
In 6.1.1 (008) a reference relative to HEAD falls back to the whole project, and the progressive block is compared with HEAD's parents (including those of a merge commit). One case remains: moving the reference to one's own branch, spread over several pushed commits, passes once on a push build; the full closure (a reference supplied by CI) deferred to 6.2.0.

## Why
A branch can weaken its own gate; this is a false green in the tool's main promise.

## Acceptance
- yg check accepts a reference from outside (a flag and an environment variable, documented for GitHub Actions and general CI); when it is given, it wins over the block from yg-config.yaml, and a change of the block in a branch without that reference's agreement ends in a check of the whole project with a message.
- e2e test: moving the reference to one's own branch in several commits on a push build with a reference from CI gives FAIL; an ordinary PR and main after a merge pass; Grain's sentence about progressive mode stays true or is corrected in the same release.

## Evidence


