# 604 · Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-lcac
**Tags:** 
**Files:** Grain/plugins/grain/engine/relations.mjs Grain/plugins/grain/engine/arch.mjs
**Repo:** Grain
**Found by:** rev-523-opus
**Where:** the review of 513, 516, 517, 523
**Branch:** jarl/604-whole-keys
**Worker:** w-604-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 17:47

## What
Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) keeps per key only the first file of each of the first two directories, but Runes asks the Rust keys per file (item:, modfile:, extern: and, from Runes rev 11, extern:: scoped keys): on release/1.1.0 already the edition 2015 crate-root items and the module chains of several roots, and with issues 513, 516, 517 and 523 every crate-root item path, every root item of a dependency and every edition 2015 dependency import. grain check then misses Rust edges the full pass finds; the Rust per-file keys need to survive the compaction. Since 493-498, C# base and member-type records are read with a per-file usings record shared by files with identical using directives; the same compaction drops 456 of 1 384 such records on jellyfin and the edit-time check gives an edge the full pass does not (ruling per-file-keys-are-kept-whole).

## Why


## Acceptance


[read] The model file's growth from keeping those keys is measured on jellyfin and a Rust corpus repository and stated in the CHANGELOG if it is noticeable

## Changelog
- grain check resolves an edited Rust or C# file with every per-file record the full pass uses (a crate root's items, extern crate names and module declarations; a C# file's using and base records), so both give the same edges.

## Evidence

### Notes

Assumed: the kept kinds are recognised by shape, in every language: a key that holds a tab (the C# records usings, base:, file-base:, members:, methods:), and a key that starts with a lowercase tag closed by a single colon (the Rust item:, extern:, extern:name=crate, modfile:, modfile?:; this also keeps the C# interface: and internal: keys whole, which costs little and is never wrong, because a whole key is the full table's own answer). The scoped extern:: forms are paths the extractor emits as uses, not declared keys, so the table holds none of them. The plain names of a crate-root file stay compacted: Runes asks a root only for its tagged keys (resolve-path.mts, declared()).

Measured with the Runes build of branch jarl/494-csharp-base-classes (it holds release/1.1.0) put in place of the vendored one, in a scratch copy of the plugin, each model built from an empty cache. ripgrep at 3fce3b5: model.json 677 164 bytes before, 696 654 after (2.9 %); the item: keys go from 1 017 to 1 661 file entries. jellyfin at 305a964: 9 558 853 before, 9 592 347 after (0.35 %); the usings records go from 928 to 1 384 file entries, the 456 the issue names. Not noticeable, so the changelog entry states no growth. Not measured: Grain with its vendored Runes, which declares none of these keys, so its model does not change at all.

With that Runes build and the compaction as it was, the new end-to-end test fails: check gives no FIRST edge for use core_lib::Engine through the root of a path dependency while the full pass gives the edge; with the fix all 6 tests of tests/check-table-whole-keys.test.mjs pass. With the vendored Runes 5 pass and 1 is skipped (the model's item: key; the test asks the extractor whether it declares one, so it starts running when issue 143 lands). No C# end-to-end test: the base-class reading is still in review in Runes and could not be run through Grain's vendored code; the C# records are tested on compactDecls and the hydrated table. Full suite on the branch tip: 2238 tests, 2231 pass, 0 fail, 7 skipped. No stamp needed: the model is rebuilt when the vendored Runes changes its extractor rev. arch.mjs needed no change.

