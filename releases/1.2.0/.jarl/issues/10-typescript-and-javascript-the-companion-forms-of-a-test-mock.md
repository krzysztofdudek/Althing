# 10 · Runes, TypeScript and JavaScript: the companion forms of a test mock (`jest.requireActual`, `vi.importActual`, `vi.doMock`, a chained `jest.mock`) give no use

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1242-imwm
**Tags:** api, javascript, runes, typescript
**Files:** 
**Repo:** Runes
**Found by:** rev-762-opus
**Where:** the review of 756, 762, 763
**Branch:** jarl/755-bundler-alias
**Worker:** w-755-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:52

## What
TypeScript and JavaScript: the companion forms of a test mock give no use: jest.requireActual('x'), jest.requireMock('x'), vi.importActual('x'), jest.doMock('x'), vi.doMock('x'), jest.unmock('x') and a chained jest.mock('a').mock('b') (its second path), although requireActual and importActual load the real module; seen in the corpus at next-intl createNavigation.test.tsx:22 (vi.importActual('use-intl')) and jest-resolve resolve.test.ts:22 (the chained form)

## Why


A test file that reaches a module only through these forms has no edge to it, and which mock function a test happened to use decides whether a consumer sees the dependency.

## Acceptance


[test] jest.requireActual, jest.requireMock, vi.importActual, jest.doMock, vi.doMock and jest.unmock with a literal path, and the second path of a chained jest.mock('a').mock('b'), give a use of the file they name, as vi.mock does, in a unit test and a catalogue case, red before and green after; every existing answer and edge stays as it is, and the corpus gate is green with every new edge explained · by: npm run check

## Evidence

