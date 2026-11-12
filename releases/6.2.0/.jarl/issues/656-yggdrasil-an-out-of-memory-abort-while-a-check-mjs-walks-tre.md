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

## Evidence

