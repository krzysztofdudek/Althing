# 381 · Gard: a view holds a worktree of the shell itself when a change touches it

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, worktrees, drift
**Files:** Gard/src/worktree/shell-view.mjs, Gard/test/worktree-shell.test.mjs
**Repo:** ../../../Gard
**After:** 379
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section Layout: when a change also touches the shell

## What
gard worktree add --shell makes the view directory itself a worktree of the shell on the view's branch, with the repo worktrees inside it in their ignored directories, so the view's container is built from the shell in that state. A view without --shell uses the shell's main checkout for its definitions. The pair of branches (code and shell) is recorded.

## Why
A change of the application that also changes its environment (a new service, a new check) must be tried and merged as one.

## Acceptance
A test makes a view with --shell, changes the container definition in it and shows that the view's generated container differs from the main checkout's

## Evidence

