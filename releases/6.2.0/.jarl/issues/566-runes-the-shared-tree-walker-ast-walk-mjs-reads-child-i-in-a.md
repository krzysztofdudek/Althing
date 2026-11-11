# 566 · Runes: the shared tree walker (ast/walk.mjs) reads child(i) in a loop, so the relation extractors o…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1227-lpke
**Tags:** 
**Files:** Runes/src/relations/extractors, Runes/src/relations/scope-walk.mts, Runes/src/ast/walk.mts
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

## Reviews
- **changes** · by rev-566-opus (fresh) · 2026-11-11 · model claude-opus-5-5
  Important 1 — C# is still quadratic on malformed text of the issue's size, and the new C# test cannot see it. src/relations/extractors/csharp.mts:1520-1527 (1573-1580 after the merge with release/1.1.0): in the reference walk of extractCsharpRefs, a qualified_name that no type-position handler took asks node.parent up to three times, and node.parent searches down from the root past the earlier children of the flat ERROR run. Input 'A.B c(' plus newline, repeated to 387 996 characters: C# fact extraction 110.4 s at 7684713 (18.9 s at 140 000, 85.3 s at 280 000, ratio 4.5), the same at 7df7807 with the same facts; a CPU profile puts 2.2 of 2.7 s in get parent called from that visitor. test/relations/extractors/wide-node.test.mjs:50 times only '"a(' lines, whose ERROR run holds no qualified_name, so it passes in 3.1 s and asserts a linear time C# does not have; the issue's changelog line ('in time proportional to its size in every language') is false for C#. The fix the other extractors got applies: hand the parent down (walkWithParent) in that walk, and add a C# case whose malformed lines hold dotted names. The other C# parent calls I reached (csBelow at 229, the extension local function at 427, declaresVariable at 546) stayed linear on ten valid and malformed shapes.

  Minor 2 — the walker pin cannot fail for the reason it names. test/ast.test.mjs:144: tree-sitter stores a long well-formed list as a balanced repetition, so child(i) is cheap there. The index walk from before issue 168 (7be0c9b^) reads the same 200 000-element array in 241 ms against the 5 000 ms bound (the cursor walk 151 ms), so the comment's cause is false for this input. A flat ERROR run discriminates: the old index walk takes 2.0 s at 25 000 lines of '"a(' in Java and 8.9 s at 50 000 (cursor walk 28 and 48 ms). The walker is still guarded by other tests: with the old walk.mjs put into a copy of 7684713, the Go string (24.5 s), C (29.2 s), C++ (28.0 s), Java, Python and C# (each killed after 75 s) inputs all exceed the 10 s bound; malformed JavaScript does not (0.9 s). Building the pin's 200 000 children as a flat ERROR run would make it a real pin.

  Minor 3 — the record, for the director: line 1's 'red before' cannot hold for the walker, JavaScript and Go inputs, because release/1.1.0 already has the cursor walk (issue 168), and Files: names only src/ast/walk.mts while the work is in 13 extractor files and scope-walk; both lines and Files: describe a different change from the one made.

  Confirmed: lines 1 and 2 re-run (evidence rows above); facts identical on the corpus and on 44 generated inputs over 13 grammars; time ratios near 2 when the size doubles on 49 shapes, except the C# dotted-name shape above and the Kotlin recovery filed outside; the merge with release/1.1.0 (a1ef8c4) is clean and its new C# code adds no index loop or parent call; dist/ fresh at 7684713 and in the merge; Kotlin's view-root parent is right (a root is a tree root or its direct child); Python's top-level reading and Ruby's handed-down parent match the old node.parent reading (identical facts); no test, bound, threshold or extractor rev weakened; two commits, each naming the issue, dist rebuilt in the fix commit.
  outside the issue, filed as 589: Kotlin: damage recovery re-parses each damaged top-level chunk padded with every newline and space before it (src/relations/extractors/kotlin-recover.mts:595-601, parseAt), so fact extraction grows with the number of damaged chunks times the file size, and runs twice per file because uses and declarations each build the view. Lines 'fun fN() = )' repeated: extraction 0.7 s at 39 000 characters, 2.5 s at 79 000, 9.7 s at 159 000 (ratio 3.6 to 3.9), the same before and after issue 566; the Kotlin grammar's own parse of that file is quadratic too (1.0, 4.0, 15.4 s). Until this is fixed, a changelog line saying malformed files read in linear time in every language is false for Kotlin.

## Evidence

### Proof

