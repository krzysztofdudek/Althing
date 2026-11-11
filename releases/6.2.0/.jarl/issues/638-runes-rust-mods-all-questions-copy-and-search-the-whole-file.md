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

## Evidence

### Proof

- **ran (line a2bc4f291c24):** node --test test/relations/extractors/rust-resolve-scale.test.mjs on a copy of release/1.1.0 · **saw:** not ok: a quarter of the package took 8125 ms, the whole of it 126185 ms: over 8 times
- **ran (line a2bc4f291c24):** node --test test/relations/extractors/rust-resolve-scale.test.mjs on the branch (3ac75be) · **saw:** pass 1 fail 0, 748 ms for both sizes
- **ran (line a2bc4f291c24):** node measure.mjs (synthetic Rust package through extract and makeResolver, resolution time) at 2000/4000/8000/16000 files, release/1.1.0 then branch · **saw:** release: 93/222/682/1762 ms; branch: 144/236/386/579 ms (16000: 1568 ms before on the same load)
- **ran (line a2bc4f291c24):** runCase rust-crate-root-globs-under-opposite-cfgs-edge on a copy of release/1.1.0, then on the branch after 1c9bc29 · **saw:** not ok: expected edge kit/src/user.rs:1->kit not emitted; then pass
- **ran (line a2bc4f291c24):** cargo check --all-targets in rust:1-slim (rustc 1.99.1) on rust-path-loaded-file-relative-path-forms-edge, before and after 8b0203c · **saw:** before: error: couldn't find file src/./imp/../platform/bsd.rs; after: Finished, and runCase passes
- **ran (line a2bc4f291c24):** npm run check, then npm run coverage, on the clean branch tip 8d25719 · **saw:** check: tests 2539, pass 2538, fail 0, dist/ is fresh; coverage: lines 99.16, branches 95.75, functions 99.20, exit 0

