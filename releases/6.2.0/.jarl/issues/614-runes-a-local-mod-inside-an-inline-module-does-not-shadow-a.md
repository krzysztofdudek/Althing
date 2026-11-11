# 614 · Runes: a local mod inside an inline module does not shadow a root's extern crate alias of the same name

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1556-lixq
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 523
**Found by:** jarl
**Where:** w-523-fable, the Rust roots package round 1
**Branch:** jarl/578-rust-rest
**Merged:** d896893
**Merge check:** npm run check · saw tests 2564, pass 2563, fail 0, skipped 1; catalogue 913 equals the case files; rev lines joined (Rust 22, TypeScript 5); dist fresh after the commit

## What


## Why
rustc resolves the name to the nearer module; Runes binds the aliased crate, a false edge to another package.

## Acceptance
[test] With extern crate engine_core as core2; in the root and mod inner { mod core2 {…} use core2::Engine; }, the use binds inner::core2, not engine-core, a catalogue case red before and green after · by: npm run check

## Reviews
- **changes** · by rev-578-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2017-pasd
  Important (635): a file that one file declares by name and another loads through a path attribute loses its edge to the first. src/lib.rs writes mod util; and defines Thing, tests/it.rs writes #[path = "../src/util.rs"] mod util; and defines Thing, src/util.rs writes use super::Thing;. rustc 1.99.1 compiles it. release/1.1.0 gives src/util.rs:1 -> src/lib.rs; the tip gives src/util.rs:1 -> tests/it.rs and nothing to the library. The climb takes the path loader as the only parent, while docs/api.md itself says the same file can also be a module by its name; wanted: the declaring file by name counts as a parent too (probed first, or the parent untold), with a catalogue case. Important (614): the worker recorded no proof row, and the catalogue holds no case of the acceptance's form: rust-module-extern-crate-alias-not-in-inline-module-edge writes the alias in src/api.rs, not in the crate root. The behaviour is met: with the alias in src/lib.rs the use inside inner gives no edge on release/1.1.0 and on the tip, compiled under rustc; wanted: that case in the catalogue and the row. Minor (638): the kept answer of a root's globs is renewed only when the name gains files, so a question asked before the root's glob key is declared stays answered 'no' after it is declared (release answers src/lib.rs, the tip nothing); the set kept per key beside it is renewed correctly. Minor (638): the rewritten fixture drops the expectation src/platform/tty.rs:1 -> tty for a comment naming a known limit; the gap is filed as 651. Minor (600): the three older cases moved to edition 2021 keep their expectations and still test the package's own name reaching the library, but none compiles as written (no src/lib.rs for the test crate, no src/cli.rs, a manifest with no target), which 651 covers. Met: 578, 579, 600, 601, 617, 618 and the rest of 638, each new case red on release/1.1.0 for its own reason, green on the tip and compiled under rustc 1.99.1 with and without features; the speed test fails on release (7875 ms against 123888 ms) and passes on the tip in 785 ms; npm run check 2539 tests, 0 fail, dist fresh; corpus gate passed, ripgrep 0 added 0 removed; 904 case files equal the catalogue count; the Rust rev rises once in each of the four commits that change the extractor's output (19 in 60c4819, 20 in 29c7a70, 21 in bdea7f2, 22 in 1c9bc29) and 8d25719 changes none; glob?:<path> fits the whole-key shape ^[a-z][a-z0-9-]*\??:(?!:). 634 [read] met: docs/api.md says 'glob?:<path>, like glob:<path> and every other per-file key of these paragraphs, is a key a consumer keeps whole: the word before its one : is lowercase and is no Rust path, so the key is never split at ::, shortened or merged with another', and the paragraphs name item:, extern:, extern:<name>=<crate>, modfile:, modfile?:, mod:, mods:all, pathmod:, pathmod-name:, glob: and glob?:. Tried against the guards: a cfg_attr with a comment, a doc(cfg) and a nested cfg_attr; a local mod in a function body against the alias; three binaries over one src/bin folder; a plain glob beside one under a cfg (edge) and two plain globs (silence).
  outside the issue, filed as 653: Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of the same name. src/lib.rs: extern crate engine_core as core2; pub fn a() { mod core2 { pub struct Engine; } use core2::Engine; }. rustc 1.99.1 binds the local module; release/1.1.0 and the tip of jarl/578-rust-rest both give src/lib.rs:4 -> engine-core, a false edge to another package. The inline-module form of issue 614 is right; this is the function-body form.
