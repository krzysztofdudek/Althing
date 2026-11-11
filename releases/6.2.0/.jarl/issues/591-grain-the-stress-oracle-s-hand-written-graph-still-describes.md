# 591 · Grain: the stress oracle's hand-written graph still describes the removed agent hooks (the hooks node, the hooks aspects, the verb-parity exemptions and their README scores)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1420-updd
**Tags:** grain, stress
**Files:** 
**Repo:** Grain
**After:** 569
**Found by:** jarl
**Where:** w-569-sonnet, issue 569
**Branch:** jarl/596-grain-tidy
**Worker:** w-596-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 18:04

## What


## Why
tests/stress/oracles/grain/ is the ground truth a stress run scores against; once 569 removes the hooks, an oracle that still expects them scores Grain against code that does not exist.

## Acceptance
[read] The oracle names no hook node, hook aspect or hook exemption, its README's scores are re-measured on the tree without hooks, and the README says when and why they changed

## Reviews
- **approve** · by rev-596-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1835-ywqk
  No Critical or Important finding. 596 line 1 [test]: re-run red on d507a933 (4 of 5 fail) and green on the tip (5 of 5); the refusal now stands in main before findRoot, storeFor and ensureFresh, and a git wrapper on PATH counted 0 git calls on an unknown command. Tried on the built tool, each exit 1 in under 100 ms with no .grain folder left: a typo of a real command (chekc, refres), a wrong case (Where), a trailing space, a removed hook command with --json, an unknown command after --no-refresh and after --, outside any repository, and the names __proto__, constructor and has; an empty command prints the usage and exits 0, as no command does. The parity test fails when the list and the switch differ. Full suite on the tip: tests 2237, pass 2231, fail 0, skipped 6. 591 [read] 'The oracle names no hook node, hook aspect or hook exemption, its README's scores are re-measured on the tree without hooks, and the README says when and why they changed': met; the diff removes only the hooks node and type, the two hook aspects with their drill cases, the six exemptions and hook prose; re-measured here on a staged copy of the tip with the release gate's yg, graph before against after: 167 to 164 errors, 45 to 44 nodes, 1607 to 1606 script pairs, matching the README; the README's entry of 2026-11-11 says when and why. 572 [read] 'Grain's docs/validation.md and docs/results.md speak of Horde only as a dated record in the past tense, and no sentence presents Horde as part of the family today': met; all four places are dated, past tense and marked as a tool that has since left the family. 268: line 1 re-run, canon-sync reports no difference for Grain (its one difference is in Yggdrasil's README); line 2 [read] 'CLAUDE.md names no private repository and carries the pointer line': met; line 3 the suite above. 131 line 1 [read] 'README:24-26 describes what 6.1.x gives on Grain's own repository, or is a dated measurement in the past tense': the sentence is gone from the tip's README, and the only self-proposal figures left are the dated rows of docs/results.md. Nothing added anywhere tells an agent to call Grain; no private repository, client or person is named in the diff. Minor 1 (131 lines 2 and 3): the README no longer carries any fixture output block, so there is nothing to run verbatim and no drift test was added; the lines are met by removal, not as written, which is the director's to accept. Minor 2 (591): the oracle README's 'What was read' list still says 'all four hook configurations'; it is a record of what was read when the graph was written, but it is the one hook mention outside the dated entry and the validation section. Minor 3 (591): the drill totals (24 cases, 9 aspects) were read, not re-run here. Minor 4 (596): the one-second bound in the new test is wall time of a spawned process and could fail on a heavily loaded machine; it held in the full suite.

## Evidence

### Notes

Assumed: the oracle's own yg-architecture.yaml is edited (the hook-config type and the hooks/never-blocks entry on cli-dispatch removed) because the line demands no hook node, aspect or exemption and the type had no file left; it is a nested test fixture graph, not the repository's own graph. The README scores were re-measured with the release gate's yg on a staged copy at fe181784, graph before vs after; the older drift in the graph (101 type mismatches, 18 unmapped files, 3 drill misses, cycles in yg structure) is unchanged by the removal and left alone.

