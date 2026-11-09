# 164 · C#: Program in another class file of a project (ILogger<Program>, GetRequiredService<ILogger<Program>>()) binds to another project's partial Program — needs a graph of project references

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1042-tnkb
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 016, 075
**Found by:** rev-runes-016
**Where:**
**Branch:** jarl/014-csharp-reach
**Merged:** 7eb5f3b2cf7ccd7349b4d60b1aea3b1de6c6fcce in ../../../Runes
**CI:** pending

## What
A limitation from 1.0.0: an ILogger<Program> parameter in a class file of one project binds to an explicit partial class Program of another project. 016 widens this: GetRequiredService<ILogger<Program>>() was silent in 1.0.0 and now gives an edge. Telling them apart needs a graph of C# project references (like 014 and 075b).

## Why
A false edge in typical ASP.NET code with many projects.

## Acceptance
Program binds only to a project the file has a reference to; together with 014 and 075b in Runes 1.1.0.

## Changelog
- Fixed: in C#, `Program` (such as `ILogger<Program>`) binds only a `Program` of a project the file's project references, the one of its own project first, so a class file no longer gets an edge to another project's `public partial class Program { }`. A declared `Program` and the one the compiler generates for top-level statements are read as one name, and when a project references two projects that each have one the reference stays unreported. A graph that relied on that false edge no longer has it, and a test project that references only a project whose `Program` is generated now gets an edge to it.

## Evidence


- **ran (history):** nice -n 15 npm run check; nice -n 15 npm run coverage (jarl/014-csharp-reach tip c9144f8) · **saw:** check: tests 1843, pass 1843, fail 0, catalogue 547 cases, dist/ is fresh; coverage: 1843/1843, all files 99.02 lines / 94.73 branches / 99.09 functions, exit 0
- **ran (history):** catalogue cases run before the fix (no reach given to the resolver) · **saw:** red: csharp-extension-unreferenced-project-silence, csharp-extension-reverse-reference-silence, csharp-member-read-unreferenced-type-silence, csharp-top-level-program-two-entries-referenced-edge, csharp-logger-of-program-own-project-silence, csharp-program-unreferenced-partial-silence, csharp-program-two-referenced-programs-silence, csharp-program-referenced-partial-edge; the edge controls (referenced, transitive, HintPath, Directory.Build.props, unresolved property) already green; after the fix all green
- **ran (history):** scratch relation pass over jellyfin 305a964 (2226 .cs, 43 projects), a node per project, with and without the reference filter · **saw:** 200 project pairs before and after, 23716 edges both, 0 lost, 0 gained; fuzz/Jellyfin.Api.Fuzz -> Jellyfin.Api (Program.cs:30), fuzz/Emby.Server.Implementations.Fuzz -> Emby.Server.Implementations (:38) and -> MediaBrowser.Controller (:52) kept through HintPath
- **ran (history):** same pass over CleanArchitecture 5353a9e (110 .cs, 13 projects) and eShop dc7ea49 (547 .cs, 28 projects) · **saw:** CleanArchitecture: 17 -> 18 pairs, 0 lost, gained tests/Application.FunctionalTests -> src/Web at WebApiFactory.cs:10; eShop: 50 -> 50 pairs, 599 edges both, 0 lost
- **ran (history):** npm run check · **saw:** tests 1854, pass 1854, fail 0, catalogue 552 cases, dist/ is fresh, merge 7eb5f3b

