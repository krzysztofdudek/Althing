# 646 · Runes, TypeScript: the corpus checker ignores call forms for files a tsconfig covers, and Runes adds an extension to an exports pattern target for a file no tsconfig covers, which Node and TypeScript do not

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1954-hmtm
**Tags:** runes, typescript
**Files:** 
**Repo:** Runes
**After:** 550
**Found by:** jarl
**Where:** w-550-opus, the TypeScript package

## What


## Why
The checker cannot catch a call-form fault in covered files, and the extension added to a pattern target gives 40 react edges that Node and TypeScript would not resolve (explained as Flow's reading).

## Acceptance
[test] The corpus checker reads the call form of require() and import() in files a tsconfig covers too, and an exports pattern target is resolved without an added extension as Node and TypeScript do, red before and green after · by: npm run check

## Evidence

