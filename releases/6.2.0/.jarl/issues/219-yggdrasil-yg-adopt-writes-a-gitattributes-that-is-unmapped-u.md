# 219 · Yggdrasil: yg adopt writes a .gitattributes that is unmapped under coverage.required ["/"], so yg check after adoption is red on a file the tool added itself

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261003T1507-lkue
**Tags:** yggdrasil, adopt
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-066
**Where:**
**Branch:** jarl/206-adopt-and-merge-truth
**Merged:** d775399cfe7271bb59459995e29ff6706bcaac7e
**CI:** none

## What
The worker of package 066 (083): e2e fixture 4 had to exclude .gitattributes, because yg adopt writes it, and under coverage.required ["/"] the file is unmapped.

## Why
The first check after adoption fails on a file that yg itself added — a false red on the adoption path.

## Acceptance
The file(s) that yg adopt/yg init writes in the repo (.gitattributes and similar) do not cause unmapped in yg check under coverage.required ["/"] — they are mapped/exempted by the graph or reported as tool files; an e2e test without the exclusion in the fixture.

## Changelog
- Fixed: the first yg check after yg adopt no longer fails on the .gitattributes the acceptance wrote; when no component maps it and the file is Yggdrasil's own (created by the acceptance or holding only its lines), yg adopt adds it to coverage.excluded as a fresh yg init does. An owner's .gitattributes stays covered and the summary says the check will report it.

## Evidence

- **ran (history):** git commit (merge of jarl/206-adopt-and-merge-truth into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8174 pairs verified; coverage branches 90.65%; [repo-check] All checks passed; [release/6.1.1 d775399cf] Merge jarl/206-adopt-and-merge-truth

