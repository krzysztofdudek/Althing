# 589 · Kotlin: damage recovery re-parses each damaged top-level chunk padded with every newline and space …

**Status:** in-progress
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
**Worker:** w-233-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:23

## What
Kotlin: damage recovery re-parses each damaged top-level chunk padded with every newline and space before it (src/relations/extractors/kotlin-recover.mts:595-601, parseAt), so fact extraction grows with the number of damaged chunks times the file size, and runs twice per file because uses and declarations each build the view. Lines 'fun fN() = )' repeated: extraction 0.7 s at 39 000 characters, 2.5 s at 79 000, 9.7 s at 159 000 (ratio 3.6 to 3.9), the same before and after issue 566; the Kotlin grammar's own parse of that file is quadratic too (1.0, 4.0, 15.4 s). Until this is fixed, a changelog line saying malformed files read in linear time in every language is false for Kotlin.

## Why


## Acceptance


[test] Kotlin damage recovery reads malformed files of fun fN() = ), @A.B fun f( and val x: A.B<C> = ( lines in time linear in their size under the wide-node ratio bound, with the same facts as before, red before and green after · by: npm run check

## Changelog
- Fixed: a malformed Kotlin file is read in time linear in its size, however many of its declarations are damaged and however far a declaration whose bracket never closes runs; what such a file gives is unchanged.

## Evidence

### Proof

- **ran (line 9ab5bda58c0a):** node --test --test-name-pattern='Kotlin of 80' test/relations/extractors/wide-node.test.mjs (Runes, the release's kotlin-recover with the test of commit 2aa, before the fix) · **saw:** fail 3: a quarter of the input took 230 ms, the whole of it 2662 ms; 151 ms and 2318 ms; 1412 ms and 21406 ms: over 8 times
- **ran (line 9ab5bda58c0a):** node --test test/relations/extractors/kotlin.test.mjs test/relations/extractors/kotlin-name-resolution-matrix.test.mjs test/relations/extractors/wide-node.test.mjs test/relations/extractor-rev.test.mjs (Runes, commit 0b64753) · **saw:** tests 154, pass 154, fail 0; the three Kotlin cases of 80 000 characters pass with the facts of the release

### Notes

Correction to row 1: 'commit 2aa' is a typo for commit b6d2b21 of branch jarl/233-jvm-and-tools (the test at 80 000 characters), run over the release's kotlin-recover before the fix 0b64753.

Assumed: 'the same facts as before' is checked beyond the three inputs: the release's Kotlin extractor and the fixed one were run over the Kotlin files of moshi and okhttp and about 16 000 copies broken on purpose (deleted spans, stray brackets and quotes, truncation, a missing last newline, a line opening with a dot, a when guard, a multi-dollar string, a context clause); every one gave identical declarations and uses. A recovery parse past the read bound (400 reads plus 100 per 1 024 characters; real declarations need at most 40 per 1 024, a cleanly repaired unclosed list, class, constructor or when of 5 000 lines at most 148 in all) falls back to the declaration's name, so the Kotlin rev moves to 7.

