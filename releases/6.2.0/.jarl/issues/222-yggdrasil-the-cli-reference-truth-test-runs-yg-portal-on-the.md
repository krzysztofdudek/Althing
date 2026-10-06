# 222 · Yggdrasil: the cli-reference-truth test runs yg portal on the fixed port 4317, so parallel gates collide; cli-lock-scope '2:' is sometimes unstable under load

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, tests
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-166
**Where:**
**Branch:** jarl/221-rebase-squash-and-ports
**Worker:** ygg-221-small
**Worktree:** /home/node/wt/221-small
**Since:** 2026-10-05 13:00

## What
The worker of package 166: the hook failed twice because of a port 4317 collision between parallel gates; cli-lock-scope '2:' failed once under load.

## Why



## Acceptance
Portal tests take a free port (0 / random) instead of a fixed one; cli-lock-scope stable under load without weakening the assertions.

## Evidence


