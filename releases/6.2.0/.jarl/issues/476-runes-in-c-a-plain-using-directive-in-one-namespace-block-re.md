# 476 · Runes: in C#, a plain using directive in one namespace block reaches references in a sibling block

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 469
**Found by:** w-runes-469-opus
**Where:** The 469 worker's report (2026-11-03): ordinary references read plain usings file-wide

## What
Aliases now reach only the namespace block that holds their directive, but a plain using directive (using Shop.Core;) still applies to every reference in the file, so a reference in a sibling namespace block can bind a type that block cannot see.

## Why
A false edge of this kind can force a cycle a team cannot remove.

## Acceptance
- A plain using directive applies only inside the block that holds it, with catalogue cases for a sibling block (silence) and a nested block (edge), red before and green after
- The C# matrix, csharp-parity and candidate-parity tests are unchanged apart from the new cases

## Evidence

From the review of 469 (rev-runes-469-fable, 2026-11-03), part of this issue: an outer block's plain using is read by its written text, so namespace A { using Core; namespace B { using O = Order; } } with namespace A.Core and a global Core.Order binds the global type where C# binds A.Core.Order (spec 14.5.3), as every ordinary reference under that using already does on release/1.1.0; an outer block's alias of a target's first name ends the lookup unread; an outer block's using static is not read for a target (it imports nested types, 14.5.4)

