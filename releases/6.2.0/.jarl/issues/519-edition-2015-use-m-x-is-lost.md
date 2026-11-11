# 519 · Edition 2015 use ::m::X is lost

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-jaep
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-lead2015
**Where:** src/relations/extractors/rust.mts:109
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: In edition 2015 a path that starts with :: is relative to the crate root. The extractor returns no specifier for a scoped identifier without a path prefix, so the path is dropped.

p14: silence for src/api/client.rs `use ::shapes::Circle;`, which Rust resolves to src/shapes/mod.rs (node shapes). Rust Reference, Paths, Path qualifiers. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015 a use path that starts with :: is relative to the crate root (Rust Reference, Paths, Path qualifiers), so use ::shapes::Circle; binds the root's module, with the sceptic's probe s15 as a catalogue case (src/api/b.rs:1 -> shapes; the audit's p14 does not compile as written), red before and green after · by: npm run check
- [test] From edition 2018 a path that starts with :: names a crate only: it never binds a module of the crate, and it binds a path dependency of that name, with a case · by: npm run check

## Changelog
- Fixed: Rust: a `use` path that starts with `::` gives an edge. In edition 2015 `use ::shapes::Circle;` binds the crate root's module `shapes`; from edition 2018 on it names a crate only, so it binds a path dependency of that name and never a module of the crate.

## Evidence

### Proof

- **ran (line 0888b77b3d35):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2015-use-leading-colons-root-module-edge failed (src/api/b.rs:1 -> shapes not emitted); after: 0 fail
- **ran (line 0888b77b3d35):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case passes
- **ran (line 82666487dc6d):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2018-use-leading-colons-crate-only-edge failed (src/lib.rs:1 -> dep not emitted); after: 0 fail, and the root's module shapes gets no edge from use ::shapes::Circle;
- **ran (line 82666487dc6d):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case passes; rustc 1.x refuses use ::shapes::Circle; for a local module (E0432) and binds ::kit to the dependency

