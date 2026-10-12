# 233 · Runes + Yggdrasil + Grain: Java references within a package bound in Runes (D8 a), Yggdrasil checks them, Grain declares them again

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, yggdrasil, grain, java, partial
**Files:** 
**Repo:** ../../../Runes, ../../../Yggdrasil, ../../../Grain
**Found by:** jarl
**Source:** decisions#patch-scope
**Where:**
**Branch:** jarl/233-java-same-package
**Worker:** runes-233
**Worktree:** /Users/me/.jarl-wt/Runes-233
**Since:** 2026-10-05 16:22

## What
In 6.1.1 (053, D8 b) Grain stopped declaring Java relations within a package, which Yggdrasil does not check; moving the binding to Runes (D8 a) deferred to a minor release with a warning in Yggdrasil's CHANGELOG.

## Why
A test in the package of a production class uses it without an import; today this dependency is invisible to both tools.

## Acceptance
The Java extractor in Runes binds references to types from the same package (without an import) within a source set; Yggdrasil checks them (a 'Before you upgrade' note: Maven/Gradle graphs may need a test→main relation); Grain uses Runes instead of its own binding; spring-petclinic: propose declares relations that yg check confirms.

## Changelog
- Fixed: a Java file that names a type of its own package by its simple name, without an import (`Owner o = new Owner();`, `Owner.make()`, `@Mark`), now gives a relation edge to the owner of that type, within the source set: code under `src/main` never sees a class that only `src/test` declares, and a test sees `main`, its own set, the `testFixtures` of any module and every test set of another module; a Kotlin class of the package counts, and an annotation type is now declared. Nothing is read where the name means something else (a type parameter in scope, a type the file declares, an import of that name, a variable that obscures a receiver, the unnamed package). This can make a consumer's graph show new refusals: a test in the package of the class it tests now depends on the component that holds that class, so a graph that keeps tests and production code apart needs that relation declared. - Added: the optional field `samePackage` on a `symbol` hint of `TargetHint`: `makeResolver` then lets the referencing file see only the definers its source set can see (`src/main` never sees `src/test`); a hint without it resolves as before.

## Evidence


Runes branch jarl/233-java-same-package: java extractor rev 3 to 4, samePackage hint field, source-set rule in the resolver, 14 new catalogue cases (count 533 to 547 for 233, 559 with 240). Red before: with the extractor reverted, the six edge cases (test-to-main, beats-on-demand, inherited-member-type, external-supertype trap, kotlin-class, qualified-and-annotation) fail; green after. npm run check and npm run coverage green on the tip (coverage 99.02 lines, 94.65 branches, 99.09 functions). Corpus (scratch, pinned commits, owner = source set and last directory): spring-petclinic @500158f owner pairs 9 to 14, all 5 new pairs test to main (petclinic, model, owner, system, vet); jsoup @088614f 110 to 113 (test:jsoup, test:safety, one java11 test root, all test to main); moshi @889013e 39 to 40 (test:adapters to main:adapters), 42 with the Kotlin half (test:reflect, test:ksp); no pair lost, no main to main or main to test pair added. docs: README.md: no paragraph describes same-package behaviour, nothing to change; the catalogue status line and CLAUDE.md case count wait for the final pass (559).

