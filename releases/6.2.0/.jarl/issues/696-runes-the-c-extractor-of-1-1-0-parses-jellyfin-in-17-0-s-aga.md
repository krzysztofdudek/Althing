# 696 · Runes: the C# extractor of 1.1.0 parses jellyfin in 17.0 s against 11.3 s in 1.0.0

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0156-hayw
**Tags:** runes, csharp, performance
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/extractors/csharp-resolve.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**After:** 686
**Found by:** jarl
**Where:** w-686-sonnet, 686 report (measured on a harness over the corpus's C# files)
**Branch:** jarl/696-csharp
**Worker:** w-696-opus
**Model:** claude-opus-5-5@xhigh
**Since:** 2026-11-13 16:59

## What


## Why
After 686 the resolver is faster than 1.0.0, so the extractor's added time is now the larger part of what Runes 1.1.0 costs on a large C# repository.

## Acceptance
[compare] The C# extractor's parse time on jellyfin and eShop is no more than 1.15 times Runes 1.0.0's, measured on one machine and written in the evidence, with byte-identical extracts · by: npm run corpus

## Evidence

### Proof

- **ran (line e229a981cafb):** node harness.mjs <runes> <repository> (a scratch harness over every tracked .cs file: tree-sitter parse, declarations(), extractCsharpRefs() and the symbol table, each timed, with a sha256 over every file's declarations and extract), one fresh process per run, nice -n 15, alternating Runes v1.0.0, 8d31e57 (the release branch) and b56f1c1, each a git archive extraction: eShop 5 rounds, jellyfin 3 rounds, the shared corpus cache · **saw:** medians, parse and extract: eShop v1.0.0 0.839 s, 8d31e57 1.340 s, b56f1c1 0.636 s (0.76 of 1.0.0); jellyfin v1.0.0 10.49 s, 8d31e57 16.05 s, b56f1c1 7.09 s (0.68 of 1.0.0). Of that, tree-sitter's own parse is about the same in all three (eShop 0.17 s, jellyfin 2.1 s); declarations plus extract on jellyfin: 8.19 s, 13.61 s, 4.82 s. The extract sha256 of b56f1c1 equals 8d31e57's on every file of eShop (9058a8bb6173e72f), jellyfin (3a4410dcb62729e6) and CleanArchitecture (d43105bc74e60964). One machine: Apple silicon, 14 cores, a Linux VM, Node 24.22.2, other agents' work sharing it
- **ran (line e229a981cafb):** RUNES_CORPUS_DIR=<the shared corpus cache> node scripts/corpus.mjs gate --only eShop,jellyfin,CleanArchitecture --tier all --runes <git archive extraction>, under nice -n 15 and MemoryMax=12G, once with b56f1c1 and once with 8d31e57 · **saw:** both: corpus gate: passed, 0 added and 0 removed against the goldens (CleanArchitecture 452, jellyfin 32196, eShop 2017 edges; the C# oracle skipped, no dotnet here). Gate clock 8d31e57 to b56f1c1: jellyfin 21.4 s to 11.9 s, eShop 2.2 s to 1.5 s, CleanArchitecture 0.4 s to 0.3 s

### Notes

Assumed: the parse time is the phase the 686 harness timed as parse and declare: tree-sitter's parse, declarations(), extractCsharpRefs() and the symbol table, over every tracked .cs file, one fresh process per run on a warm file cache, with the median of the runs. Byte-identical extracts means the 1.1.0 extract before and after this change, compared by a sha256 over every file's declarations and extract (1.0.0's extract has another shape). The cause measured: the declarations and the extract walked every node of a file 11 times between them (the file-scoped namespace alone three or four times, twice more for the using directives, once each for the scope index and the file's own types), and each visitor asked the runtime for the node's type once per comparison, 57 type reads per node in all; both read one call into the runtime at a time. The fix keeps every edge 1.1.0 gives: no reading was traded for time. A test counts the walks and type reads per node (red at 8d31e57 with 11.00 walks, green at b56f1c1 with 3.01), so the count holds on every machine.

