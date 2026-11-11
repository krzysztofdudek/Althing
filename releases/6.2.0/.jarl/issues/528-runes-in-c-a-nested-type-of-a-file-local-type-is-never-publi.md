# 528 · Runes: in C#, a nested type of a file-local type is never published, and an alias-qualified name with a generic middle segment drops that segment's arity

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0526-ugkn
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**After:** 492
**Found by:** rev-runes-492-opus
**Where:** Review of 492 and 495 (2026-11-03); the 492 worker's report
**Branch:** jarl/500-csharp-lookup-levels
**Merged:** a1ef8c4239f7cb5f77e544ff52f07a48a43f977e in Runes
**Merge check:** npm run check · saw tests 2257, pass 2256, fail 0, skipped 1; dist/ is fresh

## What
A type nested inside a file type is not declared, so a use of it inside that file falls through to namespace readings and can bind a same-named type elsewhere. S::A<int>.B keeps no arity for A<int>.

## Why
A false edge in the first case, a possibly wrong target in the second.

## Acceptance
A nested type of a file type binds inside its file, and S::A<int>.B reads A with its arity, each with a case red before and green after

## Changelog
- C#: `using static T;` imports the nested types and the extension methods of `T` at the level of its directive (the compilation unit, a namespace body, or the whole project for `global using static`), so `Circle` for `T.Circle` and `s.Shout()` for an extension method of `T` now give their edges, and inside a namespace body a farther global type of the same name no longer binds; a `file` type and a type nested in one is found by its name inside its own file, in a using alias or `using static` target and after an alias qualifier too, so a public type of the same name in another file no longer gets an edge from that file. A relation pass can show new edges, and so new refusals, where a using static now imports a type or a call; a consumer that runs its own pass passes the optional `globalStatics` of each file to `buildCsharpProjectScopes` and `projectGlobalStatics` in the uses options to get the project-wide form. Two `using static` classes that each declare an extension method of one name read as no edge, as two namespaces that do already.

## Reviews
- **changes** · by rev-500-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1203-yixb
  Important (504 line 1, src/relations/extractors/csharp.mts:2170-2188 and :2194-2199): inside the file that declares a file-local type, three reference forms still bind the public type of another file, because the directive-target and the alias-qualified paths never ask isFileLocalReading: 'using H = Helper;' gives its directive line an edge (Use.cs:2->util) while the use 'H a' is now silent, 'using static Helper;' gives Use.cs:2->util, and 'S::Helper' under 'using S = App;' gives Use.cs:5->util (the attribute form [S::Foo] takes the same path). These are legal C# and the same false edge 504 names, so they belong to 504: its line 1 says a reference to the name binds no type of another file. Each needs a catalogue case. Minor (csharp.mts:324-329): the class key of an extension method can equal a namespace key when the repository holds a class Foo.Extensions and a namespace Foo.Extensions; without project files 'using Foo.Extensions;' then gives s.Bar() a false edge to the class's file (silence before the change), with project files and the reference graph it stays silent; the comment's claim holds for one compilation only, and a key shape no namespace can spell would close it. Minor: two using static targets that declare an extension method of one name for different receiver types give silence where the compiler binds one, the same conservative reading two namespaces get. Minor (528 line 1, read): 'A nested type of a file type binds inside its file, and S::A<int>.B reads A with its arity, each with a case red before and green after': the nested case is red at fa044eb and green at c201fb5; the arity case is green at both, a pin of what 495 already fixed. Minor: c201fb5 carries two issues in one commit. Met: 500 lines 1 to 5 re-run, the five new fields (globalStatics, statics, projectGlobalStatics, scope.staticDecls, fileLocalTypes) are in docs/api.md, no consumer passes them yet, rev 19 and the catalogue count 727 are raised, dist is fresh, no test weakened. Attacked without a fault: using static of a generic type, of a nested type, of an enum, a global:: target, a relative target in a namespace body, a sibling block, a dotted name through the import, a file-local type against a namespace of its name, a nested type in a file-local partial, generic arity, attributes, typeof, new, is, cast, array, nullable, tuple, constraint, references written inside a file-local type.
  outside the issue, filed as 562: Yggdrasil's facts cache copies the C# extract field by field (source/cli/src/relations/facts-cache.ts, serializeCsharp and deserializeCsharp), so the adoption of Runes 1.1.0 (issue 530) must carry scope.staticDecls, scope.globalStatics and fileLocalTypes through it, beside passing globalStatics and projectGlobalStatics; the note on 530 names only the two inputs
