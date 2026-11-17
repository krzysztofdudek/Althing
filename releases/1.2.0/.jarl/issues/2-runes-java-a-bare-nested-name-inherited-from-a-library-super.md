# 2 · Runes, Java: a bare nested name inherited from a library supertype binds the package's own type of that name, where Java binds the inherited member type

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261117T1057-awxc
**Tags:** runes, java, api
**Files:** 
**Repo:** Runes
**Found by:** planner-1-2-0
**Where:** Runes/src/relations/resolver.mts:806-824; probe on v1.1.0: Entry in class Tree extends AbstractMap binds app/Entry.java
**Branch:** jarl/753-classify-reasons
**Worker:** w-753-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:19

## What
At v1.1.0, where a Java package declares a type Entry and a class of that package extends java.util.AbstractMap, a bare Entry in that class resolves to app/Entry.java. Java binds the member type the class inherits from its supertype first (JLS 8.5, 6.4.1), so the edge to app/Entry.java is false there. Runes cannot see a library's members, so it cannot tell whether the supertype declares a member type of that name. Found by the planner of 1.2.0 while checking 754.

## Why
A false edge is a false red for every consumer that checks dependencies; if the readers cannot know, docs/api.md has to say so, so a consumer can weigh the answer.

## Acceptance
[read] A ruling in the loop says whether this is fixed (a bare name inside a class whose supertype lies outside the repository answers unfollowed or ambiguous where the package also declares the name) or stated as a known limit in docs/api.md, and why, with the corpus's Java repositories counted for how often the form occurs

## Evidence

### Notes

For the ruling (no code written, stopped for the jarl): the fix needs to know whether a library supertype declares a member type of the name, which Runes cannot see; without it, the only fix is to stop binding a bare name to the package's own type whenever some supertype of an enclosing class lies outside the repository. Counted on the corpus's JVM repositories at 342a1b0 (uses whose group holds a member-type reading of a supertype an import or the source qualifies by a package the repository declares nothing in, and that bind the package's type): javapoet 14, jsoup 39, spring-petclinic 13, moshi 11, okhttp 379, so 456 edges; read by name, none is a member type its library supertype declares (Closeable, Flushable, Iterator, FilterInputStream, SSLSocket, Formatter, JpaRepository, AbstractProcessor, SimpleTypeVisitor8 and the like hold no such type), so 0 false edges against 456 true ones the fix would silence (google/gson has none either: no package of it declares Entry). Recommendation: state it as a known limit in docs/api.md, where the Java and Kotlin same-package paragraph already lists 'a member type inherited from a supertype outside the repository' as one; a sentence can make it concrete (Entry in a class that extends java.util.AbstractMap binds the package's own Entry where one exists; classifyUse answers it as that type) and say why (Runes reads no library's members; the guess would cost the corpus 456 true edges for 0 false ones). A middle way, a list of the JDK's member types of common supertypes (Map.Entry, Thread.State), is the same library knowledge in part, and would need its own upkeep per JDK, as the java.lang list does.

