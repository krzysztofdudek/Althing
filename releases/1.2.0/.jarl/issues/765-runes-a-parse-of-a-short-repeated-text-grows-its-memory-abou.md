# 765 · Runes: a parse of a short repeated text grows its memory about fourfold per doubling, and withParsedFile gives no way to cancel it

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-prsu
**Tags:** api, csharp, performance, runes, typescript
**Files:** Runes/src/ast/parser.mts, Runes/README.md
**Repo:** Runes
**Found by:** research research/2026-11-15-runes-parse-memory-no-cancel
**Source:** research/2026-11-15-runes-parse-memory-no-cancel#runes-parse-memory-2026-11-15-quadratic
**Where:** Runes/src/ast/parser.mts:41, Runes/src/ast/parser.mts:144, Runes/src/ast/parser.mts:149, Runes/src/ast/parser.mts:154, Runes/src/ast/parser.mts:194, Runes/src/relations/extractors/kotlin-recover.mts:603
**Branch:** jarl/765-parse-stop
**Worker:** w-765-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:09

## What
Claim: At v1.1.0 the parse that withParsedFile runs (Runes/src/ast/parser.mts:144, retried at :149) grows its peak memory about four times per doubling of a TypeScript file of a<a, repeated: 181 to 185 MiB at 8 KiB, 458 to 460 MiB at 16 KiB and 1540 to 1549 MiB at 32 KiB, over a base of 82 MiB, in two runs. A C# file of int x = f(a < b, a < b, ... grows faster: 1082 MiB at 16 KiB, and at 32 KiB the parse aborts with Aborted() at a peak of 2152 MiB. Under a 1 GiB limit a process parsing 32 KiB of the TypeScript shape, or 64 KiB of the C# shape, is killed by the kernel with no output. withParsedFile takes no option (Runes/src/ast/parser.mts:41), so a consumer cannot pass the progressCallback that web-tree-sitter's parse accepts: returning true from it cancels the parse, and a probe cancelled a 64 KiB parse after 1024 bytes in 7 ms at 69 MiB. Runes already passes that callback itself (Runes/src/relations/extractors/kotlin-recover.mts:603).

Node v24.22.3 on node:24-trixie; npm install of @chrisdudek/runes@1.1.0, web-tree-sitter@0.27.0 and tree-sitter-cli@0.27.0; the typescript and csharp grammars built by buildGrammars at their pins and checked against their sha256. materials/parse-memory.mjs ran once per size under a 4 GiB cap, twice for each size of both shapes. Under a 1 GiB cap with --memory-swap 1g, TypeScript 32 and 64 KiB and C# 64 KiB were killed (exit 137), C# 16 KiB completed at 1024 MiB, and the cgroup counted three OOM kills. materials/cancel-parse.mjs with a 1024-byte stop returned null for TypeScript 64 KiB (27 progress calls, 7 ms, 69 MiB) and for C# 64 KiB (21 calls, 6 ms, 84 MiB). The commands and the printed output are in triage.md.

Moved from issue 765 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer cannot end a parse that passes its limit. On this shape a 32 KiB file takes about 1.5 GiB, and a process limited to 1 GiB is killed by the kernel on it with no output, so a size cap does not protect it. The runtime's cancel works (a probe ended a 64 KiB parse after 1 KiB in 7 ms), and Runes already uses it for its own Kotlin recovery. Not measured on 1.0.0, so whether 1.1.0 changed the growth is not known.

## Acceptance
- [test] withParsedFile and parseFile given a progress callback that returns true, on a<a, repeated to 16 KiB and stopped at the first call: the call rejects without a tree, the callback ran, and a later parse on the same host gives the whole tree of its own file; red at v1.1.0 (the callback is never called) and green after · by: npm run check
- [test] Without the new option no progress callback reaches the runtime (a test over a stub runtime), and the catalogue and every existing test pass unchanged · by: npm run check
- [read] docs/api.md and the host section of README.md state what a consumer can rely on for time and memory on text that is not source code, with sizes measured on the runtime 1.2.0 pins or naming the runtime they come from

