# 600 · Runes: in edition 2015 a binary's use app::X binds its own library without extern crate app;

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1446-vkqf
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 516
**Found by:** jarl
**Where:** w-523-fable, the Rust roots package
**Branch:** jarl/578-rust-rest
**Merged:** d896893
**Merge check:** npm run check · saw tests 2564, pass 2563, fail 0, skipped 1; catalogue 913 equals the case files; rev lines joined (Rust 22, TypeScript 5); dist fresh after the commit

## What


## Why
Edition 2015 needs extern crate to name a crate; without it rustc rejects the path, so the edge Runes gives is one the compiler never resolves.

## Acceptance
[test] In an edition 2015 binary without extern crate app;, use app::X gives no edge to the library, and with it gives one, each a catalogue case, red before and green after · by: npm run check

## Changelog
- Fixed: In Rust edition 2015, `use app::Engine;` in a target of the package `app` reaches its library only where the crate root writes `extern crate app;`, as rustc reads it; otherwise it names the root's own module `app`, or nothing. A consumer's graph can show edges that move from the library to that module.

## Reviews
- **changes** · by rev-578-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2017-pasd
  Important (635): a file that one file declares by name and another loads through a path attribute loses its edge to the first. src/lib.rs writes mod util; and defines Thing, tests/it.rs writes #[path = "../src/util.rs"] mod util; and defines Thing, src/util.rs writes use super::Thing;. rustc 1.99.1 compiles it. release/1.1.0 gives src/util.rs:1 -> src/lib.rs; the tip gives src/util.rs:1 -> tests/it.rs and nothing to the library. The climb takes the path loader as the only parent, while docs/api.md itself says the same file can also be a module by its name; wanted: the declaring file by name counts as a parent too (probed first, or the parent untold), with a catalogue case. Important (614): the worker recorded no proof row, and the catalogue holds no case of the acceptance's form: rust-module-extern-crate-alias-not-in-inline-module-edge writes the alias in src/api.rs, not in the crate root. The behaviour is met: with the alias in src/lib.rs the use inside inner gives no edge on release/1.1.0 and on the tip, compiled under rustc; wanted: that case in the catalogue and the row. Minor (638): the kept answer of a root's globs is renewed only when the name gains files, so a question asked before the root's glob key is declared stays answered 'no' after it is declared (release answers src/lib.rs, the tip nothing); the set kept per key beside it is renewed correctly. Minor (638): the rewritten fixture drops the expectation src/platform/tty.rs:1 -> tty for a comment naming a known limit; the gap is filed as 651. Minor (600): the three older cases moved to edition 2021 keep their expectations and still test the package's own name reaching the library, but none compiles as written (no src/lib.rs for the test crate, no src/cli.rs, a manifest with no target), which 651 covers. Met: 578, 579, 600, 601, 617, 618 and the rest of 638, each new case red on release/1.1.0 for its own reason, green on the tip and compiled under rustc 1.99.1 with and without features; the speed test fails on release (7875 ms against 123888 ms) and passes on the tip in 785 ms; npm run check 2539 tests, 0 fail, dist fresh; corpus gate passed, ripgrep 0 added 0 removed; 904 case files equal the catalogue count; the Rust rev rises once in each of the four commits that change the extractor's output (19 in 60c4819, 20 in 29c7a70, 21 in bdea7f2, 22 in 1c9bc29) and 8d25719 changes none; glob?:<path> fits the whole-key shape ^[a-z][a-z0-9-]*\??:(?!:). 634 [read] met: docs/api.md says 'glob?:<path>, like glob:<path> and every other per-file key of these paragraphs, is a key a consumer keeps whole: the word before its one : is lowercase and is no Rust path, so the key is never split at ::, shortened or merged with another', and the paragraphs name item:, extern:, extern:<name>=<crate>, modfile:, modfile?:, mod:, mods:all, pathmod:, pathmod-name:, glob: and glob?:. Tried against the guards: a cfg_attr with a comment, a doc(cfg) and a nested cfg_attr; a local mod in a function body against the alias; three binaries over one src/bin folder; a plain glob beside one under a cfg (edge) and two plain globs (silence).
  outside the issue, filed as 653: Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of the same name. src/lib.rs: extern crate engine_core as core2; pub fn a() { mod core2 { pub struct Engine; } use core2::Engine; }. rustc 1.99.1 binds the local module; release/1.1.0 and the tip of jarl/578-rust-rest both give src/lib.rs:4 -> engine-core, a false edge to another package. The inline-module form of issue 614 is right; this is the function-body form.
