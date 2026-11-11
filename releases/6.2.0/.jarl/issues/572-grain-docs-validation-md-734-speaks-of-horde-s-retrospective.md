# 572 · Grain docs/validation.md:734 speaks of Horde's retrospective in the present tense, and docs/results…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1251-ltly
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-341-fable
**Where:** the review of 341
**Branch:** jarl/596-grain-tidy
**Worker:** w-596-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 18:04

## What
Grain docs/validation.md:734 speaks of Horde's retrospective in the present tense, and docs/results.md:32 and :77 name Horde; identical on origin/main

## Why


## Acceptance


[read] Grain's docs/validation.md and docs/results.md speak of Horde only as a dated record in the past tense, and no sentence presents Horde as part of the family today

## Reviews
- **approve** · by rev-596-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1835-ywqk
  No Critical or Important finding. 596 line 1 [test]: re-run red on d507a933 (4 of 5 fail) and green on the tip (5 of 5); the refusal now stands in main before findRoot, storeFor and ensureFresh, and a git wrapper on PATH counted 0 git calls on an unknown command. Tried on the built tool, each exit 1 in under 100 ms with no .grain folder left: a typo of a real command (chekc, refres), a wrong case (Where), a trailing space, a removed hook command with --json, an unknown command after --no-refresh and after --, outside any repository, and the names __proto__, constructor and has; an empty command prints the usage and exits 0, as no command does. The parity test fails when the list and the switch differ. Full suite on the tip: tests 2237, pass 2231, fail 0, skipped 6. 591 [read] 'The oracle names no hook node, hook aspect or hook exemption, its README's scores are re-measured on the tree without hooks, and the README says when and why they changed': met; the diff removes only the hooks node and type, the two hook aspects with their drill cases, the six exemptions and hook prose; re-measured here on a staged copy of the tip with the release gate's yg, graph before against after: 167 to 164 errors, 45 to 44 nodes, 1607 to 1606 script pairs, matching the README; the README's entry of 2026-11-11 says when and why. 572 [read] 'Grain's docs/validation.md and docs/results.md speak of Horde only as a dated record in the past tense, and no sentence presents Horde as part of the family today': met; all four places are dated, past tense and marked as a tool that has since left the family. 268: line 1 re-run, canon-sync reports no difference for Grain (its one difference is in Yggdrasil's README); line 2 [read] 'CLAUDE.md names no private repository and carries the pointer line': met; line 3 the suite above. 131 line 1 [read] 'README:24-26 describes what 6.1.x gives on Grain's own repository, or is a dated measurement in the past tense': the sentence is gone from the tip's README, and the only self-proposal figures left are the dated rows of docs/results.md. Nothing added anywhere tells an agent to call Grain; no private repository, client or person is named in the diff. Minor 1 (131 lines 2 and 3): the README no longer carries any fixture output block, so there is nothing to run verbatim and no drift test was added; the lines are met by removal, not as written, which is the director's to accept. Minor 2 (591): the oracle README's 'What was read' list still says 'all four hook configurations'; it is a record of what was read when the graph was written, but it is the one hook mention outside the dated entry and the validation section. Minor 3 (591): the drill totals (24 cases, 9 aspects) were read, not re-run here. Minor 4 (596): the one-second bound in the new test is wall time of a spawned process and could fail on a heavily loaded machine; it held in the full suite.

## Evidence

### Notes

Assumed: Horde stays named in the dated measurement rows (results.md 32 and 77, validation.md 732 and 734), now in the past tense with 'a tool that has since left the family'; CHANGELOG.md entries of released versions that name Horde are left for the final pass.

