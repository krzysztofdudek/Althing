# 303 · Yggdrasil: a rebase that keeps the original dates, and a fill before the commit of a squash or a merge --no-commit, read as green though the log owes an entry

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2328-pdfg
**Tags:** yggdrasil, log
**Files:** Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts, Yggdrasil/source/cli/src/cli/merge-driver.ts
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-221-opus
**Where:** source/cli/src/core/log/log-merge-resolve.ts:1167 (the combining commit's date test); CHANGELOG.md:53, docs/the-lock.md:181
**After:** 221
**Branch:** jarl/302-log-merge-integrity
**Worker:** w-302-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 10:21

## What


Two states read as green though the log owes an entry. (1) After git rebase --committer-date-is-author-date main, check gives PASS with only log-cycle-open, for one commit and for three; yg check --approve then closes the cycle on an entry carried over from the branch. The gate compares the newest entry with the combining commit's committer date (:1167); with one commit the newest entry is the one from main (the first parent), so a simple rule that the first parent's entry is always owed would catch it. The docs name only a clock set on the writing machine. (2) After git merge --squash feature and yg check --approve BEFORE the squash commit, the baseline becomes the newest entry of the branch and the committed squash is green; the same gap exists with merge --no-commit (189), so it predates 221/242. One issue for both.

## Why


A replayed entry must never read as written for the combination; both states hide exactly the entry the message asks for.

## Acceptance


- Red-to-green e2e tests in a scratch repository for the rebase with kept dates (one and three commits) and for the fill before a squash or merge commit.
- The CHANGELOG and docs say what is detected and what the remaining limit is.

## Changelog
- yg log merge-resolve refuses --ours/--theirs holding the same log (log-merge-sides-identical) and sides none of which holds the recorded history (log-merge-history-rewritten); a rebase that keeps original dates, and a fill before a squash or merge --no-commit is committed, now ask for the entry the combination owes; logs checked out with CRLF line endings are compared with git's LF copies the same way, and merge-resolve advises the eol=lf attribute where none is set.

## Evidence

### Proof

- **ran (line 05fcf0404887):** git rebase --committer-date-is-author-date main (1 and 3 commits), git merge --squash / --no-commit then yg check --approve, in scratch repositories; then e2e 13/13b and log-combined-history unit tests before and after the fix · **saw:** before: yg check PASS with only log-cycle-open in all four; tests 13 x2, 13b x2 and 4 unit cases fail; after: log-entry-missing, fill records nothing, an entry written after settles it; all pass

### Notes

Assumed: an entry the combining commit's parent already held always owes the entry (the issue's suggested rule), not every entry the combining commit holds, because an existing test pins an entry inside the combining commit dated after it as written for the combination. Remaining limit, documented in CHANGELOG and the-lock.md: a rebase that keeps dates of several commits whose newest entry came with a later replayed commit (the f1, main, f2, f3 interleaving) still reads as green with log-cycle-open; dates and committed data cannot tell it from an entry written after the rebase. A squash in progress is read from SQUASH_MSG's first commit line.

