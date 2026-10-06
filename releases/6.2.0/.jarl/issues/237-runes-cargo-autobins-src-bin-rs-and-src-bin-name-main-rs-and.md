# 237 · Runes: Cargo — autobins (src/bin/*.rs and src/bin/<name>/main.rs) and edition 2015 (use a::b relative to the crate root) (split off from 188)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust
**Files:** 
**Repo:** ../../../Runes
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**

## What
Split off from 188 per the 6.2.0 plan (R6).

## Why



## Acceptance
src/bin/*.rs and src/bin/<name>/main.rs are roots of their own crates, unless autobins = false; in edition 2015 (also the default when [package] gives no edition) use a::b is relative to the crate root; a control case for 2018, where use a::b is an external crate; red→green.

## Evidence


