# 668 · Grain: the type-name count takes a C# enum member (enum_member_declaration) and a Rust enum variant…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2225-luco
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-557b-opus
**Where:** the review of 231, 557, 563, 564, 567, 637, 640, 643, 644, 652, 664, 665
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 22:26

## What
Grain: the type-name count takes a C# enum member (enum_member_declaration) and a Rust enum variant (enum_variant) for a type, the defect 665 removed for the Java enum constant, on release/6.2.0 and on jarl/557-grain-rest alike; since 563 the rendered type check refuses them too, so count and check agree but both measure values as type names (probe: enum Color { Red } in .cs and .rs counts and refuses Red)

## Why


## Acceptance


[test] The type-name count takes neither a C# enum member nor a Rust enum variant for a type, and check refuses only what the count measured, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: a type-name rule no longer counts or checks a C# enum member or a Rust enum variant, which are values of an enum and not types. Grain reads the sources again once after you upgrade.

## Evidence

### Proof

- **ran (line e6264f5fe93f):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/name-shape-type-count-excludes-enum-values.test.mjs (red on its test commit: Green and Red counted and refused in .cs and .rs), then the whole suite through full-gate.sh (tests 2361, pass 2354, fail 0, skipped 7) on 703c5afe · **saw:** all green; the count is Color and Plain, and the check refuses the same; EXTR_V is g40

