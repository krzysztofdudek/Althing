# 549 · C#: an internal partial type whose other part carries no access modifier (internal partial class Or…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1034-bgpw
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-506-fable
**Where:** the review of 489, 506

## What
C#: an internal partial type whose other part carries no access modifier (internal partial class Order in one file, partial class Order in another of the same project) keeps the unmarked part as a candidate, so a caller in another project gets silence where the compiler binds the public type of a referenced project; the same silence as on release/1.1.0, so no regression (a probe case run on both trees).

## Why


## Acceptance


## Evidence

