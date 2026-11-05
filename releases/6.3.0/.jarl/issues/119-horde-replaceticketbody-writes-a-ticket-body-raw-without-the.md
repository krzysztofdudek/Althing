# 119 · Horde: replaceTicketBody writes a ticket body raw, without the escape of conflict marker lines that Jarl's own writers apply

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Horde
**After:** 084
**Found by:** rev-jarl-084d-opus
**Where:** Review of 084 (2026-11-04): Horde tk.mjs replaceTicketBody

## What
Jarl 6.3.0 escapes conflict marker lines in text it writes so verify can refuse a real conflict. Horde's raw body write does not, so a quoted conflict in a Horde ticket body would look like a real one to a Jarl that verifies the loop.

## Why
A text written by a tool that builds on the record should not be able to trip the conflict check.

## Acceptance
Horde's body writes escape marker lines the same way, or the record library's body setter does it for every consumer, with a test

## Evidence

Dropped: Horde left the family on 2026-11-04 (ruling horde-leaves-the-family) and its repository is private: its ticket writer no longer reads Jarl's record, so there is no consumer to keep in step

