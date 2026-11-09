# 103 · Jarl: import --adopt on a Horde-profiled loop writes the adopted issue and then refuses, and import is not atomic

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T1458-pzhy
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 083
**Found by:** rev-jarl-083b-opus
**Where:** Review of 083 round 2 (2026-11-03): lib/import.mjs
**Branch:** jarl/094-import-and-files
**Merged:** 8bd98ee27c71e3b1c301218d570e7ecf6e24b624 in ../../../JarlSkill
**CI:** none

## What
On a loop opened with Horde's profile, import --adopt --repo <name> writes the adopted issue's Source and log line, then refuses with 'nothing was written'. More generally import writes adoptions before a later refusal by new, so a refused import leaves part of its work behind.

## Why
A message that says nothing was written must be true; a refused import must leave the loop as it found it.

## Acceptance
A refused import leaves the loop unchanged, with a test for the Horde-profile --repo case and for a later refusal after an adoption

## Changelog
- Fixed: Importing research findings now checks every finding before it writes anything. If one cannot be filed, nothing is adopted or filed and the finding is named; before, the findings ahead of it were already filed, or an issue already adopted.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs (red: the branch before the change, tests added) · **saw:** tests 4 · pass 1 · fail 3: an adoption stays written when a later finding is refused, a required field of the profile refuses after the adoption, and --repo on a loop whose profile names an external scheduler writes the adopted Source and then says nothing was written
- **ran (history):** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs (green, branch jarl/094-import-and-files) · **saw:** tests 4 · pass 4 · fail 0: each refusal leaves every file of .jarl as it was (compared file by file), including the external-scheduler profile with --repo and a later refusal after an adoption
- **ran (history):** import <two findings that file and one that cannot> --source scn on two copies of the 6.3.0 loop (177 issues), release tip and then this branch · **saw:** release tip: the third is refused after two were filed (177 to 179 issue files); this branch: finding scn-bad-3 cannot be filed, 177 issue files, the log unchanged
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1414 · pass 1392 · fail 0 · skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs (red: the new tests on fa6c85d) · **saw:** tests 6 · pass 4 · fail 2: on a loop that stays at format 1 under an external scheduler with 998 as its highest issue, the import of two findings filed 999 and then refused (the loop changed); the dry run of --adopt onto an issue whose number two files carry did not refuse while the import does
- **ran (history):** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs (green, ec118b9) · **saw:** tests 6 · pass 6 · fail 0: finding "finding-3" cannot be filed: issue number 1000 needs record format 2, and this loop stays at format 1 … — nothing was written, ending jarl.mjs import "<findings.json>" --dry-run, the dry run printing the same and the loop unchanged file by file; --only finding-2 then files 999; the shared-number adoption is refused alike by the dry run and the import with nothing written
- **ran (history):** import findings.json --source ext/r (two findings), dry and real, on a scratch loop whose profile names an external scheduler and whose highest issue is 998, with the Jarl of 4eeb02e and of the fixed tip · **saw:** 4eeb02e: the dry run said would file 2, the import filed 999 and then refused the second with … — nothing was written; fixed tip: the dry run and the import both refuse finding "finding-2" cannot be filed: issue number 1000 needs record format 2 …, and only 998 is in the loop
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip ec118b9) · **saw:** tests 1420 · pass 1398 · fail 0 · skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on two import lines and one flag-list sentence, resolved by keeping both sides, then a follow-up commit added the parent flag to the import entry · **saw:** tests 1442, pass 1420, fail 0, skipped 22, tip 8bd98ee

