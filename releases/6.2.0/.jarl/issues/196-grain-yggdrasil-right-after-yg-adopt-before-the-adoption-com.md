# 196 · Grain/Yggdrasil: right after yg adopt, before the adoption commit, a plain yg check checks the whole project and fails — the propose sentence about progressive mode is true only after the commit

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** grain, yggdrasil, adopt
**Files:** Grain/plugins/grain/engine/propose-report.mjs
**Repo:** ../../../Grain, ../../../Yggdrasil
**Found by:** grain-157
**Where:**
**Branch:** jarl/195-propose-truth
**Merged:** c85cdc9
**CI:** none

## What
Propose says 'progressive mode keeps them as warnings until touched', but before the adoption is committed, a plain yg check answers for the whole project and ends with errors.

## Why
The first run after adoption looks red, although the user did everything by the instructions.

## Acceptance
The propose report and next: after adopt say that progressive mode works from the adoption commit (or yg check treats an uncommitted adoption progressively); test.

## Changelog
- Fixed: grain propose no longer says pre-existing violations are warnings right after yg adopt; it says progressive mode starts once the adoption is committed on the reference branch, or merged into the remote's branch, and that until then yg check answers for the whole repository.

## Evidence

docs: plugins/grain/commands/propose.md (enforced bullet) and docs/reference.md (propose, progressive paragraph): say the pre-existing sites are warnings only once the adoption is in the progressive reference (committed on the local branch, or merged into origin/<branch>); until then yg check answers for the whole repository

jsoup 088614f4 after yg adopt: plain yg check exit 1 'This change reaches the whole project' (24 errors) both before and after committing the adoption (reference origin/master). Yggdrasil side (not changed): yg adopt's 'Blocks on only what a change reaches' plus 'next: yg check' leads to that red run. Test tests/propose-progressive-from-adoption.test.mjs red 0/2 on old report, green 2/2 (local ref: red before commit, green after; origin/main: red after commit, green once in origin/main).
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2245, pass 2244, fail 0, skipped 1, merge c85cdc9

