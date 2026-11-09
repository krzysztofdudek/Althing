# 001 · Release 6.2.1

**Status:** done
**Kind:** process
**Priority:** 1
**Tier:** strong
**Key:** 20261022T0714-cbkt
**Tags:** release, needs-owner
**Files:** 
**Found by:** jarl
**Where:**

## What
Ship release 6.2.1: in every repository with work, release/<version> green on its exact commit, the corpus gate and the candidate verdict green, the bump commits, the order to main, the tags through each repository's release workflow, the publish verified, the branches cleaned up.

## Why
A release that skips a step is found by a user after the tag.

## Acceptance
- [read] every step of the shipping checklist in the releasing-the-family skill has a --ran/--saw row
- [read] the owner said to start it, and each push and publish happened on his word
- [check] the full suite passes on the merged result
- [test] a loop in an older format is refused and the refusal names the conversion file
- [read] the skill holds the conversion file, from which an agent converts a loop
- [check] an agent converts this very loop with that file and `verify` is clean
- [check] the word budgets per role hold by a test
- [test] every rule of the design has a test that fails without it
- [read] an independent examiner: the code does what the design says
- [owner] the blind runs have passed and he says this is it · material: the report of piece 6 · check: is this it

## Reviews
- **approve** · by jarl (coordinator) · 2026-11-09 · model claude-opus-5-5
  Director's approve of the release issue: '[read] every step of the shipping checklist in the releasing-the-family skill has a --ran/--saw row': the row names the steps that apply to Jarl alone. '[read] the owner said to start it, and each push and publish happened on his word': ruling release-6-3-0-owner-go. '[read] the skill holds the conversion file, from which an agent converts a loop': references/converting-from-6-2.md, used on this loop and on Workspace. '[read] an independent examiner: the code does what the design says': rev-jarl-230-opus-final, section by section, approved.

## Evidence

### Proof

- **ran (line fe2337ab86c3):** CI run 42634140448 on a05cc18, Linux, Windows and macOS on Node 22 and 24 · **saw:** all ten jobs success
- **ran (line e832d49f628f):** tests/record-format.test.mjs in the release, examined in piece 3 · **saw:** a loop in an older format is refused on every command and the refusal names references/converting-from-6-2.md
- **ran (line 07a46b65bb03):** this loop converted with references/converting-from-6-2.md alone, by the worker of piece 5 and independently by its examiner; jarl verify · **saw:** verify clean; the two conversions identical but for key letters and the converted line
- **ran (line ad647ecbd29f):** the word budget test of the skill, examined in piece 4 · **saw:** the budgets per role hold: SKILL.md 1,147, director's reference 2,401, the 088 set under 5,000
- **ran (line 7221404a70f1):** the rule table of piece 6 and a removal of each guard on a scratch copy · **saw:** 50 of 50 guards fail their named test when removed; 5 rules name no testable behaviour and say so
- **ran (line e77da22b67f7):** the shipping steps that apply to Jarl alone: CI green on a05cc18, the manifest a candidate, the bump commit, the push to main, the release workflow, gh release view v6.3.0 · **saw:** each done in that order; tag v6.3.0 at a05cc18, the release published; the steps for Runes, Yggdrasil, Grain and the add-ons are not part of this release

