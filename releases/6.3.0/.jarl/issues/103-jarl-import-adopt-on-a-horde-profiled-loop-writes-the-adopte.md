# 103 · Jarl: import --adopt on a Horde-profiled loop writes the adopted issue and then refuses, and import is not atomic

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 083
**Found by:** rev-jarl-083b-opus
**Where:** Review of 083 round 2 (2026-11-03): lib/import.mjs
**Branch:** jarl/094-import-and-files
**Worker:** w-jarl-094-opus-r2
**Worktree:** /home/me/Worktrees/JarlSkill/094-import-and-files
**Since:** 2026-11-06 20:16

## What
On a loop opened with Horde's profile, import --adopt --repo <name> writes the adopted issue's Source and log line, then refuses with 'nothing was written'. More generally import writes adoptions before a later refusal by new, so a refused import leaves part of its work behind.

## Why
A message that says nothing was written must be true; a refused import must leave the loop as it found it.

## Acceptance
A refused import leaves the loop unchanged, with a test for the Horde-profile --repo case and for a later refusal after an adoption

## Changelog
- Fixed: Importing research findings now checks every finding before it writes anything. If one cannot be filed, nothing is adopted or filed and the finding is named; before, the findings ahead of it were already filed, or an issue already adopted.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs (red: the branch before the change, tests added) · **saw:** tests 4 · pass 1 · fail 3: an adoption stays written when a later finding is refused, a required field of the profile refuses after the adoption, and --repo on a loop whose profile names an external scheduler writes the adopted Source and then says nothing was written
- **ran:** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs (green, branch jarl/094-import-and-files) · **saw:** tests 4 · pass 4 · fail 0: each refusal leaves every file of .jarl as it was (compared file by file), including the external-scheduler profile with --repo and a later refusal after an adoption
- **ran:** import <two findings that file and one that cannot> --source scn on two copies of the 6.3.0 loop (177 issues), release tip and then this branch · **saw:** release tip: the third is refused after two were filed (177 to 179 issue files); this branch: finding scn-bad-3 cannot be filed, 177 issue files, the log unchanged
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1414 · pass 1392 · fail 0 · skipped 22

