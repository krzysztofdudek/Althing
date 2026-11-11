# 656 · Yggdrasil: an out-of-memory abort while a check.mjs walks trees it was given (not while parsing) st…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2026-ymbj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561-opus
**Where:** the review of 561, 610

## What
Yggdrasil: an out-of-memory abort while a check.mjs walks trees it was given (not while parsing) still ends check-failed-to-run with Aborted() and 'Fix the bug in check.mjs', and the worker thread is kept. Seen with two dense JSON arrays of 6.8 MiB on one node, each passing the trial parse alone, read by a rule calling file.ast.rootNode.descendantsOfType('number'); the same on release/6.2.0. det-worker-core.ts:144 replaces a worker only when the abort came from a parse. Minor.

## Why


## Acceptance


## Evidence

