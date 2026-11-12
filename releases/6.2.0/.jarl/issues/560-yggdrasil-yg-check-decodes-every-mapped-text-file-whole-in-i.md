# 560 · Yggdrasil: yg check decodes every mapped text file whole in its scan for suppress markers without a…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1150-tetf
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340-fable
**Where:** the review of 340
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: yg check decodes every mapped text file whole in its scan for suppress markers without a reason, so the heap must hold the largest mapped text file
After the relation pass stopped keeping text (issue 340), one reader of whole files is left in a plain yg check: runSuppressionsScan in source/cli/src/core/suppressions/scan.ts:150-157 reads each mapped file into a buffer, probes it for binary content, and decodes each text file into one string to look for the marker token. A trace of every decode over 10 MiB on the 340 branch shows this call and no other. Measured on that branch: two text files and two .bin files of 100 MiB each die under --max-old-space-size=64 and finish at 128 with peak heap 220 MiB and 304 MiB of buffers; with 24 MiB files the peak is 68 MiB against 24 MiB with 1 MiB files. The files are read one at a time, so the need is the largest text file and not the sum. A binary file is read whole to probe its first 8000 bytes. The same code is on release/6.2.0. A streamed search for the token would keep the scan flat.

## Why


## Acceptance


[test] yg check's scan for suppress markers reads a mapped text file in bounded pieces, so two 100 MiB text files pass under --max-old-space-size=64 with every marker still found, red before and green after · by: cd source/cli && npm test

## Changelog
- `yg check` and `yg suppressions` read a mapped text file in pieces when they look for `yg-suppress` markers, so a text file larger than the memory they are given no longer stops them. Every marker in such a file is still found and reported. A source file over 64 MiB, which no syntax tree is built for, has its markers read line by line, as a file in a language with no grammar has.

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say

## Evidence

### Proof

- **ran (line 1d5ec62219d2):** cd source/cli && npx vitest run tests/e2e/suppress-scan-large-files-memory.test.ts tests/unit/core/suppress-scan-pieces.test.ts (red on the base: yg check under --max-old-space-size=64 died with heap out of memory on two 100 MiB text files) · **saw:** green after: 19 tests passed; yg check under --max-old-space-size=64 reports all 6 missing-reason markers of the two 100 MiB files
- **ran (line 1d5ec62219d2):** cd source/cli && npx vitest run tests/e2e/suppress-scan-large-files-memory.test.ts tests/unit/core/suppress-scan-pieces.test.ts, on fbf372dab and with these files copied onto d2cc7b6af; plus yg suppressions --json on a scratch repository with markers straddling the 1 MiB read boundary · **saw:** green on the branch; red on the base: the e2e dies with JavaScript heap out of memory under --max-old-space-size=64, the unit cases fail on missing exports. Boundary probe: a token split at byte 1048576 in .sql and .ts, a 2-byte and a 4-byte character split at the boundary, CRLF, and a Markdown fence opened before and closed after the boundary give the same markers, lines and reasons on the branch as on the base

