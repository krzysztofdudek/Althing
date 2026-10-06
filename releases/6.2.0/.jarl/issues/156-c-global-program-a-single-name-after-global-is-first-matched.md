# 156 · C#: global::Program (a single name after global::) is first matched against the enclosing namespaces

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 016, 075
**Found by:** runes-016
**Where:**
**Branch:** jarl/138-csharp-followups
**Merged:** 6a1dea0 in ../../../Runes
**CI:** none

## What
The reference global::Program, a name in the global namespace, is resolved like a plain Program: first in the enclosing namespaces. Behaviour from before 016/075.

## Why
global:: by definition skips the enclosing namespaces; binding to a type from a namespace gives a wrong edge or silence.

## Acceptance
global::X binds only to the type X in the global namespace; a catalogue case with a same-named type in the enclosing namespace.

## Changelog
- Fixed: in C#, `global::` followed by a single name (`global::Settings`, `global::Box<T>`, `WebApplicationFactory<global::Program>`) binds only a type of the global namespace, the implicit `Program` of top-level statements included, instead of first a same-named type of an enclosing namespace.

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1649, pass 1649, fail 0, catalogue 501 cases, dist/ is fresh; npm run coverage: tests 1649, pass 1649, fail 0, all files 98.78 / 94.07 / 98.76, exit 0; merge 6a1dea0 (catalogue count conflict resolved to 492 + 9 = 501; rebuilt dist matches)

