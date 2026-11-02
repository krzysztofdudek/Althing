# 470 · Runes: Rust edge cases left after 237 (an item of the crate root itself in edition 2015, and an edition set on a [[bin]] or [lib] target)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-237-opus
**Where:** Review of 237 (2026-11-02) and the 237 worker's Found list
**After:** 237

## What
In edition 2015, use Error; naming an item defined in src/lib.rs itself gives no edge, because only declared modules are resolved from the crate root. An edition key on a [[bin]] or [lib] target is ignored; only [package].edition is read.

## Why
Both lose real edges in older crates and in crates that mix editions per target.

## Acceptance
- use of a crate-root item in edition 2015 gives its edge, with a catalogue case red before and green after
- A target's own edition key decides how its files read use paths, with a catalogue case for a 2015 bin in a 2018 package and the reverse

## Evidence

From the 237 worker's follow-up (2026-11-02): the resolver still treats src/main.rs as an inferred crate root when autobins = false (rustTargetFor compares rel with mainRoot unconditionally), while Cargo infers no default bin then; part of this issue: under autobins = false, src/main.rs is a root only when a [[bin]] declares it

