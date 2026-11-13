# 709 · Minor: Runes, Kotlin: the grammar's whole-file parse splits an annotation off a function when exact…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-pyfg
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693

## What
Minor: Runes, Kotlin: the grammar's whole-file parse splits an annotation off a function when exactly one declaration precedes it: the 24-line damaged text of the dropped test in c02ae8f after one line val filler0 = 1 parses as annotated_expression plus function_declaration (no error node) and declares primaryConstructor one line lower than at depth 0 or 2 and more, on c5124ca and 90c330f; a remaining form of issue 018's annotated declarations.

## Why


## Acceptance


## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-1-1-0-scope-at-the-cut

