# 075 · C#: the class that a Program.cs with top-level statements compiles to (the global ::Program) is not declared, so WebApplicationFactory<Program> in an ASP.NET Core integration-test project gives no edge to the web project

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/extractors/csharp-project.mts, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/csharp.mts:305-332 (declarations() publishes a key only for nodes in TYPE_DECLARATION_TYPES :122-129: class/interface/struct/record/record_struct/enum; a compilation_unit with global_statement children is not handled, so the global `Program` the compiler synthesizes gets no key); Yggdrasil source/cli/src/relations/pass.ts:501 `extractor.declarations(parsed)` and :676 (SymbolTable); runes 1.0.0 pinned in source/cli/package.json:86
**Branch:** jarl/016-csharp-refs
**Merged:** a474f33 in ../../../Runes
**CI:** none

## What
Reproduction (npm @chrisdudek/yg@6.1.0 with runes 1.0.0, a fresh repo, `yg init --no-reviewer`, type comp with `when: path: "**"`, nodes web=src/Web and tests=tests with `relations: []`, `yg check --no-approve`): (1) src/Web/Program.cs with top-level statements (WebApplication.CreateBuilder…app.Run()), tests/Web.Tests/ApiTests.cs:5 with `private readonly WebApplicationFactory<Program> _factory = new();`, the tests csproj with a ProjectReference to Web: PASS, exit 0. (2) Control: the same file with `public partial class Program { }` added: FAIL relation-undeclared-dependency tests → web (ApiTests.cs:5). (3) Control: a classic `public class Program { static Main }`: the same FAIL. (4) The grammar and `csharpExtractor.declarations()` directly: `[]` for the top-level file and `[{"symbolKey":"Program"}]` for both controls; the gap is solely on the declaration side, because the reference emits a bare candidate `Program`. A real repo: jasontaylordev/CleanArchitecture @5353a9e (net10.0, a node per project, no relations): Application-FunctionalTests has edges to Application, Domain, Infrastructure and Shared, never to Web, although it has a ProjectReference to Web and runs it through `WebApiFactory : WebApplicationFactory<Program>` (WebApiFactory.cs:10); src/Web does not declare Program. Correction to the report: src/AppHost/Program.cs is top-level too; adding `public partial class Program { }` only to Web gives the edge, and adding it to both Web and AppHost (which is what a faithful "key the implicit Program" fix would produce) brings the silence back, because two nodes then declare the key `Program`, and the rule from relations-flows-ports.md:50 silences that; Aspire, worker and migrator repositories often have several top-level entry points, so the fix needs the ProjectReference closure of the referencing project. This is not 016 (method type arguments, a gap on the reference side) nor 214 from 6.1.0 (generic_name in type position, works). Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-44/log.txt, script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-44/repro.sh, probe <the session scratchpad, since lost>/bughunt/yggdrasil/verify-44/yg-install/decls.mjs, CleanArchitecture fixtures and variants in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-44/; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-3/F8-csharp-implicit-program/log.txt, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-3/F8-csharp-implicit-program/repro.sh.

## Why
WebApplicationFactory<Program> is the standard entry point of ASP.NET Core integration tests; the gap hides a real undeclared test → web dependency whenever Program is the only Web type the test project names. docs/relations-flows-ports.md:50 counts a type named as a generic argument, and the list of deliberate silences does not mention the implicit Program. Only a recall gap, no false blocks, so minor.

## Acceptance
A file with global_statement children and no explicit Program declaration publishes the global key `Program`, and ambiguity between several such files is settled by the ProjectReference closure of the referencing project: scenario (1) gives relation-undeclared-dependency tests → web at ApiTests.cs:5, and CleanArchitecture @5353a9e gives the edge Application-FunctionalTests → Web (WebApiFactory.cs:10) despite the top-level Program in AppHost; Yggdrasil pins the Runes release with the fix.

## Changelog
- Fixed: in C#, a reference to Program (such as WebApplicationFactory<Program> in an integration-test project) now finds the class the compiler generates for a file of top-level statements, so a test → web dependency that went unreported is now reported, and a graph that passed may turn red after the upgrade. A Program class declared in the source (public partial class Program { }) still takes precedence; when several projects have top-level statements and none declares Program, the reference stays unreported.

## Evidence

- **ran:** npm run check && npm run coverage (release/1.0.1) · **saw:** first npm run check: 1578/1579, the one failure the lock property test 'withLock takes over exactly the locks…' (withLockAsync did not reject a young lock; load average ~108), which passed alone 3/3; npm run check re-run: tests 1579, pass 1579, fail 0, catalogue 483 cases, dist/ is fresh; npm run coverage: tests 1579, pass 1579, fail 0, all files 98.75 / 94.02 / 98.58, exit 0; merge a474f33 (catalogue count conflict resolved to 470 + 13 = 483)

