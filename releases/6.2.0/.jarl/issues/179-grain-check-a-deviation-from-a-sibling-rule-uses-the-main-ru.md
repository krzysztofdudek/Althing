# 179 · Grain check: a deviation from a sibling rule uses the main rule's data (the 'local default' sentence, the pattern pointer, the See: list); the main rule's n is computed from a share rounded to 3 places; '+N more … --all' points to --all, which does not show those lines

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, check
**Files:** Grain/plugins/grain/engine/check.mjs, Grain/plugins/grain/engine/grain-check.mjs
**Repo:** ../../../Grain
**After:** 104
**Found by:** grain-104
**Where:**
**Branch:** jarl/167-check-truth
**Merged:** 87c0ef3
**CI:** none

## What
After 104/105/113: on a deviation from a sibling rule, the sentence about the local default, the pattern pointer and the See: list come from the main rule and are not checked against the sibling; the main rule's n is computed from a share rounded to 3 decimal places, so with ~500+ scopes the printed n is sometimes off by 1 or more (check.mjs and the read hook); the line '+N more … --all' refers to --all, which does not show those lines.

## Why
The check report gives numbers and hints that do not concern the rule being broken.

## Acceptance
A deviation from a sibling rule prints only that rule's data; n is computed from counts, not from a rounded share; --all shows the promised lines or the message does not promise them; tests.

## Changelog
- Fixed: when check reports a departure from a companion rule, it no longer borrows the main rule's local-default note, examples, history note or maintainer decision; its counts are exact on large codebases; and --all now lists every unclassified group the '+N more' line points to.

## Evidence

Red→green: tests/check-sibling-own-data.test.mjs 0/4 → 4/4 (commit 64540ce). Needs: MODEL_V (siblings gain parentExp and exemplars). docs: none.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2239, pass 2238, fail 0, skipped 1, merge 87c0ef3

