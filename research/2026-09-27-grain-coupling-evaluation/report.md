# Grain hidden coupling: the maintainer's label on the top 20

## 1. Verdict

Grain's node-level coupling instrument (`plugins/grain/tests/stress/coupling.mjs`, results.md N23) finds real co-change: none of the top 20 undeclared pairs on Yggdrasil `release/6.1.0` is statistical noise. Only 8 of the 20 are architecture, though: couplings that a relation or a rule should carry and that the graph does not. The other 12 are legitimate co-change with no architectural meaning. Ten of those have a test node on one or both sides, and two are a release-bookkeeping pair and a pair of sibling content nodes. As the instrument prints today, its precision for "hidden coupling worth acting on" is **8/20 = 0.40**. With one mechanical filter, dropping any pair that has a test node on either side, it is **8/10 = 0.80**, and the filter loses no true positive. The research's second bar, the maintainer's real-or-noise label, is therefore **met conditionally**. Before this reaches `grain advise`, the test side has to be split off the list. The channel labels also need rework: the two pairs labelled `docs` are among the strongest real findings, not benign ones.

The trajectory instrument (`trajectory.mjs`, results.md N19) is confirmed on its five largest turning points: two are the relation check learning to see more, and three are growth, exactly as N19 claimed. A cheap discriminator separates the two without a maintainer. Enforcement adds relations between nodes that already existed, while growth adds relations that touch new nodes. The split is 406:58 and 179:16 on the two enforcement commits against 15:102, 11:75 and 6:41 on the three growth commits.

## 2. What was run

The issue file carries only its title. Its What, Why and Acceptance sections are empty, so the points below are the two named in the title: the top 20 coupling pairs and the five trajectory turning points.

- `node tests/stress/coupling.mjs Yggdrasil --top 20` from `Grain/plugins/grain`. The script lives under `plugins/grain/tests/stress/`, not the repository-root `tests/stress/` the issue title names. Its flags are `--null-runs <k>`, `--top <k>` and `--json`. Grain was on `release/6.1.0` at `ce4adda`, Yggdrasil on `release/6.1.0` at `b4ea723a3`.
- `node tests/stress/trajectory.mjs Yggdrasil --top 5`, then `--json`, then a scratch split of each turning point's new relations by whether both endpoints existed at the previous commit.

The coupling summary on today's Yggdrasil, against N23's run at `c5cdd8a`: 1264 commits, 519 nodes, 5255 pairs seen, 139 certified (N23: 141), 56 undeclared (N23: 58). The 56 split by channel into vocabulary 31, test-of 11, none 10 and docs 4. The curveball null certified 0 in all three runs. Advise's floor names 22 pairs, 3 of them undeclared. In the time split, a certified undeclared partner is touched in 0.262 of later commits against 0.194 for a popularity-matched control, with 31 directions won and 7 lost. All certified pairs score 0.299 against 0.135. The numbers moved only slightly since N23, so the instrument is stable across two weeks of history.

## 3. The top 20, judged

Each verdict was checked against the node's `yg-node.yaml`, the mapped files and the commits the pair shares. **(a)** means real hidden coupling that a relation or rule should capture, **(b)** legitimate co-change with no architectural meaning, and **(c)** noise.

