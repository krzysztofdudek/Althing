# 665 · Grain: the type-name count takes a TypeScript string-named ambient module (declare module 'foo' {},…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2148-radx
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-557-opus
**Where:** the review of 231, 557, 563, 564, 567, 637, 640, 643, 644, 652
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:49

## What
Grain: the type-name count takes a TypeScript string-named ambient module (declare module 'foo' {}, node type module, counted under the name 'foo' with its quotes) and a Java enum constant (enum_constant) for types, on release/6.2.0 and on jarl/557-grain-rest alike; the Java enum constant is counted and still not refused by the rendered check, so count and check disagree in Java, and the ambient module is now refused (the review of 557's Minor 4).

## Why


## Acceptance


[test] The type-name count takes neither a TypeScript string-named ambient module nor a Java enum constant for a type, and check refuses only what the count measured, so declare module 'foo' {} is not refused, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: a type-name rule no longer counts or refuses a TypeScript ambient module named by a string (declare module 'foo') or a Java enum constant, which are not type names. Grain reads the sources again once after you upgrade.

## Evidence

