# 576 · Runes: a dual package whose .mjs and .d.mts entries a bundler (tsup, unbuild) builds from a .ts sou…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1312-flla
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-010b-opus
**Where:** the review of 010, 553

## What
Runes: a dual package whose .mjs and .d.mts entries a bundler (tsup, unbuild) builds from a .ts source maps to nothing, because the outDir mapping follows the compiler's extension rule (.d.mts from .mts). An ES importer whose settings are known gets no edge and package-entry-missing although the source is there; in a probe 22 of 480 rows (an app with module esnext and moduleResolution bundler over an unread preset, module nodenext, a committed node16 preset, a readable bundler base), where the compiler after the build binds dist/index.d.mts, emitted from src/index.ts. Unchanged by round 1 of 010; ruling D8 makes it silence rather than a wrong edge.

## Why


## Acceptance


## Evidence

