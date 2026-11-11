# 573 · Grain: the "not parsed" note says of an over-limit or failed file that dependencies to and from it …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1309-zfhs
**Tags:** 
**Files:** Grain/plugins/grain/engine/report-facts.mjs
**Repo:** Grain
**Found by:** rev-169b-fable
**Where:** the review of 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What
Grain: the "not parsed" note says of an over-limit or failed file that dependencies to and from it are not resolved, while edges to it are in the model wherever the importer binds by path or package: a Go package import gives cmd/main.go -> assets/bindata.go, and four Python services give four edges to the unread src/data.py. The tool before the change prints the same note with the same edges (plugins/grain/engine/report-facts.mjs:196).

## Why


## Acceptance


[test] For an over-limit or failed file, the not-parsed note and the model agree: the note does not say dependencies to the file are unresolved where the model holds edges to it (a Go package import giving cmd/main.go -> assets/bindata.go, four Python services giving four edges to the unread src/data.py), or those edges are no longer in the model; both repros are tests, red before and green after · by: cd plugins/grain && npm test

## Evidence

### Proof

- **ran (line bdcf32abb570):** node --import ./tests/git-env.mjs --test tests/unparsed-note-agrees-with-edges.test.mjs on the release code (the test commit, before the fix), 8 GB cap · **saw:** 4 tests, 0 pass, 4 fail: the model holds cmd/main.go -> assets/bindata.go and four edges to src/data.py while the note says dependencies to and from the file are not resolved
- **ran (line bdcf32abb570):** node --import ./tests/git-env.mjs --test tests/unparsed-note-agrees-with-edges.test.mjs tests/oversize-relations-counted.test.mjs tests/oversize-source-disclosed.test.mjs tests/binary-sources-not-parsed.test.mjs tests/check-unparsed-like-index.test.mjs after the fix, 8 GB cap, no YG_BIN · **saw:** 46 tests, 45 pass, 0 fail, 1 skipped (the yg comparison, which needs YG_BIN): the note counts 1 dependency to assets/bindata.go and 4 to src/data.py

### Notes

Assumed: where the model holds no dependency to an unread file the note keeps its sentence (dependencies to and from it are not resolved); where it holds some, the note says dependencies from it are not resolved and counts those to it. The edges stay in the model, because they are true.

