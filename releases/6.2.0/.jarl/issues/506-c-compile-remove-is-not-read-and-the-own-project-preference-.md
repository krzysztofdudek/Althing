# 506 · C#: Compile Remove is not read, and the own-project preference now binds the removed file

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-jhsv
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp-reach.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-compremv
**Where:** src/relations/extractors/csharp-reach.mts:261
**Branch:** jarl/506-csharp-reach
**Worker:** w-506b-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 09:55

## What
Claim: A file under <Compile Remove> still declares its types. With the 1.1.0 own-project preference, it outranks the same type in a referenced project, a false edge where v1.0.0 gave silence. A regression.

probes/csharp p22: Api.cs:3->Old at 5227538, silence at v1.0.0, expected Api.cs:3->Core

## Why


## Acceptance
- A file excluded by <Compile Remove> is not part of its project, so it never wins through the own-project preference, with the audit's probe as a catalogue case, red before and green after on 1.1.0 and matching v1.0.0's silence or better
- The C# project and parity tests are unchanged apart from the new case

## Changelog
- Fixed: C#: a file a project takes out of its compilation with `<Compile Remove>` no longer declares types, so it no longer outranks the same type of a referenced project.
- Fixed: C#: a `<Compile Include>` that links a file from outside the project adds that file and nothing else, so a project that compiles a shared file, and every project that references it, keeps the edges only its own references allow. An `internal` type or extension class of another project is no longer a candidate unless that project names the caller with `InternalsVisibleTo`. Both can give a consumer's graph new edges where a call was ambiguous before; a stored C# extract is stale by the extractor's rev.

## Reviews
- **changes** · by rev-506-fable (fresh) · 2026-11-11 · model claude-fable-5-1 · batch 20261111T1034-skwf
  Read: the six commits each name their issue; every source change is the C# reach reader (csharp-reach.mts), the C# extractor (rev 16 to 17, the internal:<key> marker) and the resolver's reach filter; dist is rebuilt and fresh; docs/api.md describes the optional internalsVisible member. The two changed reach assertions (a linked Compile item no longer opens its project; src/Lib/Feature.cs to src/Other/o.cs unreachable instead of unknown) follow acceptance line 1 of 489 and weaken no protection: a linked item adds exactly the files it names, and a link the reader cannot resolve still opens the project (tested). The nine eShop edges gained are the compiler's bindings (each Program.cs to its own project's AddApplicationServices, the test fixtures to the one Program in reach) and the jellyfin edge lost is a private extension method no other assembly can call. The two earlier explanation entries removed from corpus/explained.md were for the edges now back in the golden; left in place they would have explained a future loss of those edges silently, so removing them is right. Lines 489/1, 489/2, 506/1 and 506/2 are met as quoted in the evidence rows. Important: (src/relations/extractors/csharp-reach.mts:306-318 with compiledByOwn at 394-398) a Compile Remove is read as certain although a Compile Include of the same project could not be resolved. A project with <Compile Remove="Platform/**" /> and <Compile Include="Platform/$(TargetPlatform)/**/*.cs" />, the usual per-platform or per-framework folder layout, compiles one subfolder; the branch answers unreachable for every file under Platform, from the project's own files and from a project that references it, where release/1.1.0 answered same and reachable. Through the resolver the edges src/Web/Api.cs:3 -> Platform and src/App/X.cs:3 -> Platform that 1.1.0 gives are lost (a probe case run on both trees), a regression in silence. The module's contract says everything unknown fails open, and the worker's own note says an uncertain removal never takes out code the project compiles; here the kept set is uncertain, so the removal must not be read: one way is that a project with an unresolved Compile Include keeps every file of its directory. Wanted: that fix, a reach test and a catalogue case red before. The same root makes <Compile Remove="**" /> beside <Compile Include="@(Sources)" /> remove everything. Minor: (csharp-reach.mts:79, conditional) the tag scan reads an ItemGroup Condition that holds a raw greater-than sign (Condition="'$(A)' > '1'", legal XML) as closed before the sign, so the group's removal is read as unconditional and the file is unreachable where 1.1.0 kept it; rare, the &gt; spelling is the common one, a known limitation unless the fix above covers it. Tried against the guards and held: a removal in another letter case, after a closed Target, in a Directory.Build.props, with $(MSBuildThisFileDirectory), with Update in place of Remove, a link matching no known file; a friend named through an AssemblyName set in Directory.Build.props, a grant through a transitive reference, a conditional grant item, two grants in one attribute list, an open caller project whose reference does reach the target. Could not check: the dotnet msbuild oracle (no .NET SDK on this machine), and the worker's assumption that the compiler-made Program class of top-level statements is accessible to a test project without a grant (it is left unmarked, so it fails open).
  outside the issue, filed as 549: C#: an internal partial type whose other part carries no access modifier (internal partial class Order in one file, partial class Order in another of the same project) keeps the unmarked part as a candidate, so a caller in another project gets silence where the compiler binds the public type of a referenced project; the same silence as on release/1.1.0, so no regression (a probe case run on both trees).

## Evidence

### Proof

- **ran (line 1b60dd718c97):** catalogue case csharp-compile-remove-excluded-file-edge (the audit's probe p22) against the base and the branch; the branch's reach test file against both; twelve reach-level probes of my own on both trees · **saw:** base: 'expected edge src/Web/Api.cs:3->Core not emitted (got src/Web/Api.cs:3->Old)', the false edge of 1.1.0; branch: green with the edge to Core, better than v1.0.0's silence; probes: a removal in another letter case, after a closed Target, in a Directory.Build.props and with Update in place of Remove answer as the tests say; a removal beside a Compile Include under an unknown property (Platform/$(TargetPlatform)/**/*.cs) answers unreachable on the branch where the base answered same and reachable, see the finding of the verdict
- **ran (line 461114d4a646):** git diff release/1.1.0...jarl/506-csharp-reach --stat; node --test --test-concurrency=6 over every test file on the branch under a 12G cap; node scripts/check-dist.mjs in a clone of the branch · **saw:** csharp-project.test.mjs and csharp-parity.test.mjs are not in the diff; the diff touches csharp-reach.mts, csharp.mts, resolver.mts and their tests, the catalogue count (681 to 687), the extractor rev test (16 to 17), docs/api.md, the corpus goldens and explained.md, and dist; full suite 2134 tests, 2133 pass, 1 skipped (as before), 0 fail; dist/ is fresh

### Notes

The worker was killed when the machine ran out of memory with six workers running; no commit, one uncommitted file in the worktree. A new worker resumes the lease.

Assumed: a Compile Remove is read only when it always applies; one under a condition (on the item, its ItemGroup or a Choose branch) or inside a Target is ignored, a file that a Compile Include of the same project names again is kept whatever the order, and a removal is read against the project being built only, so an uncertain removal never takes out code the project compiles. A file in no compilation is unreachable as a target and unknown as a caller. The C# project and parity test files (csharp-project.test.mjs, csharp-parity.test.mjs) are unchanged.

