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
**After:** 251

## What
In the 6.2.0 loop the jarl asked the owner through the host's choice window (options with consequences and a recommendation), and copied the answer into decide --by owner with the note '(option label)'. ask/answer exist and turn an answer into a ruling — the jarl did not use them (an error of practice, not of Jarl) — but even through ask the record neither contains the options offered nor distinguishes the chosen label from the owner's words. On reflection: this is pure record-keeping (consistent with 'What Jarl will not grow'); it adds no new kind of question and blocks nothing.

## Why
A ruling 'chose option B' without the list of options loses its meaning over time; the audit of decisions (who chose what against which alternatives) is the main value of the record.

## Acceptance
- ask accepts an optional, repeatable --option "<label>: <effect>" and --recommend <label> and prints the question with options ready to be put in the host's choice window; a yes/no question without options works as it does today.
- answer accepts --option <label> or text; the ruling quotes the options offered and marks the chosen one, or quotes the person's own words — never one pretending to be the other; an answer to a ratify item requires --by and rejects coordinator names (jarl, reeve, coordinator, the loop's name).
- decide <slug> "…" --by jarl --ratify files a ratify item in the same move; decide --by owner without a question in the record prints a notice on stderr; changes only in the CLI and MCP — record.mjs unchanged in 6.2.0.

## Evidence


