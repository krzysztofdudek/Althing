# 754 · Runes, Java: a bare nested type inherited from a library supertype is answered unfollowed by classifyUse

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-mvbc
**Tags:** api, java, runes
**Files:** Runes/src/relations/resolver.mts
**Repo:** Runes
**Found by:** research research/2026-11-15-runes-readers-gaps-after-1-1-0
**Source:** research/2026-11-15-runes-readers-gaps-after-1-1-0#runes-readers-2026-11-15-java-inherited-nested
**Where:** Runes/src/relations/resolver.mts:814, Runes/src/relations/resolver.mts:900
**Branch:** jarl/753-classify-reasons
**Worker:** w-753-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:19

## What
At Runes v1.1.0 (1f3476b) classifyUse answers absent with reason unfollowed for a bare nested type that a Java class inherits from a library supertype, where the same type written Map.Entry is outside. On a repository of one class, class Tree<K, V> extends AbstractMap<K, V> with a field Map.Entry<K, V> and a field Entry<K, V>, the written Map.Entry is outside and the bare Entry (candidates java.util.AbstractMap+Entry and app.Entry) is unfollowed. On google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, 10,675 uses give 3,092 resolved, 7,563 outside and 20 unfollowed; 14 of the 20 are this shape: 12 bare Entry in gson/src/main/java/com/google/gson/internal/LinkedTreeMap.java (a class that extends AbstractMap and implements Serializable; lines 220, 442, 459, 511, 512, 590, 597, 598, 600, 608, 613, 617), one in gson/src/test/java/com/google/gson/functional/MapTest.java:411 and one Context in proto/src/test/java/com/google/gson/protobuf/functional/LegacyProtoTypeAdapterFactoryTest.java:452. The other 6 are generated protobuf types with no file. The cause: keyReason returns pass for the inherited reading, whose level is outside the repository and whose separator is + (resolver.mts:814), and pass for the same-package reading, so classifyUse falls to unfollowed (resolver.mts:900).

Moved from issue 754 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A use that leaves the repository is told as one the readers could not follow, so a consumer that reports unfollowed uses reports 14 false ones in gson, 12 of them in one file. A new family tool that uses the readers as they are reported it.

## Acceptance
- [test] In Java, a bare nested type that a class inherits from a type outside the repository (Entry in a class that extends AbstractMap or implements java.util.Map) gives reason outside in classifyUse when the repository's package declares no type of that name, in a unit test and a catalogue case, red at v1.1.0 and green after; where the package also declares a type of that name, the answer stays what it is at v1.1.0, and every existing answer and edge stays as it is · by: npm run check
- [test] On google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91 the classifyUse tally has 6 unfollowed uses (the generated protobuf types) where it had 20 · by: node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/java-inherited-nested-type.mjs <the worktree, built, with .grammars/> <google/gson at that commit, fetched into scratch>

## Changelog
- in Java and Kotlin, a bare name a class may inherit as a member type of a library supertype (`Entry` in a class that extends `AbstractMap` or implements `java.util.Map`) is answered by `classifyUse` as `outside`, as `Map.Entry` written in full already was, where the class's package declares no type of that name; in 1.1.0 it was absent, unfollowed. The edges do not change; a consumer that reports unfollowed uses sees fewer (14 of the 20 on google/gson).

## Evidence

### Proof

- **ran (line dcf740391201):** node --test test/relations/resolver.test.mjs test/relations/extractors/java-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (new tests over the dist of 71791c4, before the change) · **saw:** pass 171, fail 2: the unit test 'Java and Kotlin: a member type inherited from a supertype outside the repository leaves it...' (expected outside, got unfollowed) and the case java-inherited-library-member-type-outside-silence (Tree.java:6 answers absent unfollowed)
- **ran (line dcf740391201):** npm run build; node --test test/relations/resolver.test.mjs test/relations/extractors/java-name-resolution-matrix.test.mjs test/relations/extractors/kotlin-name-resolution-matrix.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractors/java.test.mjs test/relations/extractors/kotlin.test.mjs test/relations/catalogue.test.mjs (at d295459) · **saw:** pass 668, fail 0
- **ran (line 797ab376b2d3):** node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/java-inherited-nested-type.mjs <the worktree at 71791c4, built, with .grammars/> <google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, fetched into scratch> · **saw:** uses 10675 {resolved 3092, absent:outside 7563, absent:unfollowed 20}: 12 LinkedTreeMap Entry, MapTest.java:411 Entry, LegacyProtoTypeAdapterFactoryTest.java:452 Context, 6 generated protobuf types
- **ran (line 797ab376b2d3):** node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/java-inherited-nested-type.mjs <the worktree at d295459, built, with .grammars/> <google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, fetched into scratch> · **saw:** uses 10675 {resolved 3092, absent:outside 7577, absent:unfollowed 6}: the 6 left are the generated protobuf types TestAllTypes, TestDuration, TestMap, TestOneof, TestRecursive
- **ran (line dcf740391201):** npm run build; node --test test/relations/resolver.test.mjs test/relations/extractors/java-name-resolution-matrix.test.mjs test/relations/extractors/kotlin-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at the follow-up commit that reads a supertype as outside only when a package qualifies it) · **saw:** pass 250, fail 0
- **ran (line 797ab376b2d3):** node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/java-inherited-nested-type.mjs <the worktree at the follow-up commit, built, with .grammars/> <google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, fetched into scratch> · **saw:** uses 10675 {resolved 3092, absent:outside 7577, absent:unfollowed 6}
- **ran (line dcf740391201):** npm run check (clean tree at ef21efe, release/1.2.0 merged: already up to date at 3e125cb) · **saw:** tests 2838, pass 2835, fail 0, skipped 3 (the Rust build tests, no toolchain here); dist/ is fresh

### Notes

Assumed: the change applies to Kotlin as well as Java, since both extractors write the same inherited readings (<package>.<Super>+<Name>) and the resolver reads them alike; on the corpus one Kotlin use moved (moshi KotlinReflectTypes.kt:127, TODO() in a class implementing java.lang.reflect.TypeVariable, unfollowed to outside, which is right for the standard library's TODO). A supertype counts as outside the repository only when it is no type of the repository and its package is no package of the repository: a supertype written in the file's own package that no file declares (generated, or java.lang's Thread written bare) keeps its member types the repository's, unfollowed as at 1.1.0. 'The package declares a type of that name' is read as any file of the package in any source set, or a Kotlin file of the package that could not be read (its <package>.* marker), so every such answer stays what it was. Corpus classifyUse tallies, before -> after: javapoet unfollowed 1 -> 0 (TestFiler.java:39 Kind), jsoup 666 -> 663 (Attributes.java:718, 740, 758 Entry), moshi java 1 -> 0 (ObjectAdapterTest.java:179 Entry) and kotlin 6 -> 5, spring-petclinic unchanged; edges unchanged everywhere.

Assumed: a supertype counts as outside only when an import or the source qualifies it by a package (the names before the first capitalised one) the repository declares nothing in; a dotted supertype written from a type (Map.Entry, JsonAdapter.Factory) keeps its readings unfollowed, since it may be the repository's. Corpus classifyUse tallies at the final rule, release/1.2.0+753 -> 754: okhttp kotlin unfollowed 163 -> 153 (ten Kotlin TODO() calls in classes of library supertypes, now outside), javapoet 1 -> 0, jsoup 666 -> 663, moshi java 1 -> 0 and kotlin 6 -> 5, spring-petclinic 0 -> 0; no edge moved.

