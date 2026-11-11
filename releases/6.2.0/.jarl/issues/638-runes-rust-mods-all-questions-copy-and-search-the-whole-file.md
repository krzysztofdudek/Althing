# 638 · Runes, Rust: mods:all questions copy and search the whole file list (quadratic on large packages: 3.8 s to 11.6 s at 16 003 files), two root globs gated by opposite cfgs give no edge, and one path-loaded catalogue fixture does not compile

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1915-woun
**Tags:** runes, rust, performance
**Files:** 
**Repo:** Runes
**After:** 514
**Found by:** jarl
**Where:** rev-514-opus, the Rust paths package (resolve-path.mts:76, :92, :102; reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21)
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
Nearly every Rust file declares mods:all, so each resolution is linear in the package's Rust files and the pass grows with the square; a cfg(unix)/cfg(windows) pair of globs loses its edge; and a fixture rustc refuses tests Runes on code no compiler reads.

## Acceptance
[test] A synthetic package of 16 000 Rust files resolves within a small factor of release/1.1.0's time under the wide-node ratio bound; two root globs under opposite cfgs reaching one Order give the root edge; the path-loaded fixture compiles under rustc as written, each red before and green after · by: npm run check

## Changelog
- Fixed: In Rust, two globs of a crate root under opposite `cfg`s that bring one name in (`#[cfg(unix)] pub use unix::*;` beside `#[cfg(windows)] pub use windows::*;`) give the edge to the root. Large Rust packages resolve their paths in time that grows with the number of files. A consumer that compacts its table keeps the new `glob?:` keys of crate roots whole.

## Reviews
- **changes** · by rev-578-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2017-pasd
  Important (635): a file that one file declares by name and another loads through a path attribute loses its edge to the first. src/lib.rs writes mod util; and defines Thing, tests/it.rs writes #[path = "../src/util.rs"] mod util; and defines Thing, src/util.rs writes use super::Thing;. rustc 1.99.1 compiles it. release/1.1.0 gives src/util.rs:1 -> src/lib.rs; the tip gives src/util.rs:1 -> tests/it.rs and nothing to the library. The climb takes the path loader as the only parent, while docs/api.md itself says the same file can also be a module by its name; wanted: the declaring file by name counts as a parent too (probed first, or the parent untold), with a catalogue case. Important (614): the worker recorded no proof row, and the catalogue holds no case of the acceptance's form: rust-module-extern-crate-alias-not-in-inline-module-edge writes the alias in src/api.rs, not in the crate root. The behaviour is met: with the alias in src/lib.rs the use inside inner gives no edge on release/1.1.0 and on the tip, compiled under rustc; wanted: that case in the catalogue and the row. Minor (638): the kept answer of a root's globs is renewed only when the name gains files, so a question asked before the root's glob key is declared stays answered 'no' after it is declared (release answers src/lib.rs, the tip nothing); the set kept per key beside it is renewed correctly. Minor (638): the rewritten fixture drops the expectation src/platform/tty.rs:1 -> tty for a comment naming a known limit; the gap is filed as 651. Minor (600): the three older cases moved to edition 2021 keep their expectations and still test the package's own name reaching the library, but none compiles as written (no src/lib.rs for the test crate, no src/cli.rs, a manifest with no target), which 651 covers. Met: 578, 579, 600, 601, 617, 618 and the rest of 638, each new case red on release/1.1.0 for its own reason, green on the tip and compiled under rustc 1.99.1 with and without features; the speed test fails on release (7875 ms against 123888 ms) and passes on the tip in 785 ms; npm run check 2539 tests, 0 fail, dist fresh; corpus gate passed, ripgrep 0 added 0 removed; 904 case files equal the catalogue count; the Rust rev rises once in each of the four commits that change the extractor's output (19 in 60c4819, 20 in 29c7a70, 21 in bdea7f2, 22 in 1c9bc29) and 8d25719 changes none; glob?:<path> fits the whole-key shape ^[a-z][a-z0-9-]*\??:(?!:). 634 [read] met: docs/api.md says 'glob?:<path>, like glob:<path> and every other per-file key of these paragraphs, is a key a consumer keeps whole: the word before its one : is lowercase and is no Rust path, so the key is never split at ::, shortened or merged with another', and the paragraphs name item:, extern:, extern:<name>=<crate>, modfile:, modfile?:, mod:, mods:all, pathmod:, pathmod-name:, glob: and glob?:. Tried against the guards: a cfg_attr with a comment, a doc(cfg) and a nested cfg_attr; a local mod in a function body against the alias; three binaries over one src/bin folder; a plain glob beside one under a cfg (edge) and two plain globs (silence).
  outside the issue, filed as 653: Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of the same name. src/lib.rs: extern crate engine_core as core2; pub fn a() { mod core2 { pub struct Engine; } use core2::Engine; }. rustc 1.99.1 binds the local module; release/1.1.0 and the tip of jarl/578-rust-rest both give src/lib.rs:4 -> engine-core, a false edge to another package. The inline-module form of issue 614 is right; this is the function-body form.

