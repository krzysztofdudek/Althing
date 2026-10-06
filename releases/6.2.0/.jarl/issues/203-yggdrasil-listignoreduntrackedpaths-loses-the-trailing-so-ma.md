# 203 · Yggdrasil: listIgnoredUntrackedPaths loses the trailing '/', so marketplace check does not recognise an ignored directory

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, walk
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-004
**Where:**
**Branch:** jarl/166-ignores-and-leftovers
**Merged:** d63857afc4f7750c2502c67c314d60f4bcc7385d
**CI:** none

## What
Reported by the worker of package 004 (walk-mapping).

## Why



## Acceptance
An ignored directory is recognised by marketplace check; test red→green.

## Changelog
- Fixed: yg marketplace check sees a package inside a directory git ignores as a whole and refuses it, as the install would.

## Evidence

- **ran:** git commit (merge of jarl/166-ignores-and-leftovers into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.25%; [repo-check] All checks passed; [release/6.1.1 d63857afc] Merge jarl/166-ignores-and-leftovers

