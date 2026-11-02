# 472 · Runes: in an edition 2015 package, declaring any [[bin]] turns bin auto-discovery off, but the resolver still roots src/main.rs and src/bin files there

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 470
**Found by:** rev-runes-470-opus
**Where:** Review of 470 (2026-11-02); The Cargo Book, Target auto-discovery: in the 2015 edition a declared target turns off auto-discovery of its kind unless autobins is set

## What
The resolver reacts only to an explicit autobins = false. In an edition 2015 package that declares a [[bin]] and leaves autobins unset, Cargo builds only the declared bins, yet the resolver still treats src/main.rs and src/bin files as crate roots. The new edition 2015 crate-root-item check also matches a name that exists only inside an inline mod or a function body of the root file.

## Why
A file that is no crate root read as one gives false edges, the kind that can force a cycle.

## Acceptance
- In an edition 2015 package with a declared [[bin]] and no autobins key, only declared bins are crate roots, with a catalogue case red before and green after, and a 2018 control where discovery stays on
- The edition 2015 crate-root-item check matches only items at the top level of the root file, with a case for a name inside an inline mod

## Evidence

