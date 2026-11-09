# 205 · Yggdrasil: a second merge-resolve after amending a local merge says to remove its own merge entry as fabricated

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261002T1952-mzzj
**Tags:** yggdrasil, merge
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-023
**Where:**
**Branch:** jarl/206-adopt-and-merge-truth
**Merged:** d775399cfe7271bb59459995e29ff6706bcaac7e
**CI:** none

## What
The reviewer of package 023 (round 2): the behaviour is the same as in 6.1.0; an amend of the local merge, then a second yg log merge-resolve.

## Why



## Acceptance
A second merge-resolve after an amend does not mark the owner's entry as fabricated; test red→green.

## Changelog
- Fixed: yg log merge-resolve run again on a merge you amended no longer calls your own entry fabricated; an entry added after the merged log was recorded is accepted and the recorded baseline kept.

## Evidence

- **ran (history):** git commit (merge of jarl/206-adopt-and-merge-truth into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8174 pairs verified; coverage branches 90.65%; [repo-check] All checks passed; [release/6.1.1 d775399cf] Merge jarl/206-adopt-and-merge-truth

