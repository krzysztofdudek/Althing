# 7 · Runes, Rust: a module declared in a cfg_if! branch, and a use written in one, is no name in scope o…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1232-svav
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** the review of 737, 759, 760

## What
Runes, Rust: a module declared in a cfg_if! branch, and a use written in one, is no name in scope of its module, so a use path (since 1.1.0) and, from 1.2.0, a path outside a use that starts with that name read the crate of the name: with a path dependency datacrate whose root declares dc, cfg_if! { if #[cfg(unix)] { mod datacrate; } } beside use datacrate::dc; (1.1.0) or datacrate::dc(1u8) (the 760 branch) gives an edge to datacrate/src/lib.rs, while rustc 1.99.1 binds the local src/datacrate.rs; with no dependency of that name, imp::g() through cfg_if! { if #[cfg(unix)] { mod unix; use unix as imp; } } answers absent outside instead of resolved src/unix.rs

## Why


## Acceptance


## Evidence

