# 222 · Yggdrasil: the cli-reference-truth test runs yg portal on the fixed port 4317, so parallel gates collide; cli-lock-scope '2:' is sometimes unstable under load

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, tests
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-166
**Where:**
**Branch:** jarl/221-rebase-squash-and-ports
**Merged:** 993ad064a7f9504087b4d824157431cdef68752c in ../../../Yggdrasil
**CI:** pending

## What
The worker of package 166: the hook failed twice because of a port 4317 collision between parallel gates; cli-lock-scope '2:' failed once under load.

## Why



## Acceptance
Portal tests take a free port (0 / random) instead of a fixed one; cli-lock-scope stable under load without weakening the assertions.

## Evidence


- **ran:** devcontainer: cd source/cli && npm test (the repository hook on the merge commit, with coverage) · **saw:** the hook's repo-check passed with coverage above the 90.2% bar, merge 993ad064a

