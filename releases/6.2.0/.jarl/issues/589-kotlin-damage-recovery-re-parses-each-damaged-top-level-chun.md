# 589 · Kotlin: damage recovery re-parses each damaged top-level chunk padded with every newline and space …

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1416-xpir
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-566-opus
**Where:** the review of 566
**Branch:** jarl/233-jvm-and-tools
**Merged:** 5949da2
**Merge check:** npm run check · saw tests 2568, pass 2567, fail 0, skipped 1; catalogue 913 equals the case files; rev lines joined (Rust 22, TypeScript 5, Kotlin 7); dist fresh after the commit

## What
Kotlin: damage recovery re-parses each damaged top-level chunk padded with every newline and space before it (src/relations/extractors/kotlin-recover.mts:595-601, parseAt), so fact extraction grows with the number of damaged chunks times the file size, and runs twice per file because uses and declarations each build the view. Lines 'fun fN() = )' repeated: extraction 0.7 s at 39 000 characters, 2.5 s at 79 000, 9.7 s at 159 000 (ratio 3.6 to 3.9), the same before and after issue 566; the Kotlin grammar's own parse of that file is quadratic too (1.0, 4.0, 15.4 s). Until this is fixed, a changelog line saying malformed files read in linear time in every language is false for Kotlin.

## Why


## Acceptance


[test] Kotlin damage recovery reads malformed files of fun fN() = ), @A.B fun f( and val x: A.B<C> = ( lines in time linear in their size under the wide-node ratio bound, with the same facts as before, red before and green after · by: npm run check

## Changelog
- Fixed: a malformed Kotlin file is read in time linear in its size, however many of its declarations are damaged and however far a declaration whose bracket never closes runs; what such a file gives is unchanged.

## Reviews
- **approve** · by rev-233-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2052-nuxl
  556 line 1, '[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained': met. I read the source line of each of the 18 at jellyfin 305a964: 17 are type tests ('item is X', one 'item is Controller.Entities.TV.Episode') and one a parameter of the delegate type CreationDelegateFactory; each name is either unique in the repository, named by a using alias of the file, or its second declaration sits in Jellyfin.Database.Implementations.Entities.Libraries, which none of the files imports; ExceptionMiddleware imports MediaBrowser.Controller.Net and not System.Security. The corpus gate over every tier on the branch at 2ed35b5 passed with jellyfin at 0 added, 0 removed (5 oracles skipped for a missing go and dotnet) · 589: the three new cases fail on release/1.1.0 and pass on the branch; uses and declarations are equal between release and branch on 5876 Kotlin inputs of my own making (every file of moshi and okhttp whole, each with 8 breaks other than the worker's, and 9 generated files: 200 nested classes, 300 nested lambdas, 2000 nested parentheses, an unclosed when, list and class of 6000 lines); five generated files of 1500 damaged lines read in 0.1 to 0.2 s where the release took up to 4.9 s, with equal facts · the Kotlin rev moves once, 6 to 7, in 0b64753, the only commit that changes output; dist rebuilt from the branch is byte-equal to the committed dist · 585: the new test fails on the release's script and passes here; tried against it: two runs in the same millisecond still get separate directories (mkdtemp), a tree that is not the top of a checkout is named as such · 188, 233, 240: the Runes parts are on the branch (the S:: cases, the same-package cases of Java and Kotlin, samePackage in docs/api.md) and the full suite is green: tests 2527, pass 2526, fail 0, skipped 1 · Minor: 233 and 240 are met for Runes only; their Yggdrasil and Grain halves (the check, the Before you upgrade note, Grain's use of Runes, the spring-petclinic proof) are not on this branch and stay open · Minor: 188's sentence about the parse cost of garbage input is still in neither CHANGELOG.md nor README.md; it is left to the release preparation · Minor: in none of my inputs did the read bound change a fact, so the fallback to the name stayed unexercised outside the worker's own measurement · Minor: each corpus run now leaves a directory under the cache's reports and nothing removes them · Note: npm run check in a tree extracted with git archive stops at check:dist, which needs a git checkout; the tests had finished, and dist was compared by diff instead

## Evidence

### Proof

- **ran (line 9ab5bda58c0a):** node --test --test-name-pattern='Kotlin of 80' test/relations/extractors/wide-node.test.mjs (Runes, the release's kotlin-recover with the test of commit 2aa, before the fix) · **saw:** fail 3: a quarter of the input took 230 ms, the whole of it 2662 ms; 151 ms and 2318 ms; 1412 ms and 21406 ms: over 8 times
- **ran (line 9ab5bda58c0a):** node --test test/relations/extractors/kotlin.test.mjs test/relations/extractors/kotlin-name-resolution-matrix.test.mjs test/relations/extractors/wide-node.test.mjs test/relations/extractor-rev.test.mjs (Runes, commit 0b64753) · **saw:** tests 154, pass 154, fail 0; the three Kotlin cases of 80 000 characters pass with the facts of the release
- **ran (line 9ab5bda58c0a):** npm run check; npm run coverage (Runes, branch jarl/233-jvm-and-tools at 2ed35b5) · **saw:** check: tests 2527, pass 2526, fail 0, skipped 1, dist/ is fresh; coverage: all files 99.19 lines, 95.75 branches, 99.20 functions
- **ran (line 9ab5bda58c0a):** node --test --test-name-pattern='Kotlin of 80' test/relations/extractors/wide-node.test.mjs over the tree of release/1.1.0 with the branch's test file; then npm run check on the tree of 2ed35b5 · **saw:** release: 3 fail (a quarter 214 ms, the whole 2503 ms; 147 and 2292; 1365 and 21067: over 8 times); branch: tests 2527, pass 2526, fail 0, skipped 1; uses and declarations equal between release and branch on 5876 Kotlin inputs (659 files of moshi and okhttp, 8 broken copies of each, 9 deeply nested or unclosed generated files)

### Notes

Correction to row 1: 'commit 2aa' is a typo for commit b6d2b21 of branch jarl/233-jvm-and-tools (the test at 80 000 characters), run over the release's kotlin-recover before the fix 0b64753.

Assumed: 'the same facts as before' is checked beyond the three inputs: the release's Kotlin extractor and the fixed one were run over the Kotlin files of moshi and okhttp and about 16 000 copies broken on purpose (deleted spans, stray brackets and quotes, truncation, a missing last newline, a line opening with a dot, a when guard, a multi-dollar string, a context clause); every one gave identical declarations and uses. A recovery parse past the read bound (400 reads plus 100 per 1 024 characters; real declarations need at most 40 per 1 024, a cleanly repaired unclosed list, class, constructor or when of 5 000 lines at most 148 in all) falls back to the declaration's name, so the Kotlin rev moves to 7.

