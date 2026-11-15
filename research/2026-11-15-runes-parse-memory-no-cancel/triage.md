# Triage

Every run is on the published package @chrisdudek/runes 1.1.0, which is the tag v1.1.0 at 1f3476b0e49f (branch release/1.1.0). Paths are `Runes/<path>:<line>` at that commit.

## Setup

- Image `node:24-trixie` (Debian 13, arm64), Node v24.22.3. The image `node:24` is Debian 12 with glibc 2.36. The tree-sitter CLI that the grammar manifest pins does not start there (`/lib/aarch64-linux-gnu/libc.so.6: version GLIBC_2.39 not found`), so the same Node 24 line was run on the trixie image.
- In one container: `@chrisdudek/runes@1.1.0`, `web-tree-sitter@0.27.0` (the runtime the manifest pins) and `tree-sitter-cli@0.27.0` (the CLI the manifest pins).
- Grammars built with `buildGrammars` at their pins: `typescript` from tree-sitter-typescript at 75b3874edb2dc714fb1fd77a32013d0f8699989f, `csharp` from tree-sitter-c-sharp at 9150f7d56bb47f1a809fa23623f1ba1413e93fa9. Each matched its sha256 in the manifest.
- Caps. The peaks ran under 4 GiB, because the 32 KiB peak is above 1 GiB. The kill checks ran under `--memory 1g --memory-swap 1g`, so no swap extends the cap; the cgroup reported `memory.max` 1073741824. The container was started detached and removed with `docker rm -f` after the last run, in place of `--rm`, so the grammars were built once and served every run.
- Peak memory is the process's maximum resident set size (`process.resourceUsage().maxRSS`), one process per size. A process at 1 KiB, which loads the grammar and parses nothing large, peaked at 82 MiB (TypeScript) and 102 MiB (C#).

## Commands

    docker run -d --name runes-repro -m 4g --memory-swap 4g -v "<scripts>:/scripts:ro" -w /app node:24-trixie sleep infinity
    docker exec runes-repro sh -c 'npm init -y >/dev/null && npm install --no-audit --no-fund @chrisdudek/runes@1.1.0 web-tree-sitter@0.27.0 tree-sitter-cli@0.27.0 && npm ls --depth=0 && node -v'
    docker exec runes-repro sh -c 'cp /scripts/*.mjs /app/ && cd /app && node build-grammars.mjs typescript && node build-grammars.mjs csharp'
    docker exec runes-repro sh -c 'cd /app && for s in 8 16 32; do node parse-memory.mjs typescript $s; done; for s in 8 16 32; do node parse-memory.mjs csharp $s; done'
    docker update --memory 1g --memory-swap 1g runes-repro
    docker exec runes-repro sh -c 'cd /app && for job in "typescript 32" "typescript 64" "csharp 16" "csharp 64"; do node parse-memory.mjs $job; echo "exit=$?"; done; cat /sys/fs/cgroup/memory.events'
    docker exec runes-repro sh -c 'cd /app && node cancel-parse.mjs typescript 64 1024; node cancel-parse.mjs csharp 64 1024; node cancel-parse.mjs typescript 64 1000000; echo "exit=$?"'
    docker rm -f runes-repro

`<scripts>` is the folder that holds the files in materials/.

## 1. The parse's memory grows about four times for each doubling (TypeScript shape)

Command: `node parse-memory.mjs typescript <KiB>`, the input `a<a,` repeated to the size. Two runs at the 4 GiB cap:

    size    run 1: peak / parse      run 2: peak / parse
    8 KiB   181 MiB / 88 ms          185 MiB / 85 ms
    16 KiB  460 MiB / 287 ms         458 MiB / 279 ms
    32 KiB  1549 MiB / 1381 ms       1540 MiB / 1381 ms

One line as printed: `{"language":"typescript","sizeKiB":32,"bytes":32768,"parseMs":1381,"peakRssMiB":1549,"rootChildren":1,"error":null,"node":"v24.22.3"}`

Above the 82 MiB base, the peak grows 99, 378 and 1467 MiB in run 1, and 103, 376 and 1458 MiB in run 2: about 3.7 to 3.9 times per doubling. The figures match the report's 0.2, 0.48 and 1.55 GB at 8, 16 and 32 KiB, within a few percent.

Cause: `Runes/src/ast/parser.mts:144` (`tree = first.parse(content);`). A parse that throws is retried with a fresh parser at `Runes/src/ast/parser.mts:145-152`. The growth is in the parse itself: the callback of this probe only reads the root node's child count.

Verdict: **gap**. Runes calls the parse once per file, and the growth belongs to tree-sitter's parse of this input. The family promises no bound on memory for text that is not source code, and the readers cannot bound it themselves (see 3), nor can the API stop it (see 4). Not a defect in Runes' own code: the peak was measured on the process running the parse, and the callback did no walk over the tree.

