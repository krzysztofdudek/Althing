# 676 · Yggdrasil: yg owner on a build file git ignores still names its node by path, while the relation pass now reads only the files git lists

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T2328-icrc
**Tags:** yggdrasil, relations
**Files:** 
**Repo:** Yggdrasil
**After:** 530
**Found by:** jarl
**Where:** w-530-sonnet, Runes 1.1.0 adoption report
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
After 235 an ignored build file takes no part in relations, so yg owner naming its node by path tells the user a file counts when it does not.

## Acceptance
[test] yg owner on a file git ignores says it takes no part in relations (or names no node for it), consistent with the relation pass, red before and green after · by: cd source/cli && npm test

## Changelog
- yg owner --file says when git ignores the file: for a file a component owns that git ignores, the answer adds that it takes no part in relations, as the relation check reads only the files git lists.

## Evidence

### Proof

- **ran (line 74802ddf8fe8):** cd source/cli && npx vitest run tests/e2e/relation-checkout-files.test.ts (before the fix) · **saw:** 1 failed, 3 passed: yg owner on an ignored file under a mapped directory named the node and said nothing of relations
- **ran (line 74802ddf8fe8):** cd source/cli && npx vitest run tests/e2e/relation-checkout-files.test.ts tests/unit/cli/owner.test.ts tests/e2e/cli-read-json.test.ts (after the fix) · **saw:** Tests 42 passed: the answer adds that the file is ignored by git and takes no part in relations; a listed file gets no such note

### Notes

Assumed: the note is added to the text answer of yg owner --file for any file a component owns and git ignores, not only build files, because the relation pass leaves out every ignored file. The yg-owner/1 and yg-owner-batch/1 documents keep their fields, since a new field changes a published contract; the --files text is unchanged.

