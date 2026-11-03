# Where a unit's time goes, 6.2.0 loop

A check of the premise behind the question (Jarl is slow because it is often one issue, one review), made before the pilot is designed. Script: [time-by-unit.mjs](time-by-unit.mjs), run as `node time-by-unit.mjs` (read-only; prints the tables below).

## Method

- A unit is a branch: every issue whose `→ in-progress` log line names that branch. Lease start is the earliest such line, merge the latest `merged` line of any of its issues. Units with no merge or no verdict are left out (127 remain).
- A review is a group of `review approve|changes` lines with the same minute and the same reviewer name; its issue count is the size of the group.
- Work and review time are split per round at the last `evidence row` line of the unit before each verdict: from the round's start (the lease, or the previous verdict) to that row is work; from that row to the verdict is raising and running the reviewer. A round with no evidence row in its window is left out of these two rows (122 of the rounds remain), and a worker that wrote its evidence row late makes its review look shorter.
- Timestamps have minute precision. Units in Grain and Yggdrasil are included here (the log is enough; no commit is read), unlike the size tables.

## Results

### Issues per recorded verdict (same minute, same reviewer)

| issues | verdicts |
|---|---|
| 1 | 135 |
| 2 | 57 |
| 3 | 23 |
| 4 | 18 |
| 5 | 1 |
| 6 | 6 |

### Units by issues per unit (merged, with at least one verdict)

| issues per unit | units | median lease to merge, min | median per issue, min | mean reviews per unit | units with a changes verdict |
|---|---|---|---|---|---|
| 1 | 44 | 47 | 47 | 1.80 | 24 |
| 2 | 37 | 53 | 27 | 1.86 | 17 |
| 3 | 20 | 77 | 26 | 1.65 | 10 |
| 4 to 6 | 26 | 67 | 17 | 2.08 | 16 |

### Phases of a unit, minutes (median · p25 · p75 · p90)

| phase | n | minutes |
|---|---|---|
| lease to first verdict | 127 | 41 · 27 · 93 · 787 |
| first verdict to last verdict | 127 | 6 · 0 · 17 · 70 |
| last verdict to merge | 127 | 5 · 2 · 10 · 38 |
| lease to merge | 127 | 56 · 37 · 127 · 1857 |
| round start to the last evidence row before the verdict: work | 122 | 14 · 7 · 26 · 74 |
| that evidence row to the verdict: raising and running the reviewer | 122 | 8 · 4 · 20 · 32 |

## What it says

- In 6.2.0, one review per issue was not the common shape: 83 of 127 merged units were packages of 2 to 6 issues on one branch with one review, and 105 of 240 reviews covered more than one issue.
- Per issue, packages were faster: the median per issue falls from 47 minutes alone to 17 in a package of four or more, while reviews per unit stay close (1.80 against 2.08) and a changes verdict comes about as often (24 of 44 alone, 16 of 26 in the largest packages).
- A review is the smaller part of a round: at the median 8 minutes from the worker's last evidence row to the verdict, against 14 minutes of work.
- The long tail is not review: 13 of 127 units took more than 30 hours from lease to merge, and 83% of their summed time lies before the first verdict, 16% between the first and the last verdict.

## What it does not say

- Whether a shared review misses more than single reviews: a changes verdict as often says nothing about what was not found. That needs a known answer (part 2).
- The coordinator's own time between steps (writing briefs, reading reports, deciding what runs next) is not in the record at all, nor is the time no unit was in flight.
- Package and single units differ in what they held; the per-issue gain mixes one worker doing several issues with one reviewer reading them.
