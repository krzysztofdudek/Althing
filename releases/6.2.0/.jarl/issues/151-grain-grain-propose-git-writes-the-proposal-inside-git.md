# 151 · Grain: grain propose .git writes the proposal inside .git/

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** grain, propose
**Files:** Grain/plugins/grain/engine/grain-export.mjs
**Repo:** ../../../Grain
**After:** 037
**Found by:** grain-037
**Where:**
**Branch:** jarl/059-small-cli-truths
**Merged:** f905da4
**CI:** none

## What
After 037 and 038 the output directory guard does not reject '.git' (or any other letter case): grain propose .git writes the proposal into the git directory.

## Why
Writing into .git/ can damage the repository or leave junk that git will not show.

## Acceptance
grain propose rejects an output directory that is .git or lies inside it (in any letter case, also through a relative path); a test.

## Changelog
- Fixed: grain propose refuses to write a proposal into the repository's git directory (.git in any letter case, through a symlink, or a git directory kept outside the work tree), instead of writing there unseen.

## Evidence

docs: docs/reference.md: propose, paragraph "The out-dir defaults to .yggdrasil-proposal/...": add that the command also refuses the repository's git directory or anything inside it (.git in any letter case, through a symlink, or a git directory kept outside the work tree).
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2092, pass 2091, fail 0, skipped 1, merge f905da4

