# 686 · Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one no…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0009-llpz
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-530-opus
**Where:** the review of 475, 530, 536, 562
**Branch:** jarl/686-csharp-speed
**Worker:** w-686-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Runes: the C# resolution of 1.1.0 about doubles yg check on C# repositories. On one machine, one node per directory of .cs files, yg check --no-approve --full: eShop @913acea warm 7.8 s with release/6.2.0 (Runes 1.0.0) against 14.4 s with jarl/530-runes-110 (Runes 1.1.0), cold 9.0 against 16.7 s; jellyfin @305a964 warm 58 s against 116 s, cold 76 against 144 s. A CPU profile of the eShop run puts 11.3 of its 14.7 s under resolver.mjs hintFiles, with csharpKeys (4.8 s self) and symbol-table defCount (2.6 s self) on top; Grain's export of eShop on the same Runes takes 17 s. Found in the review of 475, 530, 536, 562.

## Why


## Acceptance


- [test] The hot paths named by the profile (hintFiles, csharpKeys, the symbol table's defCount) have a test that bounds their work on a generated project of many C# files, red before and green after · by: npm run check
- [compare] yg check on eShop and jellyfin with Runes after the change takes no more than 1.25 times its time with Runes 1.0.0, warm and cold, measured on one machine and written in the evidence, with the same edges as before the change · by: npm run corpus

## Changelog
- Resolving C# references takes a fraction of the time on repositories with many files and many using directives; the edges found are the same.

## Reviews
- **changes** · by rev-686-opus (fresh) · 2026-11-12 · model claude-opus-5-5
  Important (a kept reading goes stale, edges are lost): src/relations/resolver.mts:328-332 keeps every reading worked out at csharpKeysDepth 1, on the ground that only a reading nested in another can meet a base list still being bound. But the type lookup also binds base lists on its own: attributeClass, hasMethod, simpleName, memberTypes, argOf and cannotTake call the bind callback of resolver.mts:433-437 directly, outside any reading. A reading worked out inside such a binding is at depth 1 while the type's bases are still the empty memo entry set at src/relations/extractors/csharp-resolve.mts:111, and that partial answer is then kept for every later reference. Repro, legal C# in three projects: Lib declares namespace N; public class TBase { public class Inner { } } and public class T : TBase { }; Mid references Lib and declares public class Outer : T { }; App references Mid and Lib, declares its own public class T : Outer.Inner { } (a type of its own compilation, warning CS0436) and public class Use { Outer.Inner f; }, plus one file that reaches T's bases outside a reading. Each of three triggers works: an attribute [T] public class A { }; a call T t; void M() { t.Run(); } with an extension Run(this TBase t) in Lib; or a member lookup public class A : T { void M() { Inner.Go(); } }. With App's files declared before Lib's, c5124ca gives App/T.cs:2 -> Lib/TBase.cs and App/Use.cs:3 -> Lib/TBase.cs, and eb99977 gives neither. In the reversed order both agree. Declaring the files in two halves around a resolution shows the same two losses and nothing else. I tried one remedy in a scratch copy, not in the branch: count the lookup's bind and declared callbacks as nesting (csharpKeysDepth++ and -- around both at resolver.mts:433-437). With it all three cases and the split runs match c5124ca, so do 180 random repositories, the bound test still passes, and yg check on eShop takes 4.0 s cold and 1.7 to 2.6 s warm with identical edges. The three cases want catalogue entries. What held, identical to c5124ca: 420 runs of random multi-project repositories over three file orders (partial classes, nested types with bases, dotted and generic bases, aliases, global usings, using static, attributes, method calls, extension methods), and targeted cases: a partial class whose base sits in one part; global usings and aliases reaching a nested type through a base; two file types of one name with different bases; one nested name read inside two outer types; Result and Result<T>; a name that is a namespace in one place and a type in another. Each case was also declared in two halves around a resolution. Both acceptance lines re-run and hold (see the proof rows): the test is red on e955a21 and catches both mutants; the corpus gate shows 0 added and 0 removed; yg check is inside 1.25 of the Runes 1.0.0 baseline on eShop and jellyfin, cold and warm, with the same edges before and after. Note for the merger, not a finding: jarl/645-runes-rest rewrites hintFiles around the set that memberFiles built, which 686 removes, and also rewrites assemblyOnlyIn, where 686 switches filesFor to filesOf. Both functions will conflict, and after the merge 645's assemblyOnlyIn should read filesOf too.

## Evidence

### Proof

- **ran (line a85586f70d40):** npm run check (the bound test, run before the fix at e955a21 on the old resolver) · **saw:** test/relations/csharp-resolve-work.test.mjs failed: 169344 symbol table questions for 1440 references, 117.6 per reference, bound 30
- **ran (line a85586f70d40):** npm run check · **saw:** 2620 tests, 2619 pass, 0 fail, 1 skipped; the bound test passes at 14.9 questions per reference (21394 for 1440 references); dist is fresh
- **ran (line 0f2e0674163d):** RUNES_CORPUS_DIR set to the shared corpus cache npm run corpus; node scripts/corpus.mjs gate --only eShop,jellyfin --tier all · **saw:** corpus gate: passed; eShop 2017 edges and jellyfin 32133 edges, 0 added 0 removed against the goldens; a harness over the C# files of eShop (547) and jellyfin (2226) gives byte-identical edges before and after (sha 16 hex a9ed8dd6475ecb6e and cbff89b3e6c823ad); resolution of references: eShop 10.88 s to 0.96 s (Runes 1.0.0: 5.22 s), jellyfin 49.7 s to 5.1 s (1.0.0: 24.2 s); parse and declare plus resolve: eShop 12.2 s to 2.4 s (1.0.0: 6.1 s), jellyfin 66.9 s to 22.2 s (1.0.0: 35.6 s)
- **ran (line a85586f70d40):** node --test test/relations/csharp-resolve-work.test.mjs in a git archive extraction of e955a21 (the test on the old resolver); npm run check in a git archive extraction of eb99977; the same test file against two mutants of eb99977's dist/relations/resolver.mjs: kept answers never renewed after the first, and plain readings never kept · **saw:** e955a21: the bound test fails, {has 75960, defCount 75960, filesFor 17424, hasNamespace 0}, 117.6 questions per reference against the bound 30; its renewal test passes there (it guards the new cache only). eb99977: npm test 2620 tests, 2619 pass, 0 fail, 1 skipped; check:dist cannot run outside a git checkout, so the dist that npm test rebuilt was compared with the committed dist of eb99977: identical. Mutants: never renewed, the renewal test fails (absent where resolved b/Late.cs is due); plain readings not kept, the bound test fails at 53.6 per reference. The test counts table questions, not time, so it is not flaky
- **ran (line 0f2e0674163d):** RUNES_CORPUS_DIR=<the shared corpus cache> node scripts/corpus.mjs gate --only eShop,jellyfin,CleanArchitecture --tier all in a git archive extraction of eb99977; then yg check --no-approve --full --json in the Yggdrasil dev container, one node per directory of .cs files (eShop 169 nodes, jellyfin 427), cold on a fresh copy and warm on the same copy right after: Yggdrasil release/6.2.0 d2cc7b6af as built, with Runes c5124ca (before) and eb99977 (after) dropped into its node_modules; the baseline is Yggdrasil 202908c78, the release branch just before the merge that adopted Runes 1.1.0, built with Runes v1.0.0, because today's Yggdrasil does not load Runes 1.0.0 (no buildCsharpReachability export) · **saw:** corpus gate passed: CleanArchitecture 452, jellyfin 32133, eShop 2017 edges, 0 added 0 removed (the C# oracle skipped, no dotnet here). eShop, two rounds: baseline cold 9.45 and 8.02 s, warm 7.00 and 6.91 s; c5124ca cold 15.19 and 15.22 s, warm 12.81 and 12.91 s; eb99977 cold 4.22, 3.56, 3.60 and 4.00 s, warm 2.13, 1.91, 1.79 and 2.24 s. jellyfin, one round: baseline cold 39.4 s warm 26.8 s; c5124ca cold 71.6 s warm 50.7 s; eb99977 cold 28.1 s warm 8.9 s. After against the baseline: at most 0.53 on eShop and 0.71 on jellyfin, inside 1.25; the baseline is an older Yggdrasil as well as Runes 1.0.0. The dependencies yg check reports are identical before and after: eShop 1582 edge lines (sha 16 ffe4b64e2178ac2b) in every c5124ca and eb99977 run, jellyfin 28000 (21b98aced0c54620). Other agents' yg checks ran in the same container meanwhile, so the times carry noise

### Notes

Assumed: the time was measured on Runes itself (a harness that runs the corpus's resolution over the C# files, phases timed, one run each on a warm file cache) and not through a built Yggdrasil; Yggdrasil's own time stays to be measured by the examiner or the merger. The kept answers are dropped whenever the symbol table takes a declaration, and an answer worked out inside another is not kept, because a base list still being bound could make it partial.

