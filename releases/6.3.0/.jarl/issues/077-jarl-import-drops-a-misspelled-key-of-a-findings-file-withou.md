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

## Evidence

