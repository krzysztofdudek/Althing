# 618 · Runes: an extern crate alias binds only a use whose direct parent writes it (not a use in a function body or a nested block of that module), and edition 2015 reads the package's own crate name before the roots

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1611-uabh
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 523
**Found by:** jarl
**Where:** rev-523b-opus, the Rust roots package round 2 (rust.mts:352; rust-resolve.mts:173)
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
rustc binds the alias in the whole module, so a use in a function body loses its edge; and in edition 2015 a package's own name never reaches its library without extern crate, so use parser::Marker binds the root where rustc names src/parser.rs.

## Acceptance
[test] A use in a function body or a nested block of a module that writes extern crate engine_core as core2; binds engine-core, and in edition 2015 a crate named parser whose root has pub mod parser; binds use parser::Marker to src/parser.rs, each a catalogue case checked against rustc, red before and green after · by: npm run check

## Changelog
- Fixed: In Rust, `extern crate engine_core as core2;` in a module binds `core2` for the `use` declarations of its function bodies and blocks too, and in edition 2015 a crate named `parser` whose root declares `pub mod parser;` reads `use parser::Marker;` as that module. A consumer's graph can show new edges.

## Reviews
- **changes** · by rev-578-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2017-pasd
  Important (635): a file that one file declares by name and another loads through a path attribute loses its edge to the first. src/lib.rs writes mod util; and defines Thing, tests/it.rs writes #[path = "../src/util.rs"] mod util; and defines Thing, src/util.rs writes use super::Thing;. rustc 1.99.1 compiles it. release/1.1.0 gives src/util.rs:1 -> src/lib.rs; the tip gives src/util.rs:1 -> tests/it.rs and nothing to the library. The climb takes the path loader as the only parent, while docs/api.md itself says the same file can also be a module by its name; wanted: the declaring file by name counts as a parent too (probed first, or the parent untold), with a catalogue case. Important (614): the worker recorded no proof row, and the catalogue holds no case of the acceptance's form: rust-module-extern-crate-alias-not-in-inline-module-edge writes the alias in src/api.rs, not in the crate root. The behaviour is met: with the alias in src/lib.rs the use inside inner gives no edge on release/1.1.0 and on the tip, compiled under rustc; wanted: that case in the catalogue and the row. Minor (638): the kept answer of a root's globs is renewed only when the name gains files, so a question asked before the root's glob key is declared stays answered 'no' after it is declared (release answers src/lib.rs, the tip nothing); the set kept per key beside it is renewed correctly. Minor (638): the rewritten fixture drops the expectation src/platform/tty.rs:1 -> tty for a comment naming a known limit; the gap is filed as 651. Minor (600): the three older cases moved to edition 2021 keep their expectations and still test the package's own name reaching the library, but none compiles as written (no src/lib.rs for the test crate, no src/cli.rs, a manifest with no target), which 651 covers. Met: 578, 579, 600, 601, 617, 618 and the rest of 638, each new case red on release/1.1.0 for its own reason, green on the tip and compiled under rustc 1.99.1 with and without features; the speed test fails on release (7875 ms against 123888 ms) and passes on the tip in 785 ms; npm run check 2539 tests, 0 fail, dist fresh; corpus gate passed, ripgrep 0 added 0 removed; 904 case files equal the catalogue count; the Rust rev rises once in each of the four commits that change the extractor's output (19 in 60c4819, 20 in 29c7a70, 21 in bdea7f2, 22 in 1c9bc29) and 8d25719 changes none; glob?:<path> fits the whole-key shape ^[a-z][a-z0-9-]*\??:(?!:). 634 [read] met: docs/api.md says 'glob?:<path>, like glob:<path> and every other per-file key of these paragraphs, is a key a consumer keeps whole: the word before its one : is lowercase and is no Rust path, so the key is never split at ::, shortened or merged with another', and the paragraphs name item:, extern:, extern:<name>=<crate>, modfile:, modfile?:, mod:, mods:all, pathmod:, pathmod-name:, glob: and glob?:. Tried against the guards: a cfg_attr with a comment, a doc(cfg) and a nested cfg_attr; a local mod in a function body against the alias; three binaries over one src/bin folder; a plain glob beside one under a cfg (edge) and two plain globs (silence).
  outside the issue, filed as 653: Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of the same name. src/lib.rs: extern crate engine_core as core2; pub fn a() { mod core2 { pub struct Engine; } use core2::Engine; }. rustc 1.99.1 binds the local module; release/1.1.0 and the tip of jarl/578-rust-rest both give src/lib.rs:4 -> engine-core, a false edge to another package. The inline-module form of issue 614 is right; this is the function-body form.

## Evidence

### Proof

- **ran (line de131b5f068e):** node --test --test-name-pattern='rust-edition-2015-(bin-own-crate|bin-extern-crate-own|crate-named-like)' test/relations/extractors/rust-name-resolution-matrix.test.mjs (on the base, before any fix) · **saw:** not ok: rust-edition-2015-crate-named-like-root-module-edge: expected edge src/user.rs:1->parse not emitted
- **ran (line de131b5f068e):** node --test --test-name-pattern='function-body-edge|crate-named-like-root' test/relations/extractors/rust-name-resolution-matrix.test.mjs (after 600, before the 618 fix) · **saw:** not ok: rust-module-extern-crate-alias-use-in-function-body-edge: expected edge src/run.rs:3->engine not emitted; rust-edition-2015-crate-named-like-root-module-edge ok
- **ran (line de131b5f068e):** node --test rust-name-resolution-matrix, rust-resolve, rust, extractor-rev, catalogue, resolve-path, exports test files; corpus verify --only ripgrep (after the fix) · **saw:** pass 197/102/60/2/3/38/18, fail 0; corpus verify passed
- **ran (line de131b5f068e):** npm run check, then npm run coverage, on the clean branch tip 8d25719 · **saw:** check: tests 2539, pass 2538, fail 0, dist/ is fresh; coverage: lines 99.16, branches 95.75, functions 99.20, exit 0
- **ran (line de131b5f068e):** runCase of the new catalogue case on an extraction of release/1.1.0 (e9509e1) and of the tip 8d25719; cargo check --all-targets on the fixture under rustc 1.99.1, with and without --all-features; npm run check on the tip · **saw:** release: not ok on both cases (src/run.rs:3->engine and src/user.rs:1->parse not emitted); tip: both pass; cargo: Finished; own probe: a mod of the same name in the function body hides the alias (no edge), a nested block, a renamed use and an inner fn give the edge, compiled under rustc; npm run check on the branch tip 8d25719: tests 2539, pass 2538, fail 0, skipped 1, dist/ is fresh, exit 0

