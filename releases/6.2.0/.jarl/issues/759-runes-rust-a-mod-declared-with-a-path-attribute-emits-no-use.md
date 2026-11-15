# 759 · Runes, Rust: a mod declared with a #[path] attribute emits no use, so the file it loads has no edge from the file that declares it

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261115T1054-pfmh
**Tags:** api, runes, rust
**Files:** Runes/src/relations/extractors/rust.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-rust-path-attribute
**Where:** Runes/src/relations/extractors/rust.mts:459, Runes/src/relations/extractors/rust.mts:88

## What
Claim: At v1.1.0 modHasPathOverride makes the extractor skip every file-backed mod that carries #[path = "..."], by design ("silence over a guess"), although the attribute names the file. Since 1.1.0 declarations() records the files such an attribute loads (pathmod:), so the declaring side is the one missing.

repros.sh rust_path: src/ui/mod.rs with "pub mod f;" and, on lines 2 and 3, #[path = "../data/orphan.rs"] pub mod via_attr; printed only self::f; src/ui/f.rs with #[path = "../data/d.rs"] mod dd; on line 1 printed no use for dd

## Why


A file loaded by #[path] has no edge from the file that declares it, although the attribute names it, so a layer check shows nothing for the use. A new family tool whose documentation promised these modules found it.

## Acceptance
[test] In Rust, a file-backed mod with #[path = "../data/orphan.rs"] outside inline modules gives a use that binds that file, on its own line and when written on one line with the mod, in a unit test and a catalogue case that builds under rustc, red at v1.1.0 (no use) and green after; a #[path] on an enclosing inline module stays silent and every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

