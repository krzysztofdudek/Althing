# 177 · C#: remaining silent spots (a tuple one level deeper in a generic argument, an unnamed qualified element next to a named one, using P = global::Program, global::Helpers.H(), F(x < Limits.Max, y > z), type parameter names muted as a call receiver across the whole file)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 138, 150, 156, 161
**Found by:** rev-runes-138
**Where:**
**Branch:** jarl/177-csharp-forms
**Worker:** runes-177
**Worktree:** /Users/me/.jarl-wt/Runes-177
**Since:** 2026-10-05 16:22

## What
The reviewer of package 138 collected the spots that still give no edge (not false edges): new List<List<(Customer Who, int I)>>(n) (the grammar reads it as a >> operand), (Order O, Shop.Core.Customer), using P = global::Program, global::Helpers.H(), F(x < Limits.Max, y > z), and Entity.Create() in a neighbouring class of a file with Repo<Entity> (type parameter names muted as a receiver across the whole file — from before the patch).

## Why
Silent dependencies in real C# code.

## Acceptance
Each form gives an edge or is a documented silence; catalogue cases.

## Evidence


