# 189 · Yggdrasil: yg check points to merge-resolve when a merge commit made in this clone has an older log baseline (rebase, squash, merge after a conflict)

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1550-oybi
**Tags:** yggdrasil, 6.2
**Files:** Yggdrasil/source/cli/src/core/log-integrity.ts
**Repo:** ../../../Yggdrasil
**After:** 024
**Found by:** ygg-023
**Where:**
**Branch:** jarl/206-adopt-and-merge-truth
**Merged:** d775399cfe7271bb59459995e29ff6706bcaac7e
**CI:** none

## What
After 024, a rebase, a squash and a merge stopped on a conflict give only a log-cycle-open warning instead of demanding a merge entry; yg log merge-resolve on such a commit demands an entry, but nothing leads to it.

## Why
The merge log entry is easy to skip.

## Acceptance
yg check on such a commit points to yg log merge-resolve as next; test.

## Changelog
- Fixed: after a merge that stopped on a conflict (or a merge made in a clone without the post-merge hook), yg check reports the entry the merge owes as log-entry-missing and yg check --approve records nothing over it; both point at yg log merge-resolve --node <node>. Merges only; rebase and squash are unchanged.

## Evidence

Ruling 189-merge-only: 189 in 6.1.1 covers a merge made in this clone (including one stopped on a conflict): yg check and yg check --approve demand a merge entry. Rebase and squash (with no merge commit) move to a separate issue 221, because they leave no trace in history by which they could be recognised the same way.
- **ran (history):** git commit (merge of jarl/206-adopt-and-merge-truth into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8174 pairs verified; coverage branches 90.65%; [repo-check] All checks passed; [release/6.1.1 d775399cf] Merge jarl/206-adopt-and-merge-truth

posix-path follow-up 7d330bdca merged into release/6.1.1 at f5717cd77, gate green (branches 90.65%)

