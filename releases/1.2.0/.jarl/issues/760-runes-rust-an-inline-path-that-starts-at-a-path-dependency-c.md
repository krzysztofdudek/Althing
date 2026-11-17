# 760 · Runes, Rust: an inline path that starts at a path-dependency crate emits no use

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-ovte
**Tags:** api, runes, rust
**Files:** Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-rust-inline-extern-crate
**Where:** Runes/src/relations/extractors/rust.mts:372
**Branch:** jarl/737-rust-path-modules
**Worker:** w-737-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:24

## What
Claim: At v1.1.0 emitInline keeps only a path that starts at crate, self or super. With datacrate = { path = "datacrate" } in Cargo.toml, use datacrate::dc; resolves to the dependency's lib.rs, and a function that only writes datacrate::dc() (the extern prelude, no use) emits nothing.

repros.sh rust_dep: src/u.rs "use datacrate::dc;" printed resolved to datacrate/src/lib.rs; src/k.rs "pub fn k() { datacrate::dc(); }" printed no use; rust_path: src/ui/f.rs "crate::data::d::f()" printed resolved to src/data/d.rs

Moved from issue 760 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A function that calls a path dependency's item through the crate's name, with no use, has no edge to the dependency, while the same call through crate:: has one, so a layer check misses the more common spelling. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In Rust, datacrate::dc() written in a function body with datacrate = { path = "datacrate" } in Cargo.toml gives a use that binds datacrate/src/lib.rs, and std::mem::swap and a registry crate's path give none, in a unit test and a catalogue case that builds under rustc, red at v1.1.0 (no use) and green after; every existing answer and edge stays as it is · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Changelog
- Added: in Rust, a path written outside a `use` that starts at a path dependency (`datacrate::dc()` in a function body, `datacrate::Data` in a signature, with no `use`) gives an edge to that crate, as the same path in a `use` does; `std::`, `core::` and a registry crate leave the repository and `classifyUse` answers them `outside`, so a consumer that counts uses leaving the repository sees one for every such call. A name in scope (a module the file declares, a `use`, a type) is read first, so a local module never gives an edge to a crate of its name, and a path under a glob `use` gives none. A consumer can see new edges, and new refusals, from code that calls a path dependency through its name; hints stored earlier are stale by the Rust extractor's `rev`.

## Evidence

### Proof

- **ran (line 50dac10bbbc5):** node --test test/relations/extractors/rust.test.mjs test/relations/extractors/rust-resolve.test.mjs test/relations/extractors/rust-name-resolution-matrix.test.mjs, with the new unit tests and case against dist/ built at dd26fed (v1.1.0 plus 759, no change to inline paths) · **saw:** red: both extractor unit tests (no in::datacrate::dc use), both in:: resolver tests (datacrate::dc unbound, no outside answer) and rust-inline-path-dependency-crate-edge (no edge src/lib.rs:4 -> datacrate) fail
- **ran (line 50dac10bbbc5):** npm run check at e5885d7 (the branch tip after merging release/1.2.0 at 20aceea) · **saw:** tests 2764, pass 2761, fail 0, skipped 3; dist/ is fresh; rust-inline-path-dependency-crate-edge passes with src/lib.rs:4 and :9 -> datacrate, :4 answers resolved datacrate/src/lib.rs, :6 (std::mem::swap) and :7 (kit::spin) answer absent outside, and no edge from src/shadow.rs:3
- **ran (line 50dac10bbbc5):** node --test test/relations/rust-cases-build.test.mjs at e5885d7 with cargo and rustc 1.99.1 from rust:1.99.1-slim on PATH through the brief's wrappers · **saw:** tests 4, pass 4, fail 0, skipped 0: both build tests ran; rust-inline-path-dependency-crate-edge builds

### Notes

Assumed: a path in a type (fn t(_d: datacrate::Data)) is read as one in an expression; the acceptance names a function body only, and the type gives the same dependency.

Assumed: a glob use in any scope on the way to the module (use super::*; in mod tests) silences a bare path there, since it may bring in the name; a capitalised name, Self, a primitive type (u32::MAX), a leading :: and a tool attribute (#[rustfmt::skip]) give no use; an extern crate alias of the scope silences too.

Assumed: in:: reads the extern prelude in every edition, edition 2015 included, never from the crate root (rustc since 1.30 puts --extern crates in the extern prelude of non-use paths in both editions); a unit test pins the 2015 reading, no catalogue case does.

Corpus: ripgrep gains 105 edges (into crates/grep, crates/ignore and crates/index, path dependencies of the root package, and ignore's own library from its example) and react 573 (into compiler/crates/react_compiler_*, path dependencies of each package, and react_compiler_ast's own library from its test); none removed; each file and target checked against Cargo.toml and for a local binding of the crate name, explained per file in corpus/explained.md and taken into the goldens. zed parses no Rust file (0 edges before and after); next-intl's Rust edges do not move.

