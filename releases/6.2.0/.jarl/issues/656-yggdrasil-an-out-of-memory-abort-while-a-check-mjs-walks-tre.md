# 656 · Yggdrasil: an out-of-memory abort while a check.mjs walks trees it was given (not while parsing) st…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2026-ymbj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561-opus
**Where:** the review of 561, 610
**Branch:** jarl/560-memory-rest
**Merged:** b56d54188 in Yggdrasil

## What
Yggdrasil: an out-of-memory abort while a check.mjs walks trees it was given (not while parsing) still ends check-failed-to-run with Aborted() and 'Fix the bug in check.mjs', and the worker thread is kept. Seen with two dense JSON arrays of 6.8 MiB on one node, each passing the trial parse alone, read by a rule calling file.ast.rootNode.descendantsOfType('number'); the same on release/6.2.0. det-worker-core.ts:144 replaces a worker only when the abort came from a parse. Minor.

## Why


## Acceptance


[test] An out-of-memory abort while a check.mjs walks trees it was given is reported as the parser-memory case with no Aborted() and no blame on check.mjs, and the worker is replaced, red before and green after · by: cd source/cli && npm test

## Changelog
- A script rule's pair left unverified because the parser had no memory for a syntax tree it asked for, or because the rule asked for the text or tree of a file larger than a rule can be given, is no longer reported as a `check.mjs` that failed to run. `yg check --approve` heads such pairs `left unjudged` and names the cause, `parser-out-of-memory` or `file-over-text-limit`, in `--json`; its closing summary names the files and no longer says to fix `check.mjs`. A rule that really fails keeps `check-failed-to-run`.

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say
- **approve** · by rev-560b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0405-zkfx
  Minor (known limitation, wording): core/fill-report.ts, the script parser-memory closing summary says 'Each report above names the rule and the file', but a report of the reading form (the parser ran out while the rule walked its trees) names no file, so that summary lists no file either; nothing is miscounted or misdirected. Round 1's findings are fixed: each cause names only its own files, the done line subtracts parser-memory and text-limit pairs from failed and adds up with plain failures and refusals mixed in, and every script rule parser-memory report ends with yg check --approve --only-deterministic while reviewer and companion reports keep yg check --approve. Tried to get past it: a crashing rule beside both causes still counts as failed and keeps the check.mjs words; the own-file, held and reading forms on the built tool all name the free run.

## Evidence

### Proof

- **ran (line cd9916221828):** cd source/cli && npx vitest run tests/e2e/unverified-by-input-limits.test.ts (case 1: two 6.8 MiB JSON arrays walked with descendantsOfType; red on the base only for the cause, the heading and the summary) · **saw:** green after: no Aborted(), no 'Fix the failing check.mjs', no check-failed-to-run in the output, cause parser-out-of-memory
- **ran (line cd9916221828):** cd source/cli && npx vitest run tests/e2e/unverified-by-input-limits.test.ts; plus two 6.8 MiB dense JSON arrays walked with descendantsOfType, debug: true, on d2cc7b6af and fbf372dab · **saw:** base: no Aborted(), one 'replacing the worker' line in the debug log, but cause check-failed-to-run and 'Fix the failing check.mjs'; branch: the same replacement, cause parser-out-of-memory, heading left unjudged, no check.mjs blame. The worker's claim that only the cause, heading and summary needed a change holds

### Notes

Assumed: on release/6.2.0 as it stands, two dense JSON arrays of 6.8 MiB on one node read by file.ast.rootNode.descendantsOfType('number') already end as the parser-memory report ('The parser ran out of memory while rule ... read the syntax trees it was given'), with no Aborted() and no Fix the bug in check.mjs in the pair's report, and the worker IS replaced (debug log: 16 'replacing the worker' lines for 16 pairs through the pool). What still blamed check.mjs was the cause (check-failed-to-run), the heading and the closing summary; those are fixed with 639 and 655.

