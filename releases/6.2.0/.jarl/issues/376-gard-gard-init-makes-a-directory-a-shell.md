# 376 · Gard: gard init makes a directory a shell

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, shell
**Files:** Gard/src/shell/init.mjs, Gard/src/shell/gitignore.mjs, Gard/test/init.test.mjs
**Repo:** ../../../Gard
**After:** 375
**Found by:** owner
**Where:** Mimir at 10257cd: the managed block of a parent's .gitignore for nested repos (issue M103 of Mimir's first loop) is the model

## What
gard init initialises git in the directory when it has none, writes a minimal gard.yaml and a managed block in the shell's .gitignore that lists every declared repo directory and .worktrees/; the block is added, updated and removed by Gard, and lines written by hand outside it are left alone. Running it again changes nothing. It never runs inside a code repository, and it refuses a directory that is already the working tree of a code repository with the fix (run it one level up).

## Why
A shell starts in one move, and the shell's git must never take in a team's code by accident.

## Acceptance
- A test runs init twice on an empty directory and on one with a hand-written .gitignore; the second run changes nothing and hand-written lines stay
- init inside a code repository is refused with its fix, and that repository's git status is unchanged

## Evidence

