# 581 · Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after …

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1335-vzsz
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340b-fable
**Where:** the review of 340
**Branch:** jarl/560-memory-rest
**Merged:** b56d54188 in Yggdrasil

## What
Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after printing a companion list that names a 65 MiB file. Seen once on a copy of the e2e-companion fixture with a 65 MiB .sql file mapped into the dependency; the cause was not established, and the branch of issue 340 was not tried with a companion that returns such a file by path.

## Why


## Acceptance


[test] yg aspect-test --dry-run for a reviewer rule whose companion names a 65 MiB file ends with a report naming the file and the limit, never exit 134, red before and green after (or the cause is shown not to exist on the release, with the reproduction recorded) · by: cd source/cli && npm test

## Changelog
- `yg aspect-test --dry-run` and `yg check --approve` report a companion file larger than 64 MiB instead of running out of memory. A reviewer rule whose companion returns such a file now leaves that pair without a verdict, naming the file and the limit, and the other pairs go on; with a small memory limit the run used to abort while numbering the lines of the file.

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say
- **approve** · by rev-560b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0405-zkfx
  Minor (known limitation, wording): core/fill-report.ts, the script parser-memory closing summary says 'Each report above names the rule and the file', but a report of the reading form (the parser ran out while the rule walked its trees) names no file, so that summary lists no file either; nothing is miscounted or misdirected. Round 1's findings are fixed: each cause names only its own files, the done line subtracts parser-memory and text-limit pairs from failed and adds up with plain failures and refusals mixed in, and every script rule parser-memory report ends with yg check --approve --only-deterministic while reviewer and companion reports keep yg check --approve. Tried to get past it: a crashing rule beside both causes still counts as failed and keeps the check.mjs words; the own-file, held and reading forms on the built tool all name the free run.

## Evidence

### Proof

- **ran (line 7faf3b599b73):** cd source/cli && npx vitest run tests/e2e/companion-over-limit.test.ts tests/unit/core/companion-resolve.test.ts (red on the base: aspect-test --dry-run under --max-old-space-size=256 with a 65 MiB companion ends with heap out of memory; the unit case returns no infra) · **saw:** green after: 18 tests passed; stderr names apps/e2e/tests/big.sql and 67108864, the pairs whose companions fit still print
- **ran (line 7faf3b599b73):** cd source/cli && npx vitest run tests/e2e/companion-over-limit.test.ts tests/unit/core/companion-resolve.test.ts, on fbf372dab and on d2cc7b6af · **saw:** green on the branch; red on the base: the dry-run under --max-old-space-size=256 prints the preview and dies with heap out of memory, and the unit case returns ok instead of infra

### Notes

Assumed: the exit 134 was reproduced only with the companion hook returning a 65 MiB file of one-character lines under a heap limit (node --max-old-space-size=128..1024 on the copy of the e2e-companion fixture with specs mapped as apps/e2e/tests/*, one scenario naming test: big.sql): the run aborts with 'JavaScript heap out of memory' while the prompt numbers the lines. At the default heap (and with ordinary line lengths, 65 MiB or 69 MiB, including through a pipe) the preview printed and exited 0 on the release, so the cause is the memory the prompt needs for a file past the text limit; the fix refuses such a companion with a report naming the file and the limit. The dry-run keeps its existing exit 0 for a unit it reports and skips.

