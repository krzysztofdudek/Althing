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
Architect, section 3.5: only the profile declares a format; a loop without a profile has no version, so an older Jarl reading a newer record (names in Repo: from 247, multi-line questions from 248) silently misreads it. Jarl 6.1.0 refuses a bare name on write, but reads a name written into a file as a directory under the loop, silently: status --by repo and next go on as if nothing were wrong (probe H of the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, A.2 item 7). The only place Jarl 6.1.0 reads and refuses loudly is the profile's format key: every command that loads issues loads the profile first (jarl-lib.mjs:572 at 2c12aa3), and the format is checked before anything else (:307-308), ahead of the statuses the rest of the check requires, so list and status are both refused (probe I). So the marker is a profile.json holding only jarl-profile and format, raised by the first write that stores a name, not by a migration step. record.mjs:62 lists the profile's format as contract, with the value 1; whether a second value bumps jarl-record is the contract policy the previous architect left to the owner. This loop itself writes with Jarl 6.1.0 (jarl-pinned-in-loop), and the MCP tools in sessions are the installed version.

## Why



A record read wrong in silence is worse than one refused: an older Jarl would compute next, the views and the done gate over directories that do not exist. The marker must sit where the older Jarl already refuses, or it protects nothing.

## Acceptance
- The marker is .jarl/profile.json holding only jarl-profile and format. Jarl 6.2.0 accepts a profile that holds only those two and reads it as the built-in profile (declared: false), so status --json, the headers, report, import and the issue reader keep their shapes (jarl-lib.mjs:580, :1586, :3034, :3152, :3277, :3367)
- Any write that stores the first repository name (247), new --repo and import --repo included, raises the format before it writes the name, under the same lock; a loop without a marker is format 1 and reads as today
- Jarl refuses to write and read a loop in a newer format with a clear message, as it does today for the profile format
- Tests: the format-1 record read by the new Jarl; a format-only profile read with declared: false and the shapes above unchanged; Jarl 6.1.0 refusing a loop the new Jarl wrote with a name (list and status)

## Evidence


