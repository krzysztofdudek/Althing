# 250 · Jarl SKILL.md: a short chapter on a loop driving several repositories; research → import where the jarl starts researchers; resume in the first lines; what to do with uncommitted work at opening

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** jarl, docs
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**After:** 244

## What
Remarks from the jarl of another project's loop (2026-10-05) and the experience of the 6.2.0 loop: the rules for several repositories are scattered (Code in another repository, the --repo row, the Files rule, the check row); importing findings.json is discoverable only by someone who already knows about it (the jarl of the loop in another project rewrote 56 issues by hand from reports); 'boot through resume' takes three paragraphs about the retired handoff; nowhere does it say what to do when a session with a lot of uncommitted work opens a loop (workers see only what is committed). Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (B.2 items 6, 8, 9 and W2, and "The docs budget"), from a field report from a loop in another project: a coordinator whose context was compacted acted on the summary instead of the record, and the cure is resume, not the retired handoff; the skill's "fresh one-shot reviewer" leaves unclear whether the reviewer of an earlier round may approve after a round, while the gate counts it as fresh (probe F); both field jarls under-used asks as the owner's background queue; and workers' free-text evidence ran long beside the rows. The skill is 104.6 KB today.

## Why
Two loops on one day stumbled over the same places; the cost (manual rewriting, a missing Check: line, a skipped resume, a coordinator acting on a summary) was large, and the fix is a few sentences.

## Acceptance
- SKILL.md rebuilt around the moments of work (you open a loop, session start: resume, you ask the owner through ask, you start researchers: findings.json → import, a loop over several repositories, you close), with the command documentation alongside; worker and reviewer briefs read the rulings in force; the material about handoff and composers moved out of the main path; the releasing-the-family skill routes questions to the owner through ask; a paragraph about uncommitted work when opening a loop.
- SKILL.md says that after a compaction, or any summary of your own context, you are starting a session: resume before the next action; a summary is not the state.
- One sentence on the reviewer after a round: the gate counts the earlier reviewer as fresh, and the loop's practice, for quality, is a new one-shot reviewer for each round, handed the earlier findings to check.
- One place says how a jarl works with an owner who is rarely there: a decision taken provisionally is decide plus ask --kind ratify --issue NNN, which blocks nothing and waits as long as he needs; a question the jarl cannot settle is ask --kind stuck --issue NNN, which holds only that issue.
- What free-text evidence is for: a line or two that explains, while the --ran/--saw rows prove; a worker's long report goes to the jarl, not into evidence.
- The operating manual's main path is smaller after the release than the 104.6 KB of today.
- At the end of the Jarl release, after the other packages (each of them changes SKILL.md).
- Growth, on the owner's word (ask a-018): the compaction sentence also goes into the instructions Jarl's MCP server hands the host (jarl-mcp.mjs:69 at 2c12aa3), which hosts keep in the session's standing instructions, so it survives the compaction that loses the skill.

## Evidence


