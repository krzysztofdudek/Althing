# 524 · Edition 2015 legacy_bench_path is not modelled

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-axkb
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-benchleg
**Where:** src/relations/resolve-path.mts:262
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
Claim: In edition 2015 Cargo roots a [[bench]] named bench with no path at src/bench.rs when no benches/bench.rs exists. Runes models the legacy paths of binaries only, so src/bench.rs is read as a module of the library and its `mod x;` is looked for under src/bench/.

p09: silence; Rust gives src/bench.rs:1 -> node:helpers (src/helpers/mod.rs). Cargo targets.rs normalize_benches, legacy_bench_path. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015, a [[bench]] named bench that gives no path is rooted at src/bench.rs when benches/bench.rs does not exist and src/bench.rs does (Cargo targets.rs, normalize_benches, legacy_bench_path), so its mod helpers; binds src/helpers/mod.rs, with the audit's probe p09 as a catalogue case (src/bench.rs:1 -> helpers), red before and green after · by: npm run check
- [test] From edition 2018, or when benches/bench.rs exists, src/bench.rs stays a module of the library, with a case · by: npm run check

## Changelog
- In edition 2015, a `[[bench]]` named `bench` without a `path` is rooted at `src/bench.rs` when `benches/bench.rs` is missing, as Cargo does, so its `mod helpers;` binds the module beside it.

## Reviews
- **changes** · by rev-509-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1129-zikf
  Important (509, src/relations/resolve-path.mts:440 topLevelModules, used at :296 and :322): in a package with src/lib.rs and src/main.rs a module loses every crate:: root-item edge to the library when the root declares it in a way the text reader does not see, where the base bound the library correctly. Reproduced on the built tool against the base: mod unix; inside a cfg_if! block; mod late; after a function holding the char literal '{' ; mod late; after a raw string holding a quote and a brace; #[path = "imp/thing.rs"] mod thing; and a mod written by a macro_rules! expansion. Each gave src/lib.rs before and nothing after. The brace counter treats a char literal and a raw string as code, and a module at brace depth above zero as undeclared. No test covers these; a case for each is needed, and the choice of what a root that cannot be read means (keep the old binding, or silence) belongs in the fix. Important (511, src/relations/extractors/rust-resolve.mts:191): for a src/bin directory that two binaries declare, every path with super is dropped, also one that stays inside the directory (super::y::T from src/bin/common/x.rs names src/bin/common/y.rs in either binary). The base gave that edge, the branch gives none; two binaries sharing a common directory is an ordinary layout, and acceptance line 2 asks silence only for crate:: paths. Minor (512, src/relations/resolve-path.mts:414 and :427, known limitations to state in the changelog): the patched crate's version is not compared with the requirement, so a patch Cargo leaves unused still gives an edge; workspace exclude and package.workspace are not read, so an excluded nested package takes the upper root's patch (a false edge) and its own patch or a root named by package.workspace is ignored; :626 does not lowercase a github URL as Cargo does. Judged sound: the four changed unit tests are true updates (each old fixture asked a root item of a module no root declared, and each keeps its intent with the declaration added); the p04 case lists the library's own mod edge and still proves no edge leaves tools/build.rs; a module both roots declare gives no root item while module paths still bind, as line 3 and the changelog say; legacy_bench_path, infer_subdirectory, target_path and normalize_build were read at Cargo tag 0.88.0 and the code follows them; source matching of [patch] held for a git dependency against a crates-io patch, an alternative registry, target and dev dependencies, the table form, and renames on either side. Not checked: the heavy corpus tier (zed), the go and dotnet oracles (toolchains absent), and the per-commit red of each test commit (the branch's tests were instead run over the base code: 22 fail there, the named cases among them).

## Evidence

### Proof

- **ran (line 319a52e87326):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at 725f2ae (rust-edition-2015-legacy-bench-path-edge, p09, failed: got none) and green after cbc0ebd
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; rust-edition-2015-bench-file-exists-src-bench-module-edge and rust-edition-2018-src-bench-module-edge pass at cbc0ebd, and the unit test covers the two-files and other-name forms
- **ran (line 319a52e87326):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-edition-2015-legacy-bench-path-edge fails
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; the two guard cases pass, before and after

### Notes

Assumed: Cargo's legacy bench path is applied when benches/bench.rs and benches/bench/main.rs are not exactly one existing file, as the bin rule does, and only for edition 2015 and a bench named bench with no path.

