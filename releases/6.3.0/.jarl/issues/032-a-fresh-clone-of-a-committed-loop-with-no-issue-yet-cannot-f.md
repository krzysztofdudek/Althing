# 032 · Jarl: a fresh clone of a committed loop with no issue yet cannot file one

**Status:** in-progress
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
**Worker:** w-jarl-032-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-032
**Since:** 2026-11-03 08:34

## What
Claim: init --committed leaves .jarl/issues/ empty and git keeps no empty directory, so in a clone made before the first issue was committed new fails with a raw ENOENT on scandir of .jarl/issues instead of creating the directory.

Run on scratch repositories with Jarl a1132a8: materials/two-clones.md, section 'A fresh clone of a loop with no issue yet'. The number is taken with readdirSync on .jarl/issues with no existence check (jarl-lib.mjs:1562).

## Why


A loop opened on one machine and continued on another is ordinary work; a raw ENOENT with no repair command stops the first issue.

## Acceptance
- new creates .jarl/issues/ when it is missing in a loop whose goal exists
- A test files the first issue in a fresh clone of a loop opened with init --committed and committed before any issue; it is red on a1132a8 and green after

## Evidence

Title prefixed with Jarl: by hand after import, as the loop's other issues are

jarl-lib.mjs was split into skills/jarl/scripts/lib/ at merge 71ebc5b (issue 030); any file:line in this issue that names jarl-lib.mjs now lives in one of the lib/ modules

