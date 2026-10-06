# 164 · C#: Program in another class file of a project (ILogger<Program>, GetRequiredService<ILogger<Program>>()) binds to another project's partial Program — needs a graph of project references

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 016, 075
**Found by:** rev-runes-016
**Where:**

## What
A limitation from 1.0.0: an ILogger<Program> parameter in a class file of one project binds to an explicit partial class Program of another project. 016 widens this: GetRequiredService<ILogger<Program>>() was silent in 1.0.0 and now gives an edge. Telling them apart needs a graph of C# project references (like 014 and 075b).

## Why
A false edge in typical ASP.NET code with many projects.

## Acceptance
Program binds only to a project the file has a reference to; together with 014 and 075b in Runes 1.1.0.

## Evidence


