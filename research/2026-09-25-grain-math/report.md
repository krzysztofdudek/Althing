# Grain: what more mathematics and analytics can extract

## 1. Verdict

Grain's core mathematics is sound wherever the engine uses it. Role cells, obligations, the language bridge and change archetypes all decide by the same contrast: a KT estimate against a base rate, a BIC penalty, an index cost for choosing the cell, and a λ=8 posterior bound. The weak spots are the places where the engine uses something else: a flat 50/50 coin as the null (architecture norms, value concordance), a raw share as the gate (the sub-gate lattice, co-change), or wall-clock windows (drift, nucleation, calibration). Those places match Grain's own recorded negative results almost one for one: result 101 (advisory precision 0.091), result 153 (a co-change partner predicts no better than its popularity), result 157 (the fix label measures exposure) and study 097 (hand rules are negative and decided, and Grain reproduced 0 of 20). Most fixes reuse the existing KT cell and remove constants rather than add them. One defect sits outside the mathematics, and it matters most for the thesis. Grain reads only the commit author, so on the family's own repositories it counts roughly 85% of agent-written commits as human. The prior reports from 2026-09-23 to 25 covered packaging and integration only, so none of this repeats a fixed finding. Two caveats limit what this report proves. Yggdrasil's cached Grain model dates from 2026-09-16 and has no history. The permutation counts behind GM-1 and GM-9 come from scratch prototypes and were not re-run during verification; the Grain cache holds 3 absence norms where the prototype said 1.

## 2. Top recommendations (ranked)

| # | What | Why | Effort | How we would know it worked |
|---|---|---|---|---|
| 1 | **Read `Co-Authored-By` trailers in the history layer** (GM-5) | 1339 of 1572 Yggdrasil commits under Krzysztof's name and 226 of 229 on Grain carry a Claude trailer, yet Grain reports an agent share of 0.06. Agent weighting, the agent-share alarm and the "human-authored" exemplar labels are all wrong on the family's own repositories. | S (half a day plus a history rebuild) | Yggdrasil's agent-share line moves from about 0 to about 0.8 and the alarm fires. The 4-oracle reconstruction and the mutation harness do not regress. |
| 2 | **Gate the sub-gate lattice on the objective, not on share** (GM-2) | 58-66% of band rows do not compress under Grain's own objective, yet they become `advisory` rules. Result 101 already records precision 0.091, with 14 of 20 rows "not rules at all". | S (half a day plus a panel re-run) | Advisory precision on 101's held-out rows rises from 0.091, the "not a rule" count falls from 14 of 20, and drill false alarms stay at 0. |
| 3 | **Contrast null for absence norms, including zero-violation boundaries** (GM-1) | A boundary that has never been crossed is never a candidate, so the "decided negative" shape that 097 found missing cannot be produced by construction. A prototype recovers `io -/-> core` (0 of 22 vs 43.5% elsewhere) and `core -/-> cli` (0 of 66 vs 12.1%), which match hand aspects that already exist. | M (1-2 days plus a corpus re-run) | Shuffled edges certify about 0 absence norms. Vacuous norms such as `tests -/-> utils` and `.yggdrasil/aspects -/-> core` disappear. The count of hand fence rules matched by a certified zero-violation contrast rises above 0. |
| 4 | **Add a null-randomisation harness, `grain selftest --null`** (GM-9) | This is the only end-to-end measure of false certification. It validates recommendations 2, 3, 6 and 7, and it pairs with the existing mutation harness, which measures 0 false fires. | M (2 days) | The harness exists and reports per-family null certification counts, published in validation.md. The target is at most 1 per repository across all families. |
| 5 | **MDL change point on birth order in place of windowed OLS drift** (GM-4) | Drift and nucleation can never fire on a repository younger than about 180-270 days, which covers every repository in the family. That leaves `check` accusing new code after a team migrates to a new convention. | M (1-2 days) | Change points land within a few commits of a known corpus migration, a spot-check on Grain and Yggdrasil holds up, and mutation false fires stay at 0. |
| 6 | **A batch of cheap contrast fixes**: directional co-change gate (GM-7), an independence null for value concordance (GM-8), and a per-modification fix rate with associational wording (GM-6) | Each replaces a raw-share or flat-coin gate with the cell the engine already has. Each one targets a recorded failure. | S each (about 2 days total) | Co-change recall@3 beats the hot-file null (today 0.285 vs 0.336). The 4 YAML-schema value norms stop certifying. `cost` claims survive the popularity-matched control from 153. |
| 7 | **Partition-entropy oracle metrics and relation projection** (B1) | The current score reports node recall 0.107 and leaves 1259 of 1298 relations unscored. Conditional entropy shows the proposal is a near-perfect coarsening of the hand graph (H(P\|A)=0.10 bits), with projected relation recall 0.891 and precision 0.949. | S (1 day) | The granularity confound from 093 turns into two numbers a maintainer can act on. A synthetic split/merge test moves H(P\|A) and H(A\|P) in the expected directions. |
| 8 | **Name the imports that hold each cycle together** (B5) | Today Grain prints only the members of each cycle. On Yggdrasil, each of the two cycles is held together by 4 imports that are still present at HEAD. | S (1-2 days) | On corpus repositories that broke a cycle, the edges maintainers actually removed fall inside the proposed cut more often than a random-edge baseline. |
| 9 | **Documentation honesty pass** (GM-10) | "Six tuned thresholds … are gone" is contradicted by more than 15 undeclared constants, a comment that says 20% where the code uses 0.1, and a message that says "2x" where the code checks 1x. | S (hours for the fixes, half a day for the audit test) | A docs-audit test that fails on any undeclared numeric gate is green. |

