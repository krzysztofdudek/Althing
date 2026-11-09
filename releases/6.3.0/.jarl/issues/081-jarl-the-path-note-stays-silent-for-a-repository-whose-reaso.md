# 081 · Jarl: the path note stays silent for a repository whose reason for being stored as a path changed, and every --repo value reads all issues

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0942-hvsh
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 025
**Found by:** rev-jarl-025-opus
**Where:** Review of 025 and 026 (2026-11-03)
**Branch:** jarl/108-small-gaps
**Merged:** 4e89d0ba43de04503c11bcd97ef430ec04e9fdef in ../../../JarlSkill
**CI:** none

## What
025 prints the path note once per repository; if a later filing is stored as a path for another reason, the note stays silent. Deciding whether the note was printed reads every issue of the loop on every --repo value. The sentence of 026 sits in two references rather than one with a link.

## Why
A silent changed reason misleads; reading every issue costs time on large loops.

## Acceptance
The note is printed again when the reason differs, the check reads a cheap index or the log instead of every issue, and 026's sentence lives in one reference linked from the other, with tests

## Changelog
- Fixed: When a repository is kept by its path rather than by its name, Jarl explains why the first time it happens in a loop, and again if the reason changes.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/repositories.test.mjs, with two new cases and the code before the change (a second reason for a path; an unreadable issue file) · **saw:** not ok 7 (the note was not said again when another repository took the place of the name) and not ok 8 (the check read the issue files: with every issue file replaced by text that is no issue the note was still decided from them)
- **ran (history):** cd skills/jarl/scripts && node --test tests/repositories.test.mjs tests/modules.test.mjs tests/profile-keys.test.mjs tests/import-atomic.test.mjs tests/skill-shape.test.mjs tests/docs-true.test.mjs, on commit 88ff46e; and verify on a copy of a loop after a filing by path · **saw:** pass 69 fail 0 in the first four; the note is said once for a checkout and a reason, said again when the reason changes, decided from the log line 'repo path <value> noted · <reason>' alone, and verify reads the loop clean. The sentence on recording a verdict now stands in references/reviewer.md only, jarl.md links to it
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, once for the group, on commit 56dd68a · **saw:** tests 1503 pass 1481 fail 0 skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1552, pass 1530, fail 0, skipped 22, merge 4e89d0b

