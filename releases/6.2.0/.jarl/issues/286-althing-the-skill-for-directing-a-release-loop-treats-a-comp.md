# 286 · Althing: the skill for directing a release loop treats a compaction as a session start (ws jarl resume before acting)

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261008T1145-jtda
**Tags:** althing, docs
**Files:** Althing/.claude/skills/directing-a-release-loop/SKILL.md, Althing/AGENTS.md
**Repo:** ../..
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#althing-fr-compaction
**Where:** Althing/AGENTS.md section 2 (session start); Althing/.claude/skills/directing-a-release-loop/SKILL.md, Resume
**Worker:** jarl
**Model:** claude-opus-5-5
**Since:** 2026-11-11 09:37

## What
A coordinator of a loop in another project whose context was compacted acted on the summary instead of the record (the field report's "works badly" item; the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, B.2, W2). Althing's session start (AGENTS.md, section 2) and its skill for directing a release loop (the "Resume" section) say nothing about a compaction. Jarl's own skill gets the same sentence in 250.

## Why
The state is the live record, which resume assembles in under a second. A summary of one's own context is the one input that looks like the state and is not.

## Acceptance
- One sentence in the skill's Resume section and one in AGENTS.md's session start: after a compaction, or any summary of your own context, run ws jarl resume before the next action; a summary is not the state
- yg check && npm test green

## Evidence

### Notes

Two sentences added on main in 00da0d8eddede034990cacd5d7a6afbcb9c850c6: AGENTS.md section 2 item 4 and the Resume section of directing-a-release-loop; yg check and npm test green.

