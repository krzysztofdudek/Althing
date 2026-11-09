# 187 · Jarl: set on a format-1 loop raises the format and then writes the issue back with the bare Repo value, the flaw issue 105 fixed for retraction

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261108T0813-szqe
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-105-opus-g1
**Where:** skills/jarl/scripts/lib/commands.mjs cmdSet
**Branch:** jarl/187-writes-and-gaps
**Merged:** a981c807dab09c25e7e1444c1b09ad1ef46dfc88 in ../../../JarlSkill
**CI:** none

## What
set <id> <status> --by <who> on a format-1 loop raises the record format to 3 and then the set's own write puts the old bare Repo path back on the issue it writes. The base does the same.

## Why
The raise's rewrite must stay in the issue file the command writes.

## Acceptance
After set on a format-1 loop the issue's Repo keeps the raised form, for every command that raises the format and then writes an issue, with a test per command

## Changelog
- Fixed: Moving a task to another status with your name given, in a loop an older Jarl wrote, no longer undoes the update of that task's repository field. Before, the moved task kept the old form.

## Evidence

- **ran (history):** node --test tests/raise-keeps-paths.test.mjs (on the release branch's cmdSet, before the fix) · **saw:** pass 12 fail 3: set with --by, set into a status that needs a reason with --by, and set done with --by each left the moved issue's Repo as the bare tool while the raise wrote the other issue ./tool
- **ran (history):** node --test tests/raise-keeps-paths.test.mjs (at a2d547a) · **saw:** pass 15 fail 0: set, evidence, merged, round, ask, new, field Acceptance, Parent and Kind, decide --waives-review, a bot review and a review of several issues each keep ./tool in the issue they write after raising a format-1 loop
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 60a06f7, the tip of jarl/187-writes-and-gaps) · **saw:** tests 1492, pass 1470, fail 0, cancelled 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 3e9a411, the branch with release/6.2.1 at 1d09fe3 merged in, one conflict in lib/log.mjs resolved by keeping both sides) · **saw:** tests 1518, pass 1496, fail 0, cancelled 0, skipped 22, exit 0
- **ran (history):** node --test tests/raise-keeps-paths.test.mjs (the 24 cases of 0c5772a run on the scripts of release/6.2.1) · **saw:** pass 21 fail 3: only the three set cases are red there; split, import --adopt (with and without a filing), new --repo, the three retractions, tick and renumber already keep the ./ form, so no code change was needed for them
- **ran (history):** node --test --test-name-pattern 'split|import' tests/raise-keeps-paths.test.mjs (with cmdSplit and cmdSource made to write the text they read before the raise, then reverted) · **saw:** pass 0 fail 3: split with --by and both import --adopt cases fail on: the issue the command wrote keeps the raise's ./ form
- **ran (history):** node --test tests/raise-keeps-paths.test.mjs (at 0c5772a) · **saw:** tests 24, pass 24, fail 0: every case also checks every issue file of the loop, a filed one included, holds ./tool after the raise
- **ran (history):** status, status --json and verify on a copy of the 6.3.0 loop with JarlSkill and Yggdrasil linked beside it, the scripts of release/6.2.1 against those of 4618ac8 · **saw:** status and verify identical, status --json identical but for the ageMs fields; closedGate lists only 028 (a merge is recorded on a dropped issue) on both
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 4618ac8, the tip of jarl/187-writes-and-gaps) · **saw:** tests 1534, pass 1512, fail 0, cancelled 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1534, pass 1512, fail 0, skipped 22, merge a981c80

