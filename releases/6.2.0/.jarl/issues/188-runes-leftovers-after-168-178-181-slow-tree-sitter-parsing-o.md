# 188 · Runes: leftovers after 168/178/181 (slow tree-sitter parsing of garbage input; the tsconfig field in package.json and <sub>/tsconfig.json without exports; S::Gen<T> and S::A.Foo in C# type positions; autobins and the edition 2015 rule in Cargo; other extractors still use .parent/closest)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1536-pcns
**Tags:** 1.1.0, runes
**Files:** Runes/src/relations
**Repo:** Runes
**After:** 224
**Found by:** runes-168
**Where:**
**Branch:** jarl/233-jvm-and-tools
**Merged:** 2cebb0c9732aa2ee06a69304e00529e807c92421 in ../../../Runes
**CI:** pending

## What
Collected by the worker of package 168: tree-sitter parses garbage at 13–16 s/MB; tsconfig: the tsconfig field in package.json and <sub>/tsconfig.json without exports are not read; C#: S::Gen<T> and S::A.Foo in type positions are silent; Cargo: autobins and the edition 2015 rule are not read; the remaining extractors still walk .parent/closest (a quadratic risk like 168).

## Why
Silent edges and potential performance costs on large files.

## Acceptance
Each point resolved or described as a silence with a test; extractor passes linear.

## Changelog
- Fixed: a generic type or a dotted name written under a namespace alias, such as `S::Gen<T>` and `S::Core.Order`, now gives its edge, as an attribute under the same alias already did.

## Reviews
- **approve** · by rev-233-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2052-nuxl
  556 line 1, '[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained': met. I read the source line of each of the 18 at jellyfin 305a964: 17 are type tests ('item is X', one 'item is Controller.Entities.TV.Episode') and one a parameter of the delegate type CreationDelegateFactory; each name is either unique in the repository, named by a using alias of the file, or its second declaration sits in Jellyfin.Database.Implementations.Entities.Libraries, which none of the files imports; ExceptionMiddleware imports MediaBrowser.Controller.Net and not System.Security. The corpus gate over every tier on the branch at 2ed35b5 passed with jellyfin at 0 added, 0 removed (5 oracles skipped for a missing go and dotnet) · 589: the three new cases fail on release/1.1.0 and pass on the branch; uses and declarations are equal between release and branch on 5876 Kotlin inputs of my own making (every file of moshi and okhttp whole, each with 8 breaks other than the worker's, and 9 generated files: 200 nested classes, 300 nested lambdas, 2000 nested parentheses, an unclosed when, list and class of 6000 lines); five generated files of 1500 damaged lines read in 0.1 to 0.2 s where the release took up to 4.9 s, with equal facts · the Kotlin rev moves once, 6 to 7, in 0b64753, the only commit that changes output; dist rebuilt from the branch is byte-equal to the committed dist · 585: the new test fails on the release's script and passes here; tried against it: two runs in the same millisecond still get separate directories (mkdtemp), a tree that is not the top of a checkout is named as such · 188, 233, 240: the Runes parts are on the branch (the S:: cases, the same-package cases of Java and Kotlin, samePackage in docs/api.md) and the full suite is green: tests 2527, pass 2526, fail 0, skipped 1 · Minor: 233 and 240 are met for Runes only; their Yggdrasil and Grain halves (the check, the Before you upgrade note, Grain's use of Runes, the spring-petclinic proof) are not on this branch and stay open · Minor: 188's sentence about the parse cost of garbage input is still in neither CHANGELOG.md nor README.md; it is left to the release preparation · Minor: in none of my inputs did the read bound change a fact, so the fallback to the name stayed unexercised outside the worker's own measurement · Minor: each corpus run now leaves a directory under the cache's reports and nothing removes them · Note: npm run check in a tree extracted with git archive stops at check:dist, which needs a git checkout; the tests had finished, and dist was compared by diff instead

## Evidence

jarl: per the 6.2.0 plan, 188 stays with the C# part (package R3); the TS extends part split off into 236, Cargo into 237, the linear passes into 238; the cost of parsing garbage input: ruling plan-6-2-0 D10 (described in CHANGELOG and README).
- **ran (history):** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs · **saw:** before the extractor change: csharp-alias-colon-colon-generic-edge failed (no edge for S::Gen<int>), csharp-alias-colon-colon-qualified-tail-edge failed; after: both pass
- **ran (history):** nice -n 15 timeout 1800 npm run check · **saw:** pass 1743, fail 0; dist/ is fresh
- **ran (history):** nice -n 15 timeout 1800 npm run coverage · **saw:** all files: lines 98.81 (threshold 98), branches 94.45 (threshold 92), functions 98.80 (threshold 97)
- **ran (history):** nice -n 15 timeout 300 node --test on csharp-name-resolution-matrix and csharp-branch-coverage tests (commit f8285fd on the 185 commit, the two cases added, the extractor held at the previous commit) · **saw:** tests 122, pass 119, fail 3: csharp-alias-colon-colon-generic-edge, csharp-alias-colon-colon-qualified-tail-edge, and the R13 no-key unit test
- **ran (history):** the same command with the extractor change; then nice -n 15 npm run check and nice -n 15 npm run coverage on the tip f8285fd · **saw:** after: all pass; check: pass 1745, fail 0, dist/ is fresh; coverage: lines 98.79, branches 94.35, functions 98.81 (thresholds 98, 92, 97)
- **ran (history):** npm run check · **saw:** tests 1795, pass 1795, fail 0; dist/ is fresh; npm run coverage: lines 98.98, branches 94.68, functions 99.06, merge 2cebb0c

2026-10-28 tidy-up: the worktree directory is gone; the Runes part of this issue is merged into release/1.1.0 (its branch has no commit beyond it); what remains is the part in Yggdrasil and Grain named in the acceptance; the lease ends and the issue returns to the queue

correction to the line above: this issue is Runes only; its branch is merged into release/1.1.0, and parts of it were split off as 236, 237 and 238; what is left of it is to be read from its acceptance against release/1.1.0

Checked on 2026-11-09 against Runes release/1.1.0: the tsconfig field and <sub>/tsconfig.json, S::Gen<T> and S::A.Foo, autobins and the edition 2015 rule, and the .parent and closest walks are all done. Slow parsing of garbage input stays, and the CHANGELOG states it as a limit. What this issue still lacks is its merge's recorded check.

Checked on Runes release/1.1.0 (branch jarl/233-jvm-and-tools over e9509e1): the C# point is merged (f8285fd, csharp-alias-colon-colon-generic-edge and the alias-qualified cases pass); the tsconfig, Cargo and walk points were split off as 236, 237 and 238 and are merged; every extractor reads malformed input against the wide-node ratio bound (Kotlin's damaged-line files since commit 0b64753 of this branch). Not yet true: note-4 says the CHANGELOG states the parse cost of garbage input as a limit, but neither CHANGELOG.md nor README.md mentions it; ruling D10 (a) gives that sentence to the final pass. Measured here on random printable text with 5% newlines, the grammar's own parse: JavaScript 2.3 s for 250 000 characters and 8.1 s for 1 000 000, C# 0.8 and 3.2 s, Rust 0.6 and 2.5 s, Python 0.5 and 1.9 s, Java 0.4 and 1.8 s. A proposed sentence in the CHANGELOG's register: 'A file that is not source code in its language parses in time that grows with its size; a consumer caps the size of the files it reads and skips binaries.'