Recommendations 3 (GM-3, the repair signal) and B3 (refusal-to-fix pairs) are the largest long-term opportunities. They come after 1-5 because each needs a cache or storage format change and has no proven payoff yet.

## 3. Findings table

| id | kind | priority | title | where | proposal |
|---|---|---|---|---|---|
| GM-1 | defect | high | Absence norms without violations are never considered; the certified ones look no better than a shuffled null | Grain engine/arch.mjs:51-60, :99, :131; mine.mjs:431-432 | A two-population KT contrast over files that have at least one out-edge; include k_A=0 pairs in the universe; drop the 0.1/0.3 floors; render as `deny` candidates |
| GM-2 | risk | high | The sub-gate lattice feeds advisory rules on raw share; most rows fail Grain's own objective | propose-lattice.mjs:47, :68, :87-89; propose-status.mjs:237 | Require contrast bits > 0 with a repo-wide index cost, a Beta lower-5% bound ≥ 2/3, the STRUCT_PID contrast, and a per-partition cap ranked by bits |
| GM-4 | defect | high | The time axis in wall-clock days disables drift and nucleation on young, fast repositories | weights.mjs:64-65, :91, :102, :117; config.mjs trendWinDays/calibHorizonDays; learn.mjs:417 | Sequential-KT MDL change point on birth order, indexed by commit order |
| GM-5 | defect | high | Agent provenance ignores Co-Authored-By trailers | history.mjs:268, :283; weights.mjs:38-42; learn.mjs:254; report.mjs:443 | Read the trailers in the log format; three-valued provenance (human, agent, pair); bump HIST_V |
| GM-3 | opportunity | medium | The repair signal (was a departure later fixed?) is computed but unreachable and unused | weights.mjs:50-58, :126-197; learn.mjs:271-298; propose-status.mjs:233-237 | A certified per-fact "repaired in practice" cell, all pid families, a commit-index split, used when choosing a rule's tier |
| GM-6 | defect | medium | The deviation "cost" is not normalised for exposure, yet the output wording is causal | learn.mjs:108-112, :559-583; history.mjs:597-600; mine.mjs:706-708; report-facts.mjs:212-217 | A per-modification binomial contrast, optionally stratified by size; associational wording |
| GM-7 | inconsistency | medium | The co-change gate takes the max of both directions with no base-rate contrast | completeness.mjs:52-60, :131; cards.mjs:287; history.mjs:704-707 | The obligation cell, forward direction only, gated at λ; delete cochangeMinConf and the 1/3 floors |
| GM-8 | defect | medium | Value concordance's 50/50 null certifies schema furniture (4 of 4 certified norms) | learn.mjs:773-821 (:806); mathematics.md "Value concordance" | An independence null given member marginals (Poisson-binomial) |
| GM-9 | risk | medium | Multiple comparisons are paid per family, with no repo-wide accounting and no empirical null check | learn.mjs:172, :562, :776; arch.mjs:89; commit-log.mjs; obligations.mjs:108; propose-lattice.mjs:47; spectrum.mjs:101; mathematics.md:12-14 | One repo-wide index universe or a log2(F) family charge; exact sequential KT codelength; a `selftest --null` harness |
| B1 | opportunity | medium | The oracle score hides that the proposal is a near-perfect coarsening of the hand graph | oracle.mjs:175-214; grain-oracle-score/1 | H(P\|A), H(A\|P), NMI, ARI and VI at each depth, plus relation projection by file majority |
| B3 | opportunity | medium | Refusal-to-fix pairs in Yggdrasil's verdict history are free labelled data, and they are lost today | Yggdrasil .yggdrasil/yg-events.llm.jsonl, lock; Grain has no reader | Keep refused content in a gitignored, content-addressed store; anti-unify the fix edits into candidate script rules, gated at λ |
| B5 | opportunity | medium | Name the few imports that hold each cycle together | relations.mjs:515-551; report.mjs moduleLayers | A min-weight feedback arc set per SCC (exact up to about 15 nodes, agony above that) |
| GM-10 | inconsistency | low | "Six tuned thresholds … are gone" is contradicted by undeclared constants and a comment/code mismatch | mathematics.md:31-32 and "The honest residue"; mine.mjs:415, :431-432, :575; weights.mjs:91, :117, :161, :194-195; history.mjs:599-600 | Fix the comment and the message now; extend the residue table; add a docs-audit test for numeric gates |
| B4 | opportunity | low | Undeclared co-change couplings that have a named channel (data contract, test-of, duplicated text) | grain-advise.mjs:123-208; results.md 153 | After GM-7, require a named channel before promoting a pair from data to advice |
| B6 | opportunity | low | An architecture trajectory from the declared graph's own git history | new `report --trajectory`; yg-node.yaml at past commits | Per-interval node and edge counts, depth, fan-in Gini, and upward edges against the agony rank |
| B7 | risk | low | Size and churn dominate; fan-in "risk" is a test/production confound | results.md 149-158 | A guardrail: any risk feature must beat log(LOC) plus log(commits) on both label sources, shown only as a residual |
| B8 | opportunity | low | Release and mission loops are an independent label source | Jarl issue format; Horde retro RETURN_SOURCES | A small label reader for the public Jarl and Horde formats, used for validation only |

