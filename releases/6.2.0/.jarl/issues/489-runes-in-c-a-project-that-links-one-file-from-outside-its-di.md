# 489 · Runes: in C#, a project that links one file from outside its directory is read as reaching every project, and internal types count as candidates in other projects

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** w-runes-487-opus
**Where:** The 487 worker's report (2026-11-03): eShop, src/Basket.API/Program.cs:4 and src/OrderProcessor/Program.cs:4 lose their edge to their own AddApplicationServices because both reach EventBusRabbitMQ, whose linked Compile from src/Shared makes the reference graph reach everything
**Branch:** jarl/489-csharp-reachability-internal
**Worker:** w-runes-489-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-489
**Since:** 2026-11-03 04:24

## What
The project reachability rule treats any project with a Compile item outside its own directory as open to every project, so candidates that the real reference graph would rule out stay in play and make a call ambiguous. Runes also ignores the internal modifier, so a project's internal static classes count as candidates in other projects.

## Why
Real edges are lost to ambiguity in solutions that share source files, a common .NET layout.

## Acceptance
- A linked Compile item opens the project only to the file it links, with a case from eShop's layout where each Program.cs keeps its edge, red before and green after
- An internal type is not a candidate outside its project unless InternalsVisibleTo names the caller, with a case each

## Evidence

From the review of 487 (2026-11-03): 487 drops two true eShop edges (src/Basket.API/Program.cs:4, src/OrderProcessor/Program.cs:4) to ambiguity this issue causes; they are explained in corpus/explained.md as lost true edges, and this issue's fix must bring them back and remove those lines

