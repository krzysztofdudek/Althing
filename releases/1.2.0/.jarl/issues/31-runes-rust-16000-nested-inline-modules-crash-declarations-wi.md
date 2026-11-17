# 31 · Runes, Rust: 16000 nested inline modules crash declarations() with a stack overflow, and paths under nested inline modules cost time that grows with the square of the depth

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1551-sqeb
**Tags:** runes, rust, performance
**Files:** 
**Repo:** Runes
**Found by:** w-7-opus
**Where:** Runes/src/relations/extractors/rust.mts, declarations() and the inline-module scope walk

## What
Found by the worker of 7 and 8 at the branch jarl/7-rust-scope: a Rust file of 16000 nested inline mod blocks makes declarations() throw a stack overflow (RangeError), and paths under nested inline modules take time that grows with the square of the nesting depth (4000 levels take 1.6 s). Whether v1.1.0 already did both is to be checked first.

## Why
A thrown stack overflow stops a consumer's whole pass on one crafted or generated file, against the extractors' guarantee that malformed or deep input is read without throwing and in linear time.

## Acceptance
[test] A Rust file of 16000 nested inline modules is read without throwing, and its declarations and uses are produced in linear time, in a bounded test in the style of the existing linear-time tests, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

