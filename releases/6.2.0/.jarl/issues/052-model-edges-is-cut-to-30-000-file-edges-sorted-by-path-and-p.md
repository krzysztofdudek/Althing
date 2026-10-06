# 052 · model.edges is cut to 30 000 file edges sorted by path, and propose, measure, advise and cochange read the cut list, so file dependencies past the cut silently disappear

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/arch.mjs, Grain/plugins/grain/engine/export.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/arch.mjs:291-292 applyRelationLayer: `model.edges = edges.slice(0, 30000)` (a list sorted by from, relations.mjs:441); moduleGraph :294 and relStages :299-302 from the full list; architectureNorms :314 and :47 on the cut one; consumers: propose-nodes.mjs:139 and :6, propose-markdown.mjs:17, measure.mjs:69, what.mjs:193, grain-advise.mjs:247 and :330, cochange.mjs:372, evidence.mjs:228, partition.mjs:389, report-facts.mjs:148, propose-levels.mjs:165
**Branch:** jarl/051-relation-targets
**Merged:** bf2a1d4
**CI:** none

## What
Reproduction (Grain v6.1.0 ae6152f, yg 6.1.0): a TS repo with 234 files and 31 512 resolved import edges (K=150). `grain export` → edges 30000, edgesTruncated 1512, 0 edges from src/zeta, while moduleGraph has src/zeta→src/omega (12). `grain propose` exit 0 writes `relations: []` for the src/zeta node and sums up 'no law about dependencies could be mined (31512 references seen, 31512 resolved, 12 survived the module cut)'; propose nowhere discloses the cut, and gives the cut numbers as exact ('30000 of 30000 imports that touch it stay inside', '30000 resolved imports'). After `yg adopt`, `yg check --full` exit 1 with 12 lines `relation-undeclared-dependency: src/zeta/zNNN.ts:1 → src/omega`. Control K=140 (29 412 edges, the same zeta→omega imports): relation `src/omega type: uses`, yg check PASS. `grain measure --scope src/zeta`: importsOut 0 and repo imports 30000, against 12 and 29412; `grain what o005` loses 'used by: src/zeta/z005.ts'. Reach: the largest repo in the corpus of 23 repositories has 8 222 edges (koel), angular/angular @8608325 18 716 (62% of the limit). A side observation, not verified against known items: microsoft/vscode @de892dd1 (16 868 code files) cannot be indexed; the default heap runs out, and with --max-old-space-size=12288 `grain export` and `grain status` fail with '[grain] Invalid string length' after 10-12 minutes. The limit has been there since the first commit (16fa901) as an export size limit; the consumers came later. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-19/F6/repro.log, repro-what.log, <the session scratchpad, since lost>/bughunt/grain/verify-19/real/scale.log, vscode-export.log, vscode-export-12g.log, vscode-status.log.

## Why
Above 30 000 resolved file edges the proposal silently loses relations and the adopted graph is red right away, while measure, advise and cochange count on incomplete data without a word. Grain's aspect export/schema-is-a-published-interface §5 says that a consumer counting on a silently cut list gets wrong numbers. Today it affects only very large or dense repositories (about 12-16 thousand code files at angular's density), hence minor.

## Acceptance
- The full edge list stays in the model for relations, norms and measurements, and the 30 000 limit applies only when the export is written (export.mjs:263); if an in-memory limit stays, propose and measure openly disclose the cut and the files that lost edges.
- The fixture from the reproduction (K=150): propose writes the relation src/zeta → src/omega, after adopt `yg check --full` passes, and `grain measure --scope src/zeta` gives importsOut 12.

## Changelog
- Fixed: in a repository with more than 30,000 imports between files, propose, measure, advise and co-change no longer lose the dependencies of the files that sort last; only the export still lists the first 30,000 and says how many it left out.

## Evidence

docs: docs/reference.md (grain export): `edges` lists at most 30,000 file edges sorted by importing file and `edgesTruncated` counts the rest; every other command reads the full list.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2189, pass 2188, fail 0, skipped 1, merge bf2a1d4

