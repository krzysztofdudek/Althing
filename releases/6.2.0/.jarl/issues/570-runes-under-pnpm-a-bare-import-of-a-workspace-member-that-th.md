# 570 · Runes: under pnpm a bare import of a workspace member that the importing package does not declare b…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1247-afqa
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-010-opus
**Where:** the review of 010, 553
**Branch:** jarl/550-typescript
**Worker:** w-550-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 19:11

## What
Runes: under pnpm a bare import of a workspace member that the importing package does not declare binds that member, though pnpm links a member only into packages that declare it (483 kept undeclared imports binding as before). In next-intl 76 SWC test fixtures under packages/swc-plugin-extractor/tests, a package with no dependencies, bind next-intl and next-intl/server, and TypeScript resolves nothing for them even after a build. Before 010 these were silent only because the entry was missing.

## Why


## Acceptance


[test] Under pnpm a bare import of a workspace member that the importing package does not declare binds nothing, as TypeScript resolves nothing for it, while a declared member still binds; next-intl's SWC fixtures stay silent in the corpus, red before and green after · by: npm run check

## Evidence

