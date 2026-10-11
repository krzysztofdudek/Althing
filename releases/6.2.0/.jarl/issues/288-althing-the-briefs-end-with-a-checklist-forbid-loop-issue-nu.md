# 288 · Althing: the briefs end with a checklist, forbid loop issue numbers outside the commit subject, and the reviewer ends by recording its verdict and answers a fourth question

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** althing, docs, briefs
**Files:** Althing/releases/6.2.0/briefs/worker-althing.md, Althing/releases/6.2.0/briefs/worker-grain.md, Althing/releases/6.2.0/briefs/worker-horde.md, Althing/releases/6.2.0/briefs/worker-jarl.md, Althing/releases/6.2.0/briefs/worker-runes.md, Althing/releases/6.2.0/briefs/worker-yggdrasil.md, Althing/releases/6.2.0/briefs/reviewer.md
**Repo:** ../..
**Found by:** jarl-architect
**Source:** research/2026-10-11-jarl-model-calibration-and-field-notes#althing-mc-briefs-checklist
**Where:** Althing/releases/6.2.0/briefs/ (worker-*.md, reviewer.md), the design notes 4, 8, 11 and 14

## What
Althing worker briefs ask for the red-to-green proof in the report, which the session that reads it loses, so only 27% of the 6.2.0 units have evidence rows before review (the retro of research/2026-10-11-jarl-model-calibration-and-field-notes). Nothing in a worker brief forbids loop issue numbers in code or docs. The reviewer brief says to record the verdict in the middle of its text, not as its last step, and has three questions where a fourth is needed. These are the Althing counterparts of what 250 does in Jarl's own skill, applied to the briefs the 6.2.0 loop uses now.

## Why
Weaker models drop formal steps, and a missing step passes unseen because the merger's own check row satisfies the done gate. A closing checklist, a last concrete recording step and one more question are cheap and are read by every worker and reviewer; rows on the record serve the reviewer and the later metrics, a report does not.

## Acceptance
- Every worker brief ends with a checklist for every tier: the work is committed; red and green are recorded as jarl evidence --ran/--saw rows; every check the brief names was waited for to its end; the changelog fragment is written; no loop issue number appears in code, comments, tests, docs or graph entries (the number lives only in the commit subject), with the reason: the loop ends and the number then points nowhere; the report is sent
- reviewer.md reads the evidence rows and names a worker's missing rows an Important finding; asks as a fourth question whether the change or the fix weakened anything that worked or protected before (a mode, a default, a guard, a test), above all after a round; and its last step is the recording call with by and model filled, the answer quoting the line review printed
- A test or rail check proves each template carries the checklist items, the fourth question and the last recording step; yg check and npm test green

## Evidence

