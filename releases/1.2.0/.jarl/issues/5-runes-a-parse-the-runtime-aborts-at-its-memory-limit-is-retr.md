# 5 · Runes: a parse the runtime aborts at its memory limit is retried as a scanner trap, and the runtime stays damaged for later parses of the same process

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261117T1228-objt
**Tags:** runes, performance, api
**Files:** 
**Repo:** Runes
**Found by:** w-765-opus
**Where:** Runes/src/ast/parser.mts:138-156 (the retry); probe on 0.27.2: C# int x = f(a < b, ... at 32 KiB

## What
On web-tree-sitter 0.27.2, a C# text of int x = f(a < b, a < b, ... at 32 KiB makes the runtime abort at its 2 GiB limit. parseFile's retry for a scanner trap then runs the whole parse a second time, so the abort happens twice, and afterwards a TypeScript parse in the same process fails with table index is out of bounds while a C# parse still works. Found by the worker of 765 while measuring; the README now states that the runtime is damaged after such an abort.

## Why
A consumer that meets one pathological file pays its cost twice and may get wrong answers or failures for every later file of the run, with nothing telling it that the host is no longer usable.

## Acceptance
[test] A parse the runtime aborts is not retried as a scanner trap, and the call rejects with a stable code that tells the consumer the host must be recreated (or the host recreates its runtime itself), in a test over a stub runtime that aborts; red at v1.1.0 and green after · by: npm run check

## Evidence

