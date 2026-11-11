# 596 · Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1434-tyla
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-568-fable
**Where:** the review of 568, 569
**Branch:** jarl/596-grain-tidy
**Worker:** w-596-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 18:04

## What
Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (engine/grain.mjs, the default of the dispatcher runs after ensureFresh). A host that still calls a removed hook command, from a registration of its own or a stale copy, now pays a full build on each call and gets exit 1. The refusal belongs before the index is touched.

## Why


## Acceptance


[test] An unknown grain command is refused with exit 1 before the index is read, built or refreshed: in a repository with no index it leaves none behind and answers within a second, red before and green after · by: cd plugins/grain && npm test

## Changelog
- An unknown grain command is now refused at once with exit 1, before Grain reads or builds the index, so a call to a removed command no longer costs a build and leaves no .grain folder behind.

## Reviews
- **approve** · by rev-596-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1835-ywqk
  No Critical or Important finding. 596 line 1 [test]: re-run red on d507a933 (4 of 5 fail) and green on the tip (5 of 5); the refusal now stands in main before findRoot, storeFor and ensureFresh, and a git wrapper on PATH counted 0 git calls on an unknown command. Tried on the built tool, each exit 1 in under 100 ms with no .grain folder left: a typo of a real command (chekc, refres), a wrong case (Where), a trailing space, a removed hook command with --json, an unknown command after --no-refresh and after --, outside any repository, and the names __proto__, constructor and has; an empty command prints the usage and exits 0, as no command does. The parity test fails when the list and the switch differ. Full suite on the tip: tests 2237, pass 2231, fail 0, skipped 6. 591 [read] 'The oracle names no hook node, hook aspect or hook exemption, its README's scores are re-measured on the tree without hooks, and the README says when and why they changed': met; the diff removes only the hooks node and type, the two hook aspects with their drill cases, the six exemptions and hook prose; re-measured here on a staged copy of the tip with the release gate's yg, graph before against after: 167 to 164 errors, 45 to 44 nodes, 1607 to 1606 script pairs, matching the README; the README's entry of 2026-11-11 says when and why. 572 [read] 'Grain's docs/validation.md and docs/results.md speak of Horde only as a dated record in the past tense, and no sentence presents Horde as part of the family today': met; all four places are dated, past tense and marked as a tool that has since left the family. 268: line 1 re-run, canon-sync reports no difference for Grain (its one difference is in Yggdrasil's README); line 2 [read] 'CLAUDE.md names no private repository and carries the pointer line': met; line 3 the suite above. 131 line 1 [read] 'README:24-26 describes what 6.1.x gives on Grain's own repository, or is a dated measurement in the past tense': the sentence is gone from the tip's README, and the only self-proposal figures left are the dated rows of docs/results.md. Nothing added anywhere tells an agent to call Grain; no private repository, client or person is named in the diff. Minor 1 (131 lines 2 and 3): the README no longer carries any fixture output block, so there is nothing to run verbatim and no drift test was added; the lines are met by removal, not as written, which is the director's to accept. Minor 2 (591): the oracle README's 'What was read' list still says 'all four hook configurations'; it is a record of what was read when the graph was written, but it is the one hook mention outside the dated entry and the validation section. Minor 3 (591): the drill totals (24 cases, 9 aspects) were read, not re-run here. Minor 4 (596): the one-second bound in the new test is wall time of a spawned process and could fail on a heavily loaded machine; it held in the full suite.

## Evidence

### Proof

- **ran (line c56c2b963eeb):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/unknown-command-refusal.test.mjs · **saw:** before the fix (commit d507a933): 4 of 5 failed, 'the refusal left an index behind'; after the fix (commit fe181784): pass 5, fail 0 - an unknown command exits 1 with 'unknown command', leaves no .grain folder, answers in under a second
- **ran (line c56c2b963eeb):** cd plugins/grain && YG_BIN set, systemd-run MemoryMax=12G full-gate.sh nice -n 15 timeout 3000 npm test · **saw:** tests 2237, pass 2231, fail 0, skipped 6, exit 0
- **ran (line c56c2b963eeb):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/unknown-command-refusal.test.mjs, on an extraction of d507a933 and on the tip · **saw:** d507a933: tests 5, pass 1, fail 4 (three 'the refusal left an index behind', one command-list parity); tip f62660d1: tests 5, pass 5, fail 0
- **ran (line c56c2b963eeb):** cd plugins/grain && systemd-run MemoryMax=12G full-gate.sh nice -n 15 timeout 3000 npm test, on the tip f62660d1 · **saw:** tests 2237, pass 2231, fail 0, skipped 6, exit 0

