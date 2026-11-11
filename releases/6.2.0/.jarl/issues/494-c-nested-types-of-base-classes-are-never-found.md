# 494 · C#: nested types of base classes are never found

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vwgr
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolver.mts, Runes/src/relations/symbol-table.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-basenest
**Where:** src/relations/extractors/csharp.mts:1756
**Branch:** jarl/494-csharp-base-classes
**Worker:** w-494-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 12:57

## What
Claim: No lookup reads the base list, so Options inside a class derived from a base that nests Options binds App.Web.Options of another node, and Derived.Options finds nothing. C# reads the nested types of base classes as members (spec 7.6.1). Pre-existing in v1.0.0.

probes/csharp p03 (MyHandler.cs:4->cfg, expected core), p32 (Use.cs:3->core missing); same on v1.0.0

## Why


## Acceptance
- [test] The base list each type declares, from every part of a partial type, is recorded with the file's extraction, and a test reads it for a class, a partial class and a nested class · by: npm run check
- [test] A simple name inside a class whose base class is declared in the repository reads the nested types of that base, and of its bases to any depth in the repository, after the class's own nested types and before any namespace, alias or using (C# spec §7.6.1), with the audit's probe p03 as a catalogue case (MyHandler.cs:4 -> core, not cfg), red before and green after · by: npm run check
- [test] A dotted name through a derived type (Derived.Options) binds the nested type its base declares, with p32 as a catalogue case (Use.cs:3 -> core), red before and green after · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- C#: a name inside a class reads the nested types of its base classes, so `Options` in `class MyHandler : HandlerBase` names `HandlerBase.Options` before a namespace's `Options`, and `Derived.Options` names the type the base of `Derived` nests. A consumer's graph can show an edge move to the base class's node. A base class outside the repository is not followed.

