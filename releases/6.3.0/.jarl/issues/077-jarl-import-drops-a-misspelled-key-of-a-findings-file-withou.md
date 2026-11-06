# 077 · Jarl: import drops a misspelled key of a findings file without a word

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-012-opus
**Where:** Review of 012 (2026-11-03): skills/jarl/scripts/lib/import.mjs
**Branch:** jarl/037-notes-and-defaults
**Merged:** 7a10c53 in ../../../JarlSkill
**CI:** none

## What
A finding with a misspelled key (for example clam for claim, or severety) is filed with that field empty, and nothing reports the unknown key.

## Why
A research folder's findings land as issues with a missing claim or severity, the same silent loss 012 guards against in new.

## Acceptance
import refuses a findings file with a key that is a near miss of a mapped key (the same spelling in another case, a one-letter miss of a mapped key of five letters or more, or two neighbouring letters swapped), naming the finding id and the key and listing the keys it takes; a key that is not a near miss is let through and listed as an extra when the import files; a test per case, and --dry-run reports the same (restated after issue 094 narrowed the rule)

## Changelog
- Fixed: A research findings file with a misspelled field name is now refused, and the finding and the field are named, instead of filing the issue with that part left empty. A dry run refuses it the same way.

## Evidence

- **ran:** node --test --test-name-pattern="refuses a finding with a key it does not read" tests/jarl.test.mjs (red, the committed import.mjs) · **saw:** tests 1 · fail 1: 'expected a refusal: import … --source r-keys' at jarl.test.mjs:1112 — the import filed the finding, the key was dropped without a word
- **ran:** node --test --test-name-pattern="refuses a finding with a key it does not read" tests/jarl.test.mjs (red, the committed import.mjs, exact output) · **saw:** tests 1 · pass 0 · fail 1: AssertionError 'expected a refusal: import <temp>/findings.json --source r-keys' at tests/jarl.test.mjs:1112 (refuses, helpers.mjs:60)
- **ran:** node --test --test-name-pattern="refuses a finding with a key it does not read|import reads the angles shape|import files one issue per finding" tests/jarl.test.mjs (green, after the change) · **saw:** tests 3 · pass 3 · fail 0
- **ran:** node --test --test-name-pattern="misspelled key|keys the mapping does not read" tests/jarl.test.mjs (red, on the tip with the refusal of every unknown key) · **saw:** tests 2 · pass 0 · fail 2: the misspelling test fails its message match (the message names the key and the keys, no 'did you mean'); the fixture test fails: import --dry-run refuses finding jarl-fr-1c239812 on the key "verifier"
- **ran:** node --test --test-name-pattern="misspelled key|keys the mapping does not read|import reads the angles shape|import files one issue per finding" tests/jarl.test.mjs (green, after the rule change) · **saw:** tests 4 · pass 4 · fail 0: the misspelling test, the fixture test with import, --dry-run and sources, and the two earlier import tests
- **ran:** node --test tests/jarl.test.mjs --test-name-pattern="import" (scratch loop: import --dry-run of the field report findings file, 38 findings) · **saw:** research/2026-11-03-jarl-field-report-long-loop: 38 finding(s) · would file 38 · already filed 0
- **ran:** node the worktree's jarl.mjs import <Althing>/research/2026-11-03-jarl-field-report-long-loop/materials/findings.json --source research/2026-11-03-jarl-field-report-long-loop --dry-run --root <scratch loop> · **saw:** research/2026-11-03-jarl-field-report-long-loop: 38 finding(s) · would file 38 · already filed 0 (correction: the row above names a test command that was not run; this is the command that printed that line)
- **ran:** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 860 ℹ pass 837 ℹ fail 0 (merge 7a10c53 on release/6.2.1)

