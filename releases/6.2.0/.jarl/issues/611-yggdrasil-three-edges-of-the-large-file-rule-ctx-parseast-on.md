# 611 · Yggdrasil: three edges of the large-file rule: ctx.parseAst on a file over the text limit, a yg-suppress marker inside such a file, and the wording of the tree-too-large report

**Status:** open
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

## What


## Why
A rule that asks only for a tree through ctx.parseAst is stopped where file.ast is not; a waiver written in a large file stops counting, undocumented; and the report cites the 64 MiB text limit where the engine's string limit stopped it, and its advice starts paid reviewer pairs.

## Acceptance
- [test] ctx.parseAst(file) on a parsable file over the text limit gives the tree as file.ast does, and a yg-suppress marker inside a file over the limit waives as it does under it (or the CHANGELOG and docs/reviewers.md say it does not), each red before and green after · by: cd source/cli && npm test
- [read] The tree-too-large report names the limit that stopped it and its advice runs only free verdicts (yg check --approve --only-deterministic)

## Evidence

