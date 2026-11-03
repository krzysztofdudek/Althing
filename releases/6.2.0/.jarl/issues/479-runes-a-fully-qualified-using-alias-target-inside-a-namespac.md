# 479 · Runes: a fully qualified using alias target inside a namespace body gives no edge on its directive line, although its first segment names no nearer namespace (eShop)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 469
**Found by:** jarl
**Where:** Corpus run on release/1.1.0 after merge f2ad16b (2026-11-03): eShop tests/Ordering.UnitTests/Application/OrdersWebApiTest.cs:5
**Branch:** jarl/476-csharp-using-block-scope
**Worker:** w-runes-476-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-476
**Since:** 2026-11-03 01:21

## What
Since 469, the directive line of a plain alias target in a namespace body reads only the nearest namespace, to avoid a false edge when a nearer namespace and a global type share a name. A fully qualified target whose first segment matches no namespace of the repository nearer than the global one is unambiguous, yet it loses its directive-line edge too.

## Why
An unused alias to a real type is a real dependency the graph should show; the uses keep their edges today, the bare directive does not.

## Acceptance
- A fully qualified alias target whose first segment names no nearer namespace of the repository gives its edge on the directive line, with a catalogue case red before and green after, and the nearer-namespace case stays silent
- eShop's golden regains the line and the change is explained

## Evidence

