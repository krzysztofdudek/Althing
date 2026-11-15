# Source: a Runes parse whose memory grows quadratically, found by a stress test

Reported on 2026-11-15 from a stress test of a new tool built on Runes. The report as it arrived:

- Parsing certain text through Runes takes memory that grows quadratically with the file's size.
- A `.ts` file of `a<a,` repeated, read for its imports through Runes' `withParsedFile`, took 0.2, 0.48 and 1.55 GB at 8, 16 and 32 KiB.
- At 64 KiB, a process limited to 1 GB was killed by the kernel with no output.
- At 512 KiB, `(a<` took 883 MB and `a<` 821 MB.
- A C# file of `int x = f(a < b, a < b, ...` at 64 KiB behaved the same.
- Real minified libraries stayed under 474 MB at 512 KiB.
- The cause is in the tree-sitter parse that Runes runs.
- A consumer has no way to stop a runaway parse. The request: let `withParsedFile` (or the parse it wraps) accept web-tree-sitter's cancelling `progressCallback`, or a budget, so a consumer can end a parse that passes its limit.

Provenance: a field report from a private deployment; its origin is not named here.
