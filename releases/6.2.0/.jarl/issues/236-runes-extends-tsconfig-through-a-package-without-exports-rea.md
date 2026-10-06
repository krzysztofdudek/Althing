# 236 · Runes: extends tsconfig through a package without exports reads the tsconfig field in package.json, and extends with a subpath also tries <subpath>/tsconfig.json (split off from 188)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, typescript
**Files:** 
**Repo:** ../../../Runes
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**

## What
Split off from 188 per the 6.2.0 plan (R5).

## Why



## Acceptance
extends: "@acme/tsconfig" on a package without exports reads the tsconfig field from package.json, then tsconfig.json; extends: "@acme/tsconfig/base" tries base, base.json and base/tsconfig.json; one catalogue case for each form, red→green.

## Evidence


