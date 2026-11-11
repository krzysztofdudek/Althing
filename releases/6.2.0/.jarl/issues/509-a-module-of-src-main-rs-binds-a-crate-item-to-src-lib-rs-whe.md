# 509 · Rust: a module binds a crate:: item to the wrong crate root when a package has more than one root in src/

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-fikt
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-libfirst
**Where:** src/relations/resolve-path.mts:453
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
A file under src/ gets root files [src/lib.rs, src/main.rs] in that order, and resolveFromModuleDir binds the first root that declares the item. So a module that only src/main.rs declares binds crate::X to the library root whenever the library has an X too (p46, p54). A [[bin]] with a path in src/, such as src/cli.rs, is a crate root as well, but a module it declares still gets the same two root files, so crate::X never binds that binary (p06). Rust resolves crate to the root of the current crate. Both already exist in v1.0.0. The fix picks the root by the module chain: the root file that declares the first module segment of the importing file. Issue 510 was merged into this one.

## Why


## Acceptance
- [test] In a package with src/lib.rs and src/main.rs, crate::X in a module that only src/main.rs declares binds the binary root, with p46 and p54 as catalogue cases, red before and green after · by: npm run check
- [test] A module declared by a [[bin]] whose path lies in src/ binds crate::X to that binary root, with p06 as a catalogue case, red before and green after · by: npm run check
- [test] When both roots or neither declare the module, a root item gives no edge, with a case · by: npm run check

## Changelog
- In a package that has both `src/lib.rs` and `src/main.rs`, or a `[[bin]]` with a path in `src/`, `crate::Item` in a module binds the crate root that declares the module: the binary root for a module only `src/main.rs` or that binary declares, the library root for one only `src/lib.rs` declares. A module that two roots declare, or none does, gives no edge to a root item, so a graph can show new gaps there.

## Evidence

### Proof

- **ran (line 0623eaf571f6):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at ed3eda5 (rust-main-module-crate-item-lib-same-name-edge and rust-main-and-lib-module-result-alias-edge, p46 and p54, failed before 066fe7d) and green after; the unit test 'binds a crate:: root item to the one root that declares the module' also passes
- **ran (line 9a6e40b23b64):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at ed3eda5 (rust-bin-path-in-src-module-root-item-edge, p06, failed: got src/args/mod.rs:1->lib, wanted ->cli) and green after 066fe7d
- **ran (line c73e608dfae2):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at ed3eda5 (rust-module-of-two-roots-or-none-root-item-edge failed: unexpected src/lib.rs:1->shared root edge from the module) and green after 066fe7d; the unit test covers both, none and a stray file
- **ran (line 0623eaf571f6):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-main-module-crate-item-lib-same-name-edge and rust-main-and-lib-module-result-alias-edge fail
- **ran (line 9a6e40b23b64):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-bin-path-in-src-module-root-item-edge fails
- **ran (line c73e608dfae2):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-module-of-two-roots-or-none-root-item-edge and the unit test of the one declaring root fail

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: the root is picked by declaration only when two or more of a tree's root files exist; a tree with one root keeps binding it, declared or not. A module that two roots declare keeps both roots in the context, and a root item then binds none (module paths still resolve, since both roots share the tree). Declaration means a top-level mod x; or mod x { } in the root file, read from its text with comments and strings blanked, never one inside another module's braces.

Assumed: four existing unit tests in rust-resolve.test.mjs leaned on the old first-root-wins reading and had their fixtures changed to declare their modules, keeping their intent: 'bin discovery turned off' now asks crate::Main of src/cli.rs (main.rs declares cli) instead of the undeclared src/bin/tool.rs; the edition test's module of both roots now has mod api; in lib.rs and main.rs; the [lib]-path test asks crate::Bin of a new tool.rs that main.rs declares and asserts crate::Bin is undefined from util.rs, which only lib.rs declares; the src/-file test has core.rs declare mod cli;. The probe p04 (rust-custom-build-script-crate-path-edge) lists its own legitimate src/lib.rs:1 -> util edge instead of silence, since the runner compares the whole edge set.

Assumed: README.md paragraphs on Cargo targets may need a line for the final pass: the crate root of a src module is the root that declares it, a src/bin directory without main.rs is a module, [patch] paths and [package] build are read. The catalogue count of this branch is 714 (691 + 23 cases: 5 for 509, 4 for 511, 9 for 512, 3 for 515, 3 for 524); I raised the count in catalogue.test.mjs to that value.

