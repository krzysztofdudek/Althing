# 533 · Jarl: the carry of a text the record already holds is tied to where that text stands in the line

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261109T1711-gojr
**Tags:** jarl, jarl-6.3.1, record
**Files:** JarlSkill/skills/jarl/scripts/lib/owner.mjs
**Repo:** JarlSkill
**Found by:** rev-531-fable
**Where:** skills/jarl/scripts/lib/owner.mjs:119
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
needNoNewOwnersWords takes a carried text out of every place in a line, not only the place where the record's own text stands. Issue 531 closed the known path by checking every writer's name where it is read. Tying the carry to the position would close the whole class.

## Why
A later line shape that puts an unchecked new text beside a carried old text would pass the guard again.

## Acceptance
[test] A carried text is removed only at the position it was written, and the same text elsewhere in the line is still refused · by: cd skills/jarl/scripts && npm test

## Evidence

### Proof

- **ran (line fdde6d18c876):** cd skills/jarl/scripts && nice -n 15 timeout 1800 systemd-run --user --scope -p MemoryMax=12G npm test · **saw:** ℹ tests 1855 · ℹ pass 1833 · ℹ fail 0 · ℹ skipped 22; exit 0 (on commit 79fcc23's code; the new test files of each issue were red on the commit before its fix and green after)

### Notes

Deferred: For the next release of Jarl: no known path remains after 531.

Assumed: a carried text is tied to its place by two expressions the writer gives, the part of the line before it must end with the first and the part after it must start with the second, because the five writers put it in five different places (the end of a row after a separator, a whole line, after "was" in a body line, a struck-through note, a question and its options). Nothing user-visible changes, so there is no changelog line. The suite row above ran on commit f78533c of jarl/540-jarl-6-3-1; the one later commit, 79fcc23, changes only how a test names its worktree directory (the path module instead of a split on a slash), and that file passes alone.

