# 204 · Yggdrasil: the agent instructions (rules) still say that the walk skips what .gitignore excludes — after 004/068 it skips only untracked ignored files

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, docs
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-004
**Where:**
**Branch:** jarl/166-ignores-and-leftovers
**Merged:** d63857afc4f7750c2502c67c314d60f4bcc7385d
**CI:** none

## What



## Why



## Acceptance
The text of the agent instructions describes the behaviour after 004/068: tracked files under a .gitignore rule stay in the graph.

## Changelog
- Fixed: yg prime says which ignored files a mapping leaves out — a tracked file matched only by an ignore rule from outside the project stays in the graph.

## Evidence

- **ran:** git commit (merge of jarl/166-ignores-and-leftovers into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.25%; [repo-check] All checks passed; [release/6.1.1 d63857afc] Merge jarl/166-ignores-and-leftovers

