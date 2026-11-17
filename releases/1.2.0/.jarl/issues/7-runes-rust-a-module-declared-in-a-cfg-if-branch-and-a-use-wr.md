# 7 · Runes, Rust: a module declared in a cfg_if! branch, and a use written in one, is no name in scope o…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1232-svav
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** the review of 737, 759, 760
**Branch:** jarl/7-rust-scope
**Worker:** w-7-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes, Rust: a module declared in a cfg_if! branch, and a use written in one, is no name in scope of its module, so a use path (since 1.1.0) and, from 1.2.0, a path outside a use that starts with that name read the crate of the name: with a path dependency datacrate whose root declares dc, cfg_if! { if #[cfg(unix)] { mod datacrate; } } beside use datacrate::dc; (1.1.0) or datacrate::dc(1u8) (the 760 branch) gives an edge to datacrate/src/lib.rs, while rustc 1.99.1 binds the local src/datacrate.rs; with no dependency of that name, imp::g() through cfg_if! { if #[cfg(unix)] { mod unix; use unix as imp; } } answers absent outside instead of resolved src/unix.rs

## Why


A lost true edge, or a false one, misleads every consumer that checks dependencies with the readers.

## Acceptance


[test] A module declared and a use written in a cfg_if! branch are names in scope of their module, so use datacrate::dc; and datacrate::dc(1u8) beside cfg_if! { if #[cfg(unix)] { mod datacrate; } } bind src/datacrate.rs and give no edge to a path dependency of that name, and imp::g() through a use alias in such a branch resolves src/unix.rs; catalogue cases that build under rustc, red before and green after; every existing answer and edge stays as it is · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Changelog
- in Rust, a module a `cfg_if!` branch declares and a name a `use` there binds are names in scope of their module, as when written outside the macro: `use imp::g;` after `cfg_if! { if #[cfg(unix)] { mod unix; use unix as imp; } }` gives an edge to `src/unix.rs`, where 1.1.0 read `imp` as a crate and gave none, and a path written outside a `use` that starts with such a name (`datacrate::dc()` beside a branch that declares `mod datacrate;`) gives no edge to a path dependency of that name. A glob `use` in a branch may bring in any name, so a path under it gives no edge. This can show new findings from a platform layer to its modules.

## Evidence

### Proof

- **ran (line df79be71708a):** node --test test/relations/extractors/rust.test.mjs test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs at e01f322 (before the fix) · **saw:** tests 287, pass 284, fail 3: rust-cfg-if-module-and-use-are-names-in-scope-edge expected src/lib.rs:8->unix, got src/lib.rs:10->datacrate; the two cfg_if! names-in-scope unit tests
- **ran (line df79be71708a):** npm run check at 27ec329 · **saw:** tests 2845, pass 2842, fail 0, skipped 3; dist/ is fresh
- **ran (line df79be71708a):** node --test test/relations/rust-cases-build.test.mjs (cargo and rustc 1.99.1 from rust:1.99.1-slim through the brief's wrappers) at 27ec329 · **saw:** tests 6, pass 6, fail 0, skipped 0; rust-cfg-if-module-and-use-are-names-in-scope-edge builds

### Notes

Assumed: the line's two halves meet where the reader's design already stands. imp::g() (a path outside a use) through an alias bound in a cfg_if! branch now gives no use, as the same call through an alias written outside the macro gives none (the extractor emits nothing for a path whose first name is bound in scope, so no path outside a use ever answers resolved); before it answered absent outside. The resolved src/unix.rs answer is shown by use imp::g; in the case. use datacrate::dc; beside a cfg_if! mod datacrate; with a path dependency of that name is refused by rustc 1.99.1 (E0659, a macro-expanded name may not shadow a crate of the extern prelude during import resolution), so no building case holds it: the unit test shows the extractor emits use::2::self::datacrate::datacrate::dc for it, and the case shows datacrate::dc(1u8) gives no edge to the dependency, which rustc binds to src/datacrate.rs (the case's let () = ... fails to build against the crate's u32).