- **approve** · by rev-500b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1246-xzje
  Round 1's three requests are met at 69c950a. (1) 504, Important, closed: the directive-target path and the alias-qualified paths now go through pushHints, which cuts a group at the first reading that names a file-local type (src/relations/extractors/csharp.mts:1990-2000, :2182, :2194, :2206-2207); the four new catalogue cases are red at 4d87dbd (Use.cs:2->util twice, Use.cs:5->util, Use.cs:4->util) and green at 69c950a. (2) 500, Minor, closed: the class key of an extension method is <ns>.<Class>#<name>() (csharp.mts:324-329, :503-504, :2164, :2170), its case is red at def3891 (Use.cs:4->cls) and green at 69c950a. Readers of the key: the resolver's only test of an extension key is endsWith('()') (src/relations/resolver.mts:318), which the new shape keeps; the symbol table no longer records the class as a namespace, since the key has no dot after the class (src/relations/symbol-table.mts:31-33), which is more correct than before; Grain and Yggdrasil parse no C# extension key, they pass declarations to the table and hints to the resolver; docs/api.md:83 shows the new shape. (3) the limit of two using static classes with one extension name is written in the changelog entry of the issue. 528 line 1, read: 'A nested type of a file type binds inside its file, and S::A<int>.B reads A with its arity, each with a case red before and green after': held as in round 1, the nested case red before and green after, the arity case a pin of what 495 fixed; own probe S::Helper.Inner for a type nested in a file-local type is silent. Minor (504, csharp.mts:2046-2058, from c201fb5, not from this round): a global using alias of another file whose target is a public type (global using H = App.Helper;) gives no edge for H in a file that declares a file-local App.Helper, where the compiler binds the alias target in the file of its directive and so names the public type: a true edge of the base is lost (Use.cs:3->util expected, silence found), a rare shape and a silence, fit for the known limits or a later issue. Minor: the rev stays 19 although the key shape changed after it was raised; fine while nothing of the branch is released. Tried against the guard: using static of a global-namespace class and of a global:: target (edges kept), a class and a namespace both named Foo with a plain using (the edge found is the true one, through the global namespace key), an alias target with a nearer type of an inner namespace (binds), an alias target in a file without the file-local type (binds). Full suite on an extraction of 69c950a: tests 2209, pass 2208, fail 0, skipped 1; dist equals the committed one; corpus gate passed. Not checked: the heavy corpus tier, the C# compiler oracle (no dotnet here), check:dist itself (replaced by a diff of the rebuilt dist).

## Evidence

### Proof

- **ran (line e70d885f2ca5):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** case csharp-file-local-nested-type-in-own-file-silence red at fa044eb (unexpected edge Use.cs:4->util), green at c201fb5; case csharp-alias-colon-colon-generic-middle-arity-edge (S::A<int>.B -> A`1, Use.cs:3->lib) already green at fa044eb, so the arity half only gains its pinning case; 2203 tests, 2202 pass, 0 fail, dist/ is fresh

### Notes

Checked on 2026-11-09 against Runes release/1.1.0: the arity of S::A<int>.B looks fixed by 495, but no test names that case. The nested type of a file-local type is still not published.

Assumed: the arity half of 528 was already fixed by 495, so S::A<int>.B only gains its pinning case (csharp-alias-colon-colon-generic-middle-arity-edge, green before and after); the nested-type half is fixed with 504 by the same mechanism. Line 1 of 528 is tagged [read] in the lease, so the row I recorded for it is extra.

