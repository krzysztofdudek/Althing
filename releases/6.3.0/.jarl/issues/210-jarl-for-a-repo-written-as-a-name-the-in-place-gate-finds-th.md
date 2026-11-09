# 210 · Jarl: for a Repo written as a name, the in-place gate finds the repository through loopHome and mainCheckoutOf, which run git with a hook's GIT_DIR still set

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261108T1531-fiwb
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-204-opus-n2
**Where:** lib/repositories.mjs loopHome, mainCheckoutOf

## What
The in-place gate now asks git without a hook's variables, but the lookup of the repository a Repo name stands for still runs git with them.

## Why


## Acceptance
loopHome and mainCheckoutOf run git without the variables a hook sets, with a test that sets GIT_DIR

## Evidence

Dropped: absorbed by piece 2 (issue 226), landed

