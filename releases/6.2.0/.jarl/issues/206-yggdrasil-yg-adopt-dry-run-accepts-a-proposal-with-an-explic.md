# 206 · Yggdrasil: yg adopt --dry-run accepts a proposal with an explicitly named, non-existent file inside .yggdrasil/, which the real adopt rejects

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, adopt
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-002
**Where:**
**Branch:** jarl/206-adopt-and-merge-truth
**Merged:** d775399cfe7271bb59459995e29ff6706bcaac7e
**CI:** none

## What
The reviewer of package 002 (034): a case with a mapping of an explicitly named file under the graph directory that does not exist; the preview says would accept, the real adopt refuses after the move. Documented as a known limitation.

## Why



## Acceptance
The preview and the real adopt give the same result for an explicitly named file under .yggdrasil/; test red→green.

## Changelog
- Fixed: yg adopt --dry-run refuses a proposal that names a file inside .yggdrasil/ it does not carry, with the same mapping-path-missing the acceptance refuses it with.

## Evidence

- **ran:** git commit (merge of jarl/206-adopt-and-merge-truth into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8174 pairs verified; coverage branches 90.65%; [repo-check] All checks passed; [release/6.1.1 d775399cf] Merge jarl/206-adopt-and-merge-truth

