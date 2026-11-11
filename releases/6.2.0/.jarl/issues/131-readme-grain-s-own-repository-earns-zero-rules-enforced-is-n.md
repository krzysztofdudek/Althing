# 131 · README: 'Grain's own repository earns zero rules enforced' is not true (6.1.0 on Grain's own HEAD gives 5 enforced), and the fixture blocks given as real output are out of date

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-alhd
**Tags:** bug-hunt, grain
**Files:** Grain/README.md, Grain/plugins/grain/tests/docs-audit.test.mjs
**Repo:** Grain
**Found by:** bug-hunt
**Where:** README.md:24-26 (line 25, present tense), :79-83, :173-214 (fixture blocks; :175-216 on release/6.1.1, unchanged; release/6.1.1 already reworded line 83 in 076adf4); plugins/grain/tests/docs-audit.test.mjs checks only the command documentation and old wordings, it does not reproduce the fixture blocks. Newer output shapes: the `map:` prefix from voice('map') in engine/mine.mjs:783-784 (since 8e00179, 2026-09-06), the `in:` line from engine/cards.mjs:381 (e7a5e57, 2026-09-22); the README block was last edited in 3aa4ecf (2026-09-26), so it was patched line by line and never run as a whole.
**Branch:** jarl/596-grain-tidy
**Worker:** w-596-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 18:04

## What
Reproduction (fresh clones from GitHub, HEAD ae6152f, yg 6.1.0 on PATH, node 24.11.1):

(1) Grain on its own repository: `node ../grain-src/plugins/grain/bin/grain.mjs propose --json ../grain-self-propose.json` prints '5 promoted to `status: enforced`, 3 to `status: advisory`'; JSON: aspects total 33, enforced 5, advisory 3, the remaining 25; the adoption preview '33 rules (5 enforced, 3 advisory, 25 draft)'. README:25 says in the present tense 'Grain's own repository earns zero rules enforced from its own `propose`, for the same reason', and the reason given is missing history, though the clone has 571 non-merge commits. Zero enforced happens only when there is no Yggdrasil CLI (propose-report.mjs:143), which this sentence does not describe. The 5 enforced rules concern test files and the aspect files of test oracles, but they passed a real drill.

(2) The deterministic fixture (head 47da000) in the block presented as 'Real output … nothing below is mocked up' differs in four places: the handlers header says '15 conventions' (README: 12); the architecture line '7 modules · 6 directed dependencies' (README: 6 · 5); `check` says 'governed by 13 convention(s)' on both the clean and the edited file (README: 12); `where` cards start with an `in: src/handlers/ (layer 2) · used by 1 modules` line and a `map:` prefix, and carriers have line ranges (`:7–15`, not `:7`). Beyond the report: with the edited file ('as of 47da000+dirty', as in the README) `check` 6.1.0 does not print the `conforms to:` line at all, while the README shows it ending in '+5 more'; the clean run ends it with '+6 more'.

README:83 ('the same renderer produced 0 enforced rules, 22 advisory candidates and 59 drafts') is in the past tense, matches the dated record in docs/results.md (lines 104/107), and release/6.1.1 has already reworded it to 'an earlier build of the renderer produced…'; this overlaps the known point about out-of-date numbers from the Yggdrasil run (issue 001, which also covers the label of the placement hook example around README:250). Line 25 and the fixture blocks are not reported anywhere.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-9/f7-grain-self/repro.log and <the session scratchpad, since lost>/bughunt/grain/find-9/f6-readme-fixture/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-69/grain-self-repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-69/fixture-repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-69/fixture-dirty-repro.log.

## Why
Line 25 misstates why Grain gets zero enforced rules and what it actually gets, and the block sold as unmocked real output does not survive a verbatim rerun. This is documentation drift, not an engine bug, but every new user reads the README.

## Acceptance
- README:24-26 describes what 6.1.x gives on Grain's own repository, or is a dated measurement in the past tense.
- The fixture blocks in README:173-214 are 6.1.x output run verbatim on the fixture from build-fixture.mjs (headers, counts, `in:` and `map:` lines, `conforms to:`).
- A test or a script reproduces the fixture blocks and compares them with the README, so that drift is detected.

## Reviews
- **approve** · by rev-596-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1835-ywqk
  No Critical or Important finding. 596 line 1 [test]: re-run red on d507a933 (4 of 5 fail) and green on the tip (5 of 5); the refusal now stands in main before findRoot, storeFor and ensureFresh, and a git wrapper on PATH counted 0 git calls on an unknown command. Tried on the built tool, each exit 1 in under 100 ms with no .grain folder left: a typo of a real command (chekc, refres), a wrong case (Where), a trailing space, a removed hook command with --json, an unknown command after --no-refresh and after --, outside any repository, and the names __proto__, constructor and has; an empty command prints the usage and exits 0, as no command does. The parity test fails when the list and the switch differ. Full suite on the tip: tests 2237, pass 2231, fail 0, skipped 6. 591 [read] 'The oracle names no hook node, hook aspect or hook exemption, its README's scores are re-measured on the tree without hooks, and the README says when and why they changed': met; the diff removes only the hooks node and type, the two hook aspects with their drill cases, the six exemptions and hook prose; re-measured here on a staged copy of the tip with the release gate's yg, graph before against after: 167 to 164 errors, 45 to 44 nodes, 1607 to 1606 script pairs, matching the README; the README's entry of 2026-11-11 says when and why. 572 [read] 'Grain's docs/validation.md and docs/results.md speak of Horde only as a dated record in the past tense, and no sentence presents Horde as part of the family today': met; all four places are dated, past tense and marked as a tool that has since left the family. 268: line 1 re-run, canon-sync reports no difference for Grain (its one difference is in Yggdrasil's README); line 2 [read] 'CLAUDE.md names no private repository and carries the pointer line': met; line 3 the suite above. 131 line 1 [read] 'README:24-26 describes what 6.1.x gives on Grain's own repository, or is a dated measurement in the past tense': the sentence is gone from the tip's README, and the only self-proposal figures left are the dated rows of docs/results.md. Nothing added anywhere tells an agent to call Grain; no private repository, client or person is named in the diff. Minor 1 (131 lines 2 and 3): the README no longer carries any fixture output block, so there is nothing to run verbatim and no drift test was added; the lines are met by removal, not as written, which is the director's to accept. Minor 2 (591): the oracle README's 'What was read' list still says 'all four hook configurations'; it is a record of what was read when the graph was written, but it is the one hook mention outside the dated entry and the validation section. Minor 3 (591): the drill totals (24 cases, 9 aspects) were read, not re-run here. Minor 4 (596): the one-second bound in the new test is wall time of a spawned process and could fail on a heavily loaded machine; it held in the full suite.

## Evidence


### Notes

Not changed: on release/6.2.0 the sentence 'Grain's own repository earns zero rules enforced', the 'produced 0 enforced rules' line and the fixture output blocks are no longer in README.md (commit 1f6c5be5 rewrote the README); nothing in README.md or docs says either today, so there is nothing to fix and no block to compare. No test written.

