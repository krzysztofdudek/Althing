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

## Evidence

### Proof

- **ran (line c9e23f1a38b9):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at d22b245 (rust-custom-build-script-mod-edge, p03, and rust-custom-build-script-crate-path-edge, p04, failed) and green after 2e9059a
- **ran (line d1ed76ca1c8d):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at d22b245 (rust-build-false-build-rs-silence failed: unexpected build.rs:1->gen) and green after 2e9059a

### Notes

Assumed: [package] build = true, or a value that cannot be read, means build.rs; a build path that leaves the package names no script; a build script in a subdirectory roots the files below that subdirectory as a target path does, one at the package root only itself.

