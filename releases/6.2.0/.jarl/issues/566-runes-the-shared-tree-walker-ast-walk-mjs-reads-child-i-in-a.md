# 566 · Runes: the shared tree walker (ast/walk.mjs) reads child(i) in a loop, so the relation extractors o…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1227-lpke
**Tags:** 
**Files:** Runes/src/ast/walk.mts
**Repo:** Runes
**Found by:** rev-169-fable
**Where:** the review of 169
**Branch:** jarl/566-linear-walk
**Worker:** w-566-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 12:37

## What
Runes: the shared tree walker (ast/walk.mjs) reads child(i) in a loop, so the relation extractors of Grain and Yggdrasil take time that grows with the square of a node with many children. Under the parse limit too: a malformed JavaScript file of 388 000 characters parses in 0.3 s and its fact extraction takes 16 s (2.4 s at 194 000, 0.6 s at 97 000); a Go file whose one string literal holds 6 million characters takes 15.9 s. yg check reads such files with no size limit.

## Why


Every consumer (Grain, Yggdrasil) pays this on real files under the parse limit too, and Grain's over-limit relations (169) cannot be bounded in time without it.

## Acceptance


- [test] Walking a node with n children takes time linear in n: a generated tree of a node with 200 000 children walks within a bound the test sets, and the fact extraction of the issue's malformed JavaScript (388 000 characters) and Go string inputs finishes in time linear in their size, red before and green after · by: npm run check
- [compare] The extractors give the same facts on the corpus before and after · by: npm run corpus

## Changelog
- A source file that parses into one very wide node (a malformed file, a file of tens of thousands of top-level statements) is now read in time proportional to its size in every language; the relations found are the same.

## Evidence

### Proof

- **ran (line bbc7845cc6d2):** node --test test/relations/extractors/wide-node.test.mjs test/relations/extractors/scope-walk.test.mjs at 7df7807 (the tests on the unfixed code), 8 GB cap · **saw:** fail 9, pass 12. Malformed text of 388 000 characters: Java 35.0 s, Rust 66.0 s, PHP 114.8 s, Kotlin 117.5 s, Ruby 124.8 s, each over the 10 s bound; the four tests of the parent a scoped walk hands its visitor fail. Green already there: malformed JavaScript 2.2 s, the Go string of 6 million characters 1.5 s, Python, C, C++, C#.
- **ran (line bbc7845cc6d2):** npm run check at 7684713, 12 GB cap · **saw:** tests 2235, pass 2234, fail 0, skipped 1; dist/ is fresh. The same malformed inputs, parse included: Java 1.0 s, Rust 1.4 s, PHP 2.3 s, Kotlin 1.2 s, Ruby 1.5 s; walk over a node with 200 000 children 0.4 s. npm run coverage: 99.08 lines, 95.42 branches, 99.03 functions.
- **ran (line ecfb51b35eb6):** RUNES_CORPUS_DIR=<the shared cache> npm run corpus at 7df7807 (unfixed code) and on the fixed tree, 12 GB cap, the two outputs diffed with the per-repository seconds removed · **saw:** identical: corpus gate: passed both times, 50 ok lines over 25 repositories, every line 0 added, 0 removed, the same edge counts; the same 3 oracle checks skipped both times (go and dotnet are not installed here)

### Notes

Assumed: the fault is not where the issue puts it. On release/1.1.0 the shared walker has moved a tree cursor since issue 168, and the issue's own inputs are linear there (malformed JavaScript of 388 000 characters: extraction 0.3 s; the Go string of 6 million: 1.0 s); the 16 s were measured on the copy of Runes 1.0.1 that Grain vendors. What still held was the same cost in the extractors' own loops (children read by index, node.parent asked per node) in Java, Kotlin, PHP, Rust and Ruby, so the fix is there and in the scoped walk, not in ast/walk; the walker test is green before and after and is kept as a pin. No extractor rev moves, no export is added, the catalogue count is unchanged.