| # | Bits | Pair | Channel | Verdict | Evidence |
|---|---|---|---|---|---|
| 1 | 38.4 | cli/knowledge ↔ docs/guides | docs | **a** | The in-CLI knowledge topics and the docs pages describe the same behaviour twice (e.g. `knowledge/cli-reference.ts` and `docs/cli-reference.md`), 71 of 106 knowledge commits touch both, and only the issue-code tables are held equal by a test (`cli/tests/unit/repo`); the prose is not, so drift is caught only by "resync every surface" sweeps (`d3ff1ea0b`). |
| 2 | 27.4 | cli/knowledge ↔ cli/knowledge-authoring | vocabulary | **b** | Two topic-partitioned nodes of the same content layer, with no import between them (authoring does not use `shared-text.ts`). The shared commits are terminology and cross-link sweeps across every topic (`52414b172` "one word per meaning", `45a672ff2` cross-links), and `cli/knowledge-concepts` already declares `uses` to both. |
| 3 | 26.6 | cli/config/build ↔ root/project-config | none | **b** | `package.json` changes are logged in `CHANGELOG.md` (96 shared commits, including version bumps like `65bfb3967`), which is release bookkeeping. `root/project-config` is also a grab-bag node (CHANGELOG, README, AGENTS, CLAUDE, LICENSE…) touched by 593 commits, so the vocabulary overlap is 0.017. |
| 4 | 20.1 | docs/site ↔ tools | none | **a** | `tools/render-demo-gif.js` writes `docs/public/demo.gif` (line 7), and `docs/public/demo.html` hand-mirrors its scene script. All 7 shared commits change the generator and its output together, and no relation says the generator produces a file owned by another node. |
| 5 | 15.3 | cli/commands/aspects ↔ cli/tests/e2e/aspects-health | test-of | **b** | An e2e suite that spawns the command it tests, and the channel is right. |
| 6 | 14.1 | cli/tests/e2e/relation-conformance-csharp ↔ cli/tests/unit/relations/extractors-csharp | vocabulary | **b** | Two test suites of the same C# extractor, changed when the extractor changes, so the channel is wrong (it is test, not vocabulary). |
| 7 | 14.0 | cli/commands/impact ↔ cli/tests/unit/core/operations/other/impact | test-of | **b** | Unit tests of the impact computation and formatter, which change when a feature lands through command, core and tests together. |
| 8 | 13.2 | cli/knowledge ↔ cli/schemas | vocabulary | **a** | Knowledge topics tell the agent `yg schemas read node` and restate schema facts, and `agent-surface-truth.test.ts` exists because the agent-facing surfaces (manual, topics, schema references, glossary) drifted apart. The graph declares nothing between the two nodes, so `yg impact` on a schema change does not reach the topics that describe it. |
| 9 | 12.9 | cli/portal/frontend/core ↔ cli/portal/frontend/views | vocabulary | **a** | Every view opens with `var Yg = (window.YgPortal = window.YgPortal \|\| {})` and renders through `Yg.states` from core. That dependency is a browser global the import extractor cannot see, so both nodes declare `relations: []`, and only the `portal/honest-state-anchor` script rule enforces part of it. |
| 10 | 12.8 | cli/tests/e2e/dogfood-scripts ↔ scripts | test-of | **b** | An e2e smoke suite that spawns `scripts/*.mjs`, and the channel is right. |
| 11 | 11.6 | cli/commands/advise ↔ cli/tests/unit/core/advise | test-of | **b** | Unit tests of the advise engine, changed with the command's features. |
| 12 | 11.4 | cli/relations/extractors ↔ cli/tests/e2e/relation-conformance-compiled | none | **b** | E2e conformance tests of the Go/Java/Rust/C extractors, which spawn the CLI. The channel says none because the test name does not contain "extractors". |
| 13 | 10.8 | cli/relations/extractors ↔ cli/tests/e2e/relation-conformance-scripting | none | **b** | The same as 12, for TS/Python/PHP/Ruby/Kotlin. |
| 14 | 10.4 | cli/portal/contract ↔ cli/portal/frontend/views | vocabulary | **a** | `contract.ts` calls itself "the single typed seam between the backend pipeline and the frontend", but the views are untyped JS that read its JSON by field name. They share 14 commits, including `41d50a925` (aspect inspector) and `9c8011a3d` (unguarded file), and there is no relation from views to contract. |
| 15 | 9.8 | cli/commands/adopt ↔ cli/tests/e2e/adopt | test-of | **b** | An e2e suite of its command. |
| 16 | 9.2 | cli/tests/e2e/attention-dump ↔ cli/tests/unit/core/advise | vocabulary | **b** | Two test suites of the same advise nominations (`cli-advise-*.test.ts` and `advise-nominations.test.ts`), so the channel is wrong here too. |
| 17 | 9.0 | cli/knowledge ↔ cli/templates | vocabulary | **a** | `rules.ts` (the `yg prime` manual) names knowledge topics by string (`yg knowledge read verification-and-lock`) and restates their sentences. `agent-surface-truth.test.ts` says outright that "the manual's template cannot import them, so this suite holds the manual's copy to those exact strings". A test guards the coupling, and the graph does not show it. |
| 18 | 7.8 | cli/portal/frontend/views ↔ cli/portal/pipeline | vocabulary | **a** | The pipeline derives the state that the views render. `pipeline → contract` is declared and `views → contract` is not, so this pair is the transitive shadow of 14, true but not independent. |
| 19 | 7.6 | cli/portal/frontend/views ↔ cli/tests/integration/portal | test-of | **b** | An integration suite of the views, and the channel is right. |
| 20 | 7.3 | cli/knowledge-concepts ↔ docs/guides | docs | **a** | The same duplication as 1, for the concept topics (`meta-modeling.ts` ↔ `docs/meta-modeling.md` and so on). 35 of 55 knowledge-concepts commits touch the guides. |

