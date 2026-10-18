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
**After:** 309

## What
Remarks from the jarl of another project's loop (2026-10-05) and the experience of the 6.2.0 loop: the rules for several repositories are scattered (Code in another repository, the --repo row, the Files rule, the check row); importing findings.json is discoverable only by someone who already knows about it (the jarl of the loop in another project rewrote 56 issues by hand from reports); 'boot through resume' takes three paragraphs about the retired handoff; nowhere does it say what to do when a session with a lot of uncommitted work opens a loop (workers see only what is committed). Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (B.2 items 6, 8, 9 and W2, and 'The docs budget'), from a field report from a loop in another project: a coordinator whose context was compacted acted on the summary instead of the record, and the cure is resume, not the retired handoff; the skill's 'fresh one-shot reviewer' leaves unclear whether the reviewer of an earlier round may approve after a round, while the gate counts it as fresh (probe F); both field jarls under-used asks as the owner's background queue; and workers' free-text evidence ran long beside the rows. The skill is 104.6 KB today. Amended again by the design research/2026-10-11-jarl-model-calibration-and-field-notes/design.md, part B (notes 4, 8, 9, 11 and 14): weaker models drop formal steps, issue numbers leak into code and docs, handoff is still suggested in places, reviewers do not always record their verdict, and a fix once weakened a protection unnoticed. Amended by the architect's scope review of 2026-10-18 (sections 4, items 5, 6 and 15, and 7.1) and the ruling jarl-release-alone-with-every-jarl-issue: it absorbs the SKILL.md half of 309 (the workflow for many workers in worktrees), so that text has one home in SKILL.md; the sentence about the releasing-the-family skill leaves this issue for Althing's 314, since that skill lives in Althing; and the three Runes-pinned blocks of SKILL.md (mcp-first, evidence, worker-worktree) stay byte-identical, since a change inside them would need a Runes release first, so text moves around the blocks, never into them. The documentation review of 2026-10-18 found Critical and Important errors that no issue covered; they are fixed by 311, which runs on the text this rebuild leaves.

## Why
Two loops on one day stumbled over the same places; the cost (manual rewriting, a missing Check: line, a skipped resume, a coordinator acting on a summary) was large, and the fix is a few sentences. The briefs are where the slips that never reach the record are cured: a worker's missing proof passes unseen because the merger's own check row satisfies the done gate, and a verdict that the reviewer never recorded gets recorded by the coordinator in its name.

## Acceptance
- SKILL.md rebuilt around the moments of work (you open a loop, session start: resume, you ask the owner through ask, you start researchers: findings.json → import, a loop over several repositories, you close), with the command documentation alongside; worker and reviewer briefs read the rulings in force; the material about handoff and composers moved out of the main path; a paragraph about uncommitted work when opening a loop.
- SKILL.md says that after a compaction, or any summary of your own context, you are starting a session: resume before the next action; a summary is not the state.
- One sentence on the reviewer after a round: the gate counts the earlier reviewer as fresh, and the loop's practice, for quality, is a new one-shot reviewer for each round, handed the earlier findings to check.
- One place says how a jarl works with an owner who is rarely there: a decision taken provisionally is decide plus ask --kind ratify --issue NNN, which blocks nothing and waits as long as he needs; a question the jarl cannot settle is ask --kind stuck --issue NNN, which holds only that issue.
- What free-text evidence is for: a line or two that explains, while the --ran/--saw rows prove; a worker's long report goes to the jarl, not into evidence.
- The workflow for many workers in worktrees (309's SKILL.md half) is in SKILL.md where it is missing, in one place: the default mode with root set to the main checkout on every call; the merger, never a worker, commits .jarl/ in the committed mode; the coordinator files tickets, or a worker with root set to the main checkout; in-progress means held by a worker; list hides finished work and filters by tag, status, priority and text. The help text of 309 says the same, and neither copies the other's wording at length.
- The three Runes-pinned blocks (mcp-first, evidence, worker-worktree) are byte-identical after the rebuild, and runes-vendor.test.mjs is green; text that needs to change near them is placed outside them.
- The operating manual's main path is smaller after the release than the 104.6 KB of today, measured and recorded as a --ran/--saw row.
- At the end of the Jarl release, after the other packages (each of them changes SKILL.md), and before 311.
- Growth, on the owner's word (ask a-018): the compaction sentence also goes into the instructions Jarl's MCP server hands the host (jarl-mcp.mjs:69 at 2c12aa3), which hosts keep in the session's standing instructions, so it survives the compaction that loses the skill.
- Worker checklist (note 4): the worker brief ends with a closing checklist for every tier: the work is committed; red and green are recorded as --ran/--saw evidence rows, not only in the report; every check the brief names was waited for to its end; the changelog fragment is written; the report is sent. The reviewer brief says to read the rows: a worker's missing rows are an Important finding.
- No issue numbers in code or docs (note 8): the worker brief says that no loop issue number appears in code, comments, tests, docs or graph entries, gives the reason in the worker's own terms (the loop ends and the number then points nowhere), and allows the number only in the commit subject.
- The main path names only resume (note 9): handoff is mentioned nowhere on it; the handoff tool leaves the MCP tool list (jarl.mjs:369 at 2c12aa3, the generated table, through the table's internal mark, which the vendored Runes 1.0.0 honours), while 'handoff read' stays in the CLI until the next major; the two JSON keys and the archive row that keep it alive are cleaned or marked retired.
- The reviewer records its own verdict (note 11, root cause SKILL.md:475 at 2c12aa3, where the reviewer brief ends 'Return: verdict … and the findings'): the brief's last step is the recording call with its fields filled (by, model), and the reviewer's answer quotes the line review printed; a reviewer that returned without recording is resumed to record it, and the coordinator relays only when it cannot be resumed.
- A fourth reviewer question (note 14): for every review, and above all after a round, did the change or the fix weaken anything that worked or protected before (a mode, a default, a guard, a test)? Tests: the brief text carries each of the checklist items, the fourth question and the last recording step, and the MCP tool list has no handoff.

## Evidence


