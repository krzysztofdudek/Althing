# 518 · Edition 2018 uniform paths are lost

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-ukah
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-uniform1
**Where:** src/relations/extractors/rust-resolve.mts:139
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: From edition 2018 a use path may start with a name in scope in the current module: a module it declares, or a name an earlier use bound. Runes treats every such bare first segment as an external crate.

p12: src/lib.rs `mod shapes; pub use shapes::Circle;` gives only line 1, line 2 is lost. p13: `use crate::shapes; use shapes::Circle;` gives only line 1. p50: kit/src/lib.rs:2 `pub use types::*;` is lost. Rust Reference, Use declarations (uniform paths). Same at v1.0.0. Most lost lines repeat an edge the same file already has, which keeps the severity low.

## Why


## Acceptance
- [test] From edition 2018, the first segment of a use path that names a module the importing module declares (mod shapes; pub use shapes::Circle;) or a name an earlier use of that module brought in (use crate::shapes; use shapes::Circle;) resolves in the crate (Rust Reference, Use declarations, uniform paths), with the audit's probe p12 (src/lib.rs:2 -> shapes), the sceptic's probe s13 (src/api/client.rs:2 -> shapes, src/api/other.rs:2 -> round) and p50 (kit/src/lib.rs:2 -> types) as catalogue cases, red before and green after · by: npm run check
- [test] A first segment that names both such a local name and a crate (an error in Rust) gives no edge, and a first segment that names only a crate keeps binding that crate, with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- Fixed: Rust: from edition 2018 a `use` path that starts with a name in scope is followed: a module the same module declares (`mod shapes; pub use shapes::Circle;`) or a name another `use` there brought in (`use crate::shapes; use shapes::round::Arc;`). A local name is found before a crate of the same name. The extractor emits such a path in a new form, so stored hints are stale by its `rev`. A graph can show new edges.

## Evidence

### Proof

- **ran (line 668b17b1b944):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2018-use-local-module-edge, rust-edition-2018-use-imported-module-edge, rust-edition-2018-use-imported-module-in-function-body-edge and rust-path-dependency-root-glob-reexport-edge failed; after: 0 fail
- **ran (line 668b17b1b944):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the four cases pass
- **ran (line c653aecbfb04):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2018-use-local-module-over-crate-edge failed; after: it passes, and rust-edition-2018-use-crate-not-local-name-edge passes before and after
- **ran (line c653aecbfb04):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass. The first asserts the edge to the local module, not silence: rustc 1.x compiles the fixture and binds the local name (see the note)
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus · **saw:** corpus gate: passed; verify --tier all passed; 73 of the 109 added references are this issue's (use paths that start with a module their own file declares), 0 removed

### Notes

Assumed: acceptance line 2 says a first segment that names both a local name and a crate is an error in Rust and gives no edge. rustc 1.x (rust:1-slim, editions 2018 and 2021) compiles it and binds the local name: with a path dependency shapes and a local mod shapes, pub use shapes::Square; resolves to the local module, and the same holds for a name another use bound. So the case rust-edition-2018-use-local-module-over-crate-edge asserts the edge to the local module and none to the crate, not silence. The examiner should judge this line against rustc.

Assumed: the names read are the modules a module declares and the names its use declarations bind, looked up through the blocks around the use and stopping at the module; a name two uses bind to different paths (one per cfg) leaves the path as written; other items in scope (an enum for use Shape::*) are not read, since they name the same file.

