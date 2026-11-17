# 6 · Runes, TypeScript and JavaScript: `vi.doMock`, `vi.importActual`, `vi.unmock` and `jest.requireActual` give no use

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1228-vzjh
**Tags:** runes, typescript, javascript, api
**Files:** 
**Repo:** Runes
**Found by:** w-762-haiku
**Where:** Runes/src/relations/extractors/typescript.mts, the call reading 756 extended

## What
After 756, vi.mock and jest.mock with a literal path give a use of the file they name. The neighbouring forms that name a module the same way, vi.doMock, vi.importActual, vi.unmock and jest.requireActual (and jest.doMock), still give none, so a test file that reaches a module only through them has no edge to it.

## Why
The same test-mock shape read for two calls and not for their siblings leaves a consumer with edges that depend on which mock function a test happened to use.

## Acceptance
[test] vi.doMock, vi.importActual, vi.unmock, jest.requireActual and jest.doMock with a literal path give a use of the file they name, as vi.mock does, in a unit test and a catalogue case, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