## Changelog
- Added to the API: `ParseFileOptions`: `parseFile` and `withParsedFile` take an optional last argument whose `progressCallback` the runtime calls as a parse proceeds; returning `true` stops the parse, the call rejects with the code `EPARSESTOPPED`, and the next parse on the same host gives the whole tree of its own file. A consumer that reads every file of a repository can now end a parse past its budget of bytes, time or memory, where a short repeated text (`a<a,` repeated in a `.ts` file) takes about 1.5 GiB at 32 KiB. Without the argument a parse runs as before.

## Evidence

### Proof

- **ran (line c026bb988e74):** at 361af08 (failing-test commit; src/ast unchanged since v1.1.0, git diff v1.1.0 -- src/ast/ empty): node --test --test-name-pattern='stopped by its progress' test/parser-host.test.mjs · **saw:** tests 5, pass 1, fail 4: withParsedFile and parseFile on a<a, x4096 (16 KiB) 'Missing expected rejection' (the option is ignored, the parse resolves); the throwing-callback test the same; the stub test 'actual: undefined, expected: function'
- **ran (line c026bb988e74):** at beaa9b6: systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check · **saw:** exit 0; tests 2765, pass 2762, fail 0, skipped 3; both stop tests pass (reject with code EPARSESTOPPED, progressCalls 1, fn not run, the next file's tree equals the one a never-stopped host gives); dist/ is fresh
- **ran (line c026bb988e74):** at beaa9b6: built dist with the line 'parser.reset();' replaced by 'void 0;', then node --test --test-name-pattern='stopped by its progress' test/parser-host.test.mjs; dist restored · **saw:** tests 5, pass 2, fail 3: both stop tests and the throwing-callback test fail on the next file's tree (without the reset the next parse resumes the stopped one and gives the a<a, tree); restored: tests 42, pass 42
- **ran (line f090b1253c13):** at beaa9b6: built dist with the default parse changed to parser.parse(content, null, { progressCallback: () => false }), then node --test --test-name-pattern='no progress callback reaches' test/parser-host.test.mjs; dist restored · **saw:** the stub-runtime test fails (pass 0, fail 1); on the real dist it passes: the stub records no progressCallback for withParsedFile and parseFile without the option, and a function with it
- **ran (line f090b1253c13):** at beaa9b6: systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check; then npm run coverage under the same cap · **saw:** check exit 0: tests 2765, pass 2762, fail 0, skipped 3, catalogue unchanged, dist/ is fresh; coverage exit 0, all files 99.18 lines, 95.82 branches, 99.04 functions
- **ran (line 532df7a157f0):** probe through the host on dist of beaa9b6 (web-tree-sitter 0.27.2, 1.2.0 grammar pins, Node v24.22.2), one process per size under systemd-run MemoryMax=8G, twice: a<a, (.ts) and int x = f(a < b, ... (.cs) at 8, 16, 32 KiB unstopped; both at 64 KiB stopped past byte 1024; random printable text, 5% newlines, 250 000 and 1 000 000 characters for js, cs, rs, py, java · **saw:** peak RSS ts 181/189, 458/455, 1552/1541 MiB; cs 198/214, 1086/1084 MiB, 32 KiB Aborted() at 2154/2155 MiB; 64 KiB stopped: rejected EPARSESTOPPED, ts 27 calls 5 ms 85/77 MiB, cs 21 calls 5-6 ms 95/94 MiB; random text js 0.60/0.59 s and 8.57/8.69 s, cs 0.81/0.83 and 3.20/3.24, rs 0.13/0.13 and 0.36/0.35, py 0.42/0.47 and 1.64/1.68, java 0.57/0.57 and 2.29/2.33

### Notes

Assumed: the option is named ParseFileOptions with the one field progressCallback (the runtime's name), it is exported as a type marked "—", the callback receives the runtime's ParseState as given, and only a return of exactly true stops (what the runtime itself honours). A callback that throws is caught and turned into a stop, and the call rejects with what it threw: a throw unwinding through the runtime mid-parse would leave the parser in an unknown state and would be taken for a scanner trap and retried. The error code is EPARSESTOPPED, after ELOCKED and ELOCKBREAK.

Assumed: line 2 holds at v1.1.0 as well (no callback was ever passed), so its red is shown on a mutant build that always passes a no-op progressCallback; the stub-runtime test also checks that a callback does reach the runtime when the option is given, which is red at the failing-test commit.

