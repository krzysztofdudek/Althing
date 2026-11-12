# 707 · Minor: Runes, TypeScript: a package.json imports target is still resolved with an added extension (…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-dqki
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693

## What
Minor: Runes, TypeScript: a package.json imports target is still resolved with an added extension (src/relations/extractors/typescript-resolve.mts:69 probes it; 646 changed only exports targets to probeExact), so "imports": { "#u/*": "./src/u/*" } and import { thing } from '#u/thing' give packages/app/use.js:1 -> the file src/u/thing.js on c5124ca and 90c330f, where Node and TypeScript read the target as written and find no file.

## Why


## Acceptance


## Evidence

