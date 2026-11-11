# 634 · Runes docs/api.md, the paragraph on Rust crate-root items, asks a consumer that compacts its table …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1834-lmmd
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-604-opus
**Where:** the review of 604
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:23

## What
Runes docs/api.md, the paragraph on Rust crate-root items, asks a consumer that compacts its table to keep 'every key the extractor declares for every crate-root file', while the resolver asks a root only for item:<name>, extern:<name>, extern:<name>=<crate>, modfile:<path> and modfile?:<path> (src/relations/resolve-path.mts, declared()). Grain's compactDecls (issue 604) keeps exactly those kinds whole and a root's plain names compacted, which gives the full table's edges today. Name the Rust kinds in the docs as the C# base-classes paragraph names its records, so the contract matches what a compacting consumer keeps and a later reading of a root's plain names becomes a documented change.

## Why


## Acceptance


[read] Runes docs/api.md names the Rust per-file key kinds a consumer must keep whole the way its C# paragraph names its own

## Reviews
- **changes** · by rev-578-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2017-pasd
  Important (635): a file that one file declares by name and another loads through a path attribute loses its edge to the first. src/lib.rs writes mod util; and defines Thing, tests/it.rs writes #[path = "../src/util.rs"] mod util; and defines Thing, src/util.rs writes use super::Thing;. rustc 1.99.1 compiles it. release/1.1.0 gives src/util.rs:1 -> src/lib.rs; the tip gives src/util.rs:1 -> tests/it.rs and nothing to the library. The climb takes the path loader as the only parent, while docs/api.md itself says the same file can also be a module by its name; wanted: the declaring file by name counts as a parent too (probed first, or the parent untold), with a catalogue case. Important (614): the worker recorded no proof row, and the catalogue holds no case of the acceptance's form: rust-module-extern-crate-alias-not-in-inline-module-edge writes the alias in src/api.rs, not in the crate root. The behaviour is met: with the alias in src/lib.rs the use inside inner gives no edge on release/1.1.0 and on the tip, compiled under rustc; wanted: that case in the catalogue and the row. Minor (638): the kept answer of a root's globs is renewed only when the name gains files, so a question asked before the root's glob key is declared stays answered 'no' after it is declared (release answers src/lib.rs, the tip nothing); the set kept per key beside it is renewed correctly. Minor (638): the rewritten fixture drops the expectation src/platform/tty.rs:1 -> tty for a comment naming a known limit; the gap is filed as 651. Minor (600): the three older cases moved to edition 2021 keep their expectations and still test the package's own name reaching the library, but none compiles as written (no src/lib.rs for the test crate, no src/cli.rs, a manifest with no target), which 651 covers. Met: 578, 579, 600, 601, 617, 618 and the rest of 638, each new case red on release/1.1.0 for its own reason, green on the tip and compiled under rustc 1.99.1 with and without features; the speed test fails on release (7875 ms against 123888 ms) and passes on the tip in 785 ms; npm run check 2539 tests, 0 fail, dist fresh; corpus gate passed, ripgrep 0 added 0 removed; 904 case files equal the catalogue count; the Rust rev rises once in each of the four commits that change the extractor's output (19 in 60c4819, 20 in 29c7a70, 21 in bdea7f2, 22 in 1c9bc29) and 8d25719 changes none; glob?:<path> fits the whole-key shape ^[a-z][a-z0-9-]*\??:(?!:). 634 [read] met: docs/api.md says 'glob?:<path>, like glob:<path> and every other per-file key of these paragraphs, is a key a consumer keeps whole: the word before its one : is lowercase and is no Rust path, so the key is never split at ::, shortened or merged with another', and the paragraphs name item:, extern:, extern:<name>=<crate>, modfile:, modfile?:, mod:, mods:all, pathmod:, pathmod-name:, glob: and glob?:. Tried against the guards: a cfg_attr with a comment, a doc(cfg) and a nested cfg_attr; a local mod in a function body against the alias; three binaries over one src/bin folder; a plain glob beside one under a cfg (edge) and two plain globs (silence).
  outside the issue, filed as 653: Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of the same name. src/lib.rs: extern crate engine_core as core2; pub fn a() { mod core2 { pub struct Engine; } use core2::Engine; }. rustc 1.99.1 binds the local module; release/1.1.0 and the tip of jarl/578-rust-rest both give src/lib.rs:4 -> engine-core, a false edge to another package. The inline-module form of issue 614 is right; this is the function-body form.

## Evidence

