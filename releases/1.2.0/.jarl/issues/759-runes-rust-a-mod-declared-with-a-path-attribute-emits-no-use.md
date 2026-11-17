# 759 · Runes, Rust: a mod declared with a #[path] attribute emits no use, so the file it loads has no edge from the file that declares it

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-zfrj
**Tags:** api, runes, rust
**Files:** Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-rust-path-attribute
**Where:** Runes/src/relations/extractors/rust.mts:459, Runes/src/relations/extractors/rust.mts:88
**Branch:** jarl/737-rust-path-modules
**Worker:** w-737-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:24

## What
Claim: At v1.1.0 modHasPathOverride makes the extractor skip every file-backed mod that carries #[path = "..."], by design ("silence over a guess"), although the attribute names the file. Since 1.1.0 declarations() records the files such an attribute loads (pathmod:), so the declaring side is the one missing.

repros.sh rust_path: src/ui/mod.rs with "pub mod f;" and, on lines 2 and 3, #[path = "../data/orphan.rs"] pub mod via_attr; printed only self::f; src/ui/f.rs with #[path = "../data/d.rs"] mod dd; on line 1 printed no use for dd

Moved from issue 759 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A file loaded by #[path] has no edge from the file that declares it, although the attribute names it, so a layer check shows nothing for the use. A new family tool whose documentation promised these modules found it.

## Acceptance
[test] In Rust, a file-backed mod with #[path = "../data/orphan.rs"] outside inline modules gives a use that binds that file, on its own line and when written on one line with the mod, in a unit test and a catalogue case that builds under rustc, red at v1.1.0 (no use) and green after; a #[path] on an enclosing inline module stays silent and every existing answer and edge stays as it is · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Changelog
- Added: in Rust, a `mod` with a `#[path]` attribute among the items of its file (`#[path = "../data/orphan.rs"] pub mod via_attr;`) gives an edge to the file the attribute names, read from the directory of the file that writes it; in 1.1.0 it gave none. One inside an inline module, in a function body or in a `cfg_if!` branch still gives none. A consumer can see new edges, and new refusals, from a file to the modules it moves with the attribute; hints stored by 1.1.0 are stale by the Rust extractor's `rev`.

## Evidence

### Proof

- **ran (line 42fa2408c402):** node --test test/relations/extractors/rust.test.mjs test/relations/extractors/rust-resolve.test.mjs test/relations/extractors/rust-name-resolution-matrix.test.mjs, with the new unit tests and cases against dist/ built at 1f3476b (v1.1.0) · **saw:** red: the unit test expecting mod::../data/orphan.rs@3 and mod::data/d.rs@4, the doc-comment unit test expecting mod::a.rs and mod::b.rs, both mod:: resolver tests, rust-mod-path-attribute-override-edge and rust-mod-path-attribute-relative-to-declaring-file-edge fail with no use; the inline-module, path-attributed inline module and function-body silence test passes
- **ran (line 42fa2408c402):** npm run check at e5885d7 (the branch tip after merging release/1.2.0 at 20aceea) · **saw:** tests 2764, pass 2761, fail 0, skipped 3; dist/ is fresh; the unit tests, rust-mod-path-attribute-override-edge, rust-mod-path-attribute-relative-to-declaring-file-edge and the ten cases that now record their path-attribute edge pass
- **ran (line 42fa2408c402):** node --test test/relations/rust-cases-build.test.mjs at e5885d7 with cargo and rustc 1.99.1 from rust:1.99.1-slim on PATH through the brief's wrappers · **saw:** tests 4, pass 4, fail 0, skipped 0: both build tests ran; rust-mod-path-attribute-relative-to-declaring-file-edge builds; rust-mod-path-attribute-override-edge keeps its place in DO_NOT_BUILD_YET under its new id and still does not build

### Notes

Assumed: a mod with a path attribute inside an inline module, under an inline module with a path attribute, in a function body, in a cfg_if! branch or with a path a cfg_attr applies stays silent: the acceptance names mods outside inline modules, and the declarations side reads no such file either (pathModules).

Assumed: the file binds when it exists in a Cargo package, with no exclusion check, as every other Rust path does (the Rust resolver takes no isExcluded); the plan's 'not excluded' is not a test of the line.

Assumed: ten existing cases whose fixtures hold a mod with a path attribute among the items of a file gain the edge it gives as a new Expect line (every edge checked against the Reference: the path is read from the directory of the declaring file), and rust-mod-path-attribute-before-doc-comment-silence keeps silence with its Rule rewritten, since its files lie in one node; no existing edge or answer moved. Corpus: ripgrep gains 2 edges (crates/core/index/mod.rs:5 and :8, the cfg'd #[path] mods), explained and committed in the golden as its own commit 8e245bf.

