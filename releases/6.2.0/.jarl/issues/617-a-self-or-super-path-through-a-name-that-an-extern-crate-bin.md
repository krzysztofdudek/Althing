# 617 · A self:: or super:: path through a name that an extern crate binds in that module, such as extern c…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1610-eskr
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-523b-opus
**Where:** the review of 513, 516, 517, 523

## What
A self:: or super:: path through a name that an extern crate binds in that module, such as extern crate util as u; then use self::u::Marker; in a module of an edition 2015 crate, probes a module file u and gives no edge, where rustc 1.99.1 names the crate util; the same on release/1.1.0.

## Why


## Acceptance


## Evidence

