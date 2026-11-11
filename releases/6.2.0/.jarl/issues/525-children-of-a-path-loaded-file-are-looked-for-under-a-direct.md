# 525 · Children of a #[path]-loaded file are looked for under a directory named after it

**Status:** open
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

## What
Claim: A file loaded through #[path] outside inline modules owns its directory as a mod-rs file does, so its `mod x;` is beside it. Runes does not know the file was loaded through #[path] and treats it as a non-mod-rs file.

p53: silence for src/platform/linux.rs `mod epoll;`, which Rust resolves to src/platform/epoll/mod.rs (node epoll); Runes probes src/platform/linux/epoll.rs. Rust Reference, Modules, The path attribute. Same at v1.0.0.

## Why


## Acceptance
- [test] A file loaded through a #[path] attribute on a mod outside inline modules owns its directory as a mod.rs file does, so its mod x; binds x.rs or x/mod.rs beside it (Rust Reference, Modules, The path attribute), with the audit's probe p53 as a catalogue case (src/platform/linux.rs:1 -> epoll), red before and green after; the #[path] mod itself still gives no edge · by: npm run check
- [test] The same file declared by convention, without #[path], still looks for its children under the directory named after it, with a case · by: npm run check

## Evidence

