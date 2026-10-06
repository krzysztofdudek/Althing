# 186 · Grain: grain spectrum on a file from a submodule judges it by the outer repository's index

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, submodule
**Files:** Grain/plugins/grain/engine/spectrum.mjs
**Repo:** ../../../Grain
**After:** 058
**Found by:** grain-058
**Where:**
**Branch:** jarl/145-cli-followups
**Merged:** f1f919b
**CI:** none

## What
After 058 the hooks and check leave a submodule file to its own repository, but grain spectrum still judges it by the outer index (ky: Ky.ts — 'THIS FILE DEVIATES').

## Why
The same bug as 058 in another command.

## Acceptance
spectrum uses the helper from engine/hook-context.mjs and on a file from a submodule refuses or stays silent; test.

## Changelog
- Fixed: grain explain (and spectrum) on a file inside a submodule or a nested repository no longer judges it against the outer repository; it says to ask from inside that repository instead.

## Evidence

red: tests/spectrum-submodule.test.mjs on the unfixed engine: 2 fail (spectrum libs/sub/app/m.ts exit 0 judging against the outer index; vendor/clone file answered 'no partition covers'). green after the commit: 3/3, check-hook.test.mjs alongside 9/9 total
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2128, pass 2127, fail 0, skipped 1, merge f1f919b

