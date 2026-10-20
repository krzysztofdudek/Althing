# 288 · Althing: the briefs end with a checklist, forbid loop issue numbers outside the commit subject, and the reviewer ends by recording its verdict and answers a fourth question

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** althing, docs, briefs
**Files:** Althing/releases/6.2.0/briefs/worker-althing.md, Althing/releases/6.2.0/briefs/worker-grain.md, Althing/releases/6.2.0/briefs/worker-horde.md, Althing/releases/6.2.0/briefs/worker-jarl.md, Althing/releases/6.2.0/briefs/worker-runes.md, Althing/releases/6.2.0/briefs/worker-yggdrasil.md, Althing/releases/6.2.0/briefs/reviewer.md
**Repo:** ../..
**Found by:** jarl-architect
**Source:** research/2026-10-11-jarl-model-calibration-and-field-notes#althing-mc-briefs-checklist
**Where:** Althing/releases/6.2.0/briefs/ (worker-*.md, reviewer.md), the design notes 4, 8, 11 and 14
**Branch:** jarl/288-briefs-checklist
**Merged:** 82a57c4 in ../..
**CI:** pending

## What
Althing worker briefs ask for the red-to-green proof in the report, which the session that reads it loses, so only 27% of the 6.2.0 units have evidence rows before review (the retro of research/2026-10-11-jarl-model-calibration-and-field-notes). Nothing in a worker brief forbids loop issue numbers in code or docs. The reviewer brief says to record the verdict in the middle of its text, not as its last step, and has three questions where a fourth is needed. These are the Althing counterparts of what 250 does in Jarl's own skill, applied to the briefs the 6.2.0 loop uses now.

## Why
Weaker models drop formal steps, and a missing step passes unseen because the merger's own check row satisfies the done gate. A closing checklist, a last concrete recording step and one more question are cheap and are read by every worker and reviewer; rows on the record serve the reviewer and the later metrics, a report does not.

## Acceptance
- Every worker brief ends with a checklist for every tier: the work is committed; red and green are recorded as jarl evidence --ran/--saw rows; every check the brief names was waited for to its end; the changelog fragment is written; no loop issue number appears in code, comments, tests, docs or graph entries (the number lives only in the commit subject), with the reason: the loop ends and the number then points nowhere; the report is sent
- reviewer.md reads the evidence rows and names a worker's missing rows an Important finding; asks as a fourth question whether the change or the fix weakened anything that worked or protected before (a mode, a default, a guard, a test), above all after a round; and its last step is the recording call with by filled and the reviewer's model written into the findings text, the answer quoting the line review printed. This loop's driver is Jarl 6.1.0 (jarl-pinned-in-loop), which refuses review --model, so the model rides in the findings text, as the loop already does, until a loop's driver is Jarl 6.2.0 (architect's scope review of 2026-10-18, section 4, item 14)
- A test or rail check proves each template carries the checklist items, the fourth question and the last recording step, and that no template passes --model to a command of the 6.1.0 driver; yg check and npm test green

## Evidence

- **ran:** node --test workspace/test/brief-templates.test.mjs · **saw:** before the text change: tests 7, pass 1, fail 6 (the checklist, fourth question, missing-rows, last-step and merger tests fail)
- **ran:** node --test workspace/test/brief-templates.test.mjs · **saw:** after the text change, commit ecd8528: tests 6, pass 6, fail 0; with the merger test restored in fdd8a8b: tests 7, pass 7, fail 0
- **ran:** node --test "rails/test/*.test.mjs" "workspace/test/*.test.mjs" · **saw:** final run on the branch tip fdd8a8b: tests 97, pass 97, fail 0

