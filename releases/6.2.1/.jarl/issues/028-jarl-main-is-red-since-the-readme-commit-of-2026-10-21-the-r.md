# 028 · Jarl: main is red since the README commit of 2026-10-21; the README says what the code does again

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:**
**Branch:** jarl/028-readme-matches-code
**Worker:** w-jarl-028-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-028
**Since:** 2026-11-03 06:05
**Merged:** a1132a8 in ../../../JarlSkill
**CI:** none

## What
CI on main failed on 3ae1f4e (README: what you install and why, in one order; social card on top), run 39554635835: five of the tests that hold the README to the code fail: the drop-in copies the whole skills/jarl/ directory (the README names ~/.agents/skills/jarl/), a loop is found at the root of a checkout, the README says who verifies, no version-shaped token in prose, and the tense test. Nothing was published by it: the release workflow found the version already tagged.

## Why
A red main is the base release/6.2.1 is cut from; and a README that the tests reject tells people something the code does not do.

## Acceptance
The README text and the tests agree again, the README keeping the owner's new order and card; the full suite and CI are green on main

## Evidence

- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.1 tip before the change · **saw:** pass 772, fail 5: README drop-in copy, loop found at checkout root, README says who verifies, version-shaped token (README line 118), tense test (README lines 100 and 118)
- **ran:** cd skills/jarl/scripts && npm test, on branch jarl/028-readme-matches-code at b54136e · **saw:** pass 777, fail 0; the five named tests green
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 800, pass 777, fail 0, skipped 23 (merge a1132a8 on release/6.2.1)

Merged on release/6.2.1; the acceptance's last clause (CI green on main) is met when release/6.2.1 reaches main at the release, on the owner's word (he chose to keep the fix local until then), so 028 stays open until that CI run

