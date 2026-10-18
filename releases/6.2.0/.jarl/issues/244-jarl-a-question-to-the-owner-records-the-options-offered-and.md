# 244 · Jarl: a question to the owner records the options offered, and the answer — which one he chose, or that he answered in his own words

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, ask
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**After:** 322

## What
In the 6.2.0 loop the jarl asked the owner through the host's choice window (options with consequences and a recommendation), and copied the answer into decide --by owner with the note '(option label)'. ask/answer exist and turn an answer into a ruling — the jarl did not use them (an error of practice, not of Jarl) — but even through ask the record neither contains the options offered nor distinguishes the chosen label from the owner's words. On reflection: this is pure record-keeping (consistent with 'What Jarl will not grow'); it adds no new kind of question and blocks nothing. Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (B.2 items 6 and 7), from a field report from a loop in another project, where the owner is rarely available: asks are already the owner's background queue (ratify blocks nothing, stuck --issue holds one issue, both listed by status and resume), but answering is one id per call (jarl.mjs:338 at 2c12aa3), and when the owner looks at several ratify items and says yes to all of them (this loop's ruling ask-015 is that case) the jarl answers them one by one; and nothing ties a ruling's supersession to the open issues whose What, Why or Acceptance cite it, so the moment to rewrite them passes unnoticed. Rejected: ask --defer and an owner tag (asks are the queue; a tag would duplicate it).

## Why
A ruling 'chose option B' without the list of options loses its meaning over time; the audit of decisions (who chose what against which alternatives) is the main value of the record. Cheap answering is what makes asks a queue an owner who is rarely there can clear in one sitting, and a supersession is the one moment the jarl can rewrite every issue that cites the old ruling.

## Acceptance
- ask accepts an optional, repeatable --option "<label>: <effect>" and --recommend <label> and prints the question with options ready to be put in the host's choice window; a yes/no question without options works as it does today.
- answer accepts --option <label> or text; the ruling quotes the options offered and marks the chosen one, or quotes the person's own words — never one pretending to be the other; an answer to a ratify item requires --by and rejects coordinator names (jarl, reeve, coordinator, the loop's name).
- decide <slug> "…" --by jarl --ratify files a ratify item in the same move; decide --by owner without a question in the record prints a notice on stderr; changes only in the CLI and MCP — record.mjs unchanged in 6.2.0.
- Growth, on the owner's word (ask a-018): answer takes several ratify ids with one verdict and writes one ruling each, each naming the batch it was answered in; decide --supersedes <slug> prints on stderr the open issues whose What, Why or Acceptance name the old slug, so the jarl rewrites them at once; tests for both.
- The several ids of answer come as one comma list in the same argument, and the MCP tool's field keeps its name id (architect's scope review of 2026-10-18, section 4, item 12): a caller of 6.1.0's jarl_answer that passes one id works unchanged; tests for one id and a list through the CLI and the MCP tool.

## Evidence