(B2 duplicated GM-5 and is merged into it.)

## 4. Details for high-priority items

### GM-5: Agent provenance ignores Co-Authored-By trailers

**Evidence.** The log format is `%an <%ae>%x00%s` (history.mjs:268), and the agent test is `agent: AGENT_AUTHOR_RE.test(p[2])` (:283), which reads the author string only. Nothing reads commit bodies or trailers. The verifier re-counted the trailers. Yggdrasil has 1339 "Krzysztof Dudek" commits with a `Co-Authored-By` trailer and 233 without, and only 11 commits authored "Claude". Grain has 226 of 229 Krzysztof commits with a trailer; the original claim of 229/229 was a slight overstatement. Grain's cached model reports agentShare 0.06.

**Consequences.**
- The provenance weight (agentBase 0.15, promoted over 180 days, weights.mjs:40-41) never applies.
- The agent-share alarm (report.mjs:443, threshold 0.85) stays silent on exactly the repository where the true share is about 0.85.
- Exemplars are labelled "human-authored" (learn.mjs:254) when they were not.
- Agent-written code is the base-rate population the thesis says Grain should discount, and on the family's own repositories Grain cannot see it.

**Proposal.** Add `%(trailers:key=Co-authored-by,valueonly,separator=%x1f)` to the format. Mark a commit as agent if the author or any co-author matches `AGENT_AUTHOR_RE`. Keep three provenance values (human, agent, pair) so weighting can treat pair-authored code separately; pair can start at the agent weight. This bumps HIST_V. If GM-3 goes ahead, bundle both into one cache bump.

**Cost.** About 15 lines plus a history rebuild.

**How we would know.**
- Yggdrasil's agent-share line reads about 0.8 and the alarm fires.
- The 4-oracle reconstruction and the mutation harness do not regress.
- A count of the certified Yggdrasil facts whose support is mostly trailer-agent code, which shows how many "established" claims are overstated today.

### GM-2: The sub-gate lattice gates on raw share

**Evidence.** The band filter is `subGate = rows.filter(r => !r.isNorm && r.n >= MIN_SUPPORT && r.share >= SUPERMAJORITY && r.share < LAMBDA_BOUND)` (propose-lattice.mjs:87-89). It has no bits test. Its index cost is paid per partition (:47), not repo-wide. Its absence floor is 0.2 (:68), where mine() uses 0.1 and 0.3. Every drilled row that is not certified becomes `advisory` (propose-status.mjs:237). The prototype lat.mjs, calling the engine's own partitionLattice on the cached models, gave these counts (the verifier did not re-run them):

