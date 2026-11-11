# 489 · Runes: in C#, a project that links one file from outside its directory is read as reaching every project, and internal types count as candidates in other projects

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261103T0413-pdxx
**Tags:** 1.1.1, csharp, runes
**Files:** Runes/src/relations/extractors/csharp-reach.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** w-runes-487-opus
**Where:** The 487 worker's report (2026-11-03): eShop, src/Basket.API/Program.cs:4 and src/OrderProcessor/Program.cs:4 lose their edge to their own AddApplicationServices because both reach EventBusRabbitMQ, whose linked Compile from src/Shared makes the reference graph reach everything
**Branch:** jarl/506-csharp-reach
**Worker:** w-506b-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 09:55

## What
The project reachability rule treats any project with a Compile item outside its own directory as open to every project, so candidates that the real reference graph would rule out stay in play and make a call ambiguous. Runes also ignores the internal modifier, so a project's internal static classes count as candidates in other projects.

## Why
Real edges are lost to ambiguity in solutions that share source files, a common .NET layout.

## Acceptance
- A linked Compile item opens the project only to the file it links, with a case from eShop's layout where each Program.cs keeps its edge, red before and green after
- An internal type is not a candidate outside its project unless InternalsVisibleTo names the caller, with a case each

## Changelog
- Fixed: C#: a file a project takes out of its compilation with `<Compile Remove>` no longer declares types, so it no longer outranks the same type of a referenced project.
- Fixed: C#: a `<Compile Include>` that links a file from outside the project adds that file and nothing else, so a project that compiles a shared file, and every project that references it, keeps the edges only its own references allow. An `internal` type or extension class of another project is no longer a candidate unless that project names the caller with `InternalsVisibleTo`. Both can give a consumer's graph new edges where a call was ambiguous before; a stored C# extract is stale by the extractor's rev.

## Evidence

From the review of 487 (2026-11-03): 487 drops two true eShop edges (src/Basket.API/Program.cs:4, src/OrderProcessor/Program.cs:4) to ambiguity this issue causes; they are explained in corpus/explained.md as lost true edges, and this issue's fix must bring them back and remove those lines

Assumed: the class the compiler makes of top-level statements is not marked internal, because the .NET 10 web SDK makes it public for WebApplicationFactory and eShop's Webhooks tests bind it without a grant. Reachability becomes an interface with the optional member internalsVisible (described in docs/api.md); a Reachability without it reads nothing as internal, and a grant this reader cannot name, or a pair the graph knows nothing about, is visible. The C# extractor's rev goes to 17 for the internal:<key> markers.

Two reach-test assertions encoded the old rule that a linked Compile item opens its project (unknown); they now assert the closed graph (unreachable), as line 1 asks. Two exact declaration lists in csharp.test.mjs now include the internal markers. Corpus: eShop +9 true edges (Basket.API/Program.cs:4 and OrderProcessor/Program.cs:4 among them, their lost-edge lines removed from corpus/explained.md as note-1 asks), jellyfin -1 false edge (a private extension method of Jellyfin.Server), CleanArchitecture unchanged; goldens rewritten.

