# 002 · Yggdrasil adopt: the adoption entry lands on an arbitrary node, the shallowest one alphabetically

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** yggdrasil, adopt
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** grain-6.1.1-patch
**Where:** source/cli (adopt-transaction.ts, rootComponentPath)
**Branch:** jarl/002-adopt
**Merged:** aa73c10ef2b19f5fe1634c9bd1f5a74841433109
**CI:** none

## What
On yg adopt the adoption log entry lands on the shallowest component, and a tie is settled by alphabetical order. Grain's proposals have several nodes at the top, so the entry lands on __tests__, dot-github or docs; even Yggdrasil's own graph would get cli instead of the root node.

## Why
The adoption record (where the baseline came from, when, by whom) should sit on the node that represents the whole repository, otherwise it gets lost in an arbitrary component. Grain cannot fix this alone without changing the identifiers of all nodes.

## Acceptance
The adoption entry lands on the node of type project or on the one that maps files from the repository root; when there is no such node, the choice is deterministic and described.

## Changelog
- Fixed: `yg adopt` records the acceptance on the component that stands for the whole repository — a component of type `project`, else one mapping files at the repository root, else the shallowest (ties by name) — instead of whichever top-level component sorted first; `--dry-run` names the same one.

## Evidence

- **ran:** git commit (merge of jarl/002-adopt into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 aa73c10ef] Merge jarl/002-adopt