| | Band rows | bits ≤ 0 | Beta lower-5% bound ≥ 2/3 |
|---|---|---|---|
| Grain | 485 | 321 (66%) | 140 |
| Yggdrasil | 669 | 387 (58%) | 234 |

The top Grain row, `_repo _all:case auto.has:member_expression 358/410`, describes the language, not a decision. Grain's self-proposal drew 22 advisory rules from this band. Result 101 already measured the outcome: precision 0.091 on held-out rows, and 14 of 20 sampled rows were not rules at all.

**Proposal.**
1. Require bits_contrast > 0, using the role-vs-partition contrast for role cells and the GM-1 contrast for `_all` absences, with one repo-wide index cost shared with mine()'s `Crepo`.
2. Require the Beta(k+½, n−k+½) lower 5% quantile to be at least 2/3.
3. Apply STRUCT_PID's contrast-only rule.
4. Rank the per-partition reading cap by bits, not by share.

**Cost.** About 30 lines and no new constant.

**How we would know.** Re-run 101's bar-2 panel sample and both self-proposals. Advisory precision should rise from 0.091, the "not a rule" count should fall from 14 of 20, and drill false alarms should stay at 0.

### GM-1: Absence norms without violations are never candidates

**Evidence.** Candidate pairs (A,B) are built only for B in `targets`, the modules that at least one file in A reaches (arch.mjs:51-58). A boundary nobody has crossed therefore never enters the universe. The null is a flat coin, `data += nv*log2(kt(...)*2)` (:99), and vacuity is patched with `outsideShare(n) >= 0.1` (:131).

In a synthetic test, a domain with 0 of 20 files reaching infra is not reported, while `util->infra`, which has 1 violation, is. Grain's cached model holds vacuous norms such as `tests/relations -/-> engine 878/881, 841 bits`. The prototype permutation test certified as many absence norms or more on shuffled edges than on real ones (Yggdrasil 2 real vs 2.5 shuffled, Grain 1 real vs 3.5 shuffled). That result is unconfirmed: the Grain cache holds 3 absence norms, not 1, and the verifier did not re-run the test.

A contrast prototype restricted to files with at least one out-edge (arch3.mjs) recovers `io -/-> core` (0 of 22 vs 43.5% elsewhere, 8.2 bits) and `core -/-> cli` (0 of 66 vs 12.1%). The hand graph states boundaries of the same shape, for example events-reader-boundary ("NO file under source/cli/src/core/** may import it"). mine() has the same gap at scope level: a local absence counts only when at least 30% of the partition uses the thing (mine.mjs:432).

**Proposal.**
1. Count as capable only the files in A that have at least one resolved out-edge.
2. Take the reach-B rate p_O over capable files outside A and outside B.
3. Put every (A,B) with enough outside support into the universe, including pairs with k_A=0, and charge the index cost over that universe.
4. Gain = Σ n_v·log2(KT_A(v)/p_O(v)) − ½·log2 n_A − idxCost. A perfect absence with n=22 and p_O=0.435 gains about 18 bits before costs.
5. Speak when gain > 0 and the posterior (n_A−k_A+½)/(n_A+1) ≥ 1−1/λ.
6. Apply the same contrast to mine()'s local absence cells.

This deletes the 0.1 and 0.3 floors.

**Cost.** About 60 lines plus one module×module sweep.

**How we would know.**
- The permutation run certifies about 0 norms, below the real count.
- The vacuous norms disappear.
- On Yggdrasil and the four oracles, the count of hand fence rules matched by a certified zero-violation contrast rises above 0. Today that count is 0 by construction.

### GM-4: Drift and nucleation cannot fire on the family's repositories

**Evidence.** The window count is `nWin = Math.min(24, Math.ceil((NOW - t0) / (90 days)))`, and nucleation needs `shares.length >= 3` (weights.mjs:64-65, :102). The detector also rests on hand thresholds: slope > 0.02, at least 2 minority authors, minority share > 5%, and n ≥ 4 per window (:91, :117). Grain is 32 days old with 598 commits. All 19 of its trend-bearing facts have exactly one window, and none is nucleating. Yggdrasil started in May 2026, so it cannot reach three windows either. mathematics.md:24 says drift reads "the arrival process of a rule's instances", and the windowed OLS over snapshot shares does not do that. The code comment at weights.mjs:35-37 records that the project already fixed this mistake once, for survival.

