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

## Evidence

