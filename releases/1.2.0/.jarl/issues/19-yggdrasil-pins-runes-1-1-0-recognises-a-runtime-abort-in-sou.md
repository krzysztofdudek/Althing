# 19 · Yggdrasil (pins Runes 1.1.0) recognises a runtime abort in source/cli/src/ast/parse-guard.ts isPars…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1340-erji
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-765-opus
**Where:** the review of 5, 188, 765

## What
Yggdrasil (pins Runes 1.1.0) recognises a runtime abort in source/cli/src/ast/parse-guard.ts isParserAbort only as a RuntimeError whose message starts with 'Aborted('. With Runes 1.2.0 parseFile rejects an abort as a plain Error with code ERUNTIMEABORTED and the runtime's error as its cause, and every later parseFile on that host with the same code. So after the upgrade Yggdrasil's parseFile path no longer calls parseAborted and never replaces its runtime, and every later file fails unclassified. Probe at Runes 9b8e700: isParserAbort is false on the error and true on its cause. A host over a fresh CommonJS copy of the runtime (Yggdrasil's newHost) parsed whole after the abort when the aborted runtime was itself such a copy. Yggdrasil reads the code (or the cause) when it moves to Runes 1.2.0; Runes' final pass names the changed error under Before you upgrade.

## Why


## Acceptance


## Evidence

### Notes

Deferred: A Yggdrasil change, not a Runes one: it belongs to the family release whose Yggdrasil pins Runes 1.2.0, and is filed there when that loop opens; the Runes 1.2.0 CHANGELOG names the new abort error under Before you upgrade

