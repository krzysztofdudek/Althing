# 033 · Jarl: a tip line written by an older Jarl's log command is trusted, record.mjs's comment omits tip lines, and a closed issue can show its gate as broken after its branch moves

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 002
**Found by:** rev-jarl-002-opus
**Where:** Review of 002 (2026-11-03)

## What
The pinned 6.1.0 driver's log command and Horde's vendored 6.1.0 record.appendLog still write a line of the shape '<id> tip <sha>', and this Jarl trusts it as the tip of a row. The comment above appendLog in record.mjs does not list tip lines among the lines it refuses. The views read the branch's tip each time, so a closed issue whose branch later moves, or is deleted with no tip recorded on its merge, shows its gate as not holding.

## Why
A forged tip line can keep proof alive across a pause; a false red on a closed issue misleads a coordinator.

## Acceptance
- A tip line counts only when the Jarl that wrote it is one that writes tip lines (a marker the older reader cannot produce), with a test that writes one through an older-shaped log line and sees it ignored
- record.mjs's comment lists tip lines, and a done issue's gate is judged against the tip recorded when it closed, with a test

## Evidence

