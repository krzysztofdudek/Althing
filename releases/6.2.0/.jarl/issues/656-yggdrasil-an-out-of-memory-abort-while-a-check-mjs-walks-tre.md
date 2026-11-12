# 656 · Yggdrasil: an out-of-memory abort while a check.mjs walks trees it was given (not while parsing) st…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2026-ymbj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561-opus
**Where:** the review of 561, 610
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: an out-of-memory abort while a check.mjs walks trees it was given (not while parsing) still ends check-failed-to-run with Aborted() and 'Fix the bug in check.mjs', and the worker thread is kept. Seen with two dense JSON arrays of 6.8 MiB on one node, each passing the trial parse alone, read by a rule calling file.ast.rootNode.descendantsOfType('number'); the same on release/6.2.0. det-worker-core.ts:144 replaces a worker only when the abort came from a parse. Minor.

## Why


## Acceptance


[test] An out-of-memory abort while a check.mjs walks trees it was given is reported as the parser-memory case with no Aborted() and no blame on check.mjs, and the worker is replaced, red before and green after · by: cd source/cli && npm test

## Changelog
- A script rule's pair left unverified because the parser had no memory for a syntax tree it asked for, or because the rule asked for the text or tree of a file larger than a rule can be given, is no longer reported as a `check.mjs` that failed to run. `yg check --approve` heads such pairs `left unjudged` and names the cause, `parser-out-of-memory` or `file-over-text-limit`, in `--json`; its closing summary names the files and no longer says to fix `check.mjs`. A rule that really fails keeps `check-failed-to-run`.

## Evidence

### Proof

- **ran (line cd9916221828):** cd source/cli && npx vitest run tests/e2e/unverified-by-input-limits.test.ts (case 1: two 6.8 MiB JSON arrays walked with descendantsOfType; red on the base only for the cause, the heading and the summary) · **saw:** green after: no Aborted(), no 'Fix the failing check.mjs', no check-failed-to-run in the output, cause parser-out-of-memory

### Notes

Assumed: on release/6.2.0 as it stands, two dense JSON arrays of 6.8 MiB on one node read by file.ast.rootNode.descendantsOfType('number') already end as the parser-memory report ('The parser ran out of memory while rule ... read the syntax trees it was given'), with no Aborted() and no Fix the bug in check.mjs in the pair's report, and the worker IS replaced (debug log: 16 'replacing the worker' lines for 16 pairs through the pool). What still blamed check.mjs was the cause (check-failed-to-run), the heading and the closing summary; those are fixed with 639 and 655.

