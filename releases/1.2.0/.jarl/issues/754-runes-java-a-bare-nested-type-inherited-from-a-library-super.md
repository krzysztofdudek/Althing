# 754 · Runes, Java: a bare nested type inherited from a library supertype is answered unfollowed by classifyUse

**Status:** open
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

## What
At Runes v1.1.0 (1f3476b) classifyUse answers absent with reason unfollowed for a bare nested type that a Java class inherits from a library supertype, where the same type written Map.Entry is outside. On a repository of one class, class Tree<K, V> extends AbstractMap<K, V> with a field Map.Entry<K, V> and a field Entry<K, V>, the written Map.Entry is outside and the bare Entry (candidates java.util.AbstractMap+Entry and app.Entry) is unfollowed. On google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, 10,675 uses give 3,092 resolved, 7,563 outside and 20 unfollowed; 14 of the 20 are this shape: 12 bare Entry in gson/src/main/java/com/google/gson/internal/LinkedTreeMap.java (a class that extends AbstractMap and implements Serializable; lines 220, 442, 459, 511, 512, 590, 597, 598, 600, 608, 613, 617), one in gson/src/test/java/com/google/gson/functional/MapTest.java:411 and one Context in proto/src/test/java/com/google/gson/protobuf/functional/LegacyProtoTypeAdapterFactoryTest.java:452. The other 6 are generated protobuf types with no file. The cause: keyReason returns pass for the inherited reading, whose level is outside the repository and whose separator is + (resolver.mts:814), and pass for the same-package reading, so classifyUse falls to unfollowed (resolver.mts:900).

Moved from issue 754 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A use that leaves the repository is told as one the readers could not follow, so a consumer that reports unfollowed uses reports 14 false ones in gson, 12 of them in one file. A new family tool that uses the readers as they are reported it.

## Acceptance
- [test] In Java, a bare nested type that a class inherits from a type outside the repository (Entry in a class that extends AbstractMap or implements java.util.Map) gives reason outside in classifyUse when the repository's package declares no type of that name, in a unit test and a catalogue case, red at v1.1.0 and green after; the same name declared in the package stays unfollowed, and every existing answer and edge stays as it is · by: npm run check
- [test] On google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91 the classifyUse tally has 6 unfollowed uses (the generated protobuf types) where it had 20 · by: node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/java-inherited-nested-type.mjs

## Evidence

