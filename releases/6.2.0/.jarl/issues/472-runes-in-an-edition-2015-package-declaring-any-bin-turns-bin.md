# 472 · Runes: in an edition 2015 package, declaring any [[bin]] turns bin auto-discovery off, but the resolver still roots src/main.rs and src/bin files there

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 470
**Found by:** rev-runes-470-opus
**Where:** Review of 470 (2026-11-02); The Cargo Book, Target auto-discovery: in the 2015 edition a declared target turns off auto-discovery of its kind unless autobins is set
**Branch:** jarl/472-rust-2015-bin-discovery
**Merged:** 7e067a0 in ../../../Runes
**CI:** green

## What
The resolver reacts only to an explicit autobins = false. In an edition 2015 package that declares a [[bin]] and leaves autobins unset, Cargo builds only the declared bins, yet the resolver still treats src/main.rs and src/bin files as crate roots. The new edition 2015 crate-root-item check also matches a name that exists only inside an inline mod or a function body of the root file.

## Why
A file that is no crate root read as one gives false edges, the kind that can force a cycle.

## Acceptance
- In an edition 2015 package with a declared [[bin]] and no autobins key, only declared bins are crate roots, with a catalogue case red before and green after, and a 2018 control where discovery stays on
- The edition 2015 crate-root-item check matches only items at the top level of the root file, with a case for a name inside an inline mod

## Changelog
- Fixed: in an edition 2015 package that declares a `[[bin]]` and leaves `autobins` unset, `src/main.rs` and the files of `src/bin` that no bin names are no longer crate roots, and a 2015 `use Name;` binds the crate root only for a name its top level binds as an item (read from the parse tree: an item it defines, an item of an `extern` block or of `thread_local!`, `lazy_static!`, `bitflags!` or `cfg_if!`, a name a top-level `use` brings in), not one inside an inline `mod`, a function body, an initializer, a closure or a `macro_rules!` body; the Rust extractor's `rev` changes, and a consumer's graph can lose edges it showed before, and so lose cycles it gave

## Evidence

- **ran:** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (fix held back) · **saw:** red: rust-edition-2015-use-crate-root-item-inline-mod-silence failed (pass 60, fail 1); then rust-edition-2015-declared-bin-main-silence failed (pass 63, fail 1); the 2018 and autobins = true controls passed
- **ran:** node --test the same matrix file and test/relations/extractors/rust-resolve.test.mjs, then npm run check, npm run coverage, corpus verify --tier all · **saw:** green: 131 pass 0 fail; check 1967 pass 0 fail, dist fresh; coverage 99.06 lines 94.85 branches 99.15 functions; corpus passed, no explained or changed references
- **ran:** matrix file without the legacy bin path, then with it · **saw:** red: 3 legacy-bin-path cases failed (pass 64, fail 3); green: 68 pass 0 fail; check 1990 pass, coverage 99.11/95.00/99.16, corpus passed with no changes
- **ran:** node --test test/relations/extractors/rust-resolve.test.mjs (previous scan, fix held back) · **saw:** red: rustFileDeclares test failed (pass 66, fail 1): extern block, thread_local!, bitflags! and cfg_if! names lost
- **ran:** node --test test/relations/extractors/rust-resolve.test.mjs test/relations/extractors/rust-name-resolution-matrix.test.mjs (fix in place) · **saw:** green: pass 135, fail 0
- **ran:** npm run check; npm run coverage; node scripts/corpus.mjs verify --tier all · **saw:** check 1990 pass 0 fail, dist fresh; coverage 99.11 lines 94.98 branches 99.16 functions; corpus passed, 33 repositories, 0 added 0 removed 0 explained
- **ran:** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (nine new parse-tree cases, src held at the branch tip 7d0406d) · **saw:** red: pass 69, fail 8: const-block, static-block, static-closure, use-in-const-block and macro-rules-body silences gave edges; extern-block (cfg feature = "fn"), bitflags (associated const read as an item) and cfg-if-mod (feature = "impl") edges wrong; thread-local passed
- **ran:** node --test the matrix file, rust-resolve.test.mjs and rust.test.mjs (top-level items read from the parse tree, ca5567b) · **saw:** green: matrix pass 77 fail 0; rust-resolve pass 71 fail 0; rust extractor pass 43 fail 0
- **ran:** npm run check; npm run coverage; node scripts/corpus.mjs verify --tier all (ca5567b) · **saw:** check 2018 pass 0 fail, dist fresh; coverage 99.02 lines 94.95 branches 98.93 functions; corpus passed, 33 repositories, 0 added 0 removed 0 explained
- **ran:** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 2028, pass 2028, fail 0, dist/ is fresh, catalogue 630; corpus verify: passed on all 33 repositories (5dd7a5b on release/1.1.0: 472 merged at 7e067a0, 480 at 5dd7a5b)

