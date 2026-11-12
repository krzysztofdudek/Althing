# 667 · Runes, C#: a file that declares a public and an internal extension method of one name is dropped wh…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2152-kfpy
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-549c-opus
**Where:** the review of 549, 552, 555, 559, 577, 584, 594, 595, 619, 628, 636
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Runes, C#: a file that declares a public and an internal extension method of one name is dropped whole as a definer for a caller of another assembly that is no friend, because the reach filter reads the file-level internal:<key> mark (internalIn, src/relations/resolver.mts:309-316, through withinReach at :249). So a call only the public method takes loses its edge. Ext declares public static class A { public Tag(this Order o); internal Tag(this Order o, string k) } in App.Web, Lib declares Tag(this Order, string) in App, and Web (referencing both) calls o.Tag(): release/1.1.0 gives src/Web/Page.cs:4->Lib (a false edge) and no Ext edge; the branch gives neither (silence). The compiler binds A in Ext. Rev 38's per-method - mark in shapes: carries what the filter would need.

## Why


## Acceptance


[test] A file declaring a public and an internal extension method of one name stays a definer for a caller of a non-friend assembly through its public method, while the internal one stays out of reach, as catalogue cases, red before and green after · by: npm run check

## Evidence

