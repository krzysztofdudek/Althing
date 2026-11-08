# What the two real loops say

The critics were right that the first draft read Jarl's gaps from a simulation. This note reads the record of the family's two largest loops: `releases/6.3.0` (223 issues, Althing at 897afdb, still open) and `releases/6.2.0` (529 issues). [real-loop.mjs](real-loop.mjs) prints every number below; run it with the directory that holds `.jarl`. Both loops were written by a format-1 driver, so a body line names no writer, and both were run mostly by one strong session on strong models. Neither says how a mid-model coordinator or a light worker behaves.

## Where the issues spent their time

Hours, for the issues with a lease, a merge and a done.

| Stage | 6.3.0 (n 160) median / p90 / sum | 6.2.0 (n 288) median / p90 / sum |
|---|---|---|
| filed to first lease | 36.25 / 196.2 / 10,206 | 5.83 / 182.7 / 14,365 |
| lease to first proof row | 0.40 / 0.93 / 342 | 0.75 / 33.1 / 4,380 |
| first row to first verdict | 0.45 / 25.9 / 540 | 0.30 / 0.92 / 44 (n 105) |
| first verdict to last approve | 0.00 / 1.12 / 142 | 0.00 / 0.63 / 712 |
| last approve to merge | 0.18 / 0.72 / 162 | 0.13 / 2.48 / 377 |
| merge to done | 0.00 / 0.00 / 1 | 0.00 / 0.08 / 55 |

Of all issue-hours, 90% in 6.3.0 and 72% in 6.2.0 lie before the first lease. These are calendar hours, so they include nights, paused sessions and, in 6.3.0, the days between filing on 2026-10-22 and the start of work on 2026-11-03. Once an issue starts it moves in about an hour. The real loops show no stage in front of which work piled up as a rule. The tail does: the p90 of 25.9 hours to a first verdict in 6.3.0 comes from packages built and left unreviewed across a pause, which `releases/6.3.0/plans/resuming-on-another-machine.md` describes.

Peak of issues in flight at once: 20 in 6.3.0 and 45 in 6.2.0 (first lease to last done, so built-and-waiting work counts). Days with a close: 5 and 9, at about 33 closed issues a day in both.

## Outcomes

| | 6.3.0 | 6.2.0 |
|---|---|---|
| reviewed and done | 163 | 294 |
| clean on the first pass (no `changes`, no round) | 108 (66%) | 215 (73%) |
| `changes` verdicts | 99 on 55 issues | 111 on 86 issues |
| rounds | 42 on 20 issues | 13 on 8 issues |
| a round whose last verdict before it was an approve (a red after review) | 0 | 0 |
| issues with more than one worker name | 23 of 167 leased | 3 of 303 leased |
| of those, closed with no proof row by the last worker | 0 | 0 |
| acceptance edited after the lease | 3 of 167 (003, 066, 143) | 9 of 303 |
| issues declaring Files | 6 of 223 | 405 of 529 |
| empty Why | 57 of 223 | 86 of 529 |
| titles filed twice | 0 | 0 |
| questions to the owner (of which ratify) | 23 (10) | 32 (19) |

From 6.3.0's own `report --metrics`: cycle time median 1.4 h, p90 27.4 h; lead time median 39.3 h; reopened 1 of 223; fresh reviews of code 160 of 160; follow-ups within 7 days 17 of 163 closed (their share is "no data" until the window has passed). Of 74 rulings, the owner made 52 and the jarl 22. The coordinator of this loop sent 71 worker and reviewer briefs, 16.8 KB on average.

## Every failure the concept claims, against the record

| Claimed failure | Real case | Where |
|---|---|---|
| a worker narrows what it must prove | **none attributable.** 12 post-lease edits of 470 leases; a format-1 line names no writer; notes give 003 to the jarl and tie 143 to an owner's ruling | log; 6.3.0 decisions |
| a worker sets the tag that lightens its review | **none found** | log |
| a worker makes a ruling | **none.** 52 by the owner, 22 by the jarl | decisions.md |
| a replaced worker's proof closes its successor's issue | **none.** 0 of 26 issues with several workers closed on the predecessor's rows | real-loop.mjs |
| a worker presumed dead writes after a handover | **none found** | log |
| a second merger in one checkout | **none.** The log's one mention is the filing of 220. One reader (this research) ran the tool from the checkout a merger had mid-merge, and the tool failed to load; nothing was lost | log; simulation.md |
| a second reviewer raised on work under review | **none found**, and the format-1 record could not show one | log |
| a takeover forgotten after a compaction (215) | **none found**; simulation only | simulation.md |
| a red at the merge after a review | **none recorded.** 0 of 448 | real-loop.mjs |
| a filing repeated after a lost reply | **none.** 0 titles filed twice in 752 issues | real-loop.mjs |
| a worker stuck and unseen | **real.** Twice in a five-day loop: a permission prompt nobody could answer, and an idle holder of a shared lock | field report, item 7 |
| a convention lost at a compaction | **real.** About 80 minutes of a blocked coordinator | research/2026-11-03-jarl-as-a-loop-tool, report |
| a proof row for a command never run | **real.** A light worker in the 6.3.0 loop | same report, section 6 |
| briefs written by hand | **real.** 71 briefs averaging 16.8 KB here; about 30 reviewer briefs with the same 8 rules in about 90 messages in the field report | scratch folder of this loop's coordinator; field report |
| the owner's digest is partial when two loops are open | **real.** 6.2.0 is open with 1 question and 7 ratify items that 6.3.0's digest does not show | `status` of both loops |
| merge conflicts when files are not declared | **real and cheap.** Import lines in 031, 083 and package A | log |
| intent missing from an issue | **real.** 57 of 223 and 86 of 529 have an empty Why | real-loop.mjs |

So every claim that a loop fails through an agent cheating under its own name rests on outside evidence and on the fact that the tool allows it. The two real loops show none of it. They ran strong models under a strong director; the 6.3.0 release is the first to put light workers and mid coordinators in the field.
