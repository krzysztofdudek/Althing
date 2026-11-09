# 181 · Runes: ostatnie ciche formy po 173/174 ([A.Gen<Order>] i [S::Foo] w atrybutach C#; bin = [{ path }] inline i autotests w Cargo)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1236-trqa
**Tags:** runes, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolve-path.mts
**Repo:** ../../../Runes
**After:** 173, 174
**Found by:** runes-173
**Where:**
**Branch:** jarl/168-last-runes
**Merged:** 6ef3ef9 in ../../../Runes
**CI:** none

## What
After 173/174: an attribute with a generic type [A.Gen<Order>] (with and without global::) and an attribute through an alias [S::Foo] give no edge; in Cargo.toml the inline form bin = [{ path }] and the autotests field are not read.

## Why
Silent dependencies in rarer but valid spellings.

## Acceptance
Each form gives an edge or is a documented silence; catalogue cases; comparison with smol-toml with no new discrepancies.

## Changelog
- Fixed: in C#, a generic attribute behind a qualifier (`[A.Gen<Order>]`, `[global::A.Gen<Order>]`) and an attribute after a using alias (`[S::Foo]`, `[S::Gen<T>]`) give their edges; in Cargo.toml, target arrays written inline (`bin = [{ path = … }]`) root their crates and `autotests`, `autoexamples` and `autobenches = false` are read, so the files of tests/ are modules of the declared tests instead of crates of their own.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1736, pass 1736, fail 0, catalogue 522 cases, dist/ is fresh; npm run coverage: tests 1736, pass 1736, fail 0, all files 98.81 / 94.49 / 98.80, exit 0; merge 6ef3ef9 (clean merge, branch based on the release tip; 522 = 516 + 6 matches the cases on disk)

