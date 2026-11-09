# 303 · Yggdrasil: a rebase that keeps the original dates, and a fill before the commit of a squash or a merge --no-commit, read as green though the log owes an entry

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2328-pdfg
**Tags:** yggdrasil, log
**Files:** Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-221-opus
**Where:** source/cli/src/core/log/log-merge-resolve.ts:1167 (the combining commit's date test); CHANGELOG.md:53, docs/the-lock.md:181
**After:** 221

## What


Two states read as green though the log owes an entry. (1) After git rebase --committer-date-is-author-date main, check gives PASS with only log-cycle-open, for one commit and for three; yg check --approve then closes the cycle on an entry carried over from the branch. The gate compares the newest entry with the combining commit's committer date (:1167); with one commit the newest entry is the one from main (the first parent), so a simple rule that the first parent's entry is always owed would catch it. The docs name only a clock set on the writing machine. (2) After git merge --squash feature and yg check --approve BEFORE the squash commit, the baseline becomes the newest entry of the branch and the committed squash is green; the same gap exists with merge --no-commit (189), so it predates 221/242. One issue for both.

## Why


A replayed entry must never read as written for the combination; both states hide exactly the entry the message asks for.

## Acceptance


- Red-to-green e2e tests in a scratch repository for the rebase with kept dates (one and three commits) and for the fill before a squash or merge commit.
- The CHANGELOG and docs say what is detected and what the remaining limit is.

## Evidence

