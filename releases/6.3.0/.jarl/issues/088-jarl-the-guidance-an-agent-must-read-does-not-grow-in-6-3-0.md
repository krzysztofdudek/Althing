# 088 · Jarl: the guidance an agent must read does not grow in 6.3.0

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** design, docs
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-word-budget
**Where:**
**After:** 052, 058, 085, 086, 096

## What
Maintenance critique C3: the model adds commands and concepts, and nothing removed prose. Report section 12 names the prose it retires.

## Why
33,800 words of guidance is the cost every coordinator pays; the gain of next --as and briefs is that the steps live in the tool.

## Acceptance
- The reeve section and its relay text of references/jarl.md move into the coordinator's guidance; the daily commands table of SKILL.md gives way to next --as; role step lists become built-in rules quoted from the references, not restated
- At the end of 6.3.0 SKILL.md and the role references (jarl, worker, reviewer, merger, composers) are no longer, in words, than at 71ebc5b, and a test checks it

## Evidence

- **ran:** Opus simulation of the loop (2026-11-08): wc -w of SKILL.md and the five role references at the tip 89bb93b against 71ebc5b · **saw:** 19,386 words against 13,856, about 40 percent over the budget this issue sets; much is tool internals no agent acts on (the citation grammar, the artifact path allowlist, the shell-quoting paragraph repeated five times)

