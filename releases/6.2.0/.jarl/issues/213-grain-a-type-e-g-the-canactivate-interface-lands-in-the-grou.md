# 213 · Grain: a type (e.g. the CanActivate interface) lands in the group of methods with the same name (canActivate), the group loses its pattern and the shape deviation disappears

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, check
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-180
**Where:**
**Branch:** jarl/213-groups-cochange-history
**Merged:** c468854
**CI:** none

## What
Revealed at 180: after removing the false import from the ctx parameter of the grain.test.mjs (+dirty) fixture, the CanActivate type lands in the canActivate method group, the group no longer has a pattern, and the shape deviation disappears (2 → 1).

## Why



## Acceptance
Grouping for check does not mix types with methods of the same name (a difference of letter case / kind); test red→green on this shape.

## Changelog
- Fixed: a type named like the methods it declares (an interface `CanActivate` beside its `canActivate` methods) is no longer grouped with those methods, so checking one of them still reports when its structure departs from the group's.

## Evidence

roles-one-kind.test.mjs red (1 deviation, no shape line) -> green (2 deviations, activate+can shape)
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2296, pass 2294, fail 0, skipped 2, merge c468854

