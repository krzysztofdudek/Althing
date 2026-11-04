# 102 · Jarl: a note citation edge cases: (84, 85) cites nothing while issue 84 does, issues 084,085 cite neither, and the chain-walk cache checks only the size

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 089
**Found by:** rev-jarl-089c-opus
**Where:** Review of 089 round 2 (2026-11-03): lib/ids.mjs
**Branch:** jarl/102-citation-edge-cases
**Merged:** ea477c7 in ../../../JarlSkill
**CI:** none

## What
A bracket list of two-digit numbers cites nothing, a comma without a space joins nothing, the cost sentence is not exact when the cited issue waits on the citing one, and the cache checks only the size of the loop.

## Why
Each is a limit of the explicit-citation rule worth either fixing or stating.

## Acceptance
Each is fixed or stated in references/jarl.md, with a test where behaviour changes

## Changelog
- Added: To have the note name another issue, write its number after the word issue, or with a hash sign in front of it, and put a space after each comma in a list of numbers. A list written with no space after its commas, or a bracketed list of two-digit numbers such as (12, 13), names no issue.

## Evidence

- **ran:** cd skills/jarl/scripts && TMPDIR=$HOME/Temp/tmp/w102 nice -n 15 timeout 600 node --test tests/unordered-names.test.mjs · **saw:** tests 10, pass 9, fail 1. The failing test is 'idsCited reads the set as it stands at each call, also when a change keeps the set size': AssertionError 'an id that left the set is not cited', actual ['7', '8'], expected ['8'].
- **ran:** cd skills/jarl/scripts && TMPDIR=$HOME/Temp/tmp/w102 nice -n 15 timeout 600 node --test tests/unordered-names.test.mjs · **saw:** tests 10, pass 10, fail 0. The test 'idsCited reads the set as it stands at each call, also when a change keeps the set size' passes, and so do the nine others of the file.

Verify on a copy of the loop printed the same output before and after the change: the two outputs compare with no difference, the same notes and the same findings.
- **ran:** cd skills/jarl/scripts && TMPDIR=$HOME/Temp/tmp/w102 nice -n 15 timeout 1800 npm test · **saw:** tests 1035, pass 1012, fail 0, skipped 23; the run took about 561 seconds and exited with code 0.
- **ran:** npm test (in skills/jarl/scripts of the release worktree, at 5ce62f0 with 034, 102 and 065 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1075 tests, 1052 pass, 0 fail, 23 skipped

