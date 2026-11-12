# 688 · Yggdrasil: when the parser has no memory for a subject of a reviewer rule, the closing summary of y…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0018-rxid
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561c-opus
**Where:** the review of 561, 610, 672, 673
**Branch:** jarl/560-memory-rest
**Merged:** b56d54188 in Yggdrasil

## What
Yggdrasil: when the parser has no memory for a subject of a reviewer rule, the closing summary of yg check --approve counts the pair among provider and configuration failures: '1 pair failed on provider/config errors — re-running will not help until the connection/config is fixed (ollama / standard). Cause: the parser ran out of memory on src/alpha/f1.ts', with the fix 'Fix the reviewer connection or configuration ... To unblock CI without a reviewer, set the affected rules to status: draft'. core/review-package.ts returns the pair as an infra disposition. The pair's own report and the check's error block name the file and the reason. The reviewer-rule counterpart of issues 655 and 673. Minor.

## Why


## Acceptance


[test] When the parser has no memory for a reviewer rule's subject, yg check --approve's closing summary counts the pair apart from provider and configuration failures and names the file and the way out, red before and green after · by: cd source/cli && npm test

## Changelog
- The closing summary of `yg check --approve` counts a reviewer pair the parser had no memory for apart from the provider and configuration failures. It names the file and the way out (leave the file out of what the rule judges) instead of telling the reader to fix the reviewer connection or set the rule to `status: draft`, and `--json` gives the pair the cause `parser-out-of-memory`.

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say
- **approve** · by rev-560b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0405-zkfx
  Minor (known limitation, wording): core/fill-report.ts, the script parser-memory closing summary says 'Each report above names the rule and the file', but a report of the reading form (the parser ran out while the rule walked its trees) names no file, so that summary lists no file either; nothing is miscounted or misdirected. Round 1's findings are fixed: each cause names only its own files, the done line subtracts parser-memory and text-limit pairs from failed and adds up with plain failures and refusals mixed in, and every script rule parser-memory report ends with yg check --approve --only-deterministic while reviewer and companion reports keep yg check --approve. Tried to get past it: a crashing rule beside both causes still counts as failed and keeps the check.mjs words; the own-file, held and reading forms on the built tool all name the free run.

## Evidence

### Proof

- **ran (line 6553b31b550a):** cd source/cli && npx vitest run tests/e2e/parser-memory.test.ts -t 'counts that pair apart' tests/unit/core/fill-infra-grouping.test.ts (e2e red on the base: summary 'failed on provider/config errors') · **saw:** green after: 1 + 15 tests passed; summary '1 reviewer pair left unverified because the parser ran out of memory building the syntax tree of a file the rule judges (src/alpha/f1.ts)', next says to leave the file out, no provider/config words, --json cause parser-out-of-memory
- **ran (line 6553b31b550a):** cd source/cli && npx vitest run tests/e2e/parser-memory.test.ts tests/unit/core/fill-infra-grouping.test.ts, on fbf372dab and on d2cc7b6af · **saw:** green on the branch; red on the base: the summary says 'failed on provider/config errors', and fill-infra-grouping fails to load for a missing export

