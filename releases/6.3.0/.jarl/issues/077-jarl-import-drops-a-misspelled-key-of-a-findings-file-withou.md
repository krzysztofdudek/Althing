# 077 · Jarl: import drops a misspelled key of a findings file without a word

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-012-opus
**Where:** Review of 012 (2026-11-03): skills/jarl/scripts/lib/import.mjs

## What
A finding with a misspelled key (for example clam for claim, or severety) is filed with that field empty, and nothing reports the unknown key.

## Why
A research folder's findings land as issues with a missing claim or severity, the same silent loss 012 guards against in new.

## Acceptance
import refuses a findings file with an unknown key, naming the finding id and the key and listing the keys it takes, with a test, and --dry-run reports the same

## Evidence