## 2. The C# shape grows faster and reaches the runtime's ceiling at 32 KiB

Command: `node parse-memory.mjs csharp <KiB>`, the input `int x = f(` followed by `a < b, ` repeated to the size.

    size    run 1: peak / parse      run 2: peak / parse
    8 KiB   206 MiB / 52 ms          220 MiB / 55 ms
    16 KiB  1082 MiB / 753 ms        1082 MiB / 754 ms
    32 KiB  2152 MiB, error "Aborted(). Build with -sASSERTIONS for more info." / 531 ms   the same, 2152 MiB / 537 ms

Above the 102 MiB base, the peak grows from 104 or 118 MiB at 8 KiB to 980 MiB at 16 KiB: about eight to nine times for one doubling.

At 32 KiB the runtime aborts inside its WebAssembly memory. Runes retries once with a fresh parser, which aborts the same way, and the error reaches the caller. web-tree-sitter 0.27.0 carries the constant 2147483648 (2 GiB) in its build. Issue 561 in the 6.2.0 loop met the same message on a 40 MiB file, at about 2052 MiB outside the heap.

Cause: `Runes/src/ast/parser.mts:144` and the retry at `:145-152`, as in 1.

Verdict: **gap**, for the reason given in 1.

## 3. A 1 GiB cap kills the process on 32 and 64 KiB of the TypeScript shape

Command: `docker update --memory 1g --memory-swap 1g`, then the four jobs below.

    --- typescript 32 under 1g
    Killed
    exit=137
    --- typescript 64 under 1g
    Killed
    exit=137
    --- csharp 16 under 1g
    {"language":"csharp","sizeKiB":16,"bytes":16384,"parseMs":1351,"peakRssMiB":1024,"rootChildren":1,"error":null,"node":"v24.22.3"}
    exit=0
    --- csharp 64 under 1g
    Killed
    exit=137
    memory.events: oom 3, oom_kill 3

The kernel killed three processes and printed nothing from them. The C# parse at 16 KiB completed with its peak at the 1024 MiB cap, so it sits at the limit.

Verdict: part of **gap** (1). Under a 1 GiB limit the TypeScript shape at 32 KiB already kills the process, and the C# shape reaches the limit at 16 KiB. A size cap alone would have to sit below 32 KiB for the first and below 16 KiB for the second, and the consumer cannot tell in advance which inputs reach the limit.

## 4. The API cannot stop a parse; the runtime can

- `Runes/src/ast/parser.mts:41` (the interface) and `Runes/src/ast/parser.mts:194` (the implementation) take `filePath, content, fn, language`. No option reaches the parse at `:144` and `:149`.
- web-tree-sitter 0.27.0 accepts a `progressCallback` in its parse options. Its typings say: "If the progress callback returns `true`, then parsing will be cancelled" (`web-tree-sitter.d.ts`, lines 114 to 115, of the installed package).
- Runes already passes that callback in its Kotlin recovery: `Runes/src/relations/extractors/kotlin-recover.mts:603`, `progressCallback: () => reads > budget`.

Probe, `node cancel-parse.mjs <language> 64 1024` under the 1 GiB cap, which cancels once the parse has read 1024 bytes:

    {"language":"typescript","sizeKiB":64,"stopAfterBytes":1024,"result":"null (cancelled)","progressCalls":27,"parseMs":7,"peakRssMiB":69}
    exit=0
    {"language":"csharp","sizeKiB":64,"stopAfterBytes":1024,"result":"null (cancelled)","progressCalls":21,"parseMs":6,"peakRssMiB":84}
    exit=0

Control, the callback never returns `true` (`node cancel-parse.mjs typescript 64 1000000`): `Killed`, `exit=137`.

A cancelled parse returns `null`. `Runes/src/ast/parser.mts:154` already throws on `null`, and the retry at `:145-152` runs only when a parse throws, so a cancelled parse is not retried.

Verdict: **gap**. The request holds: the runtime offers the stop, and `withParsedFile` does not pass it through.

## 5. Not reproduced here

- `(a<` at 512 KiB (883 MB) and `a<` at 512 KiB (821 MB) from the report: not run.
- Real minified libraries at 512 KiB (under 474 MB): not run.
- The consumer's import reading: the callback in these scripts reads the root node's child count, so the number measured is the parse alone. Nothing of the other tool was run.

## Related issues

- 188 (deferred) records the time that tree-sitter spends on garbage input: on random text, 2.3 s for 250,000 characters of JavaScript, 8.1 s for 1,000,000. It covers time, not memory, and names no cancel. This finding is filed beside it, not inside it.
- 561 and 610 (Yggdrasil) met the same `Aborted()` on large files, and Yggdrasil bounds its own parse size. What Runes lacks is the stop, which is this finding.
- 168 (done) is the syntax-tree walk's own superlinear time, a different part of the same path.

## Reply on GitHub

None: no public issue is involved.
