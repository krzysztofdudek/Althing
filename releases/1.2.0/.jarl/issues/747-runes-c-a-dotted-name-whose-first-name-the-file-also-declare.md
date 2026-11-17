# 747 · Runes, C#: a dotted name whose first name the file also declares as a value of that type gives no edge (the Color Color rule in expressions)

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-grqq
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708, 744
**Branch:** jarl/743-csharp-patterns
**Worker:** w-743-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:00

## What
Runes, C#: a dotted name in a plain expression whose first name the file also declares as a value of that name's type (C#'s Color Color rule: var Status = Factory.Make(); return Status == Status.Active;, or Status = Status.Done; beside a property public Status Status { get; set; }) gives no edge to the type Status at 8d31e57, 7693a11 and f396769, where C# binds the static member through the type; with a var local or an implicitly typed lambda parameter the file has no edge to Status at all. 744 made the pattern forms read the type; the member-access reading of expressions still takes any declared value as no type.

Moved from issue 747 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] Status == Status.Active and Status = Status.Done, where the file also declares a value named Status of type Status (a property, a field, a var local, an implicitly typed lambda parameter), give the edge to the type Status, as C# binds the static member through the type, in catalogue cases red at v1.1.0 and green after; a value named Status whose written type is not Status still gives no edge, and every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: a member compared with or assigned to a value of the type of its own name (`Status == Status.Active`, `Status = Status.Done` beside a property, a field, a typed local or parameter, a `var` local or an implicitly typed lambda parameter named `Status`) gives the edge to the type `Status`, as C# reads the static member through the type; elsewhere (`Status.ToString()`) such a value still hides the type. jellyfin gains 35 references and eShop 14, so a consumer can see new findings, mostly on lines of files that already depend on the type.

## Evidence

### Proof

- **ran (line 8e5eee7f88c6):** node --test --test-name-pattern=color-color test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on the source at 0995b7c (v1.1.0 plus 743 and 750, neither of which touches the member-access reading) with the two new cases · **saw:** red: case csharp-color-color-receiver-edge: expected edge src/web/Prop.cs:5->model not emitted (got src/web/Prop.cs:4->model, src/web/Field.cs:4->model); csharp-color-color-receiver-other-type-silence passes
- **ran (line 8e5eee7f88c6):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractors/csharp.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs, at 42749f4 · **saw:** green: tests 445, pass 445, fail 0; property, qualified field, var local and lambda parameter give the edge, Status.ToString() and the values of another written type give none, csharp-local-shadows-type-name-silence and the lambda shadow unit test unchanged
- **ran (line 8e5eee7f88c6):** npm run check, at 659e2c1 (the clean branch tip) · **saw:** green: tests 2758, pass 2755, fail 0, skipped 3; dist/ is fresh

### Notes

Assumed: the type is read only where the member access is compared with (==, !=) or assigned to the bare value itself, for a value of a written type of its own name as for a var local or a lambda parameter. Read anywhere, the typed form gave 114 new corpus references, among them instance members C# reads through the value (Season.ProviderIds, DeviceProfile.SubtitleProfiles, User.Id, JellyfinDbContext.Dispose(), TranscodeSeekInfo.ToString()) and Video3DFormat.HasValue on a nullable; the narrow form gives 49, all enum members read through the type. It also keeps the existing case csharp-local-shadows-type-name-silence (var OrderStatus = o; OrderStatus.ToString()) and the lambda shadow unit test, which a var reading everywhere breaks. A written Status? is not read so, since of a value type it is Nullable<Status>. Lost by this choice: Status.Active beside such a value in a return, an argument, an attribute argument or a tuple (about 65 jellyfin references), where the file already has the edge on the value's declaration.

