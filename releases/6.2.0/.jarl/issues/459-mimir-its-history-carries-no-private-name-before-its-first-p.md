# 459 · Mimir: its history carries no private name before its first push

**Status:** open
**Kind:** cleanup
**Priority:** 1
**Tier:** strong
**Tags:** mimir, workplace, names, security, needs-owner
**Files:** Mimir
**Repo:** ../../../Mimir
**After:** 363, 426
**Found by:** owner
**Where:** Mimir's first build branch was never pushed; its files and some commit messages name companies and products from the owner's work, which the owner ruled may not be in the repository, history included

## What
Before Mimir's first push: the names rail of issue 363 scans every commit of the history; the words it finds are replaced by neutral ones in commit messages and in file contents across the whole history, keeping the tests' meaning, in a separate working copy and never in the main checkout. A backup bundle of the old history and a map of old to new commit hashes are kept privately first, because records point at the old hashes. The branch is swapped only after a green full run and on the owner's word. A one-time scan of the whole history is part of the acceptance and does not stay in the repository as a test.

## Why
A public repository's history is public for good once pushed; forks and caches keep it.

## Acceptance
- The owner's choice of the neutral words that replace private names, and whether host names of SSH aliases in fixtures count, is recorded before the rewrite
- The names rail finds nothing in any commit message or file of the rewritten history; the full suite on its tip is green with the same number of tests
- The backup and the hash map exist outside the repository; the swap happened on the owner's word; nothing was pushed by this issue

## Evidence

