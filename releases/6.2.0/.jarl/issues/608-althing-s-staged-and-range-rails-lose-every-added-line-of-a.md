# 608 · Althing's staged and range rails lose every added line of a file after an added line that begins wi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1536-jeew
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363b-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's staged and range rails lose every added line of a file after an added line that begins with "++ ", because addedLines in rails/git.mjs takes any "+++ " line for a file header

## Why


## Acceptance


[test] Althing's staged and range rails read every added line of a file after an added line that begins with '++ ' (headers told by position), red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line 328110750129):** node --test rails/test/run.test.mjs (the test of 608 alone over a git archive export of cca2888, the commit before 04aaa88 told headers by position) · **saw:** tests 1, fail 1: rails staged: clean, over a test word two lines after an added line that begins with ++
- **ran (line 328110750129):** node --test rails/test/run.test.mjs (at 6a54fa2, and in the full suite at 9b15fcf) · **saw:** pass: rails/run.mjs staged and range refuse the test word at line 3; npm test at 9b15fcf: tests 190, pass 178, fail 0