**Proposal.** Order a fact's instances by birth and set x_i = 1 when an instance carries the expected value.
1. L1 = −log2 KT_seq(x_1..n).
2. L2(τ) = −log2 KT_seq(x_1..τ) − log2 KT_seq(x_τ+1..n) + log2(n−1).
3. A regime change is certified when L1 − min_τ L2(τ) − log2 C_facts > 0.
4. If P(exp | post-τ) < 1−1/λ, stop accusing births after τ.
5. If some other value reaches 1−1/λ after τ, report that value as nucleating.

This uses the commit index, not days, reads only data already stored (`H.lc` first-seen, `vev`), and runs in O(n) per fact. GM-3 should share the same commit-index split.

**Cost.** About 80 lines.

**How we would know.**
- τ lands within a few commits of a known corpus migration.
- A spot-check of the commits around τ on Grain and Yggdrasil holds up.
- Mutation false fires stay at 0.

## 5. What is already good

- **One objective, used consistently in the core families.** Role cells, obligations, the language bridge and change archetypes all code outcomes as a KT estimate against a base rate, pay BIC and an index cost, and speak only past λ=8. Almost every fix above says "use the cell you already have", which speaks well of the design.
- **Recorded negatives.** results.md 101, 153, 157 and 149-158, and study 097, record the failures this report explains. The research did not have to discover the symptoms, only trace them to their mechanisms.
- **The mutation harness measures 0 false fires.** That is the right shape of evidence. GM-9 asks for its counterpart for false certification.
- **The project has fixed this class of mistake before.** Survival moved off an absolute 120-day scale (weights.mjs:35-37), and GM-4 applies the same fix to trends.
- **The oracle records already store file index sets.** B1 needs no new data.
- **"The honest residue" section exists** (mathematics.md:197+) and already declares cochangeMinConf and the two-thirds marker supermajority. GM-10 extends a practice that is already in place.
- **The upstream reviewer is stable.** 2080 (rule, unit, hash) keys in Yggdrasil's verdict log were judged more than once, and 0 got different dispositions. That makes B3's refusal labels trustworthy.

## 6. Open questions for the owner

1. **Which release gets these changes?** 6.1.0 is paused before main.
   - (a) Ship only GM-5 and the GM-10 comment and message fixes in 6.1.0. This is small and low-risk, but GM-5 changes the output numbers and rebuilds history.
   - (b) Put everything in the next release. This is clean but leaves agent share wrong for another cycle.
   - (c) Hold 6.1.0 for GM-1, GM-2 and GM-5. This costs about 3-4 days plus corpus re-runs.

2. **Should zero-violation boundaries (GM-1) become `deny` candidates, or advisory text only?** Deny candidates bring Grain close to what hand rules look like (097's lost bet), but a wrong deny blocks code. Advisory text is safe but may go unread.

3. **How should pair-authored commits (human plus Co-Authored-By agent) be weighted?**
   - (a) At the agent weight: consistent with "the agent typed it".
   - (b) At a separate prior, somewhere between the two: this needs one measurement to set.
   - (c) As human: this keeps today's behaviour, and leaves the thesis claim unmeasured.

4. **Should the null harness (GM-9) come before the fixes or after them?**
   - (a) Before: 2 days first, and every later fix is measured against a baseline.
   - (b) After: faster to ship, but the improvement is never quantified.
   Before is recommended.

5. **Should Grain read Yggdrasil's evidence files (B3, B8)?** Doing so couples two tools that are separate today, and B3 needs Yggdrasil to keep refused content in a gitignored store (about 1 day, plus local disk growth). The alternative leaves the best labelled data in the family unused.

6. **Should GM-3 (repair as a tiering signal, L, a cache bump) be funded now or parked?** It is the most direct route to "law is decided, not observed", but its payoff is unproven. A cheap middle path is to share the commit-index split with GM-4 now and bundle the cache bump with GM-5, then decide on the full cell after the null harness exists.

Prototype scripts from this research (read-only, run against cached models): `<session scratchpad>/research/grain-math/` (arch.mjs, arch3.mjs, perm.mjs, lat.mjs, cc.mjs) and `<session scratchpad>/research/grain-b/` (cochange.mjs, hot.mjs, layers.mjs).