**Counts: (a) 8, (b) 12, (c) 0.**

The 8 true positives fall into two mechanisms. Both are invisible to Yggdrasil's relation check by construction, which is why they show up as undeclared.

1. **Dependencies that do not travel through an import**: a browser global (9), a JSON contract read by untyped JS (14, and 18 as its shadow), and a generator writing a file another node owns (4). The code really depends on these, and the graph could declare them. Yggdrasil's checker renders a declared-only relation neutrally, so declaring them costs nothing.
2. **Parallel descriptions of one behaviour**: knowledge topics against docs pages (1, 20), against schema references (8), and against the `yg prime` manual (17). No import can exist between prose surfaces. The house already knows this coupling is real: `agent-surface-truth.test.ts` and the generated issue-code tables were built to hold part of it. The graph still says nothing about it, so `yg impact` on a knowledge topic does not name the docs page that must change with it.

## 4. Precision and what it rests on

- **As printed**: 8/20 = 0.40 architecturally meaningful, and 20/20 = 1.00 real co-change (the null certifies 0, and every pair was confirmed by shared commits with an explanation).
- **With test nodes dropped** (either side a test node by `isTestPath`): pairs 5, 6, 7, 10, 11, 12, 13, 15, 16 and 19 go, all (b). What remains is 8/10 = 0.80, and the two (b) left are the grab-bag config pair (3) and the sibling content pair (2).
- **By channel**: `test-of` was right on all 6 of the pairs it named, but it missed 4 other test pairs, which it labelled vocabulary (6, 16) or none (12, 13). `docs` named 2 pairs, and both are (a), the strongest findings on the list. `vocabulary` named 8, of which 5 are (a) and 3 are (b). `none` named 4, of which 1 is (a). So the channel does not predict the verdict, apart from "one side is a test" predicting (b).
- **Limits**: one repository, one maintainer judgement (delegated), top 20 only. The (a)/(b) line for the prose-duplication pairs is a judgement: a stricter reader could file them as (b) "docs next to code", which would bring the filtered precision down to 4/10. I keep them as (a) because the repository has already paid for the coupling twice, in a dedicated truth test and in drift-repair sweeps.

## 5. The five trajectory turning points

`trajectory.mjs --top 5` lists the five commits with the largest change in relations. Each was checked against its commit message and the CHANGELOG, and each one's new relations were split by endpoint age.

