# 189 · Jarl: decide --under accepts a rule that has ended, and its refusal lists ended rules among the rulings in force

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-105-opus-g1
**Where:** skills/jarl/scripts/lib/questions.mjs cmdDecide
**Branch:** jarl/187-writes-and-gaps
**Merged:** a981c807dab09c25e7e1444c1b09ad1ef46dfc88 in ../../../JarlSkill
**CI:** none

## What
A ruling can be made under a rule that has ended, which every view then marks not in force; the refusal of --under lists ended rules among the rulings in force.

## Why
A mandate that has ended should not be cited for a new ruling.

## Acceptance
decide --under refuses an ended rule with the form that lists the rulings in force, and the list holds only those in force, with a test

## Changelog
- Fixed: A decision can no longer be recorded as resting on a rule that has ended, and the list of rulings in force shown when it is refused leaves ended rules out. Before, such a decision was taken and then shown as resting on a ruling not in force.

## Evidence

- **ran:** node --test tests/ruling-under.test.mjs (before the fix) · **saw:** pass 10 fail 1: expected a refusal: decide x-1 Text. --by jarl --under issue-rule, a rule ended by its issue closing was taken
- **ran:** node --test tests/ruling-under.test.mjs tests/scoped-rules.test.mjs (after the fix) · **saw:** pass 27 fail 0: --under issue-rule and --under dated-rule are refused with the rulings in force: standing-mandate, live-rule, ending in the --under form, and nothing is written
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 60a06f7, the tip of jarl/187-writes-and-gaps) · **saw:** tests 1492, pass 1470, fail 0, cancelled 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 3e9a411, the branch with release/6.2.1 at 1d09fe3 merged in, one conflict in lib/log.mjs resolved by keeping both sides) · **saw:** tests 1518, pass 1496, fail 0, cancelled 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1534, pass 1512, fail 0, skipped 22, merge a981c80