## Evidence

### Proof

- **ran (line a2bc4f291c24):** node --test test/relations/extractors/rust-resolve-scale.test.mjs on a copy of release/1.1.0 · **saw:** not ok: a quarter of the package took 8125 ms, the whole of it 126185 ms: over 8 times
- **ran (line a2bc4f291c24):** node --test test/relations/extractors/rust-resolve-scale.test.mjs on the branch (3ac75be) · **saw:** pass 1 fail 0, 748 ms for both sizes
- **ran (line a2bc4f291c24):** node measure.mjs (synthetic Rust package through extract and makeResolver, resolution time) at 2000/4000/8000/16000 files, release/1.1.0 then branch · **saw:** release: 93/222/682/1762 ms; branch: 144/236/386/579 ms (16000: 1568 ms before on the same load)
- **ran (line a2bc4f291c24):** runCase rust-crate-root-globs-under-opposite-cfgs-edge on a copy of release/1.1.0, then on the branch after 1c9bc29 · **saw:** not ok: expected edge kit/src/user.rs:1->kit not emitted; then pass
- **ran (line a2bc4f291c24):** cargo check --all-targets in rust:1-slim (rustc 1.99.1) on rust-path-loaded-file-relative-path-forms-edge, before and after 8b0203c · **saw:** before: error: couldn't find file src/./imp/../platform/bsd.rs; after: Finished, and runCase passes
- **ran (line a2bc4f291c24):** npm run check, then npm run coverage, on the clean branch tip 8d25719 · **saw:** check: tests 2539, pass 2538, fail 0, dist/ is fresh; coverage: lines 99.16, branches 95.75, functions 99.20, exit 0
- **ran (line a2bc4f291c24):** node --test test/relations/extractors/rust-resolve-scale.test.mjs on release/1.1.0 and on the tip; runCase rust-crate-root-globs-under-opposite-cfgs-edge on both; cargo check under rustc 1.99.1 on that case and on rust-path-loaded-file-relative-path-forms-edge; npm run corpus with the shared cache; a probe that declares the root's glob key after a first question · **saw:** scale on release: not ok, a quarter took 7875 ms, the whole 123888 ms; on the tip: pass 1 fail 0 in 785 ms; globs case: release not ok (kit/src/user.rs:1->kit not emitted), tip pass; cargo: Finished on both fixtures; corpus gate passed, ripgrep 373 edges, 0 added, 0 removed; probe: after the glob key is declared release answers src/lib.rs, the tip still answers nothing; npm run check on the branch tip 8d25719: tests 2539, pass 2538, fail 0, skipped 1, dist/ is fresh, exit 0
- **ran (line a2bc4f291c24):** node --test --test-name-pattern='asks the table again' test/relations/extractors/rust-resolve.test.mjs with the committed sources of 3ac75be, then after 99ec824 · **saw:** before: not ok, expected undefined to be 'src/lib.rs'; after: pass 1 fail 0
- **ran (line a2bc4f291c24):** npm run check, then npm run coverage, on the clean branch tip 99ec824 · **saw:** check: tests 2543, pass 2542, fail 0, dist/ is fresh; coverage: lines 99.20, branches 95.75, functions 99.21, exit 0

