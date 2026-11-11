# 570 · Runes: under pnpm a bare import of a workspace member that the importing package does not declare b…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1247-afqa
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-010-opus
**Where:** the review of 010, 553

## What
Runes: under pnpm a bare import of a workspace member that the importing package does not declare binds that member, though pnpm links a member only into packages that declare it (483 kept undeclared imports binding as before). In next-intl 76 SWC test fixtures under packages/swc-plugin-extractor/tests, a package with no dependencies, bind next-intl and next-intl/server, and TypeScript resolves nothing for them even after a build. Before 010 these were silent only because the entry was missing.

## Why


## Acceptance


## Evidence