| # | Commit | Δ relations | Δ nodes | New relations between old nodes / touching a new node | Maintainer reading |
|---|---|---|---|---|---|
| 1 | `86135c1af` 2026-06-14 | +462 | +14 | 406 / 58 | **Enforcement.** The merge of feat/relation-conformance ("Built-in relation-conformance verification across 11 languages", 5.0.0-alpha.6) made the graph declare what the code already imported. It is also the source of 158 of the 210 "upward" relations, which are therefore declarations catching up, not erosion. |
| 2 | `90d7d5c61` 2026-09-25 | +195 | +5 | 179 / 16 | **Enforcement.** Issue 230 made "a type-only import … a dependency like any other" (6.1.0 Breaking). |
| 3 | `f9a922bbc` 2026-09-12 | +109 | +30 | 15 / 102 | **Growth.** The family-sync 6.0.0 merge. The CHANGELOG has no relation-detection change beyond port naming. |
| 4 | `27d1415e7` 2026-09-07 | +82 | +18 | 11 / 75 | **Growth.** The 5.9.0 release (`yg node`, `advise import`, `impact --json`). |
| 5 | `66e755baf` 2026-09-01 | +47 | +10 | 6 / 41 | **Growth.** The 5.8.0 progressive-mode merge. Its `.mts`/`.cts` fix cannot explain the jump, because Yggdrasil tracks 0 such files. |

N19's reading (two enforcement, three growth) is confirmed on all five. The endpoint-age split separates them with no overlap: enforcement puts 87–92% of new relations between pre-existing nodes, and growth puts 6–13% there. The instrument can therefore say "enforcement or growth" itself, which was N19's stated reason for not shipping. One more observation: all five points are merge commits of release branches, because the series follows first parents. The instrument's resolution is one release, not one change.

## 6. Issues worth filing

For Grain's metric:

1. **Split test pairs off the hidden-coupling list.** Any certified undeclared pair with a test node on either side goes to a separate "test channel" count, not into the ranked list. On Yggdrasil this doubles precision (0.40 to 0.80) at no loss. Name tests by `isTestPath` on both sides, not by name containment, which missed 4 of 10 here.
2. **Stop treating `docs` as a benign channel.** Rank a code-or-content node co-changing with a documentation node as "parallel description", a coupling the declared graph cannot see. On Yggdrasil these are the strongest pairs (38.4 and 7.3 bits), and the repository has already built a test for part of them.
3. **Down-weight grab-bag nodes.** A node that mixes unrelated file kinds (CHANGELOG, README, LICENSE, agent docs), with very high commit count and near-zero vocabulary, produces process pairs such as release bookkeeping. Either exclude root and repository-config types, or require the pair to beat the node's own base rate across all partners.
4. **Trajectory: classify each turning point as enforcement or growth by endpoint age.** Report the share of new relations whose endpoints both existed at the previous commit. The share was above 0.85 on both enforcement jumps and below 0.15 on all three growth jumps. This removes N19's blocker, and it keeps "upward" relations on an enforcement commit from reading as erosion.
5. **Fix the documented path.** The issue title and its stress-tool references say `tests/stress/coupling.mjs`, but the file is `plugins/grain/tests/stress/coupling.mjs`. Run from the repository root, the command in the title fails.

For Yggdrasil's graph (these are the maintainer's calls; this evaluation only names them):

6. **Declare `cli/portal/frontend/views → cli/portal/frontend/core` and `views → cli/portal/contract`.** Both are real runtime dependencies that the extractor cannot see (a browser global, and a JSON shape read by untyped JS). Declaring them also explains pair 18 transitively.
7. **Declare `tools → docs/site`** (the generator writes `docs/public/demo.gif`), or move `demo.gif` and `demo.html` into the `tools` node's ownership.
8. **Make parallel-description coupling visible to `yg impact`.** Knowledge topics ↔ docs guides, knowledge ↔ schema docs, and the `yg prime` template ↔ knowledge topics are held today by `agent-surface-truth.test.ts` and the issue-code table test, not by the graph. Two ways to do it: a declared relation (a "describes" edge, or `uses` by name, where the relation type allows it), or an LLM aspect on `docs/guides` saying a guide states the same behaviour as the knowledge topic of the same subject. Either way a change to one surface names the other in `yg impact`.
