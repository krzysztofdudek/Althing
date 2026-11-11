# 631 · Grain: its own graph refuses engine/export.mjs (node:child_process in the analysis layer) and README.md:135's CHANGELOG.md link, and the stress oracle's graph has drifted from the tree

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1823-oefr
**Tags:** grain, graph
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** w-596-sonnet, the Grain tidy package
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
An enforced rule of Grain's own graph that refuses its own code is a red gate on the release; and an oracle that has drifted (101 type mismatches, 18 unmapped files, 3 drill cases that miss, all passing in the 2026-09 record) no longer scores what it claims.

## Acceptance
- [test] Grain's own yg check passes on the release tip: engine/export.mjs no longer imports node:child_process in the analysis layer (or the rule's scope is corrected with its reason) and README.md's links resolve · by: cd plugins/grain && npm test
- [read] The stress oracle's graph matches the tree again, or its README says plainly which parts are out of date and why its scores still mean something

## Evidence

### Proof

- **ran (line 45270747cdd4):** yg check --approve --only-deterministic (the gate's yg) on a scratch copy of release/6.2.0 with the oracle graph at its root · **saw:** 1612 pairs, 1609 passed, 3 refused: engine/no-subprocess-in-analysis-layer on plugins/grain/engine/export.mjs:23, docs/internal-links-resolve on README.md:135 (CHANGELOG.md), and the advisory vendor rule; yg check: FAIL 164 errors in 18 blocks
- **ran (line 45270747cdd4):** node --import ./tests/git-env.mjs --test tests/own-graph-enforced-rules.test.mjs through full-gate.sh (YG_BIN set), 12 GB cap, before the fix · **saw:** 3 tests, 1 pass, 2 fail: export.mjs imports node:child_process; the staged check refuses under two enforced rules
- **ran (line 45270747cdd4):** node --import ./tests/git-env.mjs --test tests/own-graph-enforced-rules.test.mjs through full-gate.sh (YG_BIN set), 12 GB cap, on e661b462; and the same staged check by hand · **saw:** 3 tests, 3 pass, 0 skipped. By hand: 1630 pairs, 1629 passed, 1 refused (the advisory vendor rule), no enforced refusal; yg check still FAIL, 163 errors in 16 blocks, all of them the graph's drift from the tree

### Notes

Assumed: 'Grain's own yg check passes' means no enforced script rule refuses the code. The whole check cannot pass without re-mapping the graph (163 errors of drift: 20 strict-type modules in no node, 101 files of repo/instruments outside their type, the director nodes, 10 undeclared relations), which is out of proportion here; the oracle's README now says plainly which parts are out of date and what a score still means. The Grain repository has no .yggdrasil at its root: the graph is the stress oracle, checked on a staged copy as its README prescribes.

Assumed: to give CHANGELOG.md an owner I edited the oracle's yg-architecture.yaml (one path added to the repo-config type's when, with its reason in the description) and the repo/config node's mapping. It is the nested fixture graph, edited the same way the tidy package edited it; no rule, scope, status, review_by or suppression changed. It is a commit of its own (e661b462), so it can be dropped if the owner's word is wanted first.

Assumed: the git read moved to engine/grain-export.mjs (the export command's dispatcher, a type that may talk to git), not to engine/history.mjs: with it the history module is 51 613 characters, over the 50 000 budget its own rule and tests/engine-module-size-budget.test.mjs hold.

