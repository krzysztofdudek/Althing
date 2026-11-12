# 687 · Yggdrasil: a global using in a C# file the graph does not map is not applied to the other files of …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0009-qnui
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-530-opus
**Where:** the review of 475, 530, 536, 562

## What
Yggdrasil: a global using in a C# file the graph does not map is not applied to the other files of its project, because csharpProjectOptions (source/cli/src/relations/pass.ts:929-956) reads only the extracts of mapped files; the compiler applies it to every file of the project. With coverage.required [] and a node mapping src/app/Code/ only, src/app/Globals.cs holding global using Lib; leaves Thing in src/app/Code/Use.cs unbound, so app>lib is not reported, on release/6.2.0 as on jarl/530-runes-110 (where a global using static there is lost the same way). Found in the review of 475, 530, 536, 562.

## Why


## Acceptance


## Evidence