- **approve** · by rev-578b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2029-iuci
  Approve, no finding; round 1's three findings are closed. 635 (was Important): round 1's probe gives src/util.rs:1 -> lib again on the tip 99ec824 (release/1.1.0 the same, 8d25719 gave -> it), on disk and through a listed view; where only tests/it.rs declares the file through the path attribute the tip gives -> it (release gave a false edge to the library); both compile under rustc 1.99.1; the probe is a catalogue case and a unit test holds the order and the fallback; docs/api.md says it: 'A file that the module above its place also declares by its name ... keeps that module as its parent, read first as before; the file that loads it is read only where that names nothing'. Also tried: the declaration by name under a cfg beside the path loader, which gives -> lib as release does. 614 (was Important): the case rust-inline-module-local-mod-over-root-extern-crate-alias-edge has the alias in the crate root, compiles under rustc 1.99.1 with a type check that each use binds what the case says, passes on the tip, and the proof row is recorded. 638 (was Minor): the new test passes on 1c9bc29, where no answer was kept yet, fails on 8d25719, where the kept answer came in (expected undefined to be 'src/lib.rs'), and passes on the tip; the counter is read inside Runes only and the package's exports are unchanged. 634 [read] met, as round 1 quoted and still at the tip: 'glob?:<path>, like glob:<path> and every other per-file key of these paragraphs, is a key a consumer keeps whole: the word before its one : is lowercase and is no Rust path, so the key is never split at ::, shortened or merged with another'. Conventions: three further commits, each naming its issue, none amended; npm run check on the tip: tests 2543, pass 2542, fail 0, skipped 1, dist/ is fresh, exit 0; 906 case files equal the catalogue count; no rev is owed, since 8d25719..99ec824 change the resolver and the symbol table only and the extractor's output over ripgrep's 110 Rust files is byte-identical between the two (rev 22). Not re-run in this round, by its scope: the lines of 578, 579, 600, 601, 617, 618 that round 1 found met, the coverage figures and the corpus gate.

## Evidence

### Proof

- **ran (line 8b8ef99b5ded):** own fixture of the acceptance (extern crate engine_core as core2; in src/lib.rs, mod inner { mod core2 {...} use core2::Engine; }) through the case runner on release/1.1.0 and on the tip; cargo check under rustc 1.99.1; runCase rust-module-extern-crate-alias-not-in-inline-module-edge on release · **saw:** release and tip: the use inside inner gives no edge, only the declaration line names engine-core; cargo: Finished; the catalogue case passes on release but writes the alias in src/api.rs, not in the root: the catalogue holds no case of the acceptance's own form
- ~~**ran (line 8b8ef99b5ded):** cargo check --all-targets (rustc 1.99.1) on rust-inline-module-local-mod-over-root-extern-crate-alias-edge, then runCase on a copy of release/1.1.0 and on the branch (after 5d? see commit) · **saw:** Finished; pass on release/1.1.0 and pass on the branch: src/lib.rs:5 -> node:local, no edge to engine-core~~
- **ran (line 8b8ef99b5ded):** cargo check --all-targets (rustc 1.99.1) on rust-inline-module-local-mod-over-root-extern-crate-alias-edge, then runCase on a copy of release/1.1.0 and on the branch at c40aa53 · **saw:** Finished; pass on release/1.1.0 and pass on the branch: src/lib.rs:5 -> node:local, no edge to engine-core
- **ran (line 8b8ef99b5ded):** npm run check, then npm run coverage, on the clean branch tip 99ec824 · **saw:** check: tests 2543, pass 2542, fail 0, dist/ is fresh; coverage: lines 99.20, branches 95.75, functions 99.21, exit 0
- **ran (line 8b8ef99b5ded):** cargo check --all-targets under rustc 1.99.1 on the files of rust-inline-module-local-mod-over-root-extern-crate-alias-edge as written, with a function added that assigns inner::f() to inner::core2::Engine, body::g() to body::core2::Engine and h() to engine_core::Engine; the case in the matrix suite on the tip 99ec824 · **saw:** cargo: Finished, so rustc binds each use as the case says; the case passes; the alias is in the crate root, the form the acceptance names

### Notes

Fault does not hold on release/1.1.0 (e9509e1): with extern crate engine_core as core2; in src/lib.rs, a use core2::X inside mod inner { mod core2 {...} } (beside it and in a function body), in a file module that declares mod core2; and in an inline module of it, binds the local module or its own file and never engine-core, on release/1.1.0 and on this branch alike; each shape compiles under rustc 1.99.1. Likely fixed when 518 carried the scopes down the walk. Nothing changed for 614.
- **retracted:** row 2 · by w-578-opus · 2026-11-11
  the command text carries a stray placeholder; the same run is recorded again in plain words

