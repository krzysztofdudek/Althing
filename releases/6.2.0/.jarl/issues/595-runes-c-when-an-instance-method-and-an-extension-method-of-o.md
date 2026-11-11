# 595 · Runes, C#: when an instance method and an extension method of one name both fit a call by its count…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1429-okob
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-494-opus
**Where:** the review of 493, 494, 497, 498
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Runes, C#: when an instance method and an extension method of one name both fit a call by its counts, issue 498 takes the instance method, and the extension edge is lost even where the file writes the argument's type. jellyfin loses 12 true edges this way: GetItemById(string id) beside ILibraryManager.GetItemById(Guid), and GetImageCacheTag(item, ImageType.Primary) beside the IImageProcessor overloads. Reading the written type of an argument that is a parameter, a local or an enum member would tell these overloads apart.

## Why


## Acceptance


[test] When an instance method and an extension method of one name both fit a call by its counts, but the written type of an argument (a parameter, a local or an enum member) fits only the extension, the extension edge is kept: GetItemById(string id) beside ILibraryManager.GetItemById(Guid), and GetImageCacheTag(item, ImageType.Primary) beside the IImageProcessor overloads are catalogue cases, red before and green after · by: npm run check

## Evidence

