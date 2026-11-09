# 168 · Runes: the syntax tree walk is superlinear on large files (e.g. 1 MB of a video segment parsed as TypeScript)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1112-fidr
**Tags:** runes, performance
**Files:** Runes/src/relations/extractors/typescript.mts
**Repo:** ../../../Runes
**Found by:** grain-100
**Where:**
**Branch:** jarl/168-last-runes
**Merged:** 6ef3ef9 in ../../../Runes
**CI:** none

## What
Grain 100 cuts out binary files, but the tree walk in Runes itself grows superlinearly with file size: a 1 MB file raised cold indexing from 2.3 s to 83 s. Large real sources (generated API clients) pay the same cost.

## Why
Indexing time in Grain and in yg check grows disproportionately on repositories with large files.

## Acceptance
The tree walk is linear in file size; a performance test with a size of the order of 1 MB.

## Changelog
- Fixed: walking a syntax tree is linear in its size: a file the grammar reads as a long flat run of ERROR nodes (a binary file named .ts) took seconds to minutes per megabyte to walk, and a deeply nested one overflowed the stack.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1736, pass 1736, fail 0, catalogue 522 cases, dist/ is fresh; npm run coverage: tests 1736, pass 1736, fail 0, all files 98.81 / 94.49 / 98.80, exit 0; merge 6ef3ef9 (clean merge, branch based on the release tip; 522 = 516 + 6 matches the cases on disk)

