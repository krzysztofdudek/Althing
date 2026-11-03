# 103 · Jarl: import --adopt on a Horde-profiled loop writes the adopted issue and then refuses, and import is not atomic

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 083
**Found by:** rev-jarl-083b-opus
**Where:** Review of 083 round 2 (2026-11-03): lib/import.mjs

## What
On a loop opened with Horde's profile, import --adopt --repo <name> writes the adopted issue's Source and log line, then refuses with 'nothing was written'. More generally import writes adoptions before a later refusal by new, so a refused import leaves part of its work behind.

## Why
A message that says nothing was written must be true; a refused import must leave the loop as it found it.

## Acceptance
A refused import leaves the loop unchanged, with a test for the Horde-profile --repo case and for a later refusal after an adoption

## Evidence

