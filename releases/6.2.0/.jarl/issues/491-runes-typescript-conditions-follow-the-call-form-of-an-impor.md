# 491 · Runes: TypeScript conditions follow the call form of an import (require() or import()) and skip a types@<range> key whose range TypeScript's version fails

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 1.1.1, runes, typescript
**Files:** 
**Repo:** ../../../Runes
**After:** 482
**Found by:** rev-runes-482-opus
**Where:** Review of 482 (2026-11-03): the extractor already knows the call form (isRequire in typescript.mts); an ESM-only workspace package imported with import() from a Node16 CommonJS file has no edge

## What
482 picks export conditions by the importing file's format, not by the call: a require() in an ES module and an import() in a CommonJS file take the file's conditions. A types@<range> key stops the lookup, where TypeScript skips a range its version fails and goes on to types.

## Why
A lost edge to an ESM-only package from a dynamic import, and a lost types target.

## Acceptance
- require() and import() calls select require and import conditions by their own form, with a case each, red before and green after
- A types@<range> key whose range the TypeScript version fails is skipped, with a case

## Evidence

