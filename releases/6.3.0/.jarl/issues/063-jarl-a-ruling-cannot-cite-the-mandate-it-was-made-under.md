# 063 · Jarl: a ruling cannot cite the mandate it was made under

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-42af4cdd
**Where:** JarlSkill/skills/jarl/scripts/lib/questions.mjs (cmdDecide), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5763 at a1132a8
**After:** 035
**Branch:** jarl/063-ruling-under-mandate
**Merged:** df3ff35 in ../../../JarlSkill
**CI:** none

## What
Claim: Coordinator rulings under the owner's mandate should cite it, and check should warn when one falls outside every mandate.

ask --kind ratify records a choice made under a mandate; decide has no field for the mandate. Map row fr-29.

## Why


## Acceptance
- decide takes --under <slug>, naming the ruling or the owner's mandate a ruling by the jarl or a coordinator rests on; decisions and resume show it with the ruling
- --under names a ruling that exists and is in force, or is refused with the list of rulings in force
- Tests for both; no check that a ruling falls under a mandate (report section 11)

## Changelog
- Added: a ruling made by the jarl or a coordinator can now name the ruling it rests on, such as the owner's mandate. The name is shown with the ruling in the list of rulings and in the resume, and a name that is not a ruling in force is refused.

## Evidence

Kept small by the model (report section 11): decide may name the ruling it rests on (--under <slug>), shown with the ruling; no check that a coordinator's ruling falls under a mandate.
- **ran:** node --test tests/ruling-under.test.mjs (source files at the branch base, the new test file only) · **saw:** 8 tests, 0 pass, 8 fail: decide refused --under and the ruling carries no under field
- **ran:** node --test tests/ruling-under.test.mjs (with the change) · **saw:** 8 tests, 8 pass, 0 fail
- **ran:** node --test owner-quote, resume, docs-true, library-parity, record-contract, mcp, tense, printed-texts, skill-shape, modules, merge-driver, ruling-under test files · **saw:** 166 tests, 165 pass, 0 fail (1 skipped)
- **ran:** jarl decide mandate-test --by jarl --under one-format-raise-horde-later, on a copy of the 6.3.0 loop under ~/Temp, then the pinned driver's decisions --live, resume, status and decisions --json on that copy; and --under nope · **saw:** the ruling is written with a final paragraph 'Made under: <slug>' before its closing block; the driver prints it as plain ruling text and reads the copy without error; --under nope is refused listing the rulings in force
- **ran:** nice -n 15 timeout 1200 node --test tests/jarl.test.mjs; then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** jarl.test.mjs 179 tests, 178 pass, 0 fail, 1 skipped; full suite 930 tests, 907 pass, 0 fail, 23 skipped
- **ran:** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test; then node --test tests/resume.test.mjs alone · **saw:** tests 930, pass 906, fail 1, skipped 23 on merge df3ff35 (release/6.2.1): the one failure is the timing test 'resume stays fast' (9.0 s against 6 s) under load; alone the same file passes 6 of 6

