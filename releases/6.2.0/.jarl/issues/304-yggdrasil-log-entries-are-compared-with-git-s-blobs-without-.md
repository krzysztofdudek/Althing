# 304 · Yggdrasil: log entries are compared with git's blobs without line-ending normalisation, and a log with CRLF in a clone without the eol attribute warns forever

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2328-tzvg
**Tags:** yggdrasil, log
**Files:** Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts, Yggdrasil/source/cli/src/cli/merge-driver.ts
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-221-opus
**Where:** source/cli/src/core/log/log-merge-resolve.ts and the check of merge sides
**After:** 221
**Branch:** jarl/302-log-merge-integrity
**Worker:** w-302-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 10:21

## What


Entries read from the working copy are compared with git's blobs without line-ending normalisation. Without log.md text eol=lf in .gitattributes (a repository initialised before 6.1.0), a log with CRLF returns the warning again after every check. init writes the attribute, which normally prevents this.

## Why


A warning that cannot be cleared teaches users to ignore it.

## Acceptance


The comparison normalises line endings (or reads through git's own conversion), with a test using an eol=crlf attribute; an old repository without the attribute gets one line of advice to add it.

## Changelog
- yg log merge-resolve refuses --ours/--theirs holding the same log (log-merge-sides-identical) and sides none of which holds the recorded history (log-merge-history-rewritten); a rebase that keeps original dates, and a fill before a squash or merge --no-commit is committed, now ask for the entry the combination owes; logs checked out with CRLF line endings are compared with git's LF copies the same way, and merge-resolve advises the eol=lf attribute where none is set.

## Evidence

### Proof

- **ran (line 066e7409acc3):** e2e 14 (eol=crlf attribute: rebase and conflicted merge) and 14b (no attribute, core.autocrlf), unit log-line-endings and log-combined-history CRLF cases, before and after the fix · **saw:** before: rebase passed with log-cycle-open, merge-resolve refused log-merge-history-rewritten, 5 unit cases fail; after: log-entry-missing, merge-resolve exit 0, one note: line naming /.yggdrasil/**/log.md text eol=lf only without the attribute; all pass

### Notes

Assumed: the one line of advice is a note: printed by yg log merge-resolve (single log and post-merge form) when the working-tree log has CR line endings and git check-attr eol is unspecified; yg check prints none, since with normalised comparisons nothing there misbehaves any more.

