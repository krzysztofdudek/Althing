# 109 · The STALE banner is printed on stdout before the answer: every --json answer and `export` stops being JSON, and when the staleness is something other than a HEAD move the banner contradicts itself

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0853-lovq
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/grain-context.mjs, Grain/plugins/grain/engine/grain-report.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain.mjs:893 `console.log([...banner, ...lines].join('\n'))` regardless of opts.json, also for `export`; the banner is built in grain-context.mjs:250-252 (the `want === 'none'` branch), and its text (:251) knows only the indexed HEAD and the current one; the `fresh` test (grain-context.mjs:216-222) also fails for other reasons (seedsHash, a cache built with --no-history, treeSig without git, a clone that stopped being shallow); freshnessLines (grain-report.mjs:22) compares only headSha. grain-export.mjs:44 already sends its own STALE stamp to stderr. The same lines on release/6.1.1 (grain.mjs:895, grain-context.mjs:251).
**Branch:** jarl/109-freshness-and-store-truth
**Merged:** 3b40074
**CI:** none

## What
Reproduction (fresh clone of github.com/krzysztofdudek/Grain at tag v6.1.0, b70a4e9, `grain version` 6.1.0; fixture from build-fixture.mjs, HEAD 47da000, 16 commits):

1. HEAD moved: index, one commit, then queries with GRAIN_NO_REFRESH=1 or --no-refresh. Every tested command prints on stdout line 1 'STALE: indexed at 47da000, HEAD is b567af2 — run `grain refresh`', and JSON.parse(stdout) fails with "Unexpected token 'S'": `status --json`, `where handler --json`, `check <file> --json`, `completeness <file> --json`, `cochange --files a,b --json`, `export`, and also (beyond the report) `what --json`, `map --json` and `report --json`. With the first line cut off, everything parses. Controls: a run with auto-refresh and a --no-refresh run on a fresh index both parse.
2. Staleness without a HEAD move: (a) `decide boundary` (HEAD stays 47da000), then `status --no-refresh`: 'STALE: indexed at 47da000, HEAD is 47da000', then 'freshness: … · up to date · history full', then 'as of 47da000 (STALE)'; `status --json --no-refresh` is not JSON either, and without --no-refresh the same query rebuilds the index, so it really was stale. (b) After `refresh --no-history` a plain `status --no-refresh` prints the same banner 'HEAD is 47da000'. (c) A copy without git with one changed file: 'indexed at no-git, HEAD is no-git'.
3. MCP (beyond the report): `grain_status {json: true, no-refresh: true}` returns one text block that is not JSON; so does `grain_export {no-refresh: true}`, even though it has the JSON answer's `_meta` key `grain/stderr`. docs/reference.md (the MCP section) promises in such a case 'one text block holding only the JSON'.

The only test (grain.test.mjs:251) checks the banner only on text output; none covers --json with --no-refresh. Side observation: with GRAIN_NO_REFRESH=1 `cochange` walked the history of the new commit (a separate issue on --no-refresh and history walks).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-10/f8-stale-json/repro.log and <the session scratchpad, since lost>/bughunt/grain/find-10/exp5-banner/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-46/case1/repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-46/case2/repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-46/case3/repro.log.

## Why
The JSON commands have documented schemas (grain-check/1, grain-completeness/1, grain-cochange/1, grain-export/1), and with a documented flag and environment variable they stop being machine-readable whenever the index is behind HEAD, i.e. right after every commit. docs/reference.md:9-10 and :301 promise only that 'stale answers carry a STALE banner', not that the banner precedes the JSON document, and asOf already carries '(STALE)'. The banner 'indexed at X, HEAD is X' next to 'up to date' is contradictory information. Mitigating factors: the mode is opt-in, the error is loud (a parse error), and no consumer in the family passes no-refresh.

## Acceptance
- With --no-refresh or GRAIN_NO_REFRESH=1, the stdout of every command with --json and of `export` is one JSON document (the banner goes to stderr or into the JSON), also over MCP.
- The banner names the real reason for the staleness (changed seeds, a cache without history, changed files without git, engine versions), and `status` does not say 'up to date' in the same answer.
- There is a test: index, commit, then `GRAIN_NO_REFRESH=1 grain status --json` and `GRAIN_NO_REFRESH=1 grain export` give stdout that passes JSON.parse.

## Changelog
- Fixed: with --no-refresh or GRAIN_NO_REFRESH=1, answers asked as JSON (and export) stay valid JSON when the index is out of date; the STALE warning goes to the error stream and says why the index is stale instead of claiming it is up to date.

## Evidence

red: tests/stale-banner-json.test.mjs on release/6.1.1 code 0/3 (status --json under GRAIN_NO_REFRESH=1: Unexpected token 'S', "STALE: ind"); green 3/3 at 20fe3fa. MCP: grain_status {json,no-refresh} and grain_export {no-refresh} on a stale fixture each return 1 block that JSON.parses, banner under _meta grain/stderr. docs: docs/reference.md --no-refresh line and GRAIN_NO_REFRESH: the STALE banner names why the index is stale; on a JSON answer (--json, export) it goes to stderr so stdout stays one JSON document.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2119, pass 2118, fail 0, skipped 1, merge 3b40074

