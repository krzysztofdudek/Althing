# 192 · Jarl: a tip line carries a mark an older log command cannot write, so an older Jarl's line never counts as a row's tip

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** skills/jarl/scripts/lib/log.mjs and lib/loop.mjs: the tip line; follows issue 033

## What
Issue 033 made a tip line count only as the next line after its row under the same stamp, but a tip line written by an older Jarl's log command in the same minute and directly after its row still counts as that row's tip. The owner (2026-11-08, a-018) chose to close this with a tip mark before the separator that an older log command cannot write.

## Why
A forged or accidental tip line should not keep proof alive across a pause.

## Acceptance
A tip line counts only when it carries the mark; the first write of a tip raises the loop to record format 3 and never raises a loop that records no tip; the pinned 6.1.0 driver and the installed 6.2.0 Jarl refuse such a loop with their own message; a tip line without the mark (written by an older log command) never counts, with a test that writes one through the pinned driver; the closed-issue gate of this loop's 111 done issues does not start to fail (compare views on a copy of the real loop)

## Changelog
- Added: A tip line carries a mark that only this Jarl writes, so a line written by an older Jarl never counts as the tip of a row.

## Evidence

