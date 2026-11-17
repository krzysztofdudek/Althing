# 709 · Runes, Kotlin: the grammar's whole-file parse splits an annotation off a function when exactly one declaration precedes it

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-mhre
**Tags:** runes, kotlin, line-numbers
**Files:** 
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693

## What
Minor: Runes, Kotlin: the grammar's whole-file parse splits an annotation off a function when exactly one declaration precedes it: the 24-line damaged text of the dropped test in c02ae8f after one line val filler0 = 1 parses as annotated_expression plus function_declaration (no error node) and declares primaryConstructor one line lower than at depth 0 or 2 and more, on c5124ca and 90c330f; a remaining form of issue 018's annotated declarations.

Moved from issue 709 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A declaration reported one line off gives a consumer the wrong line for whatever it reports there.

## Acceptance
[test] The damaged Kotlin text of issue 018's annotated declarations, after exactly one declaration, declares primaryConstructor on the same line as at depth 0 and at depth 2 and more, in a test red at v1.1.0 and green after; or, where the grammar's own parse cannot be worked around, docs/api.md names the form as a limit and a test pins the answer · by: npm run check

## Evidence

