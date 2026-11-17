# 765 · Runes: a parse of a short repeated text grows its memory about fourfold per doubling, and withParsedFile gives no way to cancel it

**Status:** open
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

## Evidence

