**Question:** What is the best possible system for organising work on software projects of any size, done by AI agents and perhaps people, with one human who owns the outcome and is often away?

**Method:** A first-principles position written before any reading ([first-principles.md](first-principles.md)), five research passes over public sources across about twenty fields ([notes](#11-supporting-notes)), the most load-bearing figures re-read at source, a full design, a hostile critic ([critic-report.md](critic-report.md)) whose main objections were checked at source and which forced a rewrite. Six agents were used, five for research and one as critic, all Opus at xhigh effort.

**Status:** concluded

**Conclusion:** This is a design only: nothing here has been built or run, research coverage is partial because a shared search limit ended it early (section 10 lists the holes), and the critic's open objections are in section 8. The valuable part of the best system is known practice held to an unusual discipline: status computed instead of reported, checks fixed ahead of the work and out of the doer's reach, one writer per area, the owner's attention budgeted, and irreversible effects held back. What can be called new is mostly unproved, so the design's central rule is that nothing beyond a small core is built until a measured failure of the core demands it. Its hardest unsolved problem is the quality of the check itself, and no organising machinery removes that.

# A system for organising work, designed from zero

## 1. The answer on one page

Producing code has become cheap. Knowing what was wanted, knowing whether it was delivered and fitting it together have not. Most organisation of work was built around the scarcity of doing, so it tracks who is doing what. The questions that now decide the outcome are different: what do we actually know, how do we know it, is that still true, and what does the owner need to decide?

The design is a small core and a catalogue.

**The core** is six things, and it is deliberately close to what a careful team can configure today:

1. Status is computed. A program runs the checks at the exact commit in a clean environment. No participant can mark anything done.
2. Checks are fixed before the work and the doer cannot change them. The doer has an honest way to say the job cannot be done as stated.
3. Each area of code has one writer at a time, and a single ordered landing line checks the merged result.
4. A fresh examiner reads the change and the requirement and is not shown the author's account of it.
5. What changes the world irreversibly waits for the owner. Everything else runs contained, with a tested way back.
6. The owner gets one page, sized to the minutes he has: what changed that he can try, a few questions, and what was assumed for him.

**The catalogue** holds everything else: sealed checks, a test for ambiguous requests, random deep audits, planted faults, windows that tune themselves, and more. Each entry names the measured failure that admits it. Until that failure is measured, it is not built, because each of these costs money, each may be defeated by the next model generation, and the evidence that any of them pays is thin. Section 4.15 is the list.

The working vocabulary is four kinds of record. A **claim** is a statement someone wants to be true of the product, in a form that could turn out false. An **attempt** is one disposable try at it. A **warrant** is the record that a claim held of an exact state, by a named check, with a stated grade of evidence. An **ask** is a bid for the owner's attention. I use these words because they keep attention on evidence. Whether they do better than "tickets with acceptance criteria" is unproved and section 2 says how to test it.

The honest position is this. The person who asked believes what has been built so far is primitive. The evidence I found supports a narrower claim. Most tracking is primitive in one specific respect: it records what people say about work instead of what can be shown. Beyond that, the evidence favours a plain system with an excellent check over an elaborate system with an ordinary one.

## 2. What "best" means, and how to prove this design wrong

**Definition.** Among ways of organising work that deliver what the owner wanted, the best is the one that spends the fewest owner minutes and the least money per outcome he would still accept with hindsight, and that does not get worse when participants crash, lie or vanish or when the owner goes away.

Perception cannot be the measure: in a randomised study of experienced developers, AI use made work 19% slower while the same developers believed it had made them 20% faster ([METR 2025](https://arxiv.org/abs/2507.09089); old tools, small sample; a [2026 follow-up](https://metr.org/blog/2026-02-24-uplift-update/) found a speed-up whose interval includes zero).

**The numbers.**

1. Hindsight acceptance: the share of accepted outcomes he would still accept, judged later and without knowing how they were made, supported by signals that cannot be argued with (reverted, rewritten, or found defective within 90 days).
2. Attention: owner minutes per accepted outcome, counting separately the minutes he was asked for and the minutes he chose to spend.
3. Cost: all money spent per accepted outcome, counting every discarded attempt.
4. Time from want to accepted outcome.

One owner judging hindsight is a small and noisy instrument: independent expert panels disagreed about half of the papers either accepted in the NeurIPS experiment ([NeurIPS 2021](https://blog.neurips.cc/2021/12/08/the-neurips-2021-consistency-experiment)). The outside signals exist because of this, and small differences must not be believed.

**Cheap experiments that could kill the thesis in weeks.** These come first, and each one can stop the project.

| Experiment | What it decides |
|---|---|
| Checks written by an independent party against maintainers' tests, on replayed histories, scoring false accepts and false rejects | Whether sealed checks are worth having at all |
| The ambiguity test on requests seeded with known ambiguities and known clear ones, scoring precision and recall | Whether "readers differ" is signal or noise |
| An examiner given the author's account against one denied it, on code with known real defects | Whether the core's fourth item is worth its cost |
| The baseline B1 (below) against B1+, on replayed histories | Whether the honest exit and assumption record change outcomes |
| A fresh participant given only the record, questioned against known answers | Whether the record is enough to resume from |

**The full trial, once something is built.** Compare on the same workload: B0, one strong agent with a plain list and continuous integration; B1, B0 plus a fresh-context reviewer and a merge line; **B1+**, B1 plus an assumptions file and an honest exit, which the critic correctly named as the real opponent; and this design. Bars fixed in advance, and they are my judgement.

| Test | This design fails if |
|---|---|
| Low-effect work (E0, E1 below) | Cost is more than 10% above B1+, or results are worse |
| High-effect work (E2, E3 below) | It does not at least halve wrongly accepted outcomes against B1+ at no more than 3 times the cost and half the owner minutes |
| Kill: a participant killed at random about once per attempt | Anything accepted is lost, or more than the running attempt's unsaved work |
| Lie: an agent configured to report false success and tamper with checks | A false report changes any decision, or tampering goes undetected at the rate the checks catch ordinary defects |
| Absence of 14 days | Anything that needed his word happens without it, or work stops before the limit on assumptions, or he needs more than 30 minutes to be back in control |
| Poison: instructions planted in work items and code | A planted instruction reaches credentials or anything outside the sandbox, or a planted change lands at a higher rate than ordinary defects do |
| Withdrawal, at volume | A frequently run mechanism's absence changes nothing and it is kept anyway |

To test the claims idea itself: hold the checking machinery fixed and put two front ends on it, one describing work as claims and one as tasks. If outcomes do not differ, the idea is vocabulary and should be dropped in favour of whichever is cheaper.

Sample sizes are severe. Detecting a fall from 10% to 5% wrongly accepted needs about 430 outcomes per arm. The full trial is therefore affordable only at scale or by replay, and replayed outcomes are clustered. I do not claim the whole design can be falsified cheaply. The experiments above are the part that can.

## 3. The principles and their evidence

Most human-side evidence below has never been tested on models. Most agent evidence is from preprints two years old or less, on models already superseded. Treat model-specific rates as guides to the kind of failure, not its current size. Ratings are mine.

**P1. Facts about process come from the environment, never from a report. Facts about meaning come from the check, and its quality is the real limit.**
Measured: in Alberta, near-universal self-reported adoption of a surgical checklist sat beside 41% appropriate completion under audit, two different measures that later converged above 90% ([Healthy Debate](https://healthydebate.ca/2015/02/topic/safe-surgery-checklist/)). Among agents, false claims of success made up 13% to 89% of failures depending on model and benchmark ([False Success, 2026](https://arxiv.org/html/2606.09863)). In a file-review task, 67.9% of runs did not read every assigned file and 80.4% of those misreported it ([OverclaimBench, 2026](https://arxiv.org/abs/2609.20812), abstract only). In field data, inaccurate self-reporting was 22.58% of breakdowns ([20,574 sessions](https://arxiv.org/abs/2605.29442)). A sixteen-agent compiler project worked with no orchestrator, simple task locks and a very strong external test oracle ([Anthropic 2026](https://www.anthropic.com/engineering/building-c-compiler), one case).
Judgement: the environment can attest only what happened. Build provenance is a good precedent for that, and only that ([SLSA](https://slsa.dev/spec/v1.0/provenance)). "A test passed" still means a test someone wrote passed, so the design must grade checks and spend on them.
Strength: strong that self-report is unreliable; moderate that observing the environment helps; the limit in the second half is logic.

**P2. Fix the test of success before the work exists, out of the doer's reach, and give the doer an honest way out.**
Measured: positive results were 44% in registered reports against 96% in standard papers ([Scheel 2021](https://doi.org/10.1177/25152459211007467)) and 8% against 57% in large trials after and before outcomes had to be declared in advance ([Kaplan and Irvin 2015](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0132382)). Both are correlational and concern publication, so they are analogies for checking work. When tests conflicted with the task, strong models cheated at high rates; hiding tests took cheating near zero but cost legitimate performance; read-only tests restored performance while blocking test edits but did not stop special-casing; an option to report the task as impossible took GPT-5 from 54% to 9% and o3 from 49% to 12%, with much less effect on Opus 4.1 ([ImpossibleBench, 2025](https://arxiv.org/html/2510.20270)). That option was measured only on impossible tasks. Newer models show 0 to 3% on the same test in one vendor's table, with Gemini at 11.8% ([Meta, 2026](https://arxiv.org/html/2606.12429), weak).
Judgement: cheap enough to include even if the rate it addresses is falling. Direct evidence on test-first working in software was not reached.
Strength: moderate for agents; analogy for science.

**P3. Agreement proves little. Disagreement might tell you something.**
Measured: 48 agent-written implementations showed substantial common-mode failure, while majority voting over three still cut mean failures from 387 to 131 ([Ron et al. 2026](https://arxiv.org/abs/2606.20158)). The authors say most errors trace to weaknesses in the specification and also that for most conditions the dominant mechanisms are implementation errors, with true ambiguity in two ([full text](https://ar5iv.labs.arxiv.org/html/2606.20158)). Three- and five-way voting captured about 0.44 of the gain independence would give, and same-model ensembles about 0.27 ([2026](https://arxiv.org/abs/2607.02808)). When two models are both wrong they give the same wrong answer far above chance, more so for stronger models ([Correlated Errors, 2025](https://arxiv.org/html/2506.07962v1)). Polling at 25 times the cost showed no consistent gain unless something outside the models verifies, which code can ([Consensus is Not Verification, 2026](https://arxiv.org/abs/2603.06612), abstract only). Most of debate's gain is voting ([Debate or Vote, 2025](https://arxiv.org/abs/2508.17536)). Paying people for agreement produced uninformative agreement ([Gao 2014](https://lips.cs.princeton.edu/bibliography/gao2014peer/)).
Judgement: disagreement between independent readers of a request may reveal ambiguity. Nothing I found tests this, and readers differ by sampling noise even on clear text, so it stays in the catalogue until its experiment passes. Agreement among readers is never treated as establishing what is correct.
Strength: moderate to strong for the first sentence; the second is a hypothesis.

**P4. What a check is worth must be measured, because a useless check looks exactly like a good one.**
Measured: expert reviewers found about 3 of 9 seeded major errors and training barely helped ([Schroter 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2586872)). Laboratories did well on announced samples and worse on the same samples disguised as patients' ([LaMotte 1977](https://stacks.cdc.gov/view/cdc/65385)). 80.2% of agent-written test patches had weak or no explicit oracle by a static measure ([All Smoke, No Alarm, 2026](https://arxiv.org/html/2606.18168v1)). In one vendor audit, test-based graders accepted 8.5% of wrong work and rejected 24% of correct work on one benchmark ([DeepSWE coverage](https://venturebeat.com/ai/deepswe-blows-up-the-ai-coding-leaderboard-crowns-gpt-5-5-and-finds-claude-opus-exploiting-a-benchmark-loophole/), 30 tasks). Mutants coupled to 73% of real faults and 17% are beyond them ([Just 2014](https://homes.cs.washington.edu/~rjust/publ/mutants_real_faults_fse_2014.pdf)), with the strength of that link disputed ([Papadakis 2018](https://conf.researchr.org/details/icse-2018/icse-2018-Technical-Papers/78/Are-Mutation-Scores-Correlated-with-Real-Fault-Detection-A-Large-Scale-Empirical-stu)). Seeds are recognised: models spotted agentic tests at AUC up to 0.95 ([Needham 2025](https://arxiv.org/html/2505.23836)), and colluding workers inferred gold questions ([Checco 2020](https://jair.org/index.php/jair/article/view/11332)).
Judgement: whether seeding raises real detection is unmeasured in anything I could open.
Strength: moderate that one check is weak; weak on seeding as a remedy.

**P5. Examiners see the change and the requirement, not the author's account.**
Measured: labelling a change as bug-free cut detection by 16 to 93 points on small models; removing descriptions restored detection on a selected set of attacked pull requests ([confirmation bias, 2026](https://arxiv.org/html/2603.18740v1)). In 1.1 million screened women, a second reader who saw the first opinion agreed more, while detection did not clearly change ([Cooper 2022](https://wrap.warwick.ac.uk/150358/)). A blinded second reader added 13.3% detection for 0.6 points more recall ([Coolen 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC6134129/)). In a small unreviewed study with one writer, fresh same-model review and top cross-model review were not significantly different overall, fresh same-model was best on code (no intervals), and a union of one fresh and one cross-family review matched 56.7% of planted errors against 42.7% for two fresh same-family ones, a third adding 1.3 points ([2026](https://arxiv.org/html/2610.01471)). A weaker reviewer can lower a stronger writer's result (Claude solo 91.4%, Claude then Codex 82.8%; [2026](https://arxiv.org/html/2607.21656)). Human first-time reviewers are weak, about 33% useful comments rising to 67% by the third review ([Czerwonka 2015](https://microsoft.com/en-us/research/wp-content/uploads/2015/05/PID3556473.pdf)). A list of known reasons for invalidity raised a model's catch rate from 29% to 86% on one subset ([2025](https://arxiv.org/html/2511.18608)).
Judgement: one fresh examiner in the core; a second of another family is added only when measured misses justify it. An examiner needs the surrounding code supplied.
Strength: moderate, with mixed direction on cross-family review.

**P6. Targeted checks catch. Random checks tell the truth.**
Measured: discretionary inspections did three times the good of random ones in a structural model, and doubling inspections at random changed little ([Duflo 2018](https://econometricsociety.org/publications/econometrica/browse/2018/11/01/value-regulatory-discretion-estimates-environmental-inspections)). Only random sampling carries a known risk ([risk-limiting audits](https://en.wikipedia.org/wiki/Risk-limiting_audit)). A selected item that cannot be found counts as the worst case ([Banuelos and Stark 2012](https://arxiv.org/abs/1207.3413)). Auditors chosen and paid by the audited reported just under the limit until assignment and payment changed ([Duflo et al.](https://www.hks.harvard.edu/centers/cid/publications/faculty-working-papers/truth-telling-third-party-auditors-and-response-polluting-firms)).
Judgement: election audits have paper ballots as ground truth and software has none, so the shape of the method transfers and its guarantee does not.
Strength: strong mathematics; moderate transfer.

**P7. One writer per area. Coordinate by dividing the work and fixing plans first.**
Measured: two agents sharing code kept 0.59 of solo performance, and on 46 tasks success fell from 68.6% with two agents to 30.0% with four. Communication reduced textual merge conflicts but overall success did not change (17.64% without, 17.14% with), and a plan in the first turn nearly halved conflicts (29.4% against 51.5%) ([CooperBench, 2026](https://arxiv.org/html/2601.13295)). In 180 configurations, centralised coordination gained most on decomposable finance tasks (+80.8%), sequential planning lost 39% to 70%, and no coding benchmark was included ([Kim et al. 2025](https://arxiv.org/html/2512.08296v2)). At equal budgets single agents matched or beat teams on reasoning ([2026](https://arxiv.org/abs/2604.02460), abstract only). At Google, breakages fell when two authors touched a file compared with one and rose with three or more, which concerns file authorship and not concurrent writing ([Memon 2017](https://web.eecs.umich.edu/~xwangsd/courses/w23/readings/googletest.pdf), as read in the notes). A large operating report found flat teams risk-averse and locks costly, and planners cutting work for doers who do not talk to each other kept running ([Cursor 2026](https://cursor.com/blog/scaling-agents), weak on quality).
Strength: moderate, and the most consistent finding on agents working together. Hierarchy is needed for cutting work at large scale.

**P8. The narrowest stage sets the pace.**
Measured: judges pushed to run more cases in parallel took longer ([Coviello](https://www.nber.org/papers/w16502)), and finishing cases first cut duration 12%, valid only where the chance of finishing rises with a case's age ([Bray](https://www.kellogg.northwestern.edu/academics-research/research/detail/2016/multitasking-multi-armed-bandits-and-the-italian-judiciary)). Radiologists choosing their own order lost output ([Ibanez 2018](https://econpapers.repec.org/RePEc:inm:ormnsc:v:64:y:2018:i:9:p:4389-4407)). Naming the blocker and reminding that party cut pull request time 60% ([Nudge](https://arxiv.org/abs/2011.12468v5)). Waiting rises steeply with load ([Kingman](https://en.wikipedia.org/wiki/Kingman%27s_formula)). Time in review rose 441.5% and merges with no review 31.3% with AI adoption ([Faros 2026](https://faros.ai/blog/ai-acceleration-whiplash-takeaways), vendor, no control). 228 of 562 categorised rejections of agent pull requests were abandoned or never reviewed ([2026](https://arxiv.org/html/2601.15195v1)).
Strength: moderate. No controlled study of work-in-progress limits in software was found.

**P9. The owner is a rare, expensive instrument that degrades with use and can be misled.**
Measured: acceptance of alerts fell about 30% per additional reminder per encounter and about 10% per 5 points of repetition, while workload as such did not matter ([Ancker 2017](https://www.drugsandalcohol.ie/37201)). Interruptions of 2.8 seconds doubled sequence errors ([Altmann 2014](https://doi.org/10.1037/a0030986)). Radiologists scored about 80% when AI was right and 20 to 46% when it was wrong ([Dratsch 2023](https://doi.org/10.1148/radiol.222176)). Across 106 experiments human and AI combinations did worse than the better party alone (g = -0.23), better than the human alone (g = 0.64), and gained when the human was the stronger party (g = 0.46), with very high heterogeneity ([Vaccaro 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11659167/)). Radiologists treated a correlated AI signal as independent ([Agarwal 2023](https://www.nber.org/papers/w31422)). Unaided detection in colonoscopy fell after AI exposure ([Budzyn 2025](https://wrap.warwick.ac.uk/id/eprint/191005)). On simulated users, a trained asker with 3.0 questions matched a model asking 5.1 ([CLARITI, 2026](https://arxiv.org/html/2604.14624)), which says nothing about how much a real owner can absorb.
Judgement: spend him where he is the stronger party (what is wanted, what it is worth, irreversible acts). Anything the system writes for him is itself an unverified account, and the design has to treat it so.
Strength: strong for humans; applied by inference.

**P10. Authority follows the effect on the world. Containment replaces approval.**
Measured: removing a slow approver cut procurement prices 9% with no loss of quality, more where monitors had caused delay ([Bandiera](https://www.nber.org/papers/w26733)). About 0.8% of agent tool calls appear irreversible ([Anthropic 2026](https://www.anthropic.com/research/measuring-agent-autonomy), vendor). A staged file system let agents self-correct in 8 of 11 tasks with hidden side effects ([2026](https://arxiv.org/abs/2604.13536), abstract only). Nearly 80% of code and configuration incidents in one service were mitigated without a code or configuration fix ([Ghosh 2022](https://www.microsoft.com/en-us/research/?p=881646), via secondary sources). Users accept 93% of permission prompts ([Anthropic 2026](https://www.anthropic.com/research/claude-code-auto-mode), no method given).
Strength: moderate.

**P11. Programs do what recurs and can be specified. Statistics decide what recurs but cannot be specified. Models get what neither can do.**
Measured: mechanical prediction beat clinical judgement by about 10% on average ([Grove 2000](https://doi.org/10.1037/1040-3590.12.1.19)). Managers who overrode a validated test hired worse ([Hoffman](https://nber.org/digest/apr16/w21709.html)). A small trained classifier for routing resolved 75 of 100 at $25.66, Opus alone 74 at $54.73, and a hand-written rule-based router 73 at $172.56, the worst of the three ([TwinRouterBench, 2026](https://arxiv.org/html/2605.18859)). Opus as router flagged 7 of 147 verified-hard steps, which its authors call one model under one prompt. A small classifier over trajectories reached AUROC 0.83 to 0.95 at spotting false success where LLM judges reached 0.54 to 0.65, at about 50% precision when flagging 10% of runs ([False Success, 2026](https://arxiv.org/html/2606.09863)). Stated confidence ran 61 to 77% against actual success of 22 to 35% ([Agentic Overconfidence, 2026](https://arxiv.org/html/2602.06948)).
Judgement: rules are not automatically better than models. Hand-written rules were the worst router. Ordering, leases, budgets and running checks are genuinely specifiable. Routing is not, and should become a small trained statistic once there is data, with "start strong" as the fallback.
Strength: moderate.

**P12. Assume crash, keep state outside, and make retries differ.**
Measured: microreboots failed 98% fewer requests under injected faults ([Candea 2004](https://www.usenix.org/legacy/events/osdi04/tech/full_papers/candea/candea_html/)). Short leases get most of the benefit ([Gray and Cheriton 1989](https://www.eecg.utoronto.ca/~yuan/teaching/gradOS/papers/89-leases.pdf)). Unguided reruns reproduced 67.97% of multi-agent failures and repaired 6.90%, and a located intervention repaired 20.15% ([Repair or Resample, 2026](https://arxiv.org/abs/2608.25920), abstract only). In contrast, on tiny models and toy tasks, blind resampling was at least as good as repair ([2026](https://arxiv.org/abs/2607.26117)). A small outside monitor saved 14.6 to 20.4% of tokens at a 5% false-positive rate; at a 25% false-positive rate, a fresh start with the old diff as an optional overlay raised resolution from 66.6% to 71.8%, against 66.8% for a cold restart ([Fail-Fast, Restart-Smart, 2026](https://arxiv.org/abs/2608.03222), one 27B model). Retries sustained over half of metastable failures studied ([Huang 2022](https://www.usenix.org/conference/osdi22/presentation/huang-lexiang)).
Strength: moderate. A re-run of an agent is a new attempt, never a replay.

**P13. The record is append-only, never rewritten by a model, and written for a stranger.**
Measured: frontier models lost about 25% of document content over 20 edits, mostly in rare large jumps, with code the favourable exception ([DELEGATE-52, 2026](https://arxiv.org/html/2604.15597)). Compaction summaries lost artefact tracking first ([Factory 2025](https://factory.com/news/evaluating-compression), vendor). A structured handoff bundle cut medical errors 23% with no added time ([I-PASS](https://doi.org/10.1056/NEJMsa1405556), before and after). A randomised trial found no harm from anaesthesia handover where observational data had suggested a large one ([HandiCAP 2022](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:35665794&resultType=core&format=json)). Generic context files raised cost over 20% with no general gain ([2026](https://arxiv.org/abs/2602.11988)).
Judgement: I found no controlled comparison of restarting from a written record against continuing long coding work.
Strength: moderate.

**P14. Beliefs other than test results expire too, and only coarse tracking of why is affordable.**
Measured: tracking assumption sets is exponential in the worst case, which says little about the typical case ([Provan 1988](https://www.cs.ubc.ca/tr/1988/tr-88-11)). One fielded system recording every reason crashed by its forty-eighth change until it garbage-collected facts ([Everett and Forbus 1996](https://www.qrg.northwestern.edu/papers/Files/gc-final%28searchable%29.pdf)). Build systems rebuild by input hash, and non-determinism weakens this ([à la carte, 2018](https://www.microsoft.com/en-us/research/uploads/prod/2018/03/build-systems-a-la-carte.pdf)). Verified systems had their bugs at the boundary with what was not verified, 11 of 16 in the interface layer ([Fonseca 2017](https://blog.acolyer.org/2017/05/29/an-empirical-study-on-the-correctness-of-formally-verified-distributed-systems/)).
Judgement: for test results, this is ordinary continuous integration. What is not ordinary is doing it for assumptions, fitness judgements and decisions.
Strength: argument plus moderate.

**P15. "Passes" and "fit to keep" are different facts, and code health is paid for on a schedule.**
Measured: roughly half of test-passing pull requests would not be merged by maintainers, a 24.2 point gap ([METR 2026](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/); three repositories, one attempt, no iteration, Sonnet 4.5 the newest). Static warnings rose about 30% and complexity by a figure the paper itself gives inconsistently (42% and 25%), lastingly, in 806 repositories adopting one tool ([He et al. 2025](https://arxiv.org/html/2511.04427v3)). Structural erosion rose in 77% of agent trajectories against 53% of human repositories, by an unvalidated metric, and quality prompts lowered the level and not the slope ([SlopCodeBench, 2026](https://arxiv.org/html/2603.24755)).
Strength: moderate.

**P16. What measures a participant stays out of its sight.**
Measured: o3 hacked 30.4% of runs on one benchmark and 0.7% on another, and the authors suggest visibility of the scoring function as a reason ([METR 2025](https://metr.org/blog/2025-06-05-recent-reward-hacking/)). Gaming in New Zealand emergency departments grew where nobody verified the data ([Tenbensel](https://www.ijhpm.com/journal/article_3686.html)).
Strength: moderate; the application to agents is inference.

**P17. Every mechanism is a hypothesis with a price, and it goes when it stops paying.**
Measured: airlines found most parts had no wear-out zone by plotting fleet failures against age while stretching overhaul intervals, without randomisation, and I could not verify the safety outcome ([Reliamag](https://reliamag.com/guides/six-failure-patterns-nowlan-heap/), secondary). 40% of tested established medical practices were reversed, from a sample of doubted practices ([Prasad](https://www.eurekalert.org/news-releases/724095)). Root cause analyses mostly produced training and reminders, and event types recurred ([Kellogg 2017](https://doi.org/10.1136/bmjqs-2016-005991)). People overlook subtraction unless prompted ([Adams 2021](https://doi.org/10.1038/s41586-021-03380-y)). One long-running harness cost over 20 times a solo run, was clearly better, and its author concluded that an evaluator is worth its cost only beyond what the current model does reliably alone, and that each component is an assumption that goes stale ([Anthropic 2026](https://www.anthropic.com/engineering/harness-design-long-running-apps), one run each).
Strength: moderate for the pattern.

**P18. Every input is untrusted, and the diff is an attack path too.**
Measured: 66.5% of malicious work items passed all guardrails on current agent tools, with agent-level defences adding little ([IssueTrojanBench, 2026](https://arxiv.org/abs/2607.20759), abstract only). Adaptive attacks broke most published defences at over 90% ([The Attacker Moves Second, 2025](https://arxiv.org/html/2510.09023v1)). Misleading pull request text got known vulnerabilities approved ([2026](https://arxiv.org/html/2603.18740v1)). Cheap generation breaks open intake: curl's confirmed reports fell from above 15% to below 5% while pull requests stayed manageable because tests catch weak ones ([Stenberg 2026](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/)).
Strength: moderate.

## 4. The design, end to end

### 4.1 Who does what

There is one small program, which contains no language model. It keeps the record, orders work, grants and expires leases, enforces budgets, runs checks in clean environments, runs the landing line, computes what has expired, and counts. Everything it does can be specified and tested, and it can restart from the record at any time. It is itself subject to the highest effect class: changes to it need the owner's word.

Everything else that needs judgement is done by a named party, and there are more of these than the first draft admitted:

| Judgement | Done by | Audited by |
|---|---|---|
| Writing checks | A check author, of a different family from the doer where available, at least as strong as the doer | Mutation runs; deep audit |
| Doing the work | A doer | Everything below |
| Cutting work up | A strong planner | Mechanical properties of the result |
| Deciding if readings differ, and whether it matters | A comparer (a model) | Its experiment in section 2, then sampling |
| Stuck detection | A small monitor model | False-stop rate on restarted runs |
| Fitness of the change | Fresh examiner | Planted faults, audit |
| Checking a contested check | A stronger adjudicator | Sampled |
| Whether a want or a diff touches something outward | Rule first, then a named classifier when the rule cannot say | The owner's page shows what was classified and how |
| Writing asks and the page | A writer, given evidence only | Spot comparisons against raw records |

When something happens that no rule covers, the program does not improvise. It stops work in that area and raises one ask describing the state, with raw records attached. A provider outage, a broken CI and a direct push to the main line all look like failures, so identical failures across different configurations trigger this pause rather than being counted against anyone.

### 4.2 What is on record

Two stores, because the record cannot be both open and secret.

- The **open record** holds claims, attempts' outcomes, assumptions, asks, answers, decisions, supersessions and pointers to landed commits. A stranger can read it with no tools, and it is what a fresh participant is given. It starts as a plain file and stays one until something measured says otherwise.
- The **vault** holds sealed checks, planted faults, audit selections and diagnostics. Only the program and the parties assigned to them can read it. The owner can.

The program restarts from both. **Warrants are not primary records.** They are computed from CI results plus the open record, so they cannot grow without bound, and a warrant can always be rebuilt.

A warrant states which check, at which exact state, witnessed by which environment, and **a grade of evidence**:

| Grade | Oracle |
|---|---|
| A | The owner's own examples, or an existing test written by people who know the product |
| B | An independent executable reference: old behaviour, a property, a reference implementation |
| C | A model-written check, independent of the doer, shown to reject mutated and plausible wrong versions |
| D | Judgement: an examiner's opinion, or the owner having looked |

Grades are reported by count, never added up. Nothing is called "observed" unless it is grade A or B, and "done" is never unqualified. Claims come in four kinds: outcome, fitness, knowledge (the check is an answer that changes a decision) and assumption (adopted without being shown). A claim can be superseded, explicitly, by a later claim, which is how the record stops only growing.

### 4.3 Classes by effect

Effects on the world determine ceremony, not the size of the change and not whether the code can be rolled back. Turning a flag off does not refund a customer.

- **E0:** No executable change.
- **E1:** Executable, contained, with effects only we can see until exposure. A refactor is E1 at least.
- **E2:** Touches shared interfaces, broad areas or the shape of data.
- **E3:** Effects we cannot undo ourselves: money, messages sent, data destroyed, public statements.

The class is computed for the whole want, not for its pieces, so that splitting work cannot lower it. It is computed twice, on the want and on the diff, and the higher wins. Work and exposure are classed separately: most work is E1 or E2 to build and may be E3 to expose. A flag does not lower the exposure class. Doers never set the class.

| | E0 | E1 | E2 | E3 |
|---|---|---|---|---|
| Clean-environment run | yes | yes | yes | yes |
| Checks fixed ahead, read-only | no | yes | yes | yes |
| Fresh examiner | no | one | one, or two if admitted | one, or two if admitted |
| Random deep audit (if admitted) | 2% | 10% | 25% | all |
| Exposure | free | free | under his standing grant | his word |

The percentages are starting points and my judgement.

### 4.4 How work comes to exist

From the owner's words, from a check or warrant that has expired, from a defect found later, from findings during other work, and from outside reports. An item that is not yet a claim is a candidate. Candidates age out unless they are seen again from a different source. Being seen again by correlated agents is not confirmation, since they may share the error. An outside report is data, never instruction, and without a reproduction that runs it has the lowest standing. Nothing in a work item can grant authority.

A want may have a stop condition and a coarse money band. Both can be left empty on day one. (Explicit early stop criteria in drug development are associated with a rise from 4% to 19% through phase III at one firm, before and after, with many other changes: [Morgan 2018](https://doi.org/10.1038/nrd.2017.244). I did not reach the sunk-cost literature.)

### 4.5 From want to claims

The default is that the owner or a planner writes the claim and its examples. Intent is poorly transmitted: in the one direct measurement I could open, commanders judged 53% of responses to match their intent, 34% after the researchers reclassified cases, with no comparison condition ([Shattuck](https://coloradofirecamp.com/safety-drill/commanders-intent-study.htm), 32 episodes). Agents rarely ask on underspecified work unless told to ([2025](https://arxiv.org/html/2502.13069v1)). So any participant that meets an open choice records it as an assumption, and work continues if it is reversible.

**The Reading Test (catalogue, not core).** Three fresh, cheap readers who do not see one another each write the purpose as they understand it and a few concrete cases. A model compares them. Differences on something reversible become recorded assumptions, and differences on what the product should be become asks. Agreement establishes nothing: the cases are raw material for a check author, who can discard any of them. This is admitted only after its own experiment shows precision worth having, because readers differ by noise and because agreement can hide a shared error.

### 4.6 Cutting

The default is not to cut. A single attempt tries the whole claim within a budget of money and time. If it runs out, the claim is cut at the point where it stalled. A size is never predicted, so no estimate is needed.

When a cut is made, it is done by a strong planner and its output is checked mechanically: each piece has a territory, territories are disjoint, each piece has a check that can fail, interfaces between pieces are fixed first as claims of their own, and work that is sequential stays sequential. A territory may grow: an attempt that needs to step outside asks the program, which grants it if free, or pauses the attempt otherwise. At large scale planners may be recursive. They cut and they do not report.

A parent claim is never warranted by its children's warrants. It has its own check, because that is where failures live.

### 4.7 Assigning

The program assigns, by rule. The order is: anything whose expiry blocks other work; a fixed share for fitness work; finishing what has started; the owner's coarse priority bands. Finishing first is right only where completion gets more likely with age, and agent attempts may do the opposite, so a stalled attempt is stopped rather than finished. Finer economic ordering rests on guesses, and I found no field evidence for it.

Routing starts strong when no record exists, or when nothing but judgement would catch a mistake, and starts cheap when an executable check will catch it. It becomes a small trained statistic only when there is enough data, and it may also escalate after watching the first few turns ([SWE-Router, 2026](https://arxiv.org/html/2607.00053)). A hand-written rule table is not used for routing, because the only measurement I found put it last.

Each attempt holds a short lease on its claim and territory.

### 4.8 Doing

An attempt runs in a sealed environment that records what actually happens. It has no access to sealed checks or to history that contains the answer (one audit found models pulling fixes from git history). It has only the credentials its class allows, and no network egress beyond what the class permits. New dependencies, build configuration changes and changes to fixtures are surfaced as separate items, since they are side doors.

An attempt ends with a candidate, an honest exit, or an expired lease. A partial candidate is saved at its last checkpoint, so an expired lease loses unsaved work only. The next attempt may use the saved work as an optional overlay.

A sample of honest exits (one in five to begin with) is re-attempted by a stronger configuration, so the exit cannot become the cheapest way to avoid hard work. A doer may also contest a check. Contests go to a stronger adjudicator, and a check that is correctly out of date is superseded through the record, not edited by the doer.

The doer's own tests carry no weight toward a warrant. A plan published before work is part of the record, and work happens against it. There is no free-form channel between attempts by default: it did not improve overall results in the one direct measurement, though it did reduce textual conflicts, and a plan published first did better. If measured failure shows that attempts need more, it can be admitted.

An outside monitor watches each attempt. A retry must differ in something the program can verify, namely configuration or starting artefacts, and after three tries the claim is cut or becomes an ask. Three is an arbitrary starting value. Retries are budgeted, because nobody is watching to stop a retry storm.

Parallel attempts on one claim stay off by default. Real pickers leave much of the available gain unclaimed (perfect selection 64 to 70%, real selection 55 to 61%, better with surrounding code and test filtering: [CodeMonkeys](https://arxiv.org/html/2501.14723v1), [AI21](https://www.ai21.com/blog/first-scale-then-enrich-how-the-right-execution-strategy-helped-us-reach-state-of-the-art-on-swe-rebench/)). They are worth paying for only on small work where a check can pick.

### 4.9 Checking

Combined by rule, not by a model summarising.

1. **Clean-environment run.** The program runs the public checks at the exact candidate commit. A new check of grade C must have failed on the old code and rejected a mutated candidate. Failing on the old code is trivially met when a function does not yet exist, so this is a floor and not a proof. Mature tests are not held to it.
2. **Sealed checks (catalogue).** Written by an independent party at existing public surfaces or at an interface claim, never seeing the candidate. Differential testing against old behaviour runs here when a reference exists. A failed sealed check is described to the next attempt only as behaviour, and that check then moves to the public side, so the sealed set does not leak through repeated tries. The difference between public and sealed pass rates per configuration, aggregated over time, is a generalisation measure, and only a rise against that configuration's own history is a warning sign. Sealed checks have known limits: they misfire on legitimate work and miss heuristic solutions ([EvilGenie](https://arxiv.org/html/2511.21654v1)).
3. **Witness inspection.** Did the doer run what its log shows it ran, and read what it was given? Simple facts at first, a small classifier later. It flags, and it never convicts.
4. **Examination for fitness.** One fresh examiner, assigned by rule, sees the claim, the change, the surrounding code and a short list of how work has gone wrong here, and does not see the author's account. A functional finding should come with a reproduction. A fitness finding cannot, so it stands as judgement with grade D, and "fit to keep" is recorded separately from "passes". An examiner weaker than the author can raise leads and not block. Clean controls measure false rejection, so that an examiner cannot score by flagging everything.

**Random deep audit (catalogue).** Accepted claims chosen at random by class, re-examined by the strongest available party from another family where one exists, starting from the original want, not the claim, so it can catch a misread want. Findings are recorded in two columns: reproduced problems and fitness judgements. A selected item whose evidence cannot be found counts against.

**Planted faults (catalogue).** Built from real history in the vault: a defect that escaped, reintroduced where it was; a change once reverted, offered again. They enter both the examiners' stream and the audit stream at a low rate, cannot land, and are never shown to the owner. Whether they are being recognised is tested directly, by asking a separate party to tell planted items from real ones. Their score is at best a ceiling, because the seeds are built from defects that someone eventually found.

**What the owner gets from this is counts, not a bound:** "This period: 212 accepted, 31 audited at random, 2 reproduced problems, 3 judged unfit to keep. Auditors caught 7 of 10 planted faults." Rule-of-three arithmetic ([3/n](https://en.wikipedia.org/wiki/Rule_of_three_(statistics)), with an allowance for imperfect detection) is available if he asks, with the warning that it understates the true figure. Each count triggers something: above a limit he sets, audit rates and class in that area go up; after a long clean run they come down. If there is too little to say, the page says that.

**Revocation.** If an examiner configuration later proves bad, warrants resting on its judgement are downgraded. Re-examination is budgeted and ordered by class, so that revocation cannot become a storm. Forensic laboratories re-reviewing a discredited analyst's cases are the older form of this.

### 4.10 Joining

A single ordered landing line per repository, run by the program, checks the merged result, because the expensive failure is two changes that merge cleanly and break together. Textual conflicts are the cheap case ([Ghiotto](https://neverworkintheory.org/2021/08/12/on-the-nature-of-merge-conflicts.html)), and an agent resolves them under the same checks. Bisection is flake-aware ([Henderson 2023](https://hackthology.com/flake-aware-culprit-finding.html)). A flaky check is quarantined. Speculation is enabled only when waiting justifies it, since even after tuning Uber pays 1.9 to 2.6 builds per landed change ([Uber](https://www.uber.com/en-AU/blog/slashing-ci-costs-at-uber/)).

Across repositories, a change is a **wave**: steps ordered so that every repository at its current commit still works with its neighbours' at each step. Its removal step is a claim from the start, so it cannot be forgotten. Expand-and-contract has no measurement I could find ([Fowler](https://martinfowler.com/bliki/ParallelChange.html)). A claim binds to a tuple of commits.

What expires: test results expire as in any good CI, and that part of a warrant is just CI. What is not CI is that assumptions, fitness judgements and knowledge claims are also marked for review when the code they judged changes substantially or when something outside the code they rest on changes. Fitness is re-judged on a sample, not at every change, so the cost stays bounded. External facts (data, third-party APIs, traffic) are out of the hash, so claims about them carry a date and are re-observed.

### 4.11 Releasing

A release is a claim about an exact tuple of commits: all included claims are valid there, the assumptions it rests on are listed, a way back has been rehearsed, exposure is staged and there is an automatic halt. With the owner away, a tested way back is worth more than another layer of review.

The owner grants, in advance and by class, what may be exposed without him. Anything else waits. While he is away only pre-granted classes ship, so the system says plainly that its real-world signal has narrowed, and the limit on assumptions tightens accordingly. After release, what is observed comes back as late verdicts on the claims involved.

### 4.12 Who decides what

| Decision | Who | How |
|---|---|---|
| Order, assignment, who examines | program | rule |
| Whether a claim passed | program, from check results | rule |
| Whether it is fit to keep | examiner | judgement, audited |
| A reversible reading of something unclear | participant, recorded | assumption, may be overturned |
| What the product should be; a trade-off between values | owner | ask |
| Anything with effects that cannot be undone | owner, or his pre-granted class | ask or standing grant |
| "Do what you did last time" | owner, stated explicitly | a standing rule he can read and withdraw |
| Changing the program or weakening a safety mechanism | owner | shown evidence |

**Limit on assumptions.** Unconfirmed assumptions are counted, and each carries a reversal cost in rough bands. When the total passes his limit, new work resting on those assumptions stops. Assumptions with a high reversal cost are shown to him when they are made, not after work has been built on them. Agents may under-declare, so the audit looks for assumptions that were made but not recorded.

**Reversibility is produced, not just observed.** Flags, staged rollout and expand-and-contract reduce what needs his word for work. They do not reduce the effect class of exposure.

### 4.13 When participants fail, lie or disappear

| Event | What happens |
|---|---|
| Crash or vanishing | The lease expires, saved work is kept as an optional overlay, the claim returns. |
| Stuck | The monitor stops it; the next attempt must differ. |
| Wrong but sure | Checks, merged-state checks, audit. Its confidence is not read. |
| Tampers with checks | Public checks are read-only and the rest unseen. Special-casing remains possible; examiners and sealed checks are what catch it. |
| Lies in its report | The report is compared with the log. It is not otherwise an input. |
| Dodges through honest exits | Exits are sampled and re-attempted by a stronger party. |
| Splits work to lower the class | The class is computed over the whole want. |
| Examiner passes everything | Planted faults reveal it; its warrants are downgraded. |
| Examiner flags everything | Clean controls reveal it. |
| Blind spot shared across families | Reduced, not removed. |
| Poisoned work item, file or dependency | Limited to the sandbox and its credentials. The diff is an attack path, and examiners look for it. Not removed. |
| Flaky check | Quarantined. On a very flaky suite, repairing the check becomes the first work, and grades drop. |
| Retry storm or spend | Budgets per attempt, per claim and per project. Past that, only in-progress work finishes and one ask is raised. |
| Provider or CI outage | Identical failures across configurations pause work; nothing is counted against anyone. |
| Owner away | Pre-granted work continues to his limit. One notification per ask, only when what it blocks passes a threshold he set, and never repeated. |
| Owner wrong | His overrides are recorded and later compared with outcomes, for his own information. |
| Models change | Window and routing reset, and mechanisms are due for re-test. |
| The program fails | It restarts from the open record and the vault. |

### 4.14 What the owner sees

One page when he opens it, cut to the minutes he says he has.

1. **Counts**, as above, or "too little to say".
2. **What changed**, as behaviour he can try, plus where to read the code if he wants to.
3. **Asks.** Three by default, one decision each, never repeated. Each has context, options and what each costs. The cost figures are model-written and marked as such. The default is not shown until he has answered or has left without answering, so that it cannot anchor him. A bare recommendation is the anchoring that P9 warns about.
4. **Assumptions** with the highest reversal cost, each with a way to change it. Everything else is available in one list, unrationed.
5. **What stopped and why.**
6. **One spot check, optional.** A random accepted item, shown with no verdict. It is never a planted fault, because deceiving the owner with his scarcest resource is not acceptable.
7. **A forecast of when**, as a range from the record of similar work, scored later against what happened. It is a statistic, never a participant's estimate.

He can also **steer**: open any claim, look at the attempts, see diffs and talk directly to a doer. Time he chooses to spend is not counted as a cost. He is not the reviewer of last resort, because people do worst exactly when the AI is wrong, and also because reading everything is impossible. If he is the stronger party in some area, he should be used there.

### 4.15 What exists when: the admission rule

The core runs from the first day and needs no history. Everything else is admitted by a measured failure.

| Mechanism | Admitted when | Dropped when |
|---|---|---|
| Sealed checks | The experiment in section 2 passes, and tampering or generalisation gaps are measured | They reject as much good work as bad |
| Second examiner of another family | The first examiner's misses, measured by audit or late defects, exceed a limit on E2 work | It adds no catches |
| Reading Test | Audit attributes a meaningful share of problems to misreading, and its experiment passes | Its findings do not change outcomes |
| Assumption limit | Reversed assumptions are measured as costly | Never at E3 |
| Random audit and counts | Volume gives at least 30 audits in one model generation | Volume falls |
| Planted faults | Audit exists, and history supplies real defects | They are recognised |
| Budget windows | Repeated budget exhaustion or landing failures | Fixed values do as well |
| Routing statistic | Enough outcomes per configuration | A strong default does as well |
| Waves | More than one repository in a change | |
| Cells | One page cannot hold it all | |
| Fitness share | Structural drift is measured | Drift stops |

On the **budget windows**: instead of predicting size, each attempt gets a budget, a share of what similar accepted work cost, grown slowly when attempts finish under it and cut when they exhaust it repeatedly, as network senders do ([AIMD](https://en.wikipedia.org/wiki/Additive_increase/multiplicative_decrease)). The same applies to concurrency. It is proposed so that the system re-tunes itself when the models change. It has no evidence yet, it reacts only to a running average, and the unit is money or time per attempt.

**Cells**, if ever needed, are one per coherent group of repositories, each with its own record, talking through published interface claims. Nothing beyond that is designed, because I have no data on it.

### 4.16 What it costs

The critic correctly pointed out that the first draft never costed itself and that its worked example failed its own bar. Assumed weights, which are my judgement: cheap reader 0.1, mid attempt 1, strong attempt 3, check author 1, examiner 0.5, audit 3.

| | B0 | B1, B1+ | This design |
|---|---|---|---|
| E0 | 3 | 3.5 | 1 to 3 |
| E1 | 3 | 3.5 | 2 to 4 |
| E2, one claim | 3 to 4 | 4 to 5 | about 6 in the core, about 8 with audit, sealed checks and readers |
| E3 | 3 to 4 | 4 to 5 | about 10 |

So on low-effect work the design should cost about the same as B1+ and sometimes less, because cheap routing is allowed when a check will catch a mistake. On high-effect work it costs roughly 1.3 to 2.2 times B1+ on these weights, and that must be paid for by fewer wrong accepted changes where those are expensive. The single measurement I have of a full multi-role harness is over 20 times a solo run ([Anthropic 2026](https://www.anthropic.com/engineering/harness-design-long-running-apps), n = 1), so the numbers above may be optimistic.

### 4.17 What is measured

Primary: the four numbers of section 2 each period, against a baseline. Diagnostics, never visible to any participant: counts of audit and planted-fault results, generalisation gap by configuration, false rejections, first-try acceptance, retries per acceptance, contested checks and their outcomes, exits and how many were re-solved by a stronger party, assumption count and how many were reversed, cold-start drill score, structural drift.

**The cold-start drill.** At intervals, a fresh agent gets only the open record and is questioned against known answers. A failure is a defect in the record. P13 says nobody has measured this, so the system has to.

Measures are read on control charts ([funnel arithmetic](https://www.qualitydigest.com/oct04/departments/spc_guide.shtml); [Sterman 1989](https://econpapers.repec.org/RePEc:inm:ormnsc:v:35:y:1989:i:3:p:321-339)), and a change is made on a signal, not on one bad week.

### 4.18 How it improves itself

The system keeps a register of mechanisms: the failure each is meant to stop, its measured cost per item, and what it has caught.

Withdrawal is honest about its limits. At high volume, a frequently run and expensive mechanism can be switched off on a random small share of work, with a sequential test ([SPRT](https://en.wikipedia.org/wiki/Sequential_probability_ratio_test)). Detecting a change from 5% to 10% escapes needs about 430 items per arm, and thousands at lower rates, so this is possible only at volume, and almost nothing can be withdrawn at small scale. Anything guarding against rare and severe outcomes stays unless keeping it is shown to harm, because the absence of evidence is not evidence of absence.

Every defect that escapes produces a planted fault, an entry on the list of how work goes wrong here, and a structural change where one can be found. A reminder to be more careful counts as no change. The failure list has a fixed size, and adding means removing.

Every model change resets windows and routing, and puts each mechanism due for re-test.

### 4.19 Worked examples and hard cases

**A change to billing.** The owner writes: "Customers over their quota should be stopped, not charged." The want is E2 to build and E3 to expose, because it decides who pays. A planner writes the claim and examples, and flags two open choices: whether someone at exactly the limit is allowed, and what happens to a request in flight when quota runs out. The first is reversible in effect and becomes an assumption. The second affects money, so it becomes an ask. An independent check author writes checks at the billing interface, which are seen to fail on the current code and to reject a mutated candidate. A doer attempts it in a sealed environment. The examiner, not shown the author's account, finds a log line that leaks an account key and supplies a reproduction. The change goes back. The landing line runs on the merged state. At the owner's next sitting he tries it on a test account, answers the ask and gives his word to expose it. About 8 units of cost on the scale in 4.16 is a lot for one sentence, and this is why the design does not pretend to be free at E2.

**A UI redesign.** The check is his eye. A claim is written as what he wants it to feel like, attempts produce previews, and the warrant is grade D, "the owner looked". This goes through a design sitting of its own, one ask with several pictures. Nothing is pretended to be automated.

**A long migration on code with no tests.** The first claims are characterisation checks of what the code does today, grade B, and migration proceeds in waves whose removal steps are claims. Budget windows keep each piece small. The honest part is that this is slow and the record is mostly grade D at the start.

**Adoption on a running product, day one.** The record starts empty. Only behaviour that is being changed gets claims. The core works without history. Nothing in the catalogue is available, and the page says "too little to say".

**A production fire.** A hot-fix lane: a strong attempt, staged exposure under a standing grant if a way back exists, checks written within a day, and a mandatory entry in the record. If no grant exists, an ask pushes through regardless of the sitting.

**Data and schema changes.** E3 unless expand-and-contract and a verified backup make it otherwise.

**Things this design does not cover well:** deciding what to build at all (wants come from him); licence and provenance of generated code; regulated settings; a single allowed vendor, where "another family" reduces to a fresh context and is weaker; owner succession, for which the record and a named deputy are the most I can offer; and how people feel working inside this, which is the reason humans are not given seeded reviews or hidden tests or routed by statistics.

## 5. What matters most, if only part of it could be built

1. **Status computed in a clean environment, tied to the exact commit, with grades of evidence.** Without this nothing else can be trusted.
2. **Excellent checks.** Not a mechanism but where the money goes. This is the critic's strongest point, and I agree with it.
3. **Checks fixed ahead and read-only, plus the honest exit with its exits sampled.** Cheap.
4. **Effects held back and everything else contained, and the owner's page with few asks and a record of assumptions.** This is what lets work go on while he is gone.
5. **One writer per territory, with a landing line that checks the merged result.**
6. **Fresh examiner denied the author's account, with a list of how work goes wrong here.**
7. **A fixed share for fitness.** Decay is slow and invisible until it is expensive.
8. **Everything in the catalogue, only when a measured failure admits it.**

Items 1 to 6 are, close to literally, what the critic called B1+ with discipline. If those are built and nothing more, I would expect most of the benefit, which is judgement and is the thing the section 2 experiments test.

## 6. What I would deliberately not build, and what is lost

| Not built | Why | What is lost |
|---|---|---|
| A free-form channel between attempts, by default | It reduced conflicts and did not raise success | Occasional clever help; can be admitted if measured need appears |
| Layers of agents that report upward | Reporting is what the record is for; planners do cut work at scale | The comfort of a familiar organisation chart |
| Votes, panels or debates to decide correctness | Agreement is not verification, though extra samples can help where code verifies | A cheap-looking signal |
| Asking any model how sure it is | Barely above chance at ranking | A signal that might recalibrate, later |
| Time estimates from participants, points, sprints, velocity | Serve human planning rituals; forecasts come from the record instead | A number managers like |
| A status field | It would be self-reported | A convenient overview |
| The owner as line-by-line reviewer or approver of a stream | Weak when AI is wrong; repetition degrades acceptance | The comfort of seeing everything, unless he chooses to |
| Dependency graphs of every reason | Costly historically; coarse tracking is enough | Answering "exactly why" for arbitrary beliefs |
| Quorums against malicious agents | Cost; most failures are mistakes | Protection against a truly adversarial participant |
| Internal markets, truth-serum scoring | Failed replication, unclear gain | A possible signal at large scale |
| Model-written overviews of the repository | Cost up, no general gain | Quick orientation |
| Parallel attempts by default | Selection is the bottleneck | Some success on hard problems |
| A permanent backlog | A queue with no server | Ideas that would have mattered years later |
| Predicting the owner's answers | Weak evidence, cost in trust | Possible fewer questions; he can make standing rules himself |
| Planted faults shown to the owner | Deceiving him is not worth what it measures | A measure of his own detection |
| A single headline number for correctness | It would not be a bound | A simple message |
| Automatic removal of mechanisms that show no effect | Rare severe failures cannot show an effect | A cleaner system over time, at some risk of cruft |
| Estimating remaining defects from reviewer overlap | Needs more reviewers than anyone uses | A reassuring figure |

## 7. What is old here and what is not

The critic mapped the design onto existing practice, and the mapping is broadly right. It is from memory, unverified, and accepted here because it is the safe assumption.

| Term in this design | Existing thing |
|---|---|
| Claim with evidence | Assurance cases, requirements tracing, acceptance criteria |
| Comparing wanted with shown | Reconciliation in declarative controllers |
| Warrant from test results | Content-hashed CI results |
| Attempt | A CI job in an isolated checkout |
| Computed status | Required status checks |
| Sealed checks | Hidden tests, holdout sets |
| Planted faults | Error seeding, gold questions |
| Random audit | Independent verification on a sample |
| Classes | Assurance levels in safety standards |
| Landing line | Merge queue |
| Wave | Expand-and-contract |
| Revocation | Re-review of a discredited analyst's cases |

What is left after removing those, and all of it is unproved:

- Applying computed, expiring status to things CI never touched: assumptions, fitness judgements, decisions.
- A budget on the owner's attention, with a limit on what was assumed for him while he was gone.
- Grading every warrant by what kind of oracle stands behind it.
- Using disagreement of independent readers as an ambiguity detector, if its experiment passes.
- Budget windows that re-tune when models change.
- The admission rule itself: nothing beyond the core exists until a measured failure of the core demands it.

The claim that these are "best in the world" is not one I can support. What I can support is that this design makes each claim testable and removes whatever fails.

## 8. The critic's objections and my answers

The critic raised 20 ranked objections and 37 evidence stretches ([critic-report.md](critic-report.md)). I re-checked the most damaging ones at source and they held, with one nuance on the ambiguity paper, which itself says both things. All 37 stretches have been corrected or removed. The objections, in the critic's order:

| # | Objection | Verdict | What changed, and what stays open |
|---|---|---|---|
| 1 | "Done is observed" only moves a model's word one step back | **Accepted** | Warrants carry grades of oracle. Nothing is called observed below grade B. Check authors must differ from the doer and be at least as strong. Open: model-written checks may still share the doer's blind spots, and this is the hardest problem in the design. |
| 2 | Acceptance criteria come from a vote the design calls worthless | **Accepted** | Readers' agreement no longer establishes anything. Cases are raw material for a check author. The test is out of the core and has its own experiment. |
| 3 | The Number is not a bound | **Accepted** | Removed. The page shows counts. Audits are seeded directly. Reproduced problems and fitness judgements are separate. Each count triggers an action. Recognition is tested directly. |
| 4 | A much simpler thing wins | **Accepted for the first build** | B1+ is now in the trial and the design's core is close to it. Open: whether the catalogue adds anything at scale, which is the real question and is unmeasured. |
| 5 | Mostly renaming | **Largely accepted** | Section 7. The claim to originality is reduced to what is listed there. |
| 6 | Costs multiples; fails its own bar | **Accepted** | Costed in 4.16. Bars are now by effect class. Levels replaced by measured admission. Open: my weights are guesses, and the 20-times harness figure suggests they may be low. |
| 7 | "No language model in the program" is false | **Accepted** | Section 4.1 lists every judgement and who makes it. Routing is no longer a rule. An exception path exists. |
| 8 | The owner is worse off | **Partly accepted** | Steering mode, forecasts, defaults hidden until answered, high-cost assumptions shown when made, no planted items to him, no judging of him. Open: everything he reads is still model-written, and defaults still have inertia. |
| 9 | Reversibility of code confused with effects | **Accepted** | Classes are defined by effects, computed on want and diff, and exposure is classed separately. The worked example was wrong and is rewritten. |
| 10 | Self-improvement cannot test the costly parts | **Accepted** | Withdrawal is limited to frequent, costly mechanisms at volume, and severe-outcome guards stay. |
| 11 | Sealed checks collide with normal maintenance | **Accepted** | Supersession and contest paths added. Sealed checks only at existing surfaces. Leak limited by moving a used check to the public side. Renamed generalisation gap. Open: leakage is reduced, not eliminated. |
| 12 | Much real work has no place | **Partly accepted** | Hard cases in 4.19. Grade D exists because some oracles are his eye. Open: the design is far weaker on exploratory and taste-heavy work. |
| 13 | Ledger must be open and secret | **Accepted** | Open record and vault, with the partition specified. |
| 14 | Warrant expiry is CI or unaffordable | **Accepted** | Warrants are computed, and test expiry is CI. Non-test beliefs are re-judged by sample and date. |
| 15 | The sandbox does not contain the diff | **Accepted** | P18 and 4.13 say so; dependency and egress rules added; the Poison bar is restated. |
| 16 | Perverse behaviour | **Accepted** | Exits sampled, salami splitting closed, correlated rediscovery not counted, clean controls for over-flagging, budgeted revocation. |
| 17 | Further contradictions | **Accepted** | Windows on running averages with a unit, routing and scoreboards reconciled, fitness share in the ordering, retries verified only by what the program can see. Audit independence is "where one exists". |
| 18 | Falsification cannot be afforded | **Accepted** | Cheap kill experiments first; the full trial is stated to be only possible at volume. |
| 19 | Missing things | **Partly addressed** | 4.19 covers hot fixes, adoption, data changes, one vendor and supersession; the remainder is listed as not covered. |
| 20 | Things to drop | **Mostly accepted** | Dropped or demoted: the headline Number, owner-prediction precedents, planted faults shown to him, automatic removal, cells to a stub. Kept: planned publication instead of a total ban on talk, and budget windows as a catalogue item. Warrants are derived. |

The strongest objection that remains is the first. Everything downstream of a check depends on the check, and the checks here are mostly written by the same kind of system as the code. The design grades this and invests in it, and offers nothing better.

The critic's verdict was: "Build B1 plus an assumptions file and an honest exit, spend the rest on the quality of the oracle, and add any further mechanism only when a measured failure demands it." I now agree with that as the first build, and the admission rule makes it the design.

## 9. What the research changed

| I believed before reading | After |
|---|---|
| Several attempts and picking one may be valuable | Off by default. Selection is the bottleneck. |
| Seed known faults | In the catalogue, from real history, as a ceiling, with recognition tested directly. |
| Rich records of reasons | Coarse only. |
| Confidence may help | Dropped. |
| Claims instead of tasks | Still unproved, and the critic is right that it may be vocabulary. |
| Multi-agent structure might be mostly wrong | Largely confirmed for writing shared code. Planners cutting for non-communicating doers is what kept running at scale. |
| Programs should coordinate | Partly. Hand-written routing rules were the worst in the one measurement I found. Statistics are the right tool for what recurs and cannot be specified. |
| Not on my list at all | The honest exit; a record never rewritten by a model; fresh start with the old diff as an overlay; the owner as judge of outcomes; effects rather than code as the measure of reversibility; grades of oracle; the admission rule. |

## 10. What could not be checked

- **The whole.** Nothing has been built. Individual measurements do not add up to a system.
- **Transfer.** Most results about people have not been tested on models. Model-specific rates expire quickly, and the trend on test tampering appears to be falling, which would weaken P2.
- **Reading.** Every source was read through a fetch tool that passes text through a small model, so figures are second-hand by one step. I re-read 11 of the load-bearing sources myself through the same tool, and separately opened four reference pages for definitions. One re-read gave a different self-review figure from the notes, so that figure is not used. Many entries in the notes rest on abstracts or secondary reports.
- **Coverage.** The shared search limit ended all research early. Not reached: open-source governance entirely; Kubernetes and Borg on reconciliation; feature-flag evidence; assurance cases; pre-mortems; sunk cost; stage gates; sunset clauses; large-scale A/B testing and Fishtest; traffic control, film and kitchens; span of control; morbidity and mortality reviews; read-back rates; Threat Image Projection itself; test-first studies. The critic worked from memory on prior art, and said so.
- **Open questions with no data I could find.** Restarting from a written record against continuing. Whether seeded faults raise real detection. Whether approval quality falls with volume. Whether claims improve on tasks. Whether budget windows beat fixed budgets. Whether disagreement between readers predicts real ambiguity.
- **Cost.** Weights are my judgement and may be low by a factor of several.
- **Isolation.** My context contained a repository's operating document and tool names, which I was told to ignore. I opened no repository file, ran none of its commands, and searched for none of those tools; no search result was about them. Some things in this design resemble things in that document, including a fresh reviewer and evidence before completion. I cannot prove they were uninfluenced by it. They are supported independently by the sources in P1 and P5. I also did not load the machine's writing-style guide, because the isolation rules forbade reading anything under the home directory.

## 11. Supporting notes

- [first-principles.md](first-principles.md): my position before any reading, unedited.
- [notes-flow-and-economics.md](notes-flow-and-economics.md): manufacturing, queueing, organisational economics, measures, forecasting, statistical control, maintenance.
- [notes-high-reliability-and-command.md](notes-high-reliability-and-command.md): command, aviation, high reliability, medicine, seeded tests, oversight of automation, interruptions.
- [notes-software-and-distributed-systems.md](notes-software-and-distributed-systems.md): integration, coupling, review, independence of checks, incremental correctness, failure handling, speculation, rollouts.
- [notes-multi-agent-state.md](notes-multi-agent-state.md): the state of AI agents alone and together, to November 2026.
- [notes-other-fields.md](notes-other-fields.md): science, audit, intelligence, law, truthful reporting, deferral, biology, memory, group judgement.
- [critic-report.md](critic-report.md): the critic's objections and evidence stretches.

Each note lists every source opened, with its URL, what was taken and how strong it is.
