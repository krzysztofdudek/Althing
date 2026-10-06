# 221 · Yggdrasil: after a rebase or squash (with no merge commit) a missing required log entry gives only a warning — 189 covered only merge

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, merge
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-206
**Where:**
**Branch:** jarl/221-rebase-squash-and-ports
**Worker:** ygg-221-small
**Worktree:** /home/node/wt/221-small
**Since:** 2026-10-05 13:00

## What
The reviewer of package 206 (189): the title of 189 names rebase and squash; the fix covers a merge made in this clone. Rebase and squash leave no merge commit, so check only warns.

## Why



## Acceptance
After a rebase or squash that joins log history with an older baseline, yg check (and --approve) demands an entry or merge-resolve just as after a merge; test red→green.

## Changelog
- Fixed: after a rebase, a pull --rebase or a squash merge that combined two branches' entries in a log_required component's log, yg check reports the entry it owes as log-entry-missing (in any clone, once committed) and yg check --approve records nothing over it; an entry of its own settles it, or yg log merge-resolve --node <node> --ours <ref> --theirs <ref> first. A rebase that combined no log asks for nothing.

## Evidence

Ruling 189-merge-only: 189 in 6.1.1 covers a merge made in this clone (including one stopped on a conflict): yg check and yg check --approve demand a merge entry. Rebase and squash (with no merge commit) move to a separate issue 221, because they leave no trace in history by which they could be recognised the same way.

