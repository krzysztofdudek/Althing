# 27 · Runes parser host on the 1.2.0 branch: the host records an abort only from a parse call. An abort r…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1518-dgtb
**Tags:** api, performance, runes
**Files:** Runes/src/ast/parser.mts
**Repo:** Runes
**Found by:** rev-765-opus
**Where:** the review of 5, 188, 765
**Branch:** jarl/27-abort-cleanup
**Worker:** w-27-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 16:28

## What
Runes parser host on the 1.2.0 branch: the host records an abort only from a parse call. An abort raised while freeing or resetting is passed through raw and not recorded. That covers tree.delete in withParsedFile's finally, parser.reset after a stop, and a parser's delete. So the call rejects with the runtime's RuntimeError and no code; in withParsedFile it replaces the function's result. The host then keeps calling the damaged runtime for every later file. Yggdrasil's parser.ts says freeing a tree 'takes a little of the parser's memory too, so it can abort like a parse'. Not reproduced here: it needs the WebAssembly memory full at the moment of the free.

## Why


## Acceptance


[test] After an abort is recorded the host frees nothing (tree.delete in withParsedFile and the retry parser's delete are skipped), and an abort thrown while freeing or resetting a parser or a tree is recorded as one during a parse is, so the call rejects with ERUNTIMEABORTED and later calls are refused without reaching the runtime; tests over a stub runtime that aborts in delete and in reset, red before and green after; docs/api.md says the host frees nothing after an abort · by: npm run check

## Evidence

