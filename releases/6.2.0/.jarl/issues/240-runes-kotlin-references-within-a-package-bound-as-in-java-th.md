# 240 · Runes: Kotlin references within a package bound as in Java (the twin of 233, D2 a)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, kotlin, partial
**Files:** 
**Repo:** ../../../Runes, ../../../Yggdrasil, ../../../Grain
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**
**Branch:** jarl/233-java-same-package
**Worker:** runes-233
**Worktree:** /Users/me/.jarl-wt/Runes-233
**Since:** 2026-10-05 16:22

## What
Kotlin has the same rule of package type visibility without an import and the same silence (kotlin-same-package-cross-node-silence); ruling plan-6-2-0 D2 (a).

## Why



## Acceptance
The Kotlin extractor binds references to types of the same package within a source set, with the same shadowing rules as Java in 233; kotlin rev bumped; the kotlin-same-package-cross-node-silence case rewritten; one 'Before you upgrade' note in Yggdrasil for Java and Kotlin.

## Changelog
- Fixed: a Kotlin file that names a class, interface, object or typealias of its own package by its simple name, without an import (`val o: Owner = Owner()`, `Owner.make()`, `Owner::class`, `: Base()`), now gives a relation edge to the owner of that declaration, within the source set (a capitalised top-level function or property of the package used as a receiver or callee binds too); a lowercase name is never read, so a top-level `helper()`, a top-level `val limit` and an extension call `"x".shout()` still give no edge. The precedence is Kotlin's: an explicit import or alias of the name wins, the package beats a star import and the default imports, and nothing is read where the name is a type parameter in scope, a declaration of the file, a variable that obscures a receiver or callee, in the root package, or in a file whose declarations could not all be read; a Java class of the package counts. This can make a consumer's graph show new refusals: a test in the package of the class it tests now depends on the component that holds that class, so a graph that keeps tests and production code apart needs that relation declared.

## Evidence


Runes branch jarl/233-java-same-package (shared with 233): kotlin extractor rev 5 to 6, the shared candidate rules in one module used by both extractors, kotlin-same-package-cross-node-silence renamed kotlin-same-package-cross-node-edge and rewritten, 12 new cases, three cases with stale import-only prose corrected. Red before: with the Kotlin extractor reverted, seven edge cases fail (cross-node, test-to-main, explicit-import-wins, beats-star-import, inherited-member-type, external-supertype trap, java-class); green after.

Round two, commit e4f3732 on jarl/233-java-same-package (catalogue only, no source change: rev stays 6, dist unchanged, count stays 559, delta 0): the Result file with its edge (src/test line 5 to main) added to kotlin-same-package-test-to-main-edge and a List file with its edge added to kotlin-same-package-cross-node-edge, so the stdlib-shadow binding both Rules promise is tested; the pointer in kotlin-implicit-stdlib-no-import-silence names those two cases. 240's changelog reworded to say lowercase names are never read; 233's changelog now says a test sees main, its own set, testFixtures of any module and every test set of another module. The hard-wrapped comments the reviewer found (jvmSourceSetVisible doc, Java matrix comments) were already unwrapped in c3212ed. npm run check at e4f3732: 1848/1848, dist fresh; npm run coverage: 99.02 lines, 94.67 branches, 99.09 functions, 1848/1848 (one earlier coverage run showed one failed assertion under load and passed on re-run). Open: the Yggdrasil 'Before you upgrade' note for Java and Kotlin belongs to the later pickup Y5 (its list names 233, not 240), so 240 stays open until Y5's entry names Kotlin.

