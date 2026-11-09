# 167 · Grain: grain check and review still parse binary files and files over the size limit

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T1112-mdsw
**Tags:** grain, check
**Files:** Grain/plugins/grain/engine/check.mjs
**Repo:** ../../../Grain
**After:** 100, 104
**Found by:** grain-100
**Where:**
**Branch:** jarl/167-check-truth
**Merged:** 87c0ef3
**CI:** none

## What
After 100 and 119 the index skips binary files with a code extension and files over 1.5 million characters, but the check/review path (check.mjs) still parses them — the same cost and the same risk of a dead parser runtime when such a file is edited.

## Why
The after-edit hook and review can hang or produce junk on a *.ts video segment.

## Acceptance
check and review treat binary and over-limit files the same way the index does (named as not parsed); a test.

## Changelog
- Fixed: check and review no longer parse a binary file with a code extension or a source file over 1.5 million characters; they say the file was not parsed and why, as the index does. The after-edit note skips such a file silently.

## Evidence

docs: docs/reference.md (check, review): a file the index does not parse (binary with a code extension, or over 1.5 million characters) is not parsed by check or review either; check answers 'not parsed' with the reason (--json: notParsed binary|size and a not-parsed disclosure), review names it under the file's heading without counting it as a finding. Red→green: tests/check-unparsed-like-index.test.mjs 0/3 → 3/3 (commit 7482e46).
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2239, pass 2238, fail 0, skipped 1, merge 87c0ef3

