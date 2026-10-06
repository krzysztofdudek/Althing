# 138 · C#: a type parameter does not shadow a same-named type from the repo, so T x; and (after 016) GetRequiredService<T>() bind to the type T from the repo — a false edge

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 016
**Found by:** runes-016
**Where:**
**Branch:** jarl/138-csharp-followups
**Merged:** 6a1dea0 in ../../../Runes
**CI:** none

## What
The C# extractor never treats a type parameter of a method or a class as shadowing a same-named type from the repo. When a type T is in a namespace in scope, 'T x;' and — since fix 016 — the type arguments of a generic method (GetRequiredService<T>()) give an edge to that type. The planner assumed such protection exists.

## Why
A false edge blocks yg check and cannot sensibly be declared; 016 widens the places where it shows up.

## Acceptance
A type parameter in scope (of a method, class, interface, delegate) shadows a same-named type from the repo in all type positions; a silence case in the relation catalogue red before, green after.

## Changelog
- Fixed: in C#, a bare name that equals a type parameter in scope (`T x;`, `sp.GetRequiredService<T>()` inside `T Resolve<T>()`, `Entity` inside `class Repository<Entity>`) names that type parameter in every type position, so it no longer binds a same-named type of the repository; the declaration's own attributes, the code outside it and a name with type arguments still bind the type.

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1649, pass 1649, fail 0, catalogue 501 cases, dist/ is fresh; npm run coverage: tests 1649, pass 1649, fail 0, all files 98.78 / 94.07 / 98.76, exit 0; merge 6a1dea0 (catalogue count conflict resolved to 492 + 9 = 501; rebuilt dist matches)

