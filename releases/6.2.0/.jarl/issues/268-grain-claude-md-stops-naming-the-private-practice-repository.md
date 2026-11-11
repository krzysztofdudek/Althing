# 268 · Grain: CLAUDE.md stops naming the private practice repository and points to Althing, and the README's family section gains the Althing sentence

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261006T0609-cgyr
**Tags:** grain, docs, migration, needs-owner
**Files:** Grain/CLAUDE.md, Grain/README.md
**Repo:** Grain
**Found by:** jarl
**Where:** Grain/CLAUDE.md:9 (names the author's private practice repository); Grain/README.md:408 on release/6.2.0 (the family section ends without the canon's Althing sentence)
**After:** 266, 341
**Branch:** jarl/596-grain-tidy
**Merged:** 6ea10bd2 in Grain
**Merge check:** cd plugins/grain && npm test · saw tests 2237, pass 2231, fail 0, skipped 6, with Yggdrasil supplied

## What
The move's step M9 for Grain. The first sentence of CLAUDE.md:9 becomes "This repository never names or links any client, client work, or private repository of the author." (the rest of that paragraph, on the measurement corpus, stays), and the paragraph is followed by "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". README.md's family section takes the canon's block as it stands in Althing's family/canon.md, which ends with "The family is developed in the open in Althing: its releases, research and rulings." (ruling ask-014: after Althing's first push). On release/6.2.0; if 6.2.0 is tagged before Althing's first push, on the next release's branch instead. Pushed only on the owner's word.

## Why
An agent working in the repository finds where its issues, releases and rulings are decided only through that pointer. A public file that names the author's private repository points readers at something they cannot see. And the canon's drift check (ws check canon-sync) reports the README as drifting until it carries the canon's block as it stands.

## Acceptance
- From Althing, node workspace/ws.mjs check canon-sync --source local --ref grain=<the branch carrying the change> reports no difference for Grain
- CLAUDE.md names no private repository and carries the pointer line
- cd plugins/grain && npm test is green on the commit

## Reviews
- **approve** · by rev-596-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1835-ywqk
  No Critical or Important finding. 596 line 1 [test]: re-run red on d507a933 (4 of 5 fail) and green on the tip (5 of 5); the refusal now stands in main before findRoot, storeFor and ensureFresh, and a git wrapper on PATH counted 0 git calls on an unknown command. Tried on the built tool, each exit 1 in under 100 ms with no .grain folder left: a typo of a real command (chekc, refres), a wrong case (Where), a trailing space, a removed hook command with --json, an unknown command after --no-refresh and after --, outside any repository, and the names __proto__, constructor and has; an empty command prints the usage and exits 0, as no command does. The parity test fails when the list and the switch differ. Full suite on the tip: tests 2237, pass 2231, fail 0, skipped 6. 591 [read] 'The oracle names no hook node, hook aspect or hook exemption, its README's scores are re-measured on the tree without hooks, and the README says when and why they changed': met; the diff removes only the hooks node and type, the two hook aspects with their drill cases, the six exemptions and hook prose; re-measured here on a staged copy of the tip with the release gate's yg, graph before against after: 167 to 164 errors, 45 to 44 nodes, 1607 to 1606 script pairs, matching the README; the README's entry of 2026-11-11 says when and why. 572 [read] 'Grain's docs/validation.md and docs/results.md speak of Horde only as a dated record in the past tense, and no sentence presents Horde as part of the family today': met; all four places are dated, past tense and marked as a tool that has since left the family. 268: line 1 re-run, canon-sync reports no difference for Grain (its one difference is in Yggdrasil's README); line 2 [read] 'CLAUDE.md names no private repository and carries the pointer line': met; line 3 the suite above. 131 line 1 [read] 'README:24-26 describes what 6.1.x gives on Grain's own repository, or is a dated measurement in the past tense': the sentence is gone from the tip's README, and the only self-proposal figures left are the dated rows of docs/results.md. Nothing added anywhere tells an agent to call Grain; no private repository, client or person is named in the diff. Minor 1 (131 lines 2 and 3): the README no longer carries any fixture output block, so there is nothing to run verbatim and no drift test was added; the lines are met by removal, not as written, which is the director's to accept. Minor 2 (591): the oracle README's 'What was read' list still says 'all four hook configurations'; it is a record of what was read when the graph was written, but it is the one hook mention outside the dated entry and the validation section. Minor 3 (591): the drill totals (24 cases, 9 aspects) were read, not re-run here. Minor 4 (596): the one-second bound in the new test is wall time of a spawned process and could fail on a heavily loaded machine; it held in the full suite.

## Evidence

### Proof

- **ran (line 9d2dfb426631):** cd Althing && node workspace/ws.mjs check canon-sync --source local --ref grain=jarl/596-grain-tidy · **saw:** read Grain from the sibling checkout at jarl/596-grain-tidy; the only difference reported is in Yggdrasil's README (1 difference in 1 of 6 READMEs); none for Grain
- **ran (line b3499c7caa36):** grep -n 'Vision' CLAUDE.md README.md; sed -n 9,11p CLAUDE.md · **saw:** no match for Vision; line 9 starts 'This repository never names or links any client, client work, or private repository of the author.' and the next paragraph is the Althing pointer line
- **ran (line f2d83214e035):** cd plugins/grain && npm test (full gate, YG_BIN set) · **saw:** tests 2237, pass 2231, fail 0, skipped 6, exit 0
- **ran (line 9d2dfb426631):** node workspace/ws.mjs check canon-sync --source local --ref grain=jarl/596-grain-tidy · **saw:** canon-sync: 1 difference(s) in 1 of 6 READMEs, the one in Yggdrasil's README; none reported for Grain
- **ran (line f2d83214e035):** cd plugins/grain && systemd-run MemoryMax=12G full-gate.sh nice -n 15 timeout 3000 npm test, on the tip f62660d1 · **saw:** tests 2237, pass 2231, fail 0, skipped 6, exit 0

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: the README family section was replaced by the canon block with Grain's own name unlinked and '(this one)' in its table row; the Althing sentence was already there, the real drift was two wordings (the 'Jarl on it from 6.1.0' clause and 'each issue' for 'each piece of work').

