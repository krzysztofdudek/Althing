# 605 · Grain: an ordinary file whose extractor throws is kept as having no relations until its stamp changes

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-juib
**Tags:** grain, relations
**Files:** 
**Repo:** Grain
**After:** 169
**Found by:** jarl
**Where:** w-169-takeover-fable, issue 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
An extractor exception depends on the code that ran, not on the file; keeping it as the file's answer hides the file's dependencies after the extractor is fixed or the moment passes.

## Acceptance
[test] A file under the parse limit whose extraction throws is reported as unread with the reason and read again by grain refresh, red before and green after · by: cd plugins/grain && npm test

## Evidence

### Proof

- **ran (line b926cb9b69ec):** node --import ./tests/git-env.mjs --test tests/extractor-error-read-again.test.mjs before the fix, 8 GB cap · **saw:** 2 tests, 0 pass, 2 fail: a Python file whose extractor throws is read once, is in no unread list, and status says nothing of it
- **ran (line b926cb9b69ec):** node --import ./tests/git-env.mjs --test tests/extractor-error-read-again.test.mjs with the six other test files of unparsed and over-limit sources, after the fix, 8 GB cap, no YG_BIN · **saw:** tests 55, fail 0, 1 skipped (needs YG_BIN): the file is named under 'dependencies not read' with the error, a plain refresh keeps the answer without reading, grain refresh reads the file and its edge returns, in the library and on the command line

### Notes

Assumed: a file under the limit that was parsed is not 'not parsed', so the note names it under a heading of its own, 'dependencies not read', on the same line. Its failure is filed as unfinished, the outcome 169 gives an extractor error on an over-limit file.

Correction to my second row: that run printed tests 51, pass 50, fail 0, skipped 1, not 55.

