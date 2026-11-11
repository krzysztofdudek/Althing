# 595 · Runes, C#: when an instance method and an extension method of one name both fit a call by its count…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1429-okob
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-494-opus
**Where:** the review of 493, 494, 497, 498

## What
Runes, C#: when an instance method and an extension method of one name both fit a call by its counts, issue 498 takes the instance method, and the extension edge is lost even where the file writes the argument's type. jellyfin loses 12 true edges this way: GetItemById(string id) beside ILibraryManager.GetItemById(Guid), and GetImageCacheTag(item, ImageType.Primary) beside the IImageProcessor overloads. Reading the written type of an argument that is a parameter, a local or an enum member would tell these overloads apart.

## Why


## Acceptance


## Evidence

