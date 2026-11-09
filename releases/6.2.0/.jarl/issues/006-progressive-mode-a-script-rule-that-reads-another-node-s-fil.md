# 006 · Progressive mode: a script rule that reads another node's file list through ctx.graph (the documented recipe for a test file alongside) does not come into scope when that list changes, so a refusal caused by the branch is reported as inherited

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-azeg
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/progressive-scope.ts, Yggdrasil/source/cli/src/core/graph/impact-graph.ts, Yggdrasil/tests/unit/core/progressive-scope.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/progressive-scope.ts:361-380 (observationKeyCandidates) and :593-600 (computeBurnSet, the recorded observations row); source/cli/src/core/graph/impact-graph.ts:294-362 (touchedReferencesFile, `default: break` :358)
**Branch:** jarl/005-progressive-scope
**Merged:** 7b3cdde70646e95de91d8e3687e373938bfd9627
**CI:** none

## What
The observations node-files:<N> and graph-files:<N> (added in 6.1.0, issue 047) are counted into the hash (observation-keys.ts), but the burn table's row for recorded observations does not know them: observationKeyCandidates produces only read:/exists:/list:<dir>, graph:/graph-children: for yg-node.yaml and graph-flow: for yg-flow.yaml, and touchedReferencesFile has no branch for them. Only graph-bytype is a documented deliberate exception. Reproduction (clone at tag v6.1.0): node cmd (src/foo.ts) with a uses relation to node suite (maps tests/); the rule sibling-test reads ctx.graph.node('suite').files and looks for foo.test.ts by path; progressive.reference: main; on main fill PASS; on feat `git rm tests/foo.test.ts`, then `yg check --approve --only-deterministic` ('0 passed · 1 refused') and `yg check --no-approve`: both `warning[refused-outside] sibling-test — 1 violation in cmd — outside your changes` with the note '1 enforced finding ... is the baseline this repository already had, not a result of your change', PASS, exit 0; `yg check --full`: error[refused], exit 1. The recorded verdict has touched = [grammar:typescript, graph-files:suite, graph:cmd, graph:suite, node-files:cmd]. Control: the same rule with ctx.fs.exists('tests/foo.test.ts') records exists:tests/foo.test.ts, is in scope and blocks on every step. The reverse direction (the branch adds tests/foo.only.test.ts, which the rule over suite.files forbids) behaves the same way. A mitigating circumstance: on a completely fresh CI with an empty cache, step 1 happens to catch it as a cold pair (FAIL), but step 2 on the same tree gives PASS, so the two documented CI steps contradict each other; a plain `yg check` on the developer's machine, the pre-commit hook and a runner with a cache let it through. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-3/repro/graph-files-2-graph.log (controls graph-files-2-fsexists.log, graph-files-3-add.log; script graph-files.sh <id> <graph|fsexists|add>).

## Why
progressive-mode.md promises that a rule that recorded a read of what the change touched is yours, and that 'cannot tell is never read as not yours'. The documented recipe (the writing-deterministic-aspects knowledge, Cookbook 1; docs/reviewers.md:457) falls exactly into this gap, and the branch passes with a refusal it caused itself.

## Acceptance
- Adding or removing a file that belongs to node N (also a file that the mapping of an ancestor of N covers) burns every pair whose touched contains node-files:N or graph-files:N; matching by pattern like ownerOf, so that a removed path also matches.
- The sibling-test scenario gives FAIL on `yg check --no-approve` with a warm cache, in both directions (removing and adding a file); tests in progressive-scope.test.ts for graph-files and node-files.

## Changelog
- Fixed: In progressive mode, adding or deleting a file of a component puts in scope every rule that read that component's file list (the sibling-test recipe); before, yg check passed and reported the refusal as inherited debt. yg impact --file names such rules too.

## Evidence

- **ran (history):** git commit (merge of jarl/005-progressive-scope into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8102 pairs verified; [repo-check] All checks passed; [release/6.1.1 7b3cdde70] Merge jarl/005-progressive-scope

jarl, 2026-10-05: the line log.md:1564 ('006 review approve · by rev-ygg-006 · x', a mistaken entry by the reviewer rev-ygg-005) was struck through by hand on 2026-10-04; Jarl's architect pointed out that this removed it from the done gate and the metrics with no trace in the record. I record it here for the audit; the binding verdict of 006 is approve rev-ygg-005. The tool for invalidating entries: 245.

