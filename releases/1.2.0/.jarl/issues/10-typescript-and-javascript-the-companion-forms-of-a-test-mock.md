# 10 · Runes, TypeScript and JavaScript: the companion forms of a test mock (`jest.requireActual`, `vi.importActual`, `vi.doMock`, a chained `jest.mock`) give no use

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1242-imwm
**Tags:** api, javascript, runes, typescript
**Files:** 
**Repo:** Runes
**Found by:** rev-762-opus
**Where:** the review of 756, 762, 763

## What
TypeScript and JavaScript: the companion forms of a test mock give no use: jest.requireActual('x'), jest.requireMock('x'), vi.importActual('x'), jest.doMock('x'), vi.doMock('x'), jest.unmock('x') and a chained jest.mock('a').mock('b') (its second path), although requireActual and importActual load the real module; seen in the corpus at next-intl createNavigation.test.tsx:22 (vi.importActual('use-intl')) and jest-resolve resolve.test.ts:22 (the chained form)

## Why


## Acceptance


## Evidence

