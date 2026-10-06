# 173 · Rust: remaining Cargo manifest gaps ([lib] path outside src/, [[test]]/[[example]]/[[bench]] paths, path as a multi-line string, inline package = { name })

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, rust
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** ../../../Runes
**After:** 162, 163
**Found by:** runes-165
**Where:**
**Branch:** jarl/173-cargo-and-global
**Merged:** cc62301 in ../../../Runes
**CI:** none

## What
After 162 and 163: a [lib] path outside src/ has the same defect as a [[bin]] path; [[test]], [[example]] and [[bench]] paths are ignored; a path written as a multi-line string is read as '' (the package becomes its own dependency); package = { name } in an inline table is not read.

## Why
Silent or wrong edges in less typical but valid manifests.

## Acceptance
Each of the four spellings gives the same result as its plain form; comparison with smol-toml on the corpus with no new discrepancies.

## Changelog
- Fixed: the path of a `[[test]]`, `[[example]]` or `[[bench]]` table in Cargo.toml now roots that Rust crate as a `[[bin]]` path does (zed's `tests/integration/collab_tests.rs`), so its `mod` lines and the `crate::`, `self::` and `super::` paths of its modules resolve inside it; they used to resolve to the root file itself, to nothing, or to the library.
- Fixed: with a `[lib]` path outside `src/`, a Rust module of `src/main.rs` no longer binds `crate::` items to the library's root; a name both crates declare bound the library's, and a name only the library declares bound too.
- Fixed: a Cargo.toml string written in any TOML form is read as TOML reads it: a multi-line `path = """../kit"""` names `../kit` instead of the package itself (a renamed dependency then resolved into the importing crate), and escapes are decoded.
- Fixed: `package = { name = … }`, `lib = { name = … , path = … }` and their dotted-key spellings in Cargo.toml give the crate name and library path the `[package]` and `[lib]` tables give; Rust paths through that name used to stay silent.

## Evidence

jarl: reading inline tables member by member also fixes the old misreading of 'path =' inside another field's string — accepted
- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1694, pass 1694, fail 0, catalogue 516 cases, dist/ is fresh; npm run coverage: tests 1694, pass 1694, fail 0, all files 98.80 / 94.39 / 98.78, exit 0; merge cc62301 (catalogue count conflict resolved to 505 + 11 = 516; rebuilt dist matches; d06be20 after the approve changes comments only)