## Reviews
- **changes** · by rev-494-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1429-ikrh
  changes. I re-ran all 17 lines and each holds (evidence rows recorded): npm run check gives 2308 tests, 0 failing, and a fresh dist/; coverage is 99.12/95.50/99.09; the 16 new red cases fail on a1ef8c4 and pass on 68bf674; the corpus gate and the jellyfin and eShop verify pass; all 212 moved golden lines are explained, and a1ef8c4 shows exactly the 21 lines credited to the release branch. No list of framework classes was invented, so ruling outside-base-members-stay-a-known-limit holds. The worktree holds no stray file and lost no tracked one.

  Important 1 · src/relations/resolver.mts:544 with src/relations/extractors/csharp.mts:1406. The new guards end a group by answering `ambiguous` from `classify`. The public comment at resolver.mts:30 still defines `ambiguous` as a key with two or more definitions, and docs/api.md tells consumers they need no change. Grain counts every `ambiguous` group (Grain plugins/grain/engine/relations.mjs:403-409) and prints the count as "references left unresolved because the name they use is declared in more than one directory" (propose-report.mjs:82-85, measure.mjs:319). I measured it with the corpus pipeline over the pinned clones. eShop goes from 7 such answers to 993 (815 memberOnly, 141 instance, 30 orMember). jellyfin goes from 179 to 14,530 (10,520 memberOnly, 3,497 instance, 334 orMember). The memberOnly guard is emitted for every static call through a type written inside a type, so most of these groups exist only to be silenced. Once Grain takes Runes 1.1.0, its report and its measure give a false reason for about 14,000 jellyfin references. The fix must let a consumer tell a guard's stop from a real ambiguity, or change Grain in the same release, and the Classification comment and docs/api.md must say which.

  Minor 2 · src/relations/extractors/csharp-resolve.mts:130-140 (hasMethod) and csharp.mts:1326 (declaredTypes). Four shapes lose a true extension edge that a1ef8c4 gave, each shown by a probe of mine: a class receiver whose interface method is implemented explicitly; a default interface method on a class receiver; a protected method called from an unrelated class; two sibling for loops declaring x as Order and as Customer. In the last one a for initializer is scoped to the whole block, both types count, and the second loop's call is silenced. The first two follow the line's words "an interface of it", against the section the line cites: member lookup on a class type does not read the interfaces the class implements. All four are rare.

  Minor 3 · corpus. Counts cannot tell overloads apart, so 12 of the 176 removed jellyfin lines were true edges. Eight are GetItemById with a string id: PlaylistManager.cs:278 and 316, LiveTvManager.cs:179 and 1085, LiveTvMediaSourceProvider.cs:270, CleanDatabaseScheduledTask.cs:73, LiveTvDtoService.cs:472 and 538. Four are GetImageCacheTag with an ImageType: SearchController.cs:164, 235 and 252, LiveTvDtoService.cs:393. The other 164 removals are false edges gone. corpus/explained.md states the limit honestly. The worker's summary put it in the wrong place: 18 of the 22 ImageProcessorExtensions and BaseItemExtensions lines are correct removals, and most losses sit in the 154 GetItemById lines.

  Minor 4 · csharp.mts:685-689 and 1711. On jellyfin the C# declarations grow from 2,921 keys (167 KB) to 31,310 keys (14.6 MB); on eShop from 45 KB to 977 KB. member-type records take 9.9 MB and base records 2.6 MB, because each record carries its whole JSON reading list, about 2.5 KB. They land in Yggdrasil's fact cache and in Grain's model.json, where compactDecls keeps every key. Extraction of jellyfin went from 21.3 s to 31.6 s, because declarations() walks each file once more for its bases.

  Minor 5 · commit 63e9cd8 has issue 493 in its subject and also carries the 498 count refinement and the corpus regeneration for all four issues. Its body says so.

  Not run: the dotnet oracle, because dotnet is not installed here. CI runs it with --strict.

  What I tried against the guards: generic bases; a member of an outer type declared in another part; the hiding order between nested types and members across two bases; type positions and typeof; an interface default body; receivers written with ?., ! and an indexer; base cycles; an attribute class with a generic repository base; alias-qualified and nested attributes; explicit and default interface methods; a protected method; sibling scopes; this.field declared in another part.
  outside the issue, filed as 594: Runes, C#: this._config.Get(key) keeps an extension edge when _config is declared in another part of the partial class, while _config.Get(key) on the same field is silenced by issue 493's member reading. The receiver type of this.<field> is read only from the calling file. Probe: IConfig declares Get(string) in node core, an extension Get(this IConfig, string) sits in node ext, the field is in Page.cs and the call in Page.Render.cs; the this. form gives the extension edge on a1ef8c4 and on 68bf674.
  outside the issue, filed as 595: Runes, C#: when an instance method and an extension method of one name both fit a call by its counts, issue 498 takes the instance method, and the extension edge is lost even where the file writes the argument's type. jellyfin loses 12 true edges this way: GetItemById(string id) beside ILibraryManager.GetItemById(Guid), and GetImageCacheTag(item, ImageType.Primary) beside the IImageProcessor overloads. Reading the written type of an argument that is a parameter, a local or an enum member would tell these overloads apart.

## Evidence

### Proof

