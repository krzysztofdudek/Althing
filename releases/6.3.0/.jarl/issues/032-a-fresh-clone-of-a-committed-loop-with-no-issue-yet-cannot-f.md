# 032 · Jarl: a fresh clone of a committed loop with no issue yet cannot file one

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#jarl-rethink-emptyclone
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1562 at a1132a8
**Branch:** jarl/032-first-issue-on-fresh-clone
**Merged:** 2399fe2 in ../../../JarlSkill
**CI:** none

## What
Claim: init --committed leaves .jarl/issues/ empty and git keeps no empty directory, so in a clone made before the first issue was committed new fails with a raw ENOENT on scandir of .jarl/issues instead of creating the directory.

Run on scratch repositories with Jarl a1132a8: materials/two-clones.md, section 'A fresh clone of a loop with no issue yet'. The number is taken with readdirSync on .jarl/issues with no existence check (jarl-lib.mjs:1562).

## Why


A loop opened on one machine and continued on another is ordinary work; a raw ENOENT with no repair command stops the first issue.

## Acceptance
- new creates .jarl/issues/ when it is missing in a loop whose goal exists
- A test files the first issue in a fresh clone of a loop opened with init --committed and committed before any issue; it is red on a1132a8 and green after

## Changelog
- Fixed: The first issue can be filed in a fresh copy of a loop that is kept in git, even when the loop had no issue yet when it was committed. Before, it stopped with an error about a missing folder.

## Evidence

Title prefixed with Jarl: by hand after import, as the loop's other issues are

jarl-lib.mjs was split into skills/jarl/scripts/lib/ at merge 71ebc5b (issue 030); any file:line in this issue that names jarl-lib.mjs now lives in one of the lib/ modules
- **ran:** node --test --test-name-pattern='fresh clone of a committed loop' tests/jarl.test.mjs (before the fix) · **saw:** failed: ENOENT scandir .jarl/issues in the clone
- **ran:** same test after the fix; then full npm test · **saw:** test passes; full suite pass 800, fail 0, cancelled 0
- **ran:** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 834 ℹ pass 811 ℹ fail 0 (on 9503db5, release/6.2.1: 032 merged at 2399fe2, 025 and 026 at 9503db5)

