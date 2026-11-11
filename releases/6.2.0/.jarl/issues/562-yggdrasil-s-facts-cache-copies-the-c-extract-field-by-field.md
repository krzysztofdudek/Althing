# 562 · Yggdrasil's facts cache copies the C# extract field by field (source/cli/src/relations/facts-cache.…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1203-uqfg
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-500-fable
**Where:** the review of 500, 504, 528
**Branch:** jarl/530-runes-110
**Worker:** w-530-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
Yggdrasil's facts cache copies the C# extract field by field (source/cli/src/relations/facts-cache.ts, serializeCsharp and deserializeCsharp), so the adoption of Runes 1.1.0 (issue 530) must carry scope.staticDecls, scope.globalStatics and fileLocalTypes through it, beside passing globalStatics and projectGlobalStatics; the note on 530 names only the two inputs

## Why


## Acceptance


[test] Yggdrasil's facts cache keeps a C# extract's top-level parts lists and receiverTypes with refs (Runes 1.1.0's ext from, on, member.types and receiver members point into them), and an extract read back from the cache resolves to the same edges as the one held in memory, on probes that use both parts · by: cd source/cli && npm test

## Evidence

### Proof

- **ran (line c2296a7abe7e):** cd source/cli && npx vitest run tests/unit/relations/ast-cache-audit.test.ts with the old facts-cache.ts restored (the positioned-parts case: using static, a file type, a partial type with a receiver and an extension call on a typed parameter) · **saw:** x 3 failed (global-using-sibling, global-using-alias, positioned parts): TypeError Cannot read properties of undefined (reading 'filter'); with the fixed facts-cache.ts: 4 passed (cache-HIT run equals cache-DISABLED run for facts and violations)
- **ran (line c2296a7abe7e):** cd source/cli && npx vitest run tests/unit/relations/facts-cache.test.ts tests/unit/relations/ast-cache-audit.test.ts (at 096be7151) · **saw:** facts-cache 9 passed incl. lists, receiverTypes with refs, staticDecls, globalStatics and fileLocalTypes round trip and the Map canary (exactly aliasDecls, aliases, globalAliases are Maps); ast-cache-audit 5 passed incl. positioned parts and global-using-static