- **ran (line 87f6fd00893a):** npm run check, on the branch tip 68bf674 · **saw:** exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The new unit tests read the recorded base list for a class, a partial class in three files and a nested class (csharp-base-classes.test.mjs). No run before the change: the record did not exist.
- **ran (line e9989e38e146):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-base-class-nested-type-edge DIFFERS (MyHandler.cs:4 -> cfg) and csharp-base-class-nested-type-deep-partial-edge DIFFERS. After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. Both cases pass, with the own-nested-first and interface cases.
- **ran (line e5afffcbcdf5):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-base-class-nested-type-through-derived-name-edge DIFFERS (Use.cs:3 gives nothing). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The case passes (Use.cs:3 -> core).
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus, and node scripts/corpus.mjs verify --tier all --only jellyfin,eShop, on the branch tip 68bf674 · **saw:** corpus gate: passed (25 repositories, CleanArchitecture 452 edges, 0 added, 0 removed; go and dotnet oracles SKIPPED, not installed). corpus verify: passed (jellyfin 32640 edges and eShop 2017 edges, 0 added, 0 removed) after the jellyfin golden was regenerated with 212 explained lines: 15 added and 176 removed by this branch, 21 added that the release branch already gave.
- **ran (line 87f6fd00893a, e9989e38e146, e5afffcbcdf5, d0bad6f909cb):** npm ci && npm run check in a clean extraction of 68bf674 · **saw:** tests 2308, pass 2307, fail 0, skipped 1; the rebuilt dist/ is identical to the committed one; csharp-base-classes.test.mjs reads the recorded bases of a class, of a partial class over three files and of a nested class, and passes
- **ran (line 87f6fd00893a, e9989e38e146, e5afffcbcdf5, d0bad6f909cb):** npm ci && npm run check in a clean extraction of 68bf674; the branch's new catalogue cases and C# matrix run on a clean extraction of a1ef8c4; own probes through the case runner on both trees · **saw:** a1ef8c4: csharp-base-class-nested-type-edge (MyHandler.cs:4 -> cfg) and csharp-base-class-nested-type-deep-partial-edge fail; 68bf674 passes both and the own-first and interface cases. Own probes pass on 68bf674, fail on a1ef8c4: a nested type of a generic base HandlerBase<T>; a nested type of a nearer base over a namespace type; base cycles (A : B, B : A, FooAttribute : FooAttribute, IX : IY, IY : IX) end
- **ran (line 87f6fd00893a, e9989e38e146, e5afffcbcdf5, d0bad6f909cb):** npm ci && npm run check in a clean extraction of 68bf674; the branch's new catalogue cases and C# matrix run on a clean extraction of a1ef8c4; own probes through the case runner on both trees · **saw:** a1ef8c4: csharp-base-class-nested-type-through-derived-name-edge fails (Use.cs:3 gives nothing); 68bf674 passes (Use.cs:3 -> core)
- **ran (line 87f6fd00893a, e9989e38e146, e5afffcbcdf5, d0bad6f909cb):** RUNES_CORPUS_DIR=<a folder linking the shared cache's clones> npm run corpus, and node scripts/corpus.mjs verify --tier all --only jellyfin,eShop, on 68bf674; the jellyfin verify again on a1ef8c4; every moved golden line matched against the branch's explanation entries · **saw:** gate: passed, 25 repositories (go and dotnet oracles skipped, not installed). verify: passed, jellyfin 32640 edges and eShop 2017, 0 added, 0 removed. a1ef8c4: jellyfin 21 unexplained added lines, exactly the 21 the explanation gives to the release branch. All 36 added and 176 removed golden lines have a matching entry

### Notes

Ruling outside-base-members-stay-a-known-limit (by owner): A member inherited from a base class outside the repository (ASP.NET Core's ControllerBase.User and the like) keeps today's reading in Runes 1.1.0: a same-named repository type still gets the edge, and the changelog and docs state it as a known limit. The lines of 493, 494 and 498 that ask for the outside-base case are dropped; their in-repository lines stand. · the owner's words: "Krzysztof, 2026-11-11 (translated from Polish): "3""

Assumed: a base is read with the usings and aliases of the file that declares it, because a declaration is extracted without the project's scope. A base class that file reaches only through a project-wide global using of another file, an MSBuild Using item or a project-wide alias is not followed, so the reading stays what it was. Following it needs the project scope at declaration time, which is a change in both consumers.

Assumed: the record travels as declared keys (base:<type key>, a tab, a JSON value; interface:<type key>), listed by a new SymbolTable.valuesOf, so a consumer that passes every declared key to declare() needs no change. A consumer that counts or lists declared keys now sees these markers too, as it sees internal:<key> today.

