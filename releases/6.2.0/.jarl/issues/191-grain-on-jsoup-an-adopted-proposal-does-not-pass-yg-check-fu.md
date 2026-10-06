# 191 · Grain: on jsoup an adopted proposal does not pass yg check --full (6 undeclared dependencies), before and after 045

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** grain, propose, adopt
**Files:** Grain/plugins/grain/engine/propose.mjs
**Repo:** ../../../Grain
**Found by:** rev-grain-045
**Where:**
**Branch:** jarl/157-propose-followups
**Merged:** be2ca3f
**CI:** none

## What
The reviewer of 045 noticed that on jsoup grain propose → yg adopt → yg check --full ends with 6 relation-undeclared-dependency errors, independently of the 045 change: the proposal declares fewer relations than yg sees.

## Why
A freshly adopted graph should pass; otherwise the first impression of Grain is a red check.

## Acceptance
On jsoup propose → adopt → yg check --full passes, or the propose report announces exactly these refusals; the cause of the discrepancy established; test.

## Evidence

cause: dependency loops between proposed nodes; Yggdrasil refuses relation cycles (structural-cycle), so grain leaves each loop's weakest edge undeclared and names it (REFACTOR-BACKLOG.md §4, yg-node.yaml comment, propose summary '10 dependency cycle(s)'). jsoup 088614f4: the 10 backlog edges == the 10 edges yg check --full --details reports (diff identical). After committing the adoption, progressive yg check passes the relations. No engine change; pinned by tests/propose-node-cycles.test.mjs (issue 191) against real yg; mutation (cut not announced) turns it red.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2138, pass 2137, fail 0, skipped 1, merge be2ca3f

