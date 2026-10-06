# 257 · Compatibility: Jarl 6.2.0 on frozen copies of real loops (the private repository's loops, a Horde mission) and an older Jarl's refusal of the new format

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** compatibility, jarl
**Files:** Althing/workspace/checks/loops.mjs
**Repo:** ../..
**After:** 252
**Found by:** jarl
**Where:**

## What
The private repository's loops (release-6.0.0, 6.1.0, 6.2.0) and the Horde missions are written with Jarl 6.1.0; Jarl 6.2.0 changes the way the record is written (248, 245, 246, 252).

## Why



## Acceptance
On the copies: Jarl 6.2.0's status, resume, list, show, report and verify read every loop without errors and with the same numbers as 6.1.0; the Horde mission read by Jarl 6.2.0 and by Horde with the new vendored copy; Jarl 6.1.0 refuses a loop written in the new format with a clear message (252).

## Evidence


