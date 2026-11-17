# 5 · Runes: a parse the runtime aborts at its memory limit is retried as a scanner trap, and the runtime stays damaged for later parses of the same process

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261117T1228-objt
**Tags:** runes, performance, api
**Files:** 
**Repo:** Runes
**Found by:** w-765-opus
**Where:** Runes/src/ast/parser.mts:138-156 (the retry); probe on 0.27.2: C# int x = f(a < b, ... at 32 KiB
**Branch:** jarl/765-parse-stop
**Worker:** w-765-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:52

## What
On web-tree-sitter 0.27.2, a C# text of int x = f(a < b, a < b, ... at 32 KiB makes the runtime abort at its 2 GiB limit. parseFile's retry for a scanner trap then runs the whole parse a second time, so the abort happens twice, and afterwards a TypeScript parse in the same process fails with table index is out of bounds while a C# parse still works. Found by the worker of 765 while measuring; the README now states that the runtime is damaged after such an abort.

## Why
A consumer that meets one pathological file pays its cost twice and may get wrong answers or failures for every later file of the run, with nothing telling it that the host is no longer usable.

## Acceptance
[test] A parse the runtime aborts is not retried as a scanner trap, and the call rejects with a stable code that tells the consumer the host must be recreated (or the host recreates its runtime itself), in a test over a stub runtime that aborts; red at v1.1.0 and green after · by: npm run check

## Changelog
- Changed: a parse the runtime aborts (at its 2 GiB memory limit, as `int x = f(a < b, a < b, …` at 32 KiB in a `.cs` file does) is no longer run a second time; the call rejects with the code `ERUNTIMEABORTED`, and every later parse on the same host rejects with that code, because the runtime stays damaged for the rest of the process. A consumer that meets the code restarts the process.

## Evidence

### Proof

- **ran (line 6abaa467a488):** at 8241878 (failing-test commit), and with dist/ast/parser.mjs of v1.1.0 put in place: node --test --test-name-pattern='runtime aborts' test/parser-host.test.mjs · **saw:** both: pass 0, fail 2; the stub runtime's abort comes back as the plain 'RuntimeError: Aborted(). Build with -sASSERTIONS for more info.' with no code, after a retry
- **ran (line 6abaa467a488):** at 9b8e700: systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check, then npm run coverage under the same cap · **saw:** check exit 0: tests 2780, pass 2777, fail 0, skipped 3, dist/ is fresh; the abort tests pass (one parse, ERUNTIMEABORTED, later calls rejected with the same code without reaching the runtime; with a callback that asks to stop, still ERUNTIMEABORTED) and a throw that is no abort is still retried once; coverage exit 0, all files 99.26 lines, 95.89 branches, 99.10 functions
- **ran (line 6abaa467a488):** at 9944a5d, probe through the host on the real runtime under MemoryMax=8G: C# 'int x = f(a < b, ...' at 32 KiB, then b.cs and c.ts on the same host · **saw:** Aborted() printed once (was twice); first call rejected ERUNTIMEABORTED 'the tree-sitter runtime aborted while parsing a.cs ...'; b.cs and c.ts rejected ERUNTIMEABORTED 'aborted earlier, while parsing a.cs, so b.cs was not parsed'

### Notes

Assumed: an abort is told by the runtime's message, which starts with "Aborted(" (emscripten's abort in web-tree-sitter 0.27.2 throws a WebAssembly.RuntimeError so named); the host does not recreate its runtime, because a probe showed a new host over the same runtime failing and a second import of the runtime module crashing the process, so the code tells the consumer to restart the process, and the host refuses every later parse with the same code rather than give trees from a damaged runtime. A throw that is no abort keeps the scanner-trap retry, and the retry's own abort is caught the same way.

