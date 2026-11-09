# 295 · Runes: C# uses and S:: rewrites read using-alias targets from the compilation-unit root while the directive line reads the nearer namespace body

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2055-rsvv
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 185
**Found by:** fresh-reviewer
**Where:**
**Branch:** jarl/295-csharp-alias-scope
**Merged:** 86bd33b in ../../../Runes
**CI:** red

## What
After 185 the directive line of a using alias reads its target in the namespace body that holds it, but uses of the alias and S:: rewrites still read the alias map from the compilation-unit root. Three symptoms: (1) namespace App; using O = Shared.Order; class C { O x; } binds the nearer App.Shared.Order on the directive line and the global Shared.Order on the use line, a false edge already on the base. (2) S::Gen<int> under namespace App; using S = Core; binds Core.Gen instead of App.Core.Gen. (3) The Rule of the catalogue case csharp-alias-member-codefinition-edge still calls a compilation-unit alias I and the member App.I ambiguous, although App.I wins by lookup order (CS0576 is for an alias and a member in the same body).

## Why
One alias must bind to one type on every line of a file; today the directive and its uses disagree and the use line can add an edge to a type the compiler does not bind.

## Acceptance
- Test: namespace App; using O = Shared.Order; class C { O x; } with both App.Shared.Order and Shared.Order in the repository gives the edge to App.Shared.Order only, on the directive line and on the use line; red before, green after.
- Test: S::Gen<int> under namespace App; using S = Core; with App.Core.Gen present gives the edge to App.Core.Gen, not Core.Gen; red before, green after.
- The case csharp-alias-member-codefinition-edge expects the nearer App.I edge and its Rule states lookup order instead of ambiguity; the catalogue stays consistent with the tests.

## Changelog
- Fixed: a using alias is read the same way on its directive and on every use of it (and in an S:: rewrite): in the namespace body that holds the directive, so a use no longer binds a type of the compilation-unit root that the nearer namespace hides, and a member of a nearer namespace wins over an alias of the compilation unit.

## Evidence

From the second review of 185 (rev-runes-185-opus2), fold into this issue: (1) the alias map covers the whole file and the last directive wins, so two namespace blocks declaring the same alias name bind the first block's use to the wrong type (csharp.mts:501); (2) the type arguments of an alias target are read like an ordinary use, with the file's namespace and the using directives, so they can bind a type C# would not (:1027-1031); (3) a using static target is read from the root only even inside a namespace body (false edge), and using static Repo<Order> gives no edge at all (:482-486, :1546-1548); (4) namespace App; using M = Models; with a namespace App.Models and a global type Models gives line 2 an edge to Models that C# never names (csharp.mts:1552); (5) the Rules' claim of no false edge is too broad for usings in an outer namespace block (namespace A { using Shop.Core; namespace B { using O = Order; } } binds the global Order where C# binds Shop.Core.Order); (6) comments at csharp.mts:919 and :1157 are wrong: S::A.B in a tuple element and S::A.Gen<T> as an attribute stay silent, with no catalogue case; (7) the catalogue cites keep section 13.4 numbering (13 is Statements in the standard) while the Rules cite 14.5.2: renumber the cites catalogue-wide.
- **ran (history):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (before the fix) · **saw:** failed: csharp-using-alias-use-in-namespace-edge, csharp-alias-colon-colon-in-namespace-edge, csharp-alias-member-codefinition-edge
- **ran (history):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/csharp-parity.test.mjs (after the fix); npm run check; npm run coverage · **saw:** 141 pass, 0 fail; check green with 1910 tests and dist fresh; coverage all files 99.05 lines, 94.73 branches, 99.13 functions

open: evidence items 1-6 of the second review (same alias name in two blocks, type arguments of an alias target, using static in a namespace body, a namespace and a global type named alike, outer-block usings, the two comments) are not done
- **ran (history):** node --test csharp-name-resolution-matrix.test.mjs with csharp-alias-two-blocks-global-type-edge, before the fix · **saw:** 1 fail: csharp-alias-two-blocks-global-type-edge (the use in block A bound the global O)
- **ran (history):** same file after the fix; npm run check; npm run coverage · **saw:** 141 pass 0 fail; check 1912 pass, dist fresh; coverage thresholds met
- **ran (history):** node --test csharp-name-resolution-matrix.test.mjs with csharp-alias-separate-block-same-name-edge and csharp-alias-separate-dotted-block-edge, before the fix · **saw:** 2 fail (pass 137, fail 2): the use in the separate block bound X.Order instead of the global O
- **ran (history):** same file after the fix, with csharp-global-alias-beside-block-alias-edge; npm run check; npm run coverage · **saw:** 140 pass 0 fail; check 1915 pass, dist fresh; coverage thresholds met
- **ran (history):** nice -n 15 timeout 1800 npm run check · **saw:** tests 1946, pass 1946, fail 0; dist/ is fresh (on 86bd33b, the merge of 295 over the merge of 471 at 8b975bf; catalogue 596)

CI on 86bd33b (the merge tip carrying 471 and 295) was red on the Windows Node 22 job only, from the property test's tool-name collision on seed 1328475926, unrelated to either issue; filed and fixed as 478; every later tip containing both, from d0af17c on, is green

