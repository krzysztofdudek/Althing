# 2 · Runes, Java: a bare nested name inherited from a library supertype binds the package's own type of that name, where Java binds the inherited member type

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261117T1057-awxc
**Tags:** runes, java, api
**Files:** 
**Repo:** Runes
**Found by:** planner-1-2-0
**Where:** Runes/src/relations/resolver.mts:806-824; probe on v1.1.0: Entry in class Tree extends AbstractMap binds app/Entry.java

## What
At v1.1.0, where a Java package declares a type Entry and a class of that package extends java.util.AbstractMap, a bare Entry in that class resolves to app/Entry.java. Java binds the member type the class inherits from its supertype first (JLS 8.5, 6.4.1), so the edge to app/Entry.java is false there. Runes cannot see a library's members, so it cannot tell whether the supertype declares a member type of that name. Found by the planner of 1.2.0 while checking 754.

## Why
A false edge is a false red for every consumer that checks dependencies; if the readers cannot know, docs/api.md has to say so, so a consumer can weigh the answer.

## Acceptance
[read] A ruling in the loop says whether this is fixed (a bare name inside a class whose supertype lies outside the repository answers unfollowed or ambiguous where the package also declares the name) or stated as a known limit in docs/api.md, and why, with the corpus's Java repositories counted for how often the form occurs

## Evidence

