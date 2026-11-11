# 553 · Minor: Runes: a tsconfig that leaves module or moduleResolution unset (or sets module commonjs alon…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1101-zbdz
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-526b-fable
**Where:** the review of 491, 526

## What
Minor: Runes: a tsconfig that leaves module or moduleResolution unset (or sets module commonjs alone) keeps the first-target reading of exports, where TypeScript 6.0.3 resolves it as bundler: with an exports entry listing import before require, a .cts or .cjs file, an import x = require() and a require() call bind the import target and the compiler the require target (63 of 180 compared rows for {} and for module esnext alone, 141 of 180 for module commonjs alone). It existed before 491 and 526, which do not name it.

## Why


## Acceptance


## Evidence

