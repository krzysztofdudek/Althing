# 084 · Jarl: every issue carries a key, so the moves of two issues that took one number never mix, and a number taken twice is renumbered at the merge

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design, format
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-issue-key
**Where:**

## What
Ruling two-machines-caught-at-merge and report section 8: a log line names its issue by number only (scripts/lib/log.mjs:37-38) and numbering reads this checkout and its worktrees only, so two clones or two branches of one checkout give two issues one number and mix their moves beyond repair (031 detects and refuses; this makes it repairable).

## Why
Several sessions and machines on one loop is the shape Jarl is meant for; the record must never mix two issues.

## Acceptance
- new writes a key (the filing stamp and a few random characters) into the header and the filed line, and every log line about the issue carries it; unkeyed lines of older loops read by number as today
- Numbers are taken over every local and remote-tracking ref of the clone, not only this checkout and its worktrees
- After a merge that brings two issues with one number, renumber gives one of them a free number; the keys tell their moves apart and no history line is rewritten
- Lease lines name their writer; two leases with no move out between them, by different writers and with no takeover, show to the jarl as a conflict; verify refuses an issue file that holds git conflict markers
- Tests for two clones and for two branches of one checkout; red at 71ebc5b on two issues numbered 2 and verify clean

## Evidence

