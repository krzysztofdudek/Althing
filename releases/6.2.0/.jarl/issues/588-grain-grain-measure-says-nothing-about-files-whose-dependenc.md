# 588 · Grain: grain measure says nothing about files whose dependencies it could not read (a source over t…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1414-refp
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-169c-fable
**Where:** the review of 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What
Grain: grain measure says nothing about files whose dependencies it could not read (a source over the parse limit whose read gave no facts, a source the parser failed on), in its text or its JSON, so its counts of imports and undeclared dependencies read as complete. On the release branch every over-limit file was missing from those counts without a word.

## Why


## Acceptance


[test] grain measure names, in its text and in its JSON, the files whose dependencies it could not read (a source over the parse limit whose read gave no facts, a source the parser failed on), so its counts of imports and undeclared dependencies are not presented as complete, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: grain measure names every file whose dependencies it could not read, in its notes and as from.unread and to.unread in its JSON: a source over the parse limit whose read gave no facts, a source whose dependency read ended with an error, and a source the parser failed on.

## Evidence

### Proof

- **ran (line 165c52cc263b):** node --import ./tests/git-env.mjs --test tests/measure-names-unread-files.test.mjs before the fix, 8 GB cap · **saw:** 2 tests, 0 pass, 2 fail: the JSON of grain measure has no unread list at either end, and a file the parser failed on or whose extraction threw is named nowhere
- **ran (line 165c52cc263b):** node --import ./tests/git-env.mjs --test on tests/measure-names-unread-files.test.mjs after the fix; and the run before it over 14 test files that touch measure (measure-baseline-ancestors, measure-undeclared-like-yg, oversize-relations-counted and others), 8 GB cap, no YG_BIN · **saw:** the new file: 2 tests, 2 pass. The 14 files: tests 162, pass 156, skipped 5, fail 1, the one failure a control number in my own new test (imports counted per reference), corrected before the passing run
- **ran (line 165c52cc263b):** cd plugins/grain && npm test through full-gate.sh (YG_BIN and the corpus set), 12 GB cap, on cd0c0fcf · **saw:** tests 2256, pass 2250, fail 0, skipped 6, exit 0, 275 s
- **ran (line 165c52cc263b):** node --import ./tests/git-env.mjs --test tests/measure-names-unread-files.test.mjs on an extraction of 6ea10bd2 with the test copied in, and on cd0c0fcf; and a probe on cd0c0fcf with an extractor error, a parser failure and an over-limit file without facts in one repository · **saw:** before: 2 tests, 0 pass, 2 fail. After: pass. Probe: measure --json lists the same three files in to.unread (unfinished, parse-failed, empty) that status, report and export name, and its notes say each with the command that reads it again

### Notes

Assumed: a parser failure on a file under the limit is not known to be the file's own answer, so an end of grain measure built with one is built again by the next grain measure. The JSON lists the files per end as from.unread and to.unread, always present, empty when every file was read. On the release branch the over-limit case was already named in the notes (169); what was missing was the structured list and the two other kinds.

Docs delta for the final pass: reference.md, grain-measure/1: each end carries unread: [{file, why, error?}], why parse-failed for a source the parser failed on, else the outcome of the relation read.

