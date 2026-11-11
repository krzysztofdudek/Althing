# 240 · Runes: Kotlin references within a package bound as in Java (the twin of 233, D2 a)

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1441-dxth
**Tags:** runes, kotlin, partial
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**
**Branch:** jarl/233-jvm-and-tools
**Merged:** e44fa6eab108a8e1e4e5de224defe15ad7792a99 in ../../../Runes
**CI:** pending
**After:** 530, 143

## What
Kotlin has the same rule of package type visibility without an import and the same silence (kotlin-same-package-cross-node-silence); ruling plan-6-2-0 D2 (a).

## Why



## Acceptance
The Kotlin extractor binds references to types of the same package within a source set, with the same shadowing rules as Java in 233; kotlin rev bumped; the kotlin-same-package-cross-node-silence case rewritten; one 'Before you upgrade' note in Yggdrasil for Java and Kotlin.

## Changelog
- Fixed: a Kotlin file that names a class, interface, object or typealias of its own package by its simple name, without an import (`val o: Owner = Owner()`, `Owner.make()`, `Owner::class`, `: Base()`), now gives a relation edge to the owner of that declaration, within the source set (a capitalised top-level function or property of the package used as a receiver or callee binds too); a lowercase name is never read, so a top-level `helper()`, a top-level `val limit` and an extension call `"x".shout()` still give no edge. The precedence is Kotlin's: an explicit import or alias of the name wins, the package beats a star import and the default imports, and nothing is read where the name is a type parameter in scope, a declaration of the file, a variable that obscures a receiver or callee, in the root package, or in a file whose declarations could not all be read; a Java class of the package counts. This can make a consumer's graph show new refusals: a test in the package of the class it tests now depends on the component that holds that class, so a graph that keeps tests and production code apart needs that relation declared.

## Reviews
- **approve** · by rev-233-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2052-nuxl
  556 line 1, '[read] Each of the 18 edges is judged true or false against the C# rules, explained in corpus/explained.md or fixed, and the heavy jellyfin verify reports nothing unexplained': met. I read the source line of each of the 18 at jellyfin 305a964: 17 are type tests ('item is X', one 'item is Controller.Entities.TV.Episode') and one a parameter of the delegate type CreationDelegateFactory; each name is either unique in the repository, named by a using alias of the file, or its second declaration sits in Jellyfin.Database.Implementations.Entities.Libraries, which none of the files imports; ExceptionMiddleware imports MediaBrowser.Controller.Net and not System.Security. The corpus gate over every tier on the branch at 2ed35b5 passed with jellyfin at 0 added, 0 removed (5 oracles skipped for a missing go and dotnet) · 589: the three new cases fail on release/1.1.0 and pass on the branch; uses and declarations are equal between release and branch on 5876 Kotlin inputs of my own making (every file of moshi and okhttp whole, each with 8 breaks other than the worker's, and 9 generated files: 200 nested classes, 300 nested lambdas, 2000 nested parentheses, an unclosed when, list and class of 6000 lines); five generated files of 1500 damaged lines read in 0.1 to 0.2 s where the release took up to 4.9 s, with equal facts · the Kotlin rev moves once, 6 to 7, in 0b64753, the only commit that changes output; dist rebuilt from the branch is byte-equal to the committed dist · 585: the new test fails on the release's script and passes here; tried against it: two runs in the same millisecond still get separate directories (mkdtemp), a tree that is not the top of a checkout is named as such · 188, 233, 240: the Runes parts are on the branch (the S:: cases, the same-package cases of Java and Kotlin, samePackage in docs/api.md) and the full suite is green: tests 2527, pass 2526, fail 0, skipped 1 · Minor: 233 and 240 are met for Runes only; their Yggdrasil and Grain halves (the check, the Before you upgrade note, Grain's use of Runes, the spring-petclinic proof) are not on this branch and stay open · Minor: 188's sentence about the parse cost of garbage input is still in neither CHANGELOG.md nor README.md; it is left to the release preparation · Minor: in none of my inputs did the read bound change a fact, so the fallback to the name stayed unexercised outside the worker's own measurement · Minor: each corpus run now leaves a directory under the cache's reports and nothing removes them · Note: npm run check in a tree extracted with git archive stops at check:dist, which needs a git checkout; the tests had finished, and dist was compared by diff instead

## Evidence


Runes branch jarl/233-java-same-package (shared with 233): kotlin extractor rev 5 to 6, the shared candidate rules in one module used by both extractors, kotlin-same-package-cross-node-silence renamed kotlin-same-package-cross-node-edge and rewritten, 12 new cases, three cases with stale import-only prose corrected. Red before: with the Kotlin extractor reverted, seven edge cases fail (cross-node, test-to-main, explicit-import-wins, beats-star-import, inherited-member-type, external-supertype trap, java-class); green after.

Round two, commit e4f3732 on jarl/233-java-same-package (catalogue only, no source change: rev stays 6, dist unchanged, count stays 559, delta 0): the Result file with its edge (src/test line 5 to main) added to kotlin-same-package-test-to-main-edge and a List file with its edge added to kotlin-same-package-cross-node-edge, so the stdlib-shadow binding both Rules promise is tested; the pointer in kotlin-implicit-stdlib-no-import-silence names those two cases. 240's changelog reworded to say lowercase names are never read; 233's changelog now says a test sees main, its own set, testFixtures of any module and every test set of another module. The hard-wrapped comments the reviewer found (jvmSourceSetVisible doc, Java matrix comments) were already unwrapped in c3212ed. npm run check at e4f3732: 1848/1848, dist fresh; npm run coverage: 99.02 lines, 94.67 branches, 99.09 functions, 1848/1848 (one earlier coverage run showed one failed assertion under load and passed on re-run). Open: the Yggdrasil 'Before you upgrade' note for Java and Kotlin belongs to the later pickup Y5 (its list names 233, not 240), so 240 stays open until Y5's entry names Kotlin.
- **ran (history):** npm run check · **saw:** tests 1907, pass 1907, fail 0, catalogue 578 cases, dist/ is fresh; npm run coverage 1907/1907, all files 99.04 lines / 94.67 branches / 99.12 functions, exit 0; Runes half, merge e44fa6e

2026-10-28 tidy-up: the worktree directory is gone; the Runes part of this issue is merged into release/1.1.0 (its branch has no commit beyond it); what remains is the part in Yggdrasil and Grain named in the acceptance; the lease ends and the issue returns to the queue

Checked on Runes release/1.1.0 (branch jarl/233-jvm-and-tools over e9509e1): the Runes part holds. The Kotlin same-package cases pass (the kotlin matrix with the java one: 146 tests, 146 pass), kotlin-same-package-cross-node-silence was rewritten as kotlin-same-package-cross-node-edge, and the Kotlin rev moved for it to 6 (7 now, for issue 589 on this branch). The remaining line is Yggdrasil's: one 'Before you upgrade' note in its CHANGELOG for Java and Kotlin together, as described on 233; the review of 2026-10-12 asked that Y5's entry for 233 name Kotlin or that 240 be added to Y5.

