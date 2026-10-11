# 295 · Runes: C# uses and S:: rewrites read using-alias targets from the compilation-unit root while the directive line reads the nearer namespace body

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 185
**Found by:** fresh-reviewer
**Where:**

## What
After 185 the directive line of a using alias reads its target in the namespace body that holds it, but uses of the alias and S:: rewrites still read the alias map from the compilation-unit root. Three symptoms: (1) namespace App; using O = Shared.Order; class C { O x; } binds the nearer App.Shared.Order on the directive line and the global Shared.Order on the use line, a false edge already on the base. (2) S::Gen<int> under namespace App; using S = Core; binds Core.Gen instead of App.Core.Gen. (3) The Rule of the catalogue case csharp-alias-member-codefinition-edge still calls a compilation-unit alias I and the member App.I ambiguous, although App.I wins by lookup order (CS0576 is for an alias and a member in the same body).

## Why
One alias must bind to one type on every line of a file; today the directive and its uses disagree and the use line can add an edge to a type the compiler does not bind.

## Acceptance
- Test: namespace App; using O = Shared.Order; class C { O x; } with both App.Shared.Order and Shared.Order in the repository gives the edge to App.Shared.Order only, on the directive line and on the use line; red before, green after.
- Test: S::Gen<int> under namespace App; using S = Core; with App.Core.Gen present gives the edge to App.Core.Gen, not Core.Gen; red before, green after.
- The case csharp-alias-member-codefinition-edge expects the nearer App.I edge and its Rule states lookup order instead of ambiguity; the catalogue stays consistent with the tests.

## Changelog
- Fixed: a using alias is read the same way on its directive and on every use of it (and in an S:: rewrite): in the namespace body that holds the directive, so a use no longer binds a type of the compilation-unit root that the nearer namespace hides.

## Evidence

