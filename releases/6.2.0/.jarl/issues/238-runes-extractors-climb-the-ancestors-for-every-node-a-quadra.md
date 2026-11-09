# 238 · Runes: extractors climb the ancestors for every node (a quadratic cost on deep files) — context carried down the walk (split off from 188)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261005T1441-gdjd
**Tags:** runes, performance
**Files:** 
**Repo:** ../../../Runes
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**
**Branch:** jarl/238-extractor-context-walk
**Merged:** d0af17c in ../../../Runes
**CI:** green

## What
Split off from 188 per the 6.2.0 plan (R7).

## Why



## Acceptance
The number of ancestor steps grows linearly with depth in every extractor (a work test on a synthetic deep file); the result does not change (the whole catalogue, the parity tests, the corpus unchanged); a source guard test fails on a new .parent loop in src/relations/extractors/.

## Changelog
- Fixed: a deeply nested source file (namespaces, classes, modules or conditional groups nested hundreds of levels deep, as generated code can be) costs the relation pass time in proportion to its depth, not to the square of it, in C#, Java, Kotlin, Rust, C and C++; the edges are the same and no graph shows new refusals

## Evidence


- **ran (history):** node --test test/relations/extractors/ancestor-walk.test.mjs, before the change (built from the release branch tip) · **saw:** red for csharp, java, kotlin, rust, c and cpp: parent-accessor steps at depth 40 and 80 were 205540 and 1321480 (csharp), 7601 and 28001 (java), 16321 and 61441 (kotlin), 5240 and 20080 (rust), 900 and 3400 (c, cpp); python, php and ruby already linear
- **ran (history):** node --test test/relations/extractors/ancestor-walk.test.mjs test/relations/extractors/ancestor-guard.test.mjs test/relations/extractors/scope-walk.test.mjs, on the branch tip · **saw:** green: all nine languages about double their ancestor steps from depth 40 to 80 (csharp 205540 steps became linear, the run 7.7 s to 0.4 s); the source guard finds no x = x.parent loop or closest( call in src/relations/extractors (it failed on the release tip)
- **ran (history):** nice -n 15 timeout 590 node scripts/corpus.mjs verify --tier all · **saw:** corpus verify: passed; 0 added, 0 removed, 0 explained on all 33 pinned repositories
- **ran (history):** node comparison of declarations(), uses() and for C# extractCsharpRefs() and the global-using collectors, previous build against this branch, over every file of eShop, Jellyfin, CleanArchitecture, jsoup, okhttp (java, kotlin), moshi, ripgrep, hiredis, leveldb at their pinned commits · **saw:** identical JSON for every file: csharp 2883 files, java 276, kotlin 659, rust 110, c 25, cpp 76
- **ran (history):** nice -n 15 npm run check; nice -n 15 npm run coverage · **saw:** check: 1978 tests, 0 failed, dist/ is fresh; coverage thresholds met (all files 99.10 lines, 94.94 branches, 99.16 functions; scope-walk 100/100/100)
- **ran (history):** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 1978, pass 1978, fail 0, dist/ is fresh; corpus verify: passed, no change (merge d0af17c on release/1.1.0)

