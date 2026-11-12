# 663 · Yggdrasil: a 3.9 MiB TypeScript file holding one array of two million numbers keeps a plain yg check busy for over four minutes

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2138-uhgs
**Tags:** yggdrasil, performance
**Files:** 
**Repo:** Yggdrasil
**After:** 561
**Found by:** jarl
**Where:** w-561-fable, 561 round 2 report
**Branch:** jarl/560-memory-rest

## What


## Why
A generated data file of a few megabytes is common in real repositories; a check that sits for minutes on one looks hung, and nothing tells the user which file holds it.

## Acceptance
[test] yg check on a repository holding a 3.9 MiB TypeScript file of one array of two million numbers ends within a bound the test states, or names the file it is slow on, red before and green after · by: cd source/cli && npm test

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say

## Evidence

### Proof

- **ran (line e21054c05027):** plain yg check twice on a scratch git repository with src/data/numbers.ts of 2,000,000 numbers (one array of digits, 4.0 MB; a spaced form, 6.4 MB; nested one-element arrays, 4.0 MB; the digits form with a yg-suppress marker) imported from another node, on d2cc7b6af and fbf372dab; plus yg check --approve --only-deterministic with a rule reading file.ast · **saw:** no slow case: first run 6.2 to 6.7 s, second 0.16 to 0.18 s on both trees; with the marker 9.1 s and 3.6 s; with the rule 9.4 s and 0.19 s. The fault does not reproduce on this base; no test was written for the line

### Notes

Assumed: the fault does not hold on release/6.2.0 (tip d2cc7b6af, with 340 and 561 merged), so nothing is changed for it. Tried: a mapped src/data/numbers.ts of one array of 2,000,000 one-digit numbers (4,000,023 bytes, 3.8 MiB), plain yg check --json, in a scratch repository, with and without git, with and without another node importing it, sizes 0.4 / 1 / 2 / 4 MB: 0.86 s, 1.7 s, 3.2 s, 6.2 s (linear, about 1.5 s per MB), a second run 0.18 s from the content-addressed fact cache. The time of the first run is spent in the relation pass's per-file child process (parse and fact extraction); the main thread is idle in spawnSync. No four-minute case was seen.

Dropped: Does not reproduce on release/6.2.0 or on the branch: a plain yg check on a 2,000,000-number array file (4.0 to 6.4 MB, three layouts) takes 6.2 to 6.7 s the first time and 0.16 to 0.18 s after, linear in size, measured by w-560-sonnet and rev-560-opus; the minutes of the report came before 340 and 561. A timing test would be flaky, so the issue closes on these measurements.