- **approve** · by rev-578b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2029-iuci
  Approve, no finding; round 1's three findings are closed. 635 (was Important): round 1's probe gives src/util.rs:1 -> lib again on the tip 99ec824 (release/1.1.0 the same, 8d25719 gave -> it), on disk and through a listed view; where only tests/it.rs declares the file through the path attribute the tip gives -> it (release gave a false edge to the library); both compile under rustc 1.99.1; the probe is a catalogue case and a unit test holds the order and the fallback; docs/api.md says it: 'A file that the module above its place also declares by its name ... keeps that module as its parent, read first as before; the file that loads it is read only where that names nothing'. Also tried: the declaration by name under a cfg beside the path loader, which gives -> lib as release does. 614 (was Important): the case rust-inline-module-local-mod-over-root-extern-crate-alias-edge has the alias in the crate root, compiles under rustc 1.99.1 with a type check that each use binds what the case says, passes on the tip, and the proof row is recorded. 638 (was Minor): the new test passes on 1c9bc29, where no answer was kept yet, fails on 8d25719, where the kept answer came in (expected undefined to be 'src/lib.rs'), and passes on the tip; the counter is read inside Runes only and the package's exports are unchanged. 634 [read] met, as round 1 quoted and still at the tip: 'glob?:<path>, like glob:<path> and every other per-file key of these paragraphs, is a key a consumer keeps whole: the word before its one : is lowercase and is no Rust path, so the key is never split at ::, shortened or merged with another'. Conventions: three further commits, each naming its issue, none amended; npm run check on the tip: tests 2543, pass 2542, fail 0, skipped 1, dist/ is fresh, exit 0; 906 case files equal the catalogue count; no rev is owed, since 8d25719..99ec824 change the resolver and the symbol table only and the extractor's output over ripgrep's 110 Rust files is byte-identical between the two (rev 22). Not re-run in this round, by its scope: the lines of 578, 579, 600, 601, 617, 618 that round 1 found met, the coverage figures and the corpus gate.

## Evidence

### Proof

- **ran (line a8675c1d8fc7):** node --test --test-name-pattern='rust-edition-2015-bin-(own-crate|extern-crate-own)' test/relations/extractors/rust-name-resolution-matrix.test.mjs (before the fix) · **saw:** not ok: expected edge src/main.rs:2->local not emitted (got src/main.rs:2->lib); not ok: unexpected cross-owner edge src/bin/tool.rs:2->lib
- **ran (line a8675c1d8fc7):** node --test rust-name-resolution-matrix, rust-resolve, catalogue, exports test files; node scripts/corpus.mjs verify --only ripgrep,zed --tier all (after the fix) · **saw:** pass 195/102/3/18, fail 0; corpus verify passed, ripgrep 0 added 0 removed
- **ran (line a8675c1d8fc7):** npm run check, then npm run coverage, on the clean branch tip 8d25719 · **saw:** check: tests 2539, pass 2538, fail 0, dist/ is fresh; coverage: lines 99.16, branches 95.75, functions 99.20, exit 0
- **ran (line a8675c1d8fc7):** runCase of the new catalogue case on an extraction of release/1.1.0 (e9509e1) and of the tip 8d25719; cargo check --all-targets on the fixture under rustc 1.99.1, with and without --all-features; npm run check on the tip · **saw:** release: not ok on both cases (src/main.rs:2->lib where the root module is named; unexpected edge src/bin/tool.rs:2->lib); tip: both pass; cargo: Finished; own probe of an edition 2015 package: a module of a binary whose root writes extern crate app; and a test with it reach the library, a test without it gives nothing; npm run check on the branch tip 8d25719: tests 2539, pass 2538, fail 0, skipped 1, dist/ is fresh, exit 0

### Notes

Assumed: rustc 1.99.1 refuses use app::Engine; in an edition 2015 binary without extern crate app; (E0432), so the no-edge-to-the-library case is written as a binary whose root declares mod app; (the use binds that module) and the with-extern-crate case carries a second binary whose use stands under cfg(any()) (no edge); both fixtures compile as written. Three older fixtures with no edition (rust-lib-path-outside-src-main-module-edge, rust-integration-test-mod-common-edge, rust-inline-package-table-crate-name-edge) relied on the own name in edition 2015, which rustc refuses; they now write edition 2021, their expectations unchanged.

