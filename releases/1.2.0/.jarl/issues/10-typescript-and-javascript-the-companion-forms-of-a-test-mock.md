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

## Changelog
- `jest.requireActual('…')`, `jest.requireMock`, `jest.doMock`, `jest.unmock`, `jest.dontMock`, `jest.deepUnmock`, `jest.setMock`, `jest.createMockFromModule`, `vi.importActual('…')`, `vi.importMock`, `vi.doMock`, `vi.unmock` and `vi.doUnmock` with a string-literal path now give a use of the file the path names, as `vi.mock('…')` does, and so does each call of a chain of Jest's module calls (`jest.mock('a').mock('b')` gives two). This can show new findings: a graph that forbids a test's dependency on a module it loads or mocks through one of these calls now reports that test.

## Evidence

### Proof

- **ran (line 8097ba2813ca):** node --test test/relations/extractors/typescript.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs (pattern companion), at 45d8cfe (tests only) · **saw:** red: fail 2; the unit test got only ../data/g and ../data/k (no requireActual, requireMock, importActual, doMock, unmock or chained second path), the case typescript-test-mock-companion-forms-edge emitted no edge at line 1
- **ran (line 8097ba2813ca):** node --test typescript.test.mjs, the TypeScript matrix, extractor-rev, catalogue and exports tests at 87f5310; node scripts/corpus.mjs verify for next-intl, jest, react, typeorm, shaka-player, skywalking-booster-ui, vitepress, zod, ky, express, koa, commander.js · **saw:** green: pass 223, fail 0, catalogue 1013 cases; corpus: next-intl +6, jest +46, react +53 added, each read at its source line and explained, then goldens regenerated; every other repository 0 added, 0 removed

### Notes

Assumed: besides the six forms the line lists, the reading takes every other call of vi and jest whose first argument is a module path (jest.dontMock, jest.deepUnmock, jest.setMock, jest.createMockFromModule, vi.importMock, vi.unmock, vi.doUnmock), since the issue's why is that the mock function a test picked must not decide the edge; a chain is read through Jest's calls that return the jest object (mock, doMock, unmock, dontMock, deepUnmock, setMock), and each link of a chain over several lines gives its use on the line the chain starts, as 756 already reports a call.

