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

## Changelog
- C#: an extension method keeps a call that an instance method of the same counts cannot take by the written type of an argument: `manager.GetItemById(id)` with `string id` beside `GetItemById(Guid)`, and an enum member (`ImageType.Primary`) beside overloads that take none. A consumer's graph can show new extension-method edges; the new keys `enum:<key>` and `converts:<key>`, and the longer `methods:` records, go to the symbol table as before.

## Evidence

### Proof

- **ran (line d65cce4eeca7):** node --test --test-name-pattern=<case id> test/relations/extractors/csharp-name-resolution-matrix.test.mjs for csharp-extension-argument-type-beside-instance-method-edge and csharp-extension-enum-argument-beside-instance-overloads-edge, on 447cc91 with the new cases, then on a9912e8 · **saw:** before: both fail (expected edge src/web/Playlists.cs:6->ext not emitted); after: both pass; jellyfin gets 9 references back, each explained

### Notes

Assumed: an instance method is refused only where the written types say for certain that a parameter cannot take its argument; a literal, a call result, a var local, a property of another value, a named, ref, out, in or dynamic argument, and a parameter whose type is an alias or declared by two imported namespaces say nothing. A framework type refuses a predefined type or an enum value only when it is one of Guid, DateTime, DateTimeOffset, TimeSpan, DateOnly, TimeOnly, CancellationToken. jellyfin gets back 9 of the 12 lost references; the other 3 pass a property of another value (mediaSource.Id, dto.ProgramId).

