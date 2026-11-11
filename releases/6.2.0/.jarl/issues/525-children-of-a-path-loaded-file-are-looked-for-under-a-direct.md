# 525 · Children of a #[path]-loaded file are looked for under a directory named after it

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-vggw
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-pathkids
**Where:** src/relations/extractors/rust-resolve.mts:200
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: A file loaded through #[path] outside inline modules owns its directory as a mod-rs file does, so its `mod x;` is beside it. Runes does not know the file was loaded through #[path] and treats it as a non-mod-rs file.

p53: silence for src/platform/linux.rs `mod epoll;`, which Rust resolves to src/platform/epoll/mod.rs (node epoll); Runes probes src/platform/linux/epoll.rs. Rust Reference, Modules, The path attribute. Same at v1.0.0.

## Why


## Acceptance
- [test] A file loaded through a #[path] attribute on a mod outside inline modules owns its directory as a mod.rs file does, so its mod x; binds x.rs or x/mod.rs beside it (Rust Reference, Modules, The path attribute), with the audit's probe p53 as a catalogue case (src/platform/linux.rs:1 -> epoll), red before and green after; the #[path] mod itself still gives no edge · by: npm run check
- [test] The same file declared by convention, without #[path], still looks for its children under the directory named after it, with a case · by: npm run check

## Changelog
- Fixed: Rust: a file loaded through `#[path = "…"]` on a `mod` owns its directory as a `mod.rs` does, so its own `mod x;` binds `x.rs` or `x/mod.rs` beside it. A graph can show new edges from such a file to its modules.

## Evidence

### Proof

- **ran (line 7e8d31e02413):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-path-loaded-file-children-beside-it-edge and rust-path-loaded-file-relative-path-forms-edge failed; after: 0 fail; the path mod itself gives no edge
- **ran (line 7e8d31e02413):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass; rustc 1.x compiles the fixture
- **ran (line a72ce2a3275b):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; rust-file-module-children-under-own-directory-edge passes (also before the fix: it holds the unchanged rule)

### Notes

Assumed: only a path attribute on a mod without a body at the top level of a file is read (not inside an inline module, a cfg_attr or a macro). The loaded file's mod and self:: paths look beside it first and under the directory named after it second, since the file can be a module by its name too. Its super:: paths are read as before.

