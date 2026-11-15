# 756 · Runes, TypeScript and JavaScript: import.meta.glob, require.context and vi.mock emit no use, so a file that reaches the repository only thr…

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261115T1054-wxwu
**Tags:** api, glob, javascript, runes, typescript
**Files:** Runes/src/relations/extractors/typescript.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-glob-context-mock
**Where:** Runes/src/relations/extractors/typescript.mts:334

## What
Claim: At v1.1.0 the TypeScript extractor emits import, export from, require, dynamic import, import x = require, new URL with import.meta.url and import types. A call of import.meta.glob (Vite), require.context (webpack) or vi.mock (Vitest) with a string path is none of them and gives no use. No document of Runes lists them as unread.

repros.sh glob_forms: a file holding import.meta.glob("../data/*.ts"), require.context("../data", false, /\.ts$/) and vi.mock("../data/d") printed no use at all

## Why


A file that reaches the repository only through import.meta.glob, require.context or vi.mock has no edge and no count, so a consumer cannot tell it from a file that reaches nothing. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In TypeScript and JavaScript, vi.mock with a literal path, require.context with a literal directory and import.meta.glob with literal patterns give a use of the files they name, in a unit test and a catalogue case each, red at v1.1.0 (no use) and green after; or docs/api.md lists the three as unread and a test pins the empty answer · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

