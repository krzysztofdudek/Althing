# 600 · Runes: in edition 2015 a binary's use app::X binds its own library without extern crate app;

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1446-vkqf
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 516
**Found by:** jarl
**Where:** w-523-fable, the Rust roots package

## What


## Why
Edition 2015 needs extern crate to name a crate; without it rustc rejects the path, so the edge Runes gives is one the compiler never resolves.

## Acceptance
[test] In an edition 2015 binary without extern crate app;, use app::X gives no edge to the library, and with it gives one, each a catalogue case, red before and green after · by: npm run check

## Evidence

