# 686 · Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one no…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0009-llpz
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-530-opus
**Where:** the review of 475, 530, 536, 562
**Branch:** jarl/686-csharp-speed
**Worker:** w-686-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one node per directory of .cs files, yg check --no-approve --full: eShop @913acea warm 7.8 s with release/6.2.0 (Runes 1.0.0) against 14.4 s with jarl/530-runes-110 (Runes 1.1.0), cold 9.0 against 16.7 s; jellyfin @305a964 warm 58 s against 116 s, cold 76 against 144 s. A CPU profile of the eShop run puts 11.3 of its 14.7 s under resolver.mjs hintFiles, with csharpKeys (4.8 s self) and symbol-table defCount (2.6 s self) on top; Grain's export of eShop on the same Runes takes 17 s. Found in the review of 475, 530, 536, 562.

## Why


## Acceptance


- [test] The hot paths named by the profile (hintFiles, csharpKeys, the symbol table's defCount) have a test that bounds their work on a generated project of many C# files, red before and green after · by: npm run check
- [compare] yg check on eShop and jellyfin with Runes after the change takes no more than 1.25 times its time with Runes 1.0.0, warm and cold, measured on one machine and written in the evidence, with the same edges as before the change · by: npm run corpus

## Changelog
- Resolving C# references takes a fraction of the time on repositories with many files and many using directives; the edges found are the same.

## Evidence

### Proof

- **ran (line a85586f70d40):** npm run check (the bound test, run before the fix at e955a21 on the old resolver) · **saw:** test/relations/csharp-resolve-work.test.mjs failed: 169344 symbol table questions for 1440 references, 117.6 per reference, bound 30
- **ran (line a85586f70d40):** npm run check · **saw:** 2620 tests, 2619 pass, 0 fail, 1 skipped; the bound test passes at 14.9 questions per reference (21394 for 1440 references); dist is fresh
- **ran (line 0f2e0674163d):** RUNES_CORPUS_DIR set to the shared corpus cache npm run corpus; node scripts/corpus.mjs gate --only eShop,jellyfin --tier all · **saw:** corpus gate: passed; eShop 2017 edges and jellyfin 32133 edges, 0 added 0 removed against the goldens; a harness over the C# files of eShop (547) and jellyfin (2226) gives byte-identical edges before and after (sha 16 hex a9ed8dd6475ecb6e and cbff89b3e6c823ad); resolution of references: eShop 10.88 s to 0.96 s (Runes 1.0.0: 5.22 s), jellyfin 49.7 s to 5.1 s (1.0.0: 24.2 s); parse and declare plus resolve: eShop 12.2 s to 2.4 s (1.0.0: 6.1 s), jellyfin 66.9 s to 22.2 s (1.0.0: 35.6 s)

### Notes

Assumed: the time was measured on Runes itself (a harness that runs the corpus's resolution over the C# files, phases timed, one run each on a warm file cache) and not through a built Yggdrasil; Yggdrasil's own time stays to be measured by the examiner or the merger. The kept answers are dropped whenever the symbol table takes a declaration, and an answer worked out inside another is not kept, because a base list still being bound could make it partial.

