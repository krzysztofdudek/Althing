# 470 · Runes: Rust edge cases left after 237 (an item of the crate root itself in edition 2015, and an edition set on a [[bin]] or [lib] target)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-237-opus
**Where:** Review of 237 (2026-11-02) and the 237 worker's Found list
**After:** 237
**Branch:** jarl/470-rust-crate-root-items
**Merged:** d4cc82527adf57985bfb308e4781bac05529686b in ../../../Runes
**CI:** green

## What
In edition 2015, use Error; naming an item defined in src/lib.rs itself gives no edge, because only declared modules are resolved from the crate root. An edition key on a [[bin]] or [lib] target is ignored; only [package].edition is read.

## Why
Both lose real edges in older crates and in crates that mix editions per target.

## Acceptance
- use of a crate-root item in edition 2015 gives its edge, with a catalogue case red before and green after
- A target's own edition key decides how its files read use paths, with a catalogue case for a 2015 bin in a 2018 package and the reverse

## Changelog
- Fixed: in an edition 2015 crate, `use Error;` or `use Error::NotFound;` naming an item the crate root file itself defines now gives its edge to that file; an edition written on `[lib]` or on a `[[bin]]`, `[[test]]`, `[[example]]` or `[[bench]]` table now decides how that target's files read `use` paths (a 2015 binary in a 2018 package gains its root-relative edges, a 2018 binary in a 2015 package loses the ones it wrongly had); under `autobins = false`, `src/main.rs` is a crate root only when a `[[bin]]` declares it by `path` or is named like the package. A consumer's graph can show fewer edges from an undeclared `src/main.rs` and from a 2018 binary in a 2015 package, and new edges elsewhere.

## Evidence

From the 237 worker's follow-up (2026-11-02): the resolver still treats src/main.rs as an inferred crate root when autobins = false (rustTargetFor compares rel with mainRoot unconditionally), while Cargo infers no default bin then; part of this issue: under autobins = false, src/main.rs is a root only when a [[bin]] declares it
- **ran:** nice -n 15 node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (before the fix, case rust-edition-2015-use-crate-root-item-edge) · **saw:** failed: expected edge src/api/client.rs:1->src not emitted (got none)
- **ran:** same command after the fix, with test/relations/extractors/rust-resolve.test.mjs · **saw:** all pass; the case binds src/lib.rs for use Error::NotFound, and use serde::Deserialize and use Missing stay silent
- **ran:** same matrix test before the edition fix, cases rust-bin-edition-2015-in-2018-package-edge and rust-bin-edition-2018-in-2015-package-silence · **saw:** edge case: expected edge src/api/client.rs:1->src not emitted (got none); silence case: unexpected cross-owner edge src/api/client.rs:1->src
- **ran:** same matrix test and rust-resolve.test.mjs after the edition fix · **saw:** all pass (124 and 66 tests in the two files, 0 fail)
- **ran:** same matrix test before the main.rs fix, case rust-autobins-off-undeclared-main-silence · **saw:** failed: unexpected cross-owner edge src/main.rs:1->tools
- **ran:** nice -n 15 npm run check, then nice -n 15 npm run coverage on the committed tree · **saw:** check: 1933 pass, 0 fail, dist/ is fresh; coverage: 1933 pass, all files 99.05% lines, 94.78% branches, 99.13% functions
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** tests 1933, pass 1933, fail 0; dist/ is fresh (merge d4cc82527adf57985bfb308e4781bac05529686b on release/1.1.0, catalogue 587)