- **ran (line bbc7845cc6d2):** node --test test/relations/extractors/wide-node.test.mjs test/relations/extractors/scope-walk.test.mjs at 7df7807 (the tests on the unfixed code), 8 GB cap · **saw:** fail 9, pass 12. Malformed text of 388 000 characters: Java 35.0 s, Rust 66.0 s, PHP 114.8 s, Kotlin 117.5 s, Ruby 124.8 s, each over the 10 s bound; the four tests of the parent a scoped walk hands its visitor fail. Green already there: malformed JavaScript 2.2 s, the Go string of 6 million characters 1.5 s, Python, C, C++, C#.
- **ran (line bbc7845cc6d2):** npm run check at 7684713, 12 GB cap · **saw:** tests 2235, pass 2234, fail 0, skipped 1; dist/ is fresh. The same malformed inputs, parse included: Java 1.0 s, Rust 1.4 s, PHP 2.3 s, Kotlin 1.2 s, Ruby 1.5 s; walk over a node with 200 000 children 0.4 s. npm run coverage: 99.08 lines, 95.42 branches, 99.03 functions.
- **ran (line ecfb51b35eb6):** RUNES_CORPUS_DIR=<the shared cache> npm run corpus at 7df7807 (unfixed code) and on the fixed tree, 12 GB cap, the two outputs diffed with the per-repository seconds removed · **saw:** identical: corpus gate: passed both times, 50 ok lines over 25 repositories, every line 0 added, 0 removed, the same edge counts; the same 3 oracle checks skipped both times (go and dotnet are not installed here)
- **ran (line bbc7845cc6d2):** node --test test/relations/extractors/wide-node.test.mjs test/relations/extractors/scope-walk.test.mjs test/ast.test.mjs at 7df7807 (git archive extraction), 8 GB cap · **saw:** 9 fail: the 4 parent tests of the scoped walk; malformed text of 388 000 characters: Java 40.3 s, Kotlin 124.5 s, PHP 136.8 s, Rust 97.8 s, Ruby 172.6 s against the 10 s bound. Already green on the unfixed code: malformed JavaScript, the Go string, Python, C, C++, C#, the walk over 200 000 children
- **ran (line bbc7845cc6d2):** npm run check at 7684713 (git archive extraction), 12 GB cap · **saw:** tests 2235, pass 2234, fail 0, skipped 1; dist/ is fresh. Malformed 388 000 characters: Java 1.0 s, Kotlin 1.3 s, PHP 2.3 s, Rust 1.4 s, Ruby 1.7 s, Python 0.8 s, C# 3.1 s, JavaScript 2.2 s; Go string 1.6 s; walk over 200 000 children 0.45 s
- **ran (line bbc7845cc6d2):** npm run coverage on the clean merge of jarl/566-linear-walk into release/1.1.0 (a1ef8c4), 12 GB cap · **saw:** tests 2275, pass 2274, fail 0, skipped 1; all files 99.08 lines, 95.46 branches, 99.04 functions; committed dist/ equals a fresh build in both 7684713 and the merge
- **ran (line ecfb51b35eb6):** RUNES_CORPUS_DIR=<the shared cache> npm run corpus at 7df7807 and at 7684713, 12 GB cap, the two outputs diffed with the seconds removed · **saw:** identical: corpus gate: passed both times, 50 ok lines over 25 repositories, 25 of them 0 added, 0 removed; the go and dotnet oracle checks skipped both times (not installed)
- **ran (line ecfb51b35eb6):** a probe calling uses and declarations of each extractor on 44 generated inputs (wide valid nodes, malformed lines, random text; JavaScript, TypeScript, TSX, Go, C#, Rust, Java, Kotlin, PHP, Ruby, Python, C, C++) at 7df7807 and 7684713, facts hashed · **saw:** the same uses and declarations on all 44 inputs before and after
- **ran (line bbc7845cc6d2):** node --test --test-name-pattern='dotted|200 000' test/relations/extractors/wide-node.test.mjs test/ast.test.mjs at f9f66b9 (round 1's tests on the code before the C# fix), 8 GB cap · **saw:** fail 1, pass 1. Malformed C# of 388 000 characters whose lines hold dotted names: took 111419 ms against the 10 s bound. The walker test over a flat run of 210 000 children passes, as a pin: the walker was already linear.
- **ran (line bbc7845cc6d2):** npm run check at 43e8130 (release/1.1.0 merged in), 12 GB cap · **saw:** tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh. Malformed C# with dotted names now 3.8 s, parse included. npm run coverage: 99.06 lines, 95.46 branches, 99.07 functions.
- **ran (line ecfb51b35eb6):** RUNES_CORPUS_DIR=<the shared cache> npm run corpus on f9f66b9 and on the tree of 43e8130, 12 GB cap, the two outputs diffed with the per-repository seconds removed · **saw:** identical: corpus gate: passed both times, 50 ok lines, every line 0 added, 0 removed; the same 3 oracle checks skipped both times (go and dotnet are not installed here)

### Notes

Assumed: the fault is not where the issue puts it. On release/1.1.0 the shared walker has moved a tree cursor since issue 168, and the issue's own inputs are linear there (malformed JavaScript of 388 000 characters: extraction 0.3 s; the Go string of 6 million: 1.0 s); the 16 s were measured on the copy of Runes 1.0.1 that Grain vendors. What still held was the same cost in the extractors' own loops (children read by index, node.parent asked per node) in Java, Kotlin, PHP, Rust and Ruby, so the fix is there and in the scoped walk, not in ast/walk; the walker test is green before and after and is kept as a pin. No extractor rev moves, no export is added, the catalogue count is unchanged.

Assumed: of the other C# parent calls, the type body's (csBelow) moved to the walk's parent; the two helpers that climb two parents (a local function of a misread extension block, a declaration expression) stay, because they are handed a node away from the walk and measured linear. Issue 577 still has those two.

