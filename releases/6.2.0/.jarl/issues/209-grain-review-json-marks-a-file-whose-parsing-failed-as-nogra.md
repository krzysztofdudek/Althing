# 209 · Grain: review --json marks a file whose parsing failed as noGrammar; where cards show the main rule's share and patterns next to the sibling rule's sentence

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261002T2032-ettm
**Tags:** grain, check
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-167
**Where:**
**Branch:** jarl/146-status-selftest-output
**Merged:** 3ed1f82
**CI:** none

## What
Reported by the worker of package 167 (two small output mismatches).

## Why



## Acceptance
review --json distinguishes a missing grammar from a failed parse; the where card next to the sibling rule's sentence shows that rule's data; tests red→green.

## Changelog
- Fixed: review --json reports a file it could not parse as a parse failure instead of a file with no grammar, and where no longer prints one rule's share and history next to a related rule's sentence.

## Evidence

docs: docs/reference.md (review --json): a finding entry may carry parseFailed: true with a parse-failed disclosure, beside noGrammar and notParsed
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2267, pass 2266, fail 0, skipped 1, merge 3ed1f82

