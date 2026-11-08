# 164 · Jarl: a test of the goal command fails with a TDZ error on LS when run alone with --test-name-pattern

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-128-sonnet
**Where:** Report of the worker of 128 (package C), Found
**Branch:** jarl/163-base-and-reopen
**Merged:** 835fcd05f8a49889f0a1bffefe2d4453aa2bfc82 in ../../../JarlSkill
**CI:** none

## What
tests/jarl.test.mjs, the test 'goal --set refuses a line break…', throws a temporal-dead-zone error on LS when it is run alone with --test-name-pattern; it passes in the full suite. A worker who runs one test as the brief tells them to hits it.

## Why
A test that depends on the order of the others hides a real error and wastes a worker's time.

## Acceptance
Every test of tests/jarl.test.mjs passes when run alone with --test-name-pattern, and a check runs each test alone or the shared setup is moved to where every test reaches it

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='goal --set refuses a line break' tests/jarl.test.mjs (release branch tip, before the fix) · **saw:** ReferenceError: Cannot access 'LS' before initialization; the test 'verify prints the findings of the log in file order' run alone the same way threw on 'retracted'
- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='^<name>' tests/<file> for every test of tests/jarl.test.mjs (137 names) and for 10 names sampled from each of the other 107 test files (651 runs), after the fix · **saw:** every run passes alone with no ReferenceError; the 7 runs with pass 0 are tests skipped for want of JARL_LIVE_LOOP, zsh or a case-insensitive disk. Same cause also fixed in tests/one-store.test.mjs (fieldTextOf) and tests/vocabulary.test.mjs (TERMS), and in jarl.test.mjs withStderr and the verify helpers
- **ran:** cd skills/jarl/scripts && npm test (the whole suite on the branch tip 58824ff) · **saw:** tests 1548, pass 1526, fail 0, skipped 22; the suite left nothing in its temporary directory
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on two import lines of lib/commands.mjs (group H2 added leaseConflictOf, this group swapped in baseOf and added unmergedText), resolved by keeping both · **saw:** tests 1566, pass 1544, fail 0, skipped 22, merge 835fcd0

