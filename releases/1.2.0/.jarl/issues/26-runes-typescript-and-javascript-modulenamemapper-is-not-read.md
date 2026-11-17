# 26 · Runes, TypeScript and JavaScript: `moduleNameMapper` of the `jest` configuration is not read, so a test import it maps into the repository answers outside

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1509-ltek
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-755-opus
**Where:** the review of 10, 20, 755

## What
Runes, TypeScript and JavaScript: Jest's moduleNameMapper (the jest key of package.json or jest.config.*) is not read: with '^@/(.*)$': '<rootDir>/src/$1', a test's import of @/components/Button answers absent outside although Jest binds src/components/Button.js, so a test that reaches the code only through a Jest-only alias passes a layer check unseen

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: a gap v1.1.0 already had, or a reach the new reader does not claim, not a false edge or a regression (ruling runes-1-2-0-cut-for-new-findings)

