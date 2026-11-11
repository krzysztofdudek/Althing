# 607 · Runes: the TypeScript extractor reads the sibling after every '<' comparison (misreadImportTypes, s…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1534-vsok
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-566b-opus
**Where:** the review of 566
**Branch:** jarl/550-typescript
**Worker:** w-550-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 19:11

## What
Runes: the TypeScript extractor reads the sibling after every '<' comparison (misreadImportTypes, src/relations/extractors/typescript.mts:269, node.nextSibling). Tree-sitter answers that by searching down from the root and across the earlier children of a flat ERROR run, so malformed TypeScript or TSX lines of 'g<import('x').T>(' take time that grows with the square of the file: 0.48, 1.8 and 7.4 s of extraction at 97 000, 194 000 and 388 000 characters (TSX 0.45 and 1.6 s at 97 000 and 194 000). A CPU profile puts 1.37 of 1.6 s in get nextSibling. The same before and after issue 566 (6.7 s at 388 000 on release/1.1.0), with the same facts.

## Why


## Acceptance


[test] Malformed TypeScript or TSX lines of g<import('x').T>( are extracted in time linear in the file under the wide-node ratio bound, red before and green after · by: npm run check

## Evidence

