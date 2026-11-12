# 651 · Runes: 73 of the 189 Rust catalogue fixtures do not compile under rustc (binaries without main, incomplete manifests), and a #[path] inside an inline module is not read

**Status:** in-progress
**Kind:** test
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2002-jwvd
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-578-opus, the last Rust package
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
A fixture rustc refuses tests Runes on code no compiler reads, so a case can pass for a wrong reason; the inline #[path] gap misses a child edge and can give a wrong one to a leftover file.

## Acceptance
[test] Every Rust catalogue fixture compiles under rustc (a test that builds each with a pinned rustc where it is installed, skipped with a reason where it is not), and a #[path] inside an inline module is read, red before and green after · by: npm run check

## Evidence

