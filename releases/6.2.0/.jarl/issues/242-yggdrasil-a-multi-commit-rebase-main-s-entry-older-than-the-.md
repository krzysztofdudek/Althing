# 242 · Yggdrasil: a multi-commit rebase (main's entry older than the branch's second-to-last entry) gives log-integrity with advice that does not remove it, although the documentation says it is handled

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** yggdrasil, merge, log
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-221
**Where:**
**Branch:** jarl/221-rebase-squash-and-ports
**Worker:** ygg-221-small
**Worktree:** /home/node/wt/221-small
**Since:** 2026-10-05 16:22

## What
The reviewer of package 221: a rebase of a branch with several log entries onto a main whose newest entry is older than the branch's second-to-last entry gives error[log-integrity]; the advice given (merge-resolve / log add) does not remove the error. State from before package 221; the documentation (the-lock.md, log-management) claims that rebase is handled (024).

## Why
Honest work on a branch ends with a red check and no way out — a false red that the user cannot fix.

## Acceptance
A multi-commit rebase with interleaved entry dates (the reviewer's scenario) either passes or gives an error with advice that actually removes it (an e2e test runs the advice and gets a green check); the documentation tells the truth about what is handled.

## Evidence


