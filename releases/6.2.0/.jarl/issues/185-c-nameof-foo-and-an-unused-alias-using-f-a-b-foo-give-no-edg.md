# 185 · C#: nameof(Foo) and an unused alias using F = A.B.Foo give no edge (while using static A.B.Helpers does) — to be decided whether this is a dependency

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**Found by:** csharp-check
**Where:**
**Branch:** jarl/177-csharp-forms
**Merged:** 2cebb0c9732aa2ee06a69304e00529e807c92421 in ../../../Runes
**CI:** pending

## What
Checked at the owner's request (session scratchpad patch-611/csharp-simple-names): a bare type name after using gives an edge in all the basic shapes since 6.1.0. Two exceptions: nameof(Foo) is deliberately silent (catalogue case csharp-nameof-no-edge-silence), although the compiler binds the name and removing the type breaks the build; an unused alias using F = A.B.Foo; gives no edge, while using static A.B.Helpers; does, although the compiler resolves both directives.

## Why
Inconsistency: two forms that the compiler binds to a type are silent.

## Acceptance
A decision recorded in Runes (nameof and the alias directive alone: a dependency or not, the same for the alias and using static); catalogue cases consistent with the decision.

## Changelog
- Added: a using alias to a type, such as `using F = A.B.Foo;`, `using H = global::A.B.Foo;` or the closed generic `using R = A.B.Repo<A.B.Foo>;` (the generic type and each type argument), gives its edge whether or not any line uses the alias, as `using static` already does, and its target is read in the namespace body that holds the directive (below `namespace App;` it reads `App.A.B.Foo` before `A.B.Foo`; the usings of an outer compilation unit take no part, a deliberate silence); `nameof(Foo)` stays silent by design. An unused alias to a type of the repository adds an edge, so a graph that was green may turn red after the upgrade.

## Evidence


- **ran:** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs · **saw:** before the extractor change: csharp-using-alias-unused-type-edge and csharp-global-alias-program-unused-edge failed (no edge at the directive); after: both pass, and csharp-nameof-no-edge-silence still passes
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** pass 1743, fail 0; dist/ is fresh
- **ran:** nice -n 15 timeout 1800 npm run coverage · **saw:** all files: lines 98.81 (threshold 98), branches 94.45 (threshold 92), functions 98.80 (threshold 97)
- **ran:** nice -n 15 timeout 300 node --test on csharp-name-resolution-matrix, csharp and catalogue tests (commit ca2a7b7 on the 177 commit, the cases and tests added, the extractor held at the previous commit) · **saw:** tests 217, pass 208, fail 9: csharp-using-alias-unused-type-edge, csharp-using-alias-target-in-namespace-edge, csharp-global-alias-program-unused-edge, csharp-using-alias, csharp-global-using-alias, csharp-global-alias-per-project-edge, csharp-alias-member-codefinition-edge, csharp-global-alias-cross-project-collision-edge and the attribute-after-alias group test
- **ran:** the same command with the extractor change · **saw:** tests 217, pass 217, fail 0; nice -n 15 npm test on the commit: pass 1743, fail 0

second round: checked against C# spec 14.6.2 (14.5.2 for a global alias): a using alias target is resolved in the immediately containing compilation unit or namespace body, unaffected by other using directives, so inside namespace App it reads App.A.B.Foo before A.B.Foo; the extractor now reads it that way (new descriptor kind, new case csharp-using-alias-target-in-namespace-edge) and the Rule of csharp-using-alias says so; an alias to a namespace still emits the namespace name as a type key, which binds only a type of that exact full name (accepted); catalogue 3 new cases, 2 renames

docs: CHANGELOG Before you upgrade: an unused using alias to a type of the repository (using F = A.B.Foo; with F never used) now gives an edge, as do the 177 forms; a consumer graph that was green can turn red
- **ran:** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs on the old dist with the two new cases, then after the fix · **saw:** before: csharp-using-alias-global-dotted-edge failed (no edge, the key global::Shop.Core.Helpers never binds) and csharp-using-alias-generic-target-edge failed (only the edge to Order, none to Repo); after: tests 113, pass 113, fail 0
- **ran:** nice -n 15 timeout 1800 npm run check and npm run coverage on the round-three commit (further commit after f8285fd) · **saw:** pass 1747, fail 0, dist/ fresh; coverage lines 98.81, branches 94.41, functions 98.81 (thresholds 98/92/97). Catalogue 531 to 533 (test name, assertion, first-line comment). Extractor rev not bumped again: the change is relative to the unpublished 185 state, no published rev carries the old output. Spec reference now 14.5.2 in source, dist and cases; Rules call the silence on outer compilation-unit usings a deliberate conservatism; stale comments (member-access type, generic attribute behind an alias) fixed in the same commit

follow-up for the jarl to file (found by the round-two reviewer, already on the base): uses and S:: rewrites still read alias targets from the root, so in one file `namespace App; using O = Shared.Order; class C { O x; }` binds the global Shared.Order on the use line (a false edge) while the directive line binds the nearer App.Shared.Order; direction: read the alias map the way the directive now reads it, in the namespace body that holds the directive. Related conservative silence: the Rule of csharp-alias-member-codefinition-edge keeps the claim that a compilation-unit alias I and the namespace member App.I are ambiguous, while by lookup order App.I wins (CS0576 is for an alias and a member in the same body)

follow-up: alias targets read from the root on uses and S:: rewrites, and the ambiguity Rule of csharp-alias-member-codefinition-edge, are issue 295.
- **ran:** npm run check · **saw:** tests 1795, pass 1795, fail 0; dist/ is fresh; npm run coverage: lines 98.98, branches 94.68, functions 99.06, merge 2cebb0c

