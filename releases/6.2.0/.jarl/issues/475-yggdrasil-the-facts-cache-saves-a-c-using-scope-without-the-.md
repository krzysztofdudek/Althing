# 475 · Yggdrasil: the facts cache saves a C# using scope without the alias declarations Runes 1.1.0 adds, so a reloaded entry may fail in the assembly step

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0017-lyln
**Tags:** yggdrasil, runes, csharp
**Files:** 
**Repo:** Yggdrasil
**Found by:** w-runes-469-opus
**Where:** Yggdrasil main, source/cli/src/relations/facts-cache.ts (read by the 469 worker on 2026-11-03); Runes release/1.1.0 merge 86bd33b (issue 295) adds aliasDecls to the C# using scope
**Branch:** jarl/530-runes-110
**Worker:** w-530-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
The facts cache writes a C# file's using scope field by field. The field Runes 1.1.0 adds for block-scoped aliases is not among them, so an entry written and read back lacks it, and the assembly step that reads it would fail.

Checked on 2026-11-09 against release/6.2.0: the branch still pins Runes 1.0.0, so this becomes a defect only with the adoption in 142, and it comes first. Runes release/1.1.0 adds two fields to the scope, aliasDecls and prefixDecls. The cache key already holds the Runes version, so an old entry is never read as the new shape.

## Why
Adopting Runes 1.1.0 would crash yg check on the second run of any C# repository with a warm cache.

## Acceptance
[test] A test writes a C# file's facts through the cache, reads them back and gets the same edges as a cold run, red before the fix on Runes 1.1.0 and green after · by: cd source/cli && npm test

## Evidence

Belongs with the adoption of Runes 1.1.0 in Yggdrasil (142): the red run needs Yggdrasil on Runes 1.1.0, so the two go on one branch

From the review of 476 (rev-runes-476-fable, 2026-11-03): the facts cache must also store the using scope's prefixDecls, which 476 adds; and Grain's serializer spreads the scope, so prefixDecls survives there, but the aliasDecls Map will not when Grain adopts 1.1.0

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""
- **ran (line c741f43160e1):** cd source/cli && npx vitest run tests/unit/relations/facts-cache.test.ts (at 9e4506a8b: the new tests, the old code, Runes 1.1.0 build c5124ca installed) · **saw:** 3 of 9 failed: the old alias-map round trip died with TypeError Cannot read properties of undefined (reading 'filter') when the reloaded entry was assembled, and the two new 1.1.0 tests failed (the reloaded extract lacks aliasDecls, prefixDecls, staticDecls, globalStatics, fileLocalTypes, lists and receiverTypes)
- **ran (line c741f43160e1):** cd source/cli && npx vitest run tests/unit/relations (at da7c118a2, the fix) · **saw:** Test Files 9 passed, Tests 95 passed; the written-then-read C# extract equals the cold one (toEqual) and gives the same candidates with and without project-wide scope; ast-cache-audit 4 cases at that commit, 5 with the global using static case added later

