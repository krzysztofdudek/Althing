# 602 · Althing's staged and range rails read no added line of a file whose path git quotes in a diff

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1504-ofxf
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's staged and range rails read no added line of a file whose path git quotes in a diff
rails/git.mjs addedLines, used by rails/run.mjs for pre-commit (staged) and pre-push (range), keys the added lines by the "+++" path as git prints it. A space in the path ends that line with a tab, and a non-ASCII letter, a double quote or a backslash makes it a quoted, octal-escaped path, so the key never matches the path from the file list and no line of such a file counts as added: pre-commit and pre-push report clean over a deny-listed word added to it (reproduced on a scratch repository with a test list: "rails range (1 commit): clean"). CI's tree scan still reads the whole file on the canonical repository, so it is caught after the push, too late for a public repository. Found while reviewing 363, whose gate shares the parser.

## Why


## Acceptance


[test] Althing's staged and range rails read the added lines of a file whose path git quotes in a diff (a space, a non-ASCII letter, a quote), with a planted test word refused in each shape, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line dd1dc0d1414f):** node --test rails/test/run.test.mjs (the test of 602 alone over a git archive export of ad8169b, the commit before ac83dd9 corrected the shared path parser) · **saw:** tests 1, fail 1: rails staged: clean, over a test word added to files with a space, a non-ASCII letter and a quote in their paths
- **ran (line dd1dc0d1414f):** node --test rails/test/run.test.mjs (at f5f1338, and in the full suite at 9b15fcf) · **saw:** pass: rails/run.mjs staged and range refuse the test word at line 2 of each of the three files; npm test at 9b15fcf: tests 190, pass 178, fail 0

### Notes

Assumed: the fault of 602 no longer holds on main: ac83dd9 (issue 363) corrected the path parser in rails/git.mjs, which rails/run.mjs staged and range used. No behaviour was changed for 602; the test that holds it for both scans is added (f5f1338), red against the tree before ac83dd9.

