# 585 · Runes: parallel corpus runs over the shared cache overwrite each other's report files

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T1353-vxyv
**Tags:** runes, corpus
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-494-fable, the C# base-class package
**Branch:** jarl/233-jvm-and-tools
**Worker:** w-233-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:23

## What


## Why
Several workers share one corpus cache on this machine; a run's report can be another run's, so a recorded proof may describe the wrong tree.

## Acceptance
[test] Two corpus runs over one cache at once each write their report to a place of their own, and each report names the tree it ran on · by: npm run check

## Reviews
- **approve** · by rev-233-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2052-nuxl
  556 line 1, '[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained': met. I read the source line of each of the 18 at jellyfin 305a964: 17 are type tests ('item is X', one 'item is Controller.Entities.TV.Episode') and one a parameter of the delegate type CreationDelegateFactory; each name is either unique in the repository, named by a using alias of the file, or its second declaration sits in Jellyfin.Database.Implementations.Entities.Libraries, which none of the files imports; ExceptionMiddleware imports MediaBrowser.Controller.Net and not System.Security. The corpus gate over every tier on the branch at 2ed35b5 passed with jellyfin at 0 added, 0 removed (5 oracles skipped for a missing go and dotnet) · 589: the three new cases fail on release/1.1.0 and pass on the branch; uses and declarations are equal between release and branch on 5876 Kotlin inputs of my own making (every file of moshi and okhttp whole, each with 8 breaks other than the worker's, and 9 generated files: 200 nested classes, 300 nested lambdas, 2000 nested parentheses, an unclosed when, list and class of 6000 lines); five generated files of 1500 damaged lines read in 0.1 to 0.2 s where the release took up to 4.9 s, with equal facts · the Kotlin rev moves once, 6 to 7, in 0b64753, the only commit that changes output; dist rebuilt from the branch is byte-equal to the committed dist · 585: the new test fails on the release's script and passes here; tried against it: two runs in the same millisecond still get separate directories (mkdtemp), a tree that is not the top of a checkout is named as such · 188, 233, 240: the Runes parts are on the branch (the S:: cases, the same-package cases of Java and Kotlin, samePackage in docs/api.md) and the full suite is green: tests 2527, pass 2526, fail 0, skipped 1 · Minor: 233 and 240 are met for Runes only; their Yggdrasil and Grain halves (the check, the Before you upgrade note, Grain's use of Runes, the spring-petclinic proof) are not on this branch and stay open · Minor: 188's sentence about the parse cost of garbage input is still in neither CHANGELOG.md nor README.md; it is left to the release preparation · Minor: in none of my inputs did the read bound change a fact, so the fallback to the name stayed unexercised outside the worker's own measurement · Minor: each corpus run now leaves a directory under the cache's reports and nothing removes them · Note: npm run check in a tree extracted with git archive stops at check:dist, which needs a git checkout; the tests had finished, and dist was compared by diff instead

## Evidence

### Proof

- **ran (line 116297a720a0):** node --test test/corpus.test.mjs (Runes, commit 94063c3: the new test over the release's scripts/corpus.mjs) · **saw:** pass 19, fail 1: two runs at once over one cache ... Expected "actual" to be strictly unequal to: both runs named the same report file
- **ran (line 116297a720a0):** node --test test/corpus.test.mjs test/guard.test.mjs (Runes, commit be38737) · **saw:** corpus pass 20, fail 0; guard pass 24, fail 0
- **ran (line 116297a720a0):** npm run check; npm run coverage (Runes, branch jarl/233-jvm-and-tools at 2ed35b5) · **saw:** check: tests 2527, pass 2526, fail 0, skipped 1, dist/ is fresh; coverage: all files 99.19 lines, 95.75 branches, 99.20 functions
- **ran (line 116297a720a0):** node --test test/corpus.test.mjs with the branch's test over the release's scripts/corpus.mjs; then npm run check on the tree of 2ed35b5 · **saw:** release: fail 1, Expected actual to be strictly unequal (both runs named one report file); branch: tests 2527, pass 2526, fail 0, skipped 1

### Notes

Assumed: no changelog entry: the corpus script ships with no package and changes nothing a consumer sees. The tree a report names is the Runes directory the run loaded, with its commit and whether it holds uncommitted changes (untracked files count); a directory that is not the top of a git checkout is named as not a git checkout of its own.

