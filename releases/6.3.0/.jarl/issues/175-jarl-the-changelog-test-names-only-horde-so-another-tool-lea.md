# 175 · Jarl: the changelog test names only Horde, so another tool leaving the family would not be caught

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-136-opus-d2
**Where:** skills/jarl/scripts/tests/docs-true.test.mjs: the changelog test
**Branch:** jarl/172-leftover-words-and-readme
**Worker:** w-jarl-172-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/172-leftover-words-and-readme
**Since:** 2026-11-06 20:27

## What
The test that keeps the preamble and the newest changelog sections free of a tool that left the family reads one name.

## Why
The next tool to leave would ship in the notes the same way.

## Acceptance
The list of tools that left the family is one place the test reads, with Horde in it, and a test shows a second name is caught

## Evidence

- **ran:** node --test tests/docs-true.test.mjs with the old changelog test, a scratch CHANGELOG preamble naming a second departed tool · **saw:** passes: the old test, reading one name, does not catch it
- **ran:** node --test --test-name-pattern='changelog|tools that left' tests/docs-true.test.mjs with the list holding Horde and a second name, that name in the scratch CHANGELOG preamble · **saw:** the changelog test fails and prints the preamble line naming the second tool; the test of the list passes (it catches a second name, whole words only, any case, and an empty list catches nothing)
- **ran:** node --test tests/docs-true.test.mjs tests/tense.test.mjs on the branch, then the full suite · **saw:** 35 tests, 35 pass; full suite tests 1409, pass 1387, fail 0, skipped 22

