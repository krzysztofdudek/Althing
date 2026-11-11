# 516 · Edition 2015: a path dependency wins over the root's own module of that name

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-adte
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-dep2015s
**Where:** src/relations/extractors/rust-resolve.mts:127
**After:** 517, 523
**Branch:** jarl/523-rust-roots
**Worker:** w-523-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 13:54

## What
Claim: resolveRustPath checks path dependencies before the edition 2015 crate-relative rule. In 2015 a use path is relative to the crate root and a dependency is reachable from `use` only through an `extern crate` there, so with a root `mod util;` and no `extern crate util;`, `use util::slug;` names the local module.

p15: src/api/client.rs:1 -> node:depsrc (the dependency) instead of node:localutil. Rust Reference, Preludes, Extern prelude: in the 2015 edition crates in the extern prelude cannot be referenced via use declarations. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015, the first segment of a use path that the crate root declares as a module or an item binds the root's module, and a path dependency of that name binds only when the root writes extern crate for it (Rust Reference, Preludes, Extern prelude: in the 2015 edition, crates in the extern prelude cannot be referenced via use declarations), with the sceptic's probe s15 as a catalogue case (src/api/a.rs:1 -> localutil; the audit's p15 does not compile as written), red before and green after · by: npm run check
- [test] In edition 2015, a use path whose first segment is neither a root module or item nor a crate the root binds with extern crate gives no edge, with a case · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- In an edition 2015 crate, `use util::slug;` names the crate root's own `mod util;` where the package also has a path dependency `util`, and binds the dependency only when the root writes `extern crate util;`. Without either it gives no edge. A graph may show new refusals where the edge moves to the crate's own module.

## Evidence

### Proof

- **ran (line b6f271f1781b):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (the branch at a8b6b4f, after 523 and 517, the new cases added, before the fix; the same two failed on release/1.1.0 at 28e52cf) · **saw:** red: rust-edition-2015-root-module-over-path-dependency-edge fails with 'expected edge src/api/a.rs:1->localutil not emitted (got ... src/api/a.rs:1->depsrc)'
- **ran (line 220d954e6a5a):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (the branch at a8b6b4f, after 523 and 517, the new cases added, before the fix; the same two failed on release/1.1.0 at 28e52cf) · **saw:** red: rust-edition-2015-path-dependency-without-extern-crate-silence fails with 'unexpected cross-owner edge src/api/a.rs:1->depsrc'

### Notes

Assumed: an extern crate line names its crate directly in every edition, so in edition 2015 the bare crate name still binds the dependency from a file that writes such a declaration at any depth (kept per file). The package's own crate name from one of its binaries is left as it was. Eight older catalogue cases that imported a dependency by use from a package with no edition and no extern crate got edition = 2021 on the importing package: Rust rejects them as edition 2015 and they are about dependency tables.

