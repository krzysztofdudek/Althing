# 515 · [package] build = "<file>" is not read

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-piuv
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-buildpth
**Where:** src/relations/resolve-path.mts:446
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
Claim: Only a file named build.rs at the package root is taken as the build script's root. A build script named by [package] build is treated as a file of the src/ tree: its `mod x;` is looked for under a directory named after it, and its crate:: paths resolve into the library.

p03 (build = "build/main.rs"): silence where Rust gives build/main.rs:1 and :2 -> node:gen. p04 (build = "tools/build.rs"): tools/build.rs:2 -> node:util, a false edge into the library's src/util/mod.rs instead of the script's own tools/util.rs. Cargo targets.rs normalize_build. Same at v1.0.0.

## Why


## Acceptance
- [test] [package] build = "<file>" roots the build script at that file, so its mod declarations bind the modules beside it and its crate:: paths resolve in its own tree, never in the library's (Cargo targets.rs, normalize_build), with the audit's probes p03 (build/main.rs:1 and :2 -> gen) and p04 (silence, no tools/build.rs:2 -> util) as catalogue cases, red before and green after · by: npm run check
- [test] With build = false a build.rs at the package root is no build script and gives no edges as one, with a case · by: npm run check

## Changelog
- `[package] build = "<file>"` roots the build script at that file: its `mod x;` binds the modules beside it and its `crate::` paths resolve in its own tree, no longer in the library's. With `build = false` a `build.rs` at the package root is no build script.

## Reviews
- **changes** · by rev-509-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1129-zikf
  Important (509, src/relations/resolve-path.mts:440 topLevelModules, used at :296 and :322): in a package with src/lib.rs and src/main.rs a module loses every crate:: root-item edge to the library when the root declares it in a way the text reader does not see, where the base bound the library correctly. Reproduced on the built tool against the base: mod unix; inside a cfg_if! block; mod late; after a function holding the char literal '{' ; mod late; after a raw string holding a quote and a brace; #[path = "imp/thing.rs"] mod thing; and a mod written by a macro_rules! expansion. Each gave src/lib.rs before and nothing after. The brace counter treats a char literal and a raw string as code, and a module at brace depth above zero as undeclared. No test covers these; a case for each is needed, and the choice of what a root that cannot be read means (keep the old binding, or silence) belongs in the fix. Important (511, src/relations/extractors/rust-resolve.mts:191): for a src/bin directory that two binaries declare, every path with super is dropped, also one that stays inside the directory (super::y::T from src/bin/common/x.rs names src/bin/common/y.rs in either binary). The base gave that edge, the branch gives none; two binaries sharing a common directory is an ordinary layout, and acceptance line 2 asks silence only for crate:: paths. Minor (512, src/relations/resolve-path.mts:414 and :427, known limitations to state in the changelog): the patched crate's version is not compared with the requirement, so a patch Cargo leaves unused still gives an edge; workspace exclude and package.workspace are not read, so an excluded nested package takes the upper root's patch (a false edge) and its own patch or a root named by package.workspace is ignored; :626 does not lowercase a github URL as Cargo does. Judged sound: the four changed unit tests are true updates (each old fixture asked a root item of a module no root declared, and each keeps its intent with the declaration added); the p04 case lists the library's own mod edge and still proves no edge leaves tools/build.rs; a module both roots declare gives no root item while module paths still bind, as line 3 and the changelog say; legacy_bench_path, infer_subdirectory, target_path and normalize_build were read at Cargo tag 0.88.0 and the code follows them; source matching of [patch] held for a git dependency against a crates-io patch, an alternative registry, target and dev dependencies, the table form, and renames on either side. Not checked: the heavy corpus tier (zed), the go and dotnet oracles (toolchains absent), and the per-commit red of each test commit (the branch's tests were instead run over the base code: 22 fail there, the named cases among them).

## Evidence

### Proof

- **ran (line c9e23f1a38b9):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at d22b245 (rust-custom-build-script-mod-edge, p03, and rust-custom-build-script-crate-path-edge, p04, failed) and green after 2e9059a
- **ran (line d1ed76ca1c8d):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at d22b245 (rust-build-false-build-rs-silence failed: unexpected build.rs:1->gen) and green after 2e9059a
- **ran (line c9e23f1a38b9):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-custom-build-script-mod-edge and rust-custom-build-script-crate-path-edge fail
- **ran (line d1ed76ca1c8d):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-build-false-build-rs-silence fails

### Notes

Assumed: [package] build = true, or a value that cannot be read, means build.rs; a build path that leaves the package names no script; a build script in a subdirectory roots the files below that subdirectory as a target path does, one at the package root only itself.

