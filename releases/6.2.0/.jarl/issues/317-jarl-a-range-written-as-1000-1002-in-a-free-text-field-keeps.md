# 317 · Jarl: a range written as 1000-1002 in a free-text field keeps its first id when ids in text are read

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261018T1718-uclk
**Tags:** jarl, ids
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/ids.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** rev-p2-opus
**Where:**
**Branch:** jarl/241-worktree-lookup
**Merged:** 3cd4a489bc7ceab0855cfd3a5b251eee715400a3 in ../../../JarlSkill
**CI:** pending

## What
idsNamed removes dates before it matches ids, so a range such as 1000-1002 in a Found by line is read as a date-like shape and loses 1000 (found in the review of 310; the same pass left the tests of fresh-review and profile-keys on a three-digit pattern that is harmless until a test loop passes 999).

## Why
A range of four-digit ids is a normal way to name several issues; losing its first id hides one of them from the places that read ids out of text.

## Acceptance
- A range of ids of any length in a free-text field yields every id the loop holds in it, and a date still yields none; tested with 998-1002 and 2026-10-15
- The fresh-review and profile-keys tests read ids with the shared id grammar

## Changelog
- Fixed: a range of issue numbers written in a free-text field, such as 1000-1002 in a Found by line, now counts every number the loop holds in it; a real date still counts for nothing.

## Evidence

- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 3cd4a48 · **saw:** 269 tests, 267 pass, 0 fail, 2 skipped

