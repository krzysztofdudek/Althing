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

## Changelog
- after the runtime aborts, the parser host frees nothing on it: `withParsedFile` no longer deletes its tree, also when another call aborted while its function ran (its result then stands), and the parser made to retry a scanner trap is not deleted. An abort raised while freeing a tree or a parser now rejects with `ERUNTIMEABORTED` (`withParsedFile` in place of its function's result) and makes every later call reject with that code, where before it rejected with the runtime's plain error and later calls went on into the damaged runtime.

## Evidence

### Proof

- **ran (line 5252b3f6c750):** node --test --test-name-pattern='freeing and resetting' test/parser-host.test.mjs (at 27c9c90, before the fix) · **saw:** tests 7, pass 2, fail 5: the tree held when another call aborts was freed ('tree delete one' after ABORT), the retry parser was freed after its parse or reset aborted ('parser delete' after ABORT), and an abort from a tree's or a retry parser's delete rejected as RuntimeError: Aborted() with no code; the reset abort on the cached parser and the no-abort case passed
- **ran (line 5252b3f6c750):** node --test test/parser-host.test.mjs (at 39e15be, after the fix) · **saw:** tests 61, pass 61, fail 0, skipped 0
- **ran (line 5252b3f6c750):** npm run check (at 39e15be, clean tree, MemoryMax=12G) · **saw:** exit 0; tests 2864, pass 2861, fail 0, skipped 3; dist/ is fresh.
- **ran (line 5252b3f6c750):** npm run coverage (at 54b9eeb, MemoryMax=12G) · **saw:** exit 0; all files 99.31 lines, 96.00 branches, 99.19 functions; parser.mjs 99.60 / 96.15 / 96.43, uncovered 227 (loadGrammarsFor, not touched)

### Notes

Assumed: when another call aborts while a withParsedFile function runs, that call resolves with the function's result and only the free of its tree is skipped. The function may have read the tree before the abort, even when it is synchronous (the abort can land in the tick between its return and the finally), so rejecting would refuse a sound result; a function that reads the tree after the abort meets the damaged runtime on its own.

Assumed: an abort from a tree's delete is reported as 'aborted while freeing the tree of <file>' (later calls: 'earlier, while freeing the tree of <file>, so <other> was not parsed'); an abort from the retry parser's delete or from a reset keeps 'while parsing <file>', since both happen inside that file's parse call. The code ERUNTIMEABORTED and the cause are the same either way.

Assumed: the issue's claim that a reset after a stop passes its abort raw no longer holds on release/1.2.0: the reset runs inside run(), inside the guarded parse, so its abort was already recorded (the test of that case was green before the fix). What was wrong there was only the retry parser's delete after it, which the test of a reset abort on the retry parser shows red before. Both tests stay.

