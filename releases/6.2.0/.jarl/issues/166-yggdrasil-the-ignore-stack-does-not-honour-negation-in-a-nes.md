# 166 · Yggdrasil: the ignore stack does not honour negation (!) in a nested .gitignore and matches regardless of letter case

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** yggdrasil, walk
**Files:** Yggdrasil/source/cli/src/io/gitignore.ts
**Repo:** ../../../Yggdrasil
**After:** 004
**Found by:** rev-grain-035
**Where:**
**Branch:** jarl/166-ignores-and-leftovers
**Merged:** d63857afc4f7750c2502c67c314d60f4bcc7385d
**CI:** none

## What
The reviewer of 035 checked on yg 6.1.0: a negated pattern in a nested .gitignore (e.g. '!keep.txt' under a directory ignored higher up) does not restore a file git tracks, and ignore matching disregards letter case, which git does not do on a case-sensitive system. The result depends on the machine; Grain after 035 subtracts the files git ignores, so the two tools diverge.

## Why
A file git treats as ordinary may be taken as ignored by Yggdrasil (or the other way round): inconsistent coverage and different results on Linux and macOS.

## Acceptance
Yggdrasil's ignore stack gives the same answers as git check-ignore for negation in nested .gitignore files and for letter case (following core.ignorecase); a comparison test against git.

## Changelog
- Fixed: what .gitignore files ignore is read as git reads it — a !pattern in a nested .gitignore re-includes a file, and letter case counts unless the repository sets core.ignorecase.

## Evidence

- **ran:** git commit (merge of jarl/166-ignores-and-leftovers into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.25%; [repo-check] All checks passed; [release/6.1.1 d63857afc] Merge jarl/166-ignores-and-leftovers

