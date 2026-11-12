# 710 · Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 't…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0326-zick
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-560-opus
**Where:** the review of 560, 580, 581, 611, 639, 655, 656, 663, 688, 689
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:30

## What
Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say

## Why


## Acceptance


[test] A script rule's parser-memory report ends with yg check --approve --only-deterministic, not a step that starts paid reviewer pairs, as 611's tree report does, red before and green after · by: cd source/cli && npm test

## Changelog
- The report of a script rule the parser had no memory for ends with `yg check --approve --only-deterministic`, which does not start paid reviewer pairs.

## Reviews
- **approve** · by rev-560b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0405-zkfx
  Minor (known limitation, wording): core/fill-report.ts, the script parser-memory closing summary says 'Each report above names the rule and the file', but a report of the reading form (the parser ran out while the rule walked its trees) names no file, so that summary lists no file either; nothing is miscounted or misdirected. Round 1's findings are fixed: each cause names only its own files, the done line subtracts parser-memory and text-limit pairs from failed and adds up with plain failures and refusals mixed in, and every script rule parser-memory report ends with yg check --approve --only-deterministic while reviewer and companion reports keep yg check --approve. Tried to get past it: a crashing rule beside both causes still counts as failed and keeps the check.mjs words; the own-file, held and reading forms on the built tool all name the free run.

## Evidence

### Proof

- **ran (line cc18b09351ab):** cd source/cli && npx vitest run tests/unit/ast/parse-guard.test.ts (red on the old source: every script rule report ended with yg check --approve) · **saw:** green after: all six forms of a script rule report end with yg check --approve --only-deterministic and carry that command as their step; the reviewer form does not
- **ran (line cc18b09351ab):** cd source/cli && npx vitest run tests/unit/ast/parse-guard.test.ts, on 9d2c8eff8 and copied onto fbf372dab; plus yg check --approve --only-deterministic giving the reading, held and own-file forms of a script rule's parser-memory report · **saw:** green on the tip (12 passed), red on fbf372dab (3 cases: every form ended with yg check --approve). On the built tool the reading, held and own-file reports end with yg check --approve --only-deterministic; after-stop and side-by-side are proved by the unit loop over all six forms; the companion of a reviewer rule (hook-loader, kind reviewer) and suppressMarkersUnreadMessage keep yg check --approve

### Notes

Assumed: parse-guard.ts:175 (suppressMarkersUnreadMessage) is a reviewer rule's report, whose pair only the run that calls the reviewer can fill, so it keeps yg check --approve; the script rule's reports (:123, :133-134, :147, :155, :162) end with --only-deterministic, and the companion of a reviewer rule (parserMemoryMessage called with 'reviewer') keeps the paid run.

