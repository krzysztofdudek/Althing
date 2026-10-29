# 404 · Gard: gard gate install, uninstall and doctor

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, git-gate
**Files:** Gard/src/gate/install.mjs, Gard/src/gate/doctor.mjs, Gard/test/gate-install.test.mjs
**Repo:** ../../../Gard
**After:** 402
**Found by:** owner
**Where:** Mimir at 10257cd: after npm install, husky or lefthook may reset core.hooksPath or the stubs; mimir doctor reports it

## What
install chooses plain or chain mode per repository and per worktree and says which; uninstall removes exactly what Gard installed and restores a hook manager's path; doctor reports a stub that was replaced, a core.hooksPath that a hook manager reset, and a rule directory that is missing, each with its fix. Installing twice changes nothing.

## Why
A gate that silently stopped running after an npm install is a false green.

## Acceptance
- Tests install into a husky and a lefthook fixture, simulate the manager's reset and see doctor report it with gard gate install as the fix
- uninstall leaves each fixture's hooks as they were before install

## Evidence

