# 556 · Runes: jellyfin's corpus verify shows 18 unexplained added edges on release/1.1.0

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1133-zebu
**Tags:** runes, corpus, csharp
**Files:** 
**Repo:** Runes
**Found by:** w-505-sonnet
**Where:** npm run corpus -- verify, heavy tier, jellyfin
**Branch:** jarl/233-jvm-and-tools
**Worker:** w-233-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:23

## What
The worker of 505 ran verify on jellyfin and saw 18 added edges that corpus/explained.md does not explain, on a copy of release/1.1.0 without 505 too, so a merged C# change moved jellyfin's golden without an explanation.

## Why
An unexplained golden change hides whether the edges are true or false.

## Acceptance
[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained

## Reviews
- **approve** · by rev-233-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2052-nuxl
  556 line 1, '[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained': met. I read the source line of each of the 18 at jellyfin 305a964: 17 are type tests ('item is X', one 'item is Controller.Entities.TV.Episode') and one a parameter of the delegate type CreationDelegateFactory; each name is either unique in the repository, named by a using alias of the file, or its second declaration sits in Jellyfin.Database.Implementations.Entities.Libraries, which none of the files imports; ExceptionMiddleware imports MediaBrowser.Controller.Net and not System.Security. The corpus gate over every tier on the branch at 2ed35b5 passed with jellyfin at 0 added, 0 removed (5 oracles skipped for a missing go and dotnet) · 589: the three new cases fail on release/1.1.0 and pass on the branch; uses and declarations are equal between release and branch on 5876 Kotlin inputs of my own making (every file of moshi and okhttp whole, each with 8 breaks other than the worker's, and 9 generated files: 200 nested classes, 300 nested lambdas, 2000 nested parentheses, an unclosed when, list and class of 6000 lines); five generated files of 1500 damaged lines read in 0.1 to 0.2 s where the release took up to 4.9 s, with equal facts · the Kotlin rev moves once, 6 to 7, in 0b64753, the only commit that changes output; dist rebuilt from the branch is byte-equal to the committed dist · 585: the new test fails on the release's script and passes here; tried against it: two runs in the same millisecond still get separate directories (mkdtemp), a tree that is not the top of a checkout is named as such · 188, 233, 240: the Runes parts are on the branch (the S:: cases, the same-package cases of Java and Kotlin, samePackage in docs/api.md) and the full suite is green: tests 2527, pass 2526, fail 0, skipped 1 · Minor: 233 and 240 are met for Runes only; their Yggdrasil and Grain halves (the check, the Before you upgrade note, Grain's use of Runes, the spring-petclinic proof) are not on this branch and stay open · Minor: 188's sentence about the parse cost of garbage input is still in neither CHANGELOG.md nor README.md; it is left to the release preparation · Minor: in none of my inputs did the read bound change a fact, so the fallback to the name stayed unexercised outside the worker's own measurement · Minor: each corpus run now leaves a directory under the cache's reports and nothing removes them · Note: npm run check in a tree extracted with git archive stops at check:dist, which needs a git checkout; the tests had finished, and dist was compared by diff instead

## Evidence

### Notes

Reproduced on an extraction of release/1.1.0 at 176abca (the commit the worker of 505 named): verify --only jellyfin, 18 added, 0 removed, 0 explained. Attributed by running the same verify on extractions of 33ba2bc (0 added), 47680c4 (1 added: ApplicationHost.cs:394, a delegate declaration read as a type) and 9ea4980 (the 18: a type in a pattern, the grammar reading item is A || item is B || item is C as one constant pattern). Since then commit 63e9cd8 put them in the golden with the note 'release/1.1.0 gave this reference at merge a1ef8c4', which judges nothing. All 18 judged true against the source and the C# lookup rules; commit 2ed35b5 rewrites their 18 entries in corpus/explained.md with the judgment. The current golden holds all 18, and node scripts/corpus.mjs verify --only jellyfin on that commit: ok, 32640 edges, 0 added, 0 removed; corpus verify: passed.

