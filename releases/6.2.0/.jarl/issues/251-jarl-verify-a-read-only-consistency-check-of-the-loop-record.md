# 251 · Jarl: verify — a read-only consistency check of the loop record (no lock, no network)

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:**
**After:** 246

## What
Architect, section 3.4: log.md is the event store of the done gate, and manual edits (the 006 strike-through, the 247 title change, goal.md lines) change the result silently. A check is needed that reads and reports, before identifiers or retractions arrive.

## Why



## Acceptance
- verify reports: log.md lines that look like events but cannot be parsed; foreign lines in asks.md; Repo: values that cannot be resolved or have a mismatching fingerprint; After pointing to non-existent issues; duplicated ruling slugs; unparsable issue headers; worktree leases that no repository names; unparsable goal.md machine lines. It tolerates edits that a composer makes by design (Horde's ruling fields).
- Tested on frozen copies of the private repository's loops (release-6.0.0, 6.1.0, 6.2.0): a predictable and documented result; exit 0 when clean, 2 when it found something.

## Evidence


