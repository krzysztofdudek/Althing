# 252 · Jarl: a loop record format version marker; an older Jarl loudly refuses a newer record

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:**
**After:** 249

## What
Architect, section 3.5: only the profile declares a format; a loop without a profile has no version, so an older Jarl reading a newer record (e.g. names in Repo: from 246, multi-line questions from 248) will silently misread it. This loop itself writes with Jarl 6.1.0 (jarl-pinned-in-loop), and the MCP tools in sessions are the installed version.

## Why



## Acceptance
init records a format marker; the first write in a newer format raises it; Jarl refuses to write and read a loop in a newer format with a clear message (as it does today for the profile format); a loop without a marker is format 6.1.0; test: the 6.1.0 format read by the new Jarl, the new format rejected by the old code.

## Evidence


