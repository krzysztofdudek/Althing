# 580 · Yggdrasil: a script rule's run holds the text of every own file of its component at once, even when…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1335-tamu
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340b-fable
**Where:** the review of 340
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: a script rule's run holds the text of every own file of its component at once, even when the rule reads only paths. Eight text files of 40 MiB in one component end yg check --approve --only-deterministic with heap out of memory under --max-old-space-size=256, on release/6.2.0 and on the branch of issue 340 alike; the crash is in allocating the next file's buffer. The same eight files at 65 MiB each pass on that branch, because files over 64 MiB are no longer read. So under the 64 MiB limit a component's rule run still costs the sum of its files.

## Why


## Acceptance


[test] A script rule that reads only paths does not hold its component's file texts; eight 40 MiB text files in one component pass yg check --approve --only-deterministic under --max-old-space-size=256, red before and green after · by: cd source/cli && npm test

## Changelog
- A script rule that reads only the paths of its component's files no longer makes `yg check` hold their text. Under a small memory limit, a component of several large text files used to stop `yg check --approve --only-deterministic` for running out of memory even though the rule never read them; a file's text is now read when a rule asks for it.

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say

## Evidence

### Proof

- **ran (line da5b691e38cf):** cd source/cli && npx vitest run tests/e2e/script-rule-paths-memory.test.ts (red on the base: heap out of memory, 8 text files of 40 MiB under --max-old-space-size=256) · **saw:** green after: 1 test passed, yg check --approve --only-deterministic exits 0 with no errors; tests/unit/bounty2/structure-infile.test.ts 35 passed
- **ran (line da5b691e38cf):** cd source/cli && npx vitest run tests/e2e/script-rule-paths-memory.test.ts, on fbf372dab and on d2cc7b6af; plus yg check --approve --only-deterministic under --max-old-space-size=256 on eight 40 MiB text files with a rule that reads one file's text, and with a rule that reports a line in every file · **saw:** green on the branch, red on the base (heap out of memory while allocating the next file's buffer). Both extra rules pass under 256 MiB on the branch; the reporting rule's marker in one file waives that file

