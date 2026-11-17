# 9 · Runes, Rust: the attribute namespaces diagnostic and rust_analyzer emit an in:: use that answers outside

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261117T1233-uhhi
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** Runes/src/relations/extractors/rust.mts, TOOL_ATTRIBUTES (rustfmt, clippy)
**Branch:** jarl/7-rust-scope
**Worker:** w-7-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
After 760, #[diagnostic::on_unimplemented(...)] and #[rust_analyzer::skip] emit in::diagnostic::on_unimplemented and in::rust_analyzer::skip, which classifyUse answers outside, because only rustfmt and clippy are listed as tool attribute namespaces. They name no crate: diagnostic is a built-in attribute namespace and rust_analyzer a tool namespace.

## Why
A consumer that counts uses leaving the repository counts two attribute namespaces as crates, noise in every crate that uses them.

## Acceptance
[test] #[diagnostic::on_unimplemented(...)], #[diagnostic::do_not_recommend] and #[rust_analyzer::skip] give no use, as #[rustfmt::skip] gives none, in a unit test, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

