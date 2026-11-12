# 611 · Yggdrasil: three edges of the large-file rule: ctx.parseAst on a file over the text limit, a yg-suppress marker inside such a file, and the wording of the tree-too-large report

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1542-lixz
**Tags:** yggdrasil, rules
**Files:** 
**Repo:** Yggdrasil
**After:** 340
**Found by:** jarl
**Where:** rev-340c-fable, 340 round 3 (ctx-parsers.ts:101-110, hook-loader.ts:153-157 and :579, withheld-text.ts:131-135 and :154-156)
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
A rule that asks only for a tree through ctx.parseAst is stopped where file.ast is not; a waiver written in a large file stops counting, undocumented; and the report cites the 64 MiB text limit where the engine's string limit stopped it, and its advice starts paid reviewer pairs.

## Acceptance
- [test] ctx.parseAst(file) on a parsable file over the text limit gives the tree as file.ast does, and a yg-suppress marker inside a file over the limit waives as it does under it (or the CHANGELOG and docs/reviewers.md say it does not), each red before and green after · by: cd source/cli && npm test
- [read] The tree-too-large report names the limit that stopped it and its advice runs only free verdicts (yg check --approve --only-deterministic)

## Changelog
- `ctx.parseAst` gives a file over 64 MiB the tree `file.ast` gives, and a `yg-suppress` marker in such a file waives. The markers of such a file are read line by line, as they are in a file with no grammar. Rules that ask for the syntax tree of a file too large to parse get a report naming the limit that stopped them, and its advice runs only free verdicts (`yg check --approve --only-deterministic`).

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say
- **approve** · by rev-560b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0405-zkfx
  Minor (known limitation, wording): core/fill-report.ts, the script parser-memory closing summary says 'Each report above names the rule and the file', but a report of the reading form (the parser ran out while the rule walked its trees) names no file, so that summary lists no file either; nothing is miscounted or misdirected. Round 1's findings are fixed: each cause names only its own files, the done line subtracts parser-memory and text-limit pairs from failed and adds up with plain failures and refusals mixed in, and every script rule parser-memory report ends with yg check --approve --only-deterministic while reviewer and companion reports keep yg check --approve. Tried to get past it: a crashing rule beside both causes still counts as failed and keeps the check.mjs words; the own-file, held and reading forms on the built tool all name the free run.

## Evidence

### Proof

- **ran (line 0c455b563cc0):** cd source/cli && npx vitest run tests/unit/structure/rule-text.test.ts tests/unit/core/suppress-scan-pieces.test.ts (8 of the new cases red with the 611 source changes reverted: ctx.parseAst on a file over the limit, the two report wordings, a marker in a file over the limit in a node, a nodeless unit and a given file) · **saw:** green after: 24 + 23 tests passed; ctx.parseAst gives program/true, markers waive in .ts, .sql, nodeless and given files, a reasonless marker fails only its rule
- **ran (line 0c455b563cc0):** cd source/cli && npx vitest run tests/unit/structure/rule-text.test.ts tests/unit/core/suppress-scan-pieces.test.ts, on fbf372dab and on d2cc7b6af; plus peak resident size of yg check --approve --only-deterministic with a rule calling ctx.parseAst, file.ast or only paths on a 70 MiB and a 60 MiB .ts file · **saw:** green on the branch; 8 rule-text cases red on the base. ctx.parseAst on the 70 MiB file gives the program tree; peak 694 MB against 688 MB for file.ast and 660 MB for a paths-only rule, 704 MB when called three times, 606 MB for the 60 MiB file: no cost beyond what file.ast already had

