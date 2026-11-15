# 735 · Runes: a comment in the Rust case build test says CI has no Rust toolchain and skips the test, while CI runs it on every platform

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261113T1659-wyud
**Tags:** ci, rust
**Files:** Runes/test/relations/rust-cases-build.test.mjs
**Repo:** Runes
**Found by:** w-733-opus
**Where:** Runes/test/relations/rust-cases-build.test.mjs:19 at 8d31e57
**Branch:** jarl/740-runes-1-1-0-final
**Worker:** w-740-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-13 17:52

## What
The comment above the toolchain lookup says CI has no Rust toolchain, so the test runs only where a developer installed the pinned one and is skipped on CI. Runes CI runs it: run 43464346353 failed in it on Windows (issue 733).

## Why
A comment that says a test never runs on CI tells the next reader a red CI cannot come from it.

## Acceptance
[read] The comment says where the test runs and when it is skipped, as the workflow and the code do

## Evidence

