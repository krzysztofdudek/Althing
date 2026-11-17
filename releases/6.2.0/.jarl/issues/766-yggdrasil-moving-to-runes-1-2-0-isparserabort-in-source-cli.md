# 766 · Yggdrasil: moving to Runes 1.2.0, isParserAbort in source/cli/src/ast/parse-guard.ts must read the error code ERUNTIMEABORTED (or the error's cause), or the parse path never replaces an aborted runtime and every later file fails unclassified

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T2124-liqe
**Tags:** yggdrasil, runes
**Files:** source/cli/src/ast/parse-guard.ts
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** Runes 1.2.0 loop, its issue 19

## What
Yggdrasil recognises a runtime abort in isParserAbort only as a RuntimeError whose message starts with 'Aborted('. With Runes 1.2.0 parseFile rejects an abort as a plain Error with code ERUNTIMEABORTED and the runtime's error as its cause, and every later parseFile on that host with the same code. After the upgrade Yggdrasil's parseFile path no longer calls parseAborted and never replaces its runtime. Probe at Runes 9b8e700: isParserAbort is false on the error and true on its cause.

## Why
Without it, the first abort after Yggdrasil moves to Runes 1.2.0 leaves every later file unparsed and unclassified; Runes 1.2.0's CHANGELOG names the changed error under Before you upgrade.

## Acceptance
[test] under Runes 1.2.0 a parse abort is recognised by its code, the runtime is replaced, and the next file parses

## Evidence

