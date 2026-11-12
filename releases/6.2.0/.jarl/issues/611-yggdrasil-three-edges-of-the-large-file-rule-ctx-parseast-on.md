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

## Evidence

### Proof

- **ran (line 0c455b563cc0):** cd source/cli && npx vitest run tests/unit/structure/rule-text.test.ts tests/unit/core/suppress-scan-pieces.test.ts (8 of the new cases red with the 611 source changes reverted: ctx.parseAst on a file over the limit, the two report wordings, a marker in a file over the limit in a node, a nodeless unit and a given file) · **saw:** green after: 24 + 23 tests passed; ctx.parseAst gives program/true, markers waive in .ts, .sql, nodeless and given files, a reasonless marker fails only its rule

