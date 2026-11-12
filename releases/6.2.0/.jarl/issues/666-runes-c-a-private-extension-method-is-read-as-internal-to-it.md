# 666 · Runes, C#: a private extension method is read as internal to its assembly (assemblyOnlyExtension, s…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2152-hjio
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
Runes, C#: a private extension method is read as internal to its assembly (assemblyOnlyExtension, src/relations/extractors/csharp.mts:710-716), so a friend assembly and the method's own assembly count it as a definer and, since rev 38, in the count check, where the compiler cannot see it: in namespace App.Web, project Ext declares public static class B { static void Tag(this Order o, string k) }, grants InternalsVisibleTo("Web"), and Lib declares public Tag(this Order, string) in namespace App. o.Tag("k") in Web gives src/Web/Page.cs:4->Ext on release/1.1.0 and on the branch, where the compiler binds Lib. The same holds for a private Tag beside a public Tag of another count in one class.

## Why


## Acceptance


[test] A private extension method is no definer outside its own class: neither a friend assembly nor its own assembly counts it, in resolution and in the count check, as catalogue cases, red before and green after · by: npm run check

## Changelog
- Fixed: C#: a private extension method (`static void Tag(this Order o)` in a static class) counts for calls in its own file only, and a file that declares a public and an internal extension method of one name stays a definer through the public one for a caller of another assembly that is no friend; a call that only the internal method of a non-friend assembly takes no longer binds it.

## Evidence

### Proof

- **ran (line df25f2ca5035):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (Runes, commit 471e35e, before the fix) · **saw:** fail 4: csharp-private-extension-method-friend-assembly-binds-other-edge (got Page.cs:4->Ext), -own-assembly-, -beside-public-other-count- (got Ext), and csharp-public-and-internal-extension-method-one-file-public-call-edge; the own-class silence case and the internal-call case pass before and after
- **ran (line df25f2ca5035):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f) · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions; catalogue matrix at c9c62a7: pass 294, fail 0

### Notes

Assumed: a private extension method (no access modifier, private, or private protected) counts for calls in its own file only; a call from another part of the same partial static class in another file therefore no longer sees it. A method is private to its class, not to its file, but the file is what a definer record names, and a partial static class holding extension methods is rare. 666 and 667 are one commit (c9c62a7): both change the one place where the resolver reads a file's marks, from the shapes of its records. Resolver functions touched: hintFiles (the tail after the reach filter), assemblyOnlyIn, and takesCall's shape test; new helpers extensionShapesIn, privateOnlyIn and byReceiver. withinReach, internalIn and the hot paths for type readings are unchanged.

