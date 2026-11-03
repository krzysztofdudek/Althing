# 077 · Jarl: import drops a misspelled key of a findings file without a word

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-012-opus
**Where:** Review of 012 (2026-11-03): skills/jarl/scripts/lib/import.mjs
**Branch:** jarl/037-notes-and-defaults
**Worker:** w-jarl-037-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-037
**Since:** 2026-11-03 10:58

## What
A finding with a misspelled key (for example clam for claim, or severety) is filed with that field empty, and nothing reports the unknown key.

## Why
A research folder's findings land as issues with a missing claim or severity, the same silent loss 012 guards against in new.

## Acceptance
import refuses a findings file with an unknown key, naming the finding id and the key and listing the keys it takes, with a test, and --dry-run reports the same

## Changelog
- Fixed: A research findings file with a misspelled field name is now refused, and the finding and the field are named, instead of filing the issue with that part left empty. A dry run refuses it the same way.

## Evidence

- **ran:** node --test --test-name-pattern="refuses a finding with a key it does not read" tests/jarl.test.mjs (red, the committed import.mjs) · **saw:** tests 1 · fail 1: 'expected a refusal: import … --source r-keys' at jarl.test.mjs:1112 — the import filed the finding, the key was dropped without a word
- **ran:** node --test --test-name-pattern="refuses a finding with a key it does not read" tests/jarl.test.mjs (red, the committed import.mjs, exact output) · **saw:** tests 1 · pass 0 · fail 1: AssertionError 'expected a refusal: import <temp>/findings.json --source r-keys' at tests/jarl.test.mjs:1112 (refuses, helpers.mjs:60)
- **ran:** node --test --test-name-pattern="refuses a finding with a key it does not read|import reads the angles shape|import files one issue per finding" tests/jarl.test.mjs (green, after the change) · **saw:** tests 3 · pass 3 · fail 0

