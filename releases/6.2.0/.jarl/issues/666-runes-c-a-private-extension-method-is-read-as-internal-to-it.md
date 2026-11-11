# 666 · Runes, C#: a private extension method is read as internal to its assembly (assemblyOnlyExtension, s…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2152-hjio
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-549c-opus
**Where:** the review of 549, 552, 555, 559, 577, 584, 594, 595, 619, 628, 636

## What
Runes, C#: a private extension method is read as internal to its assembly (assemblyOnlyExtension, src/relations/extractors/csharp.mts:710-716), so a friend assembly and the method's own assembly count it as a definer and, since rev 38, in the count check, where the compiler cannot see it: in namespace App.Web, project Ext declares public static class B { static void Tag(this Order o, string k) }, grants InternalsVisibleTo("Web"), and Lib declares public Tag(this Order, string) in namespace App. o.Tag("k") in Web gives src/Web/Page.cs:4->Ext on release/1.1.0 and on the branch, where the compiler binds Lib. The same holds for a private Tag beside a public Tag of another count in one class.

## Why


## Acceptance


## Evidence

