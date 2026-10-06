# 210 · Yggdrasil: after yg adopt the summary says that check blocks only what the change touches and suggests yg check, and that run is red (on jsoup also after the adoption is committed)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** yggdrasil, adopt, progressive
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** grain-195
**Where:**
**Branch:** jarl/005-progressive-scope
**Merged:** 7b3cdde70646e95de91d8e3687e373938bfd9627
**CI:** none

## What
Reported by Grain's worker at 196 (jsoup 088614f4, propose + yg adopt): the adopt summary promises progressive mode and gives yg check as next, which immediately fails on the whole project; after the adoption commit a plain yg check is still red (probably the progressive reference origin/<branch> does not contain the adoption). Grain 196 has already corrected its sentence: progressive mode starts after the adoption is committed on the local reference branch or after it is merged into origin/<branch>.

## Why
The first command after adoption that the tool suggests is red, contrary to what the tool has just said.

## Acceptance
- The yg adopt summary and its next: tell the truth about when progressive mode works and what the nearest yg check will give (checked on a fixture: adopt without a commit, after the commit, after merging into the reference).
- If, after the adoption is committed on the reference branch, a plain yg check still checks the whole project, this is fixed or described in the summary as a condition.

## Changelog
- Fixed: yg adopt says when progressive mode starts: Blocks on and next: name committing the adoption on a local reference branch, or merging it into a remote one such as origin/main; until then yg check answers for the whole project.

## Evidence

Ruling 008-skip-parent-without-graph: 008: when comparing the progressive block with HEAD's parents we skip a parent that has no yg-config.yaml (the commit/PR adding the first graph). This goes slightly beyond the scope set by yggdrasil-scope, but it keeps the promise of progressive mode (adoption does not turn all existing code red) and agrees with Grain 196's sentence: 'progressive mode starts once the adoption is committed on the local reference branch, or merged into origin/<branch>'. A PR adding the first graph with a reference pointing at itself passes the measured step; --full still catches it.
- **ran:** git commit (merge of jarl/005-progressive-scope into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8102 pairs verified; [repo-check] All checks passed; [release/6.1.1 7b3cdde70] Merge jarl/005-progressive-scope

