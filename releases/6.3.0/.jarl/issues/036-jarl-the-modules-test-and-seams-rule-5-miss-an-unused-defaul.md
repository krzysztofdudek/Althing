# 036 · Jarl: the modules test and seams rule 5 miss an unused default or namespace import and a side-effect upward import, and fail falsely on an import inside some comments

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0823-eptl
**Tags:** refactor
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 030
**Found by:** rev-jarl-030b-opus
**Where:** Review of 030 round 1 (2026-11-03)
**Branch:** jarl/108-small-gaps
**Merged:** 4e89d0ba43de04503c11bcd97ef430ec04e9fdef in ../../../JarlSkill
**CI:** none

## What
An unused default or namespace import is not flagged; seams rule 5 misses a side-effect upward import such as import '../jarl.mjs' (the modules test catches it); an import line inside a /* */ comment whose lines have no leading *, and import( inside any comment, make the test fail falsely.

## Why
A guard with known holes and false reds loses trust.

## Acceptance
Each of the five cases has a fixture that the tests judge correctly

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/modules.test.mjs, with the new cases and the old parsing · **saw:** not ok 3 (an unused default import was not listed) and not ok 4 (an import line inside a block comment with no leading star was read as an import of ../record.mjs)
- **ran (history):** cd skills/jarl/scripts && node --test tests/seams.test.mjs, rule 5 with the new case and the pattern as it was · **saw:** not ok: 'a side-effect import names no binding': 0 !== 2 (import '../jarl.mjs' was not found)
- **ran (history):** cd skills/jarl/scripts && node --test tests/modules.test.mjs tests/seams.test.mjs, on commit ec053d7 · **saw:** pass 20 fail 0; the five cases are judged: unused default import, unused namespace import (listed), side-effect upward import (found), import line in a block comment without a star and import( in a line or block comment (neither is an import); every module of lib/ keeps its length and its line breaks when its comments are blanked
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, once for the group, on commit 56dd68a · **saw:** tests 1503 pass 1481 fail 0 skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1552, pass 1530, fail 0, skipped 22, merge 4e89d0b

