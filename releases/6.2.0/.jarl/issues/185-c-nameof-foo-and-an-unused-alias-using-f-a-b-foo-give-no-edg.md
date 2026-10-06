# 185 · C#: nameof(Foo) and an unused alias using F = A.B.Foo give no edge (while using static A.B.Helpers does) — to be decided whether this is a dependency

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**Found by:** csharp-check
**Where:**
**Branch:** jarl/177-csharp-forms
**Worker:** runes-177
**Worktree:** /Users/me/.jarl-wt/Runes-177
**Since:** 2026-10-05 16:22

## What
Checked at the owner's request (session scratchpad patch-611/csharp-simple-names): a bare type name after using gives an edge in all the basic shapes since 6.1.0. Two exceptions: nameof(Foo) is deliberately silent (catalogue case csharp-nameof-no-edge-silence), although the compiler binds the name and removing the type breaks the build; an unused alias using F = A.B.Foo; gives no edge, while using static A.B.Helpers; does, although the compiler resolves both directives.

## Why
Inconsistency: two forms that the compiler binds to a type are silent.

## Acceptance
A decision recorded in Runes (nameof and the alias directive alone: a dependency or not, the same for the alias and using static); catalogue cases consistent with the decision.

## Evidence


