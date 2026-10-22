# 010 · Jarl: tool fields explain themselves, and a wrong value type gets a message about the type

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
Through the tools a coordinator guessed field names: after takes id and ids, which the names do not say; evidence takes lists for ran and saw, and a plain string gave a JSON syntax error instead of a type message; body cannot append to a section; decide's --supersedes and decisions' live view were never found, so withdrawals were written as new rulings by hand.

## Why
The one-sentence tool summaries are the only text an agent reads before it calls; a field whose meaning is not in its name needs its example there.

## Acceptance
- Each tool field whose meaning is not obvious from its name carries a short example in its description (after, evidence, review, decide's supersedes, decisions' live view)
- A value of the wrong type is refused with a message naming the field and the type it takes
- body can append to a section as well as replace it
- Tests for the descriptions, the type message and the append

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

