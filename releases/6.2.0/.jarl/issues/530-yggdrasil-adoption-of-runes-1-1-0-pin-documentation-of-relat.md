# 530 · Yggdrasil: adoption of Runes 1.1.0 (pin, documentation of relation limits, rerun of the reproductions)

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261109T1633-evok
**Tags:** yggdrasil, runes
**Files:** Yggdrasil/source/cli/package.json, Yggdrasil/source/cli/package-lock.json, Yggdrasil/docs/relations-flows-ports.md
**Repo:** Yggdrasil
**After:** 009, 073, 013, 074, 010, 012, 011, 017, 015, 016, 075, 018, 475
**Found by:** jarl
**Where:**

## What
The extractor fixes in Runes 1.1.0 reach Yggdrasil only after Runes 1.1.0 is published, which is the owner's step. Then: npm install @chrisdudek/runes@1.1.0 --save-exact in source/cli, an update of the cited lines and of the limits table in docs/relations-flows-ports.md, and a rerun of the reproduction of every Runes issue on Yggdrasil. Runes 1.0.1 was never published, and release/6.2.0 pins 1.0.0 today. The Yggdrasil halves of 233, 234, 235 and 240 land with this adoption, because their Runes halves are already on Runes release/1.1.0. 475 comes first. This issue replaces 142.

When adopting, pass Runes 1.1.0's new optional C# inputs where Yggdrasil builds the C# relation pass: globalStatics and projectGlobalStatics (project-wide global using static, issue 500), and the Reachability internalsVisible member (issue 489), so their behaviour reaches users.

Through Yggdrasil's facts cache (source/cli/src/relations/facts-cache.ts, which copies the C# extract field by field) carry Runes 1.1.0's new C# extract fields scope.staticDecls, scope.globalStatics and fileLocalTypes (issue 562).

## Why
Without this the Runes fixes change nothing for Yggdrasil's users.

## Acceptance
- [read] release/6.2.0 pins Runes 1.1.0 in source/cli/package.json and its lockfile
- [read] The limits table in docs/relations-flows-ports.md matches what Runes 1.1.0 does
- [read] The reproductions of 009 to 018 and 073 to 075 were rerun on the built Yggdrasil and the results are recorded

## Evidence

