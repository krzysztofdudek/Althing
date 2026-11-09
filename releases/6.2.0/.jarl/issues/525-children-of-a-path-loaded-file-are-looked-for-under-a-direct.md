# 525 · Children of a #[path]-loaded file are looked for under a directory named after it

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-vggw
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-pathkids
**Where:** src/relations/extractors/rust-resolve.mts:200

## What
Claim: A file loaded through #[path] outside inline modules owns its directory as a mod-rs file does, so its `mod x;` is beside it. Runes does not know the file was loaded through #[path] and treats it as a non-mod-rs file.

p53: silence for src/platform/linux.rs `mod epoll;`, which Rust resolves to src/platform/epoll/mod.rs (node epoll); Runes probes src/platform/linux/epoll.rs. Rust Reference, Modules, The path attribute. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Keep the silence unless the resolver learns which files a #[path] attribute loads; if it does, give those files the mod-rs directory rule.

## Evidence

