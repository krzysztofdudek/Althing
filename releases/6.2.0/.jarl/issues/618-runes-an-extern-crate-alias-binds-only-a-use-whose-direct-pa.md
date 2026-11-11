# 618 · Runes: an extern crate alias binds only a use whose direct parent writes it (not a use in a function body or a nested block of that module), and edition 2015 reads the package's own crate name before the roots

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1611-uabh
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 523
**Found by:** jarl
**Where:** rev-523b-opus, the Rust roots package round 2 (rust.mts:352; rust-resolve.mts:173)
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
rustc binds the alias in the whole module, so a use in a function body loses its edge; and in edition 2015 a package's own name never reaches its library without extern crate, so use parser::Marker binds the root where rustc names src/parser.rs.

## Acceptance
[test] A use in a function body or a nested block of a module that writes extern crate engine_core as core2; binds engine-core, and in edition 2015 a crate named parser whose root has pub mod parser; binds use parser::Marker to src/parser.rs, each a catalogue case checked against rustc, red before and green after · by: npm run check

## Evidence

### Proof

- **ran (line de131b5f068e):** node --test --test-name-pattern='rust-edition-2015-(bin-own-crate|bin-extern-crate-own|crate-named-like)' test/relations/extractors/rust-name-resolution-matrix.test.mjs (on the base, before any fix) · **saw:** not ok: rust-edition-2015-crate-named-like-root-module-edge: expected edge src/user.rs:1->parse not emitted
- **ran (line de131b5f068e):** node --test --test-name-pattern='function-body-edge|crate-named-like-root' test/relations/extractors/rust-name-resolution-matrix.test.mjs (after 600, before the 618 fix) · **saw:** not ok: rust-module-extern-crate-alias-use-in-function-body-edge: expected edge src/run.rs:3->engine not emitted; rust-edition-2015-crate-named-like-root-module-edge ok
- **ran (line de131b5f068e):** node --test rust-name-resolution-matrix, rust-resolve, rust, extractor-rev, catalogue, resolve-path, exports test files; corpus verify --only ripgrep (after the fix) · **saw:** pass 197/102/60/2/3/38/18, fail 0; corpus verify passed

