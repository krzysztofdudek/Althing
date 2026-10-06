# 214 · Yggdrasil portal: the counter of imports supporting a declared relation includes imports into nested nodes of a forbidden type (after 065)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, portal, relations
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-065
**Where:**
**Branch:** jarl/031-portal
**Merged:** 4fdb0779fba283544076fa447532c9abb13a1c62
**CI:** none

## What
Reported by the worker of package 065: after the ancestor sanction was tightened, the portal still counts imports that check no longer accepts.

## Why



## Acceptance
The portal counts only imports that check considers covered by the relation; test red→green.

## Changelog
- Fixed (folded into 065's Before-you-upgrade entry): the portal's relations view and yg advise no longer count an import of a nested component of a forbidden type as backing a relation to its parent, matching yg check.

## Evidence

- **ran:** git commit (merge of jarl/031-portal into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8113 pairs verified; [repo-check] All checks passed; [release/6.1.1 4fdb0779f] Merge jarl/031-portal

