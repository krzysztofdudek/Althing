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

## Evidence

