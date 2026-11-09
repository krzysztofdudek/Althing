# 180 · Jarl: the import refusal at the record format edge ends with the dry-run form, which only repeats the refusal, and the library import can file issues and then refuse an empty by under --parent

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261106T2044-ihtt
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-094-opus-h1b
**Where:** skills/jarl/scripts/lib/import.mjs formOf and cmdImport
**Branch:** jarl/173-views-and-refusals
**Merged:** 0e17fb92e93c4507d564e47f6ebb71403b6a3391 in ../../../JarlSkill
**CI:** none

## What
(1) The refusal for a number the loop's record format cannot hold ends with the import --dry-run form, which only repeats it; the way out is --only or raising the format. (2) A library caller of cmdImport that passes --parent with an empty by gets the issues filed and then a refusal when they are put under the parent; the command line and the MCP tool refuse an empty by before the command runs.

## Why
A form at the end of a refusal should be one that can work; a refused import leaves nothing.

## Acceptance
The refusal at the format edge ends with a form that can work or says the way out; cmdImport refuses an empty by with --parent before the first write; a test for each

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs tests/import-parent.test.mjs with the new tests, on the old lib/import.mjs · **saw:** tests 14, pass 11, fail 3: the format-edge refusal ends with jarl.mjs import "<findings.json>" --dry-run (twice: findings ahead of the edge, and none); the library cmdImport with parent 1 and by '' files issues 2 and 3 before it refuses
- **ran (history):** cd skills/jarl/scripts && node --test tests/import-atomic.test.mjs tests/import-parent.test.mjs at the tip · **saw:** tests 14, pass 14, fail 0: the format-edge refusal adds that the findings below the edge can be filed with --only and ends with the call's form with --only "<finding-ids>"; with no finding below the edge it ends with jarl.mjs profile and the call's own form; cmdImport with parent and by '' refuses with nothing filed. the full suite at the branch tip ac6f9bd (cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs) printed tests 1546, pass 1524, fail 0, skipped 22; every view (status, resume, next, next --as jarl and owner, report, models, branches, verify, list, decisions, profile, show, brief, text and --json) on a copy of the loop with the tool repositories linked is the same at a981c80 and at the tip except the ages, and closedGate holds only 028 in both
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on five files (import lines of ball, evidence and models, two reference tables), resolved by keeping both sides, holderKey exported from loop.mjs, and a follow-up commit dropped the unused leaseOfMove import the modules test refused · **saw:** first run tests 1583, pass 1560, fail 1 (the imports-only-names-it-uses test); after the follow-up tests 1583, pass 1561, fail 0, skipped 22, tip 0e17fb9

