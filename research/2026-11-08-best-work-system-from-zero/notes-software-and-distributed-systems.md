# Notes: large engineering organisations, software verification, distributed systems, open-source governance

## Method

I searched the web for each question in the brief and opened the sources I could reach. I read no local file, skill or repository, used no MCP tool, and did not search for the tools or the author named in the session's context. No search result was about them, so I closed nothing under the isolation rules. When a PDF fetch failed, the fetch tool saved a binary copy under the home directory; I did not open those copies.

Four limits on this evidence matter.

- **The review is incomplete.** The search budget, shared by all agents in this run, ran out at 200 calls while I was starting the last group of topics. The notice told me to continue with what I had and not to route around the limit. I stopped searching, and afterwards opened only addresses that earlier searches had already returned. **Open-source governance is therefore not covered at all.** The section "Not covered" lists this and other holes. A follow-up with more search budget could fill them.
- **How PDFs were read.** The fetch tool could not read most compressed PDFs. Before the notice I read many of them through a public text-extraction service (r.jina.ai). The notice named such readers as off limits for continuing the search, so I stopped using it; the last three reads through it were sent in the same batch that first returned the notice. Entries give the original address. Some arXiv papers were read as HTML on arXiv's ar5iv pages, one of them after the notice because a search had returned that address.
- **How text reached me.** Every page passed through a small model that answered my questions about it, so a number can be mis-extracted. Where the output contradicted itself I say so. Each entry states the access I had: full text, abstract, or someone else's summary.
- **Ratings** are mine. "Strong" means a large sample or a replicated result with a sound design. "Moderate" means a real measurement limited by a single site, self-report by the party concerned, or injected faults. "Weak" means thin data or second-hand reporting. "Argument only" means no measurement.

"Who disputes it" says "none found" when I did not find a critic. Given the limits above, that is not evidence that none exists.

## Integration at scale

### Keeping master green at scale (Uber SubmitQueue, EuroSys 2019), through The Morning Paper
- URL: https://blog.acolyer.org/2019/04/18/keeping-master-green-at-scale/
- Took: how a queue that speculates on the outcome of pending changes keeps the main line always passing.
- Measured: about 40% probability of a problem at 16 concurrent, potentially conflicting changes (nine months of Uber iOS and Android data). The iOS main line was green only 52% of the time in the week shown before the queue. Builds take 30 to 60 minutes; a naive full queue at 1,000 changes a day would leave the last change waiting over 20 days. With n changes per hour and n workers, turnaround stayed within 1.2x of a perfect-prediction oracle. Logistic regression on about 100 features predicted outcomes with 97% accuracy.
- Evidence: moderate. Single company, authors report their own system; I read a summary because the paper was behind a bot check.
- Who disputes it: none found. Its own limits are that small changes wait behind large ones and that the oracle is an idealised baseline.

### Enhancements to SubmitQueue (arXiv 2501.03440, abstract)
- URL: https://arxiv.org/abs/2501.03440
- Took: speculating selectively, on predicted usefulness, cuts cost substantially.
- Measured: CI resource use down about 53%, CPU down about 44%, P95 waiting down about 37% across Uber's Go, iOS and Android monorepos. Abstract gives no sample size or statistical method.
- Evidence: moderate. Same company, before-and-after.
- Who disputes it: none found.

### Slashing CI costs at Uber (company blog on the same work)
- URL: https://www.uber.com/en-AU/blog/slashing-ci-costs-at-uber/
- Took: the real price of speculation, stated as builds per landed change.
- Measured: before the change, an estimated 40 to 65% of builds were ended prematurely. Builds per change fell from 3.39 to 1.85 (Go), 4.93 to 2.57 (iOS), 5.43 to 1.96 (Android). P95 wait fell to 18.64, 9.91 and 17.33 minutes. Large changes touching many targets conflict with almost every later change.
- Evidence: moderate. Vendor-of-itself, weekly averages, before-and-after with no control.
- Who disputes it: none found.

### Why Google stores billions of lines of code in a single repository (Potvin and Levenberg, CACM 2016)
- URL: https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/
- Took: one trunk works at huge scale only with heavy tooling, and most commits are not written by people.
- Measured (January 2015 figures): about 2 billion lines, 86 TB, over 25,000 developers. On a typical workday 16,000 human commits and 24,000 automated ones. Average workspace under 10 changed files. All code reviewed before commit; long-lived branches "exceedingly rare"; features behind flags; a change causing widespread breakage can be undone automatically.
- Evidence: moderate as a description of scale; argument only as a claim that the model is better. Authors are Google staff.
- Who disputes it: the article itself lists costs: tooling, unnecessary dependencies, a stream of refactorings to review, hidden dependence on implementation details.

### Taming Google-scale continuous testing (Memon et al., ICSE-SEIP 2017)
- URL: https://web.eecs.umich.edu/~xwangsd/courses/w23/readings/googletest.pdf
- Took: nearly all test execution finds nothing, and who touches a file predicts breakage.
- Measured: 5,562,881 test targets; 91.3% passed at least once and never failed; 1.23% tied to a real breakage or fix (the paper's introduction says "executions", its table supports "targets"). Of targets that both passed and failed, about 40.5% were flaky. Per change, 0.42% of outcomes failed. Simulated selection by dependency distance: running only distance 10 or less would save about 42% of resources with no missed breakage in this dataset. Breakages fall when two authors touch a file compared with one, and rise significantly with three or more. About 150M test runs a day.
- Evidence: strong for the descriptive numbers at Google; moderate for the selection simulation (one dataset, retrospective).
- Who disputes it: authors warn it may not generalise.

### Flake aware culprit finding (Henderson et al., ICST 2023)
- URL: https://hackthology.com/flake-aware-culprit-finding.html
- Took: bisection fails on noisy signals; a Bayesian search handles them.
- Measured: 13,600 test breakages at Google; about 60% had a real culprit and about 40% were flakes. In ranges with a culprit, plain bisection about 96.1% accurate, flake-aware about 97.5%; flake-aware beat every bisection variant overall (p < 10^-12). Plain bisection with no reruns was the cheapest in builds; the most accurate flake-aware variant was next. Exact overall accuracy and build counts appear only in figures I could not read.
- Evidence: strong for one setting. Large sample, but the "ground truth" labels come from the same organisation's systems.
- Who disputes it: none found.

### On the nature of merge conflicts (Ghiotto et al.), through Never Work in Theory
- URL: https://neverworkintheory.org/2021/08/12/on-the-nature-of-merge-conflicts.html
- Took: textual conflicts are small and mostly resolved by choosing existing lines.
- Measured: 2,731 open-source Java projects, 616 conflict chunks coded by hand. 94% of chunks were 50 lines or fewer. About 81% resolved using only existing lines; 19% involved new code. Conflict rate of "10 to 20% of merges" is cited from earlier work, not measured here.
- Evidence: moderate. Large corpus, small hand-coded sample, summary only.
- Who disputes it: none found.

### Indicators for merge conflicts in the wild (Lessenich et al.)
- URL: https://www.se.cs.uni-saarland.de/papers/conflict-prediction
- Took: what developers believe predicts conflicts does not.
- Measured: 41 developers proposed indicators; tested on 155 projects, 32,579 merge scenarios. None of the 7 indicators (branch activity, files changed in both branches, change size, scattering and others) had predictive power for conflict frequency.
- Evidence: moderate to strong. A clean negative result, open source only, and only textual conflicts.
- Who disputes it: none found.

### Advantages and disadvantages of a monolithic repository (Jaspan et al.), AcaWiki summary
- URL: https://acawiki.org/Advantages_and_Disadvantages_of_a_Monolithic_Repository
- Took: what people value in one repository is visibility and single-version dependencies, and tooling may matter as much as repository shape.
- Measured: interviews, survey and tool logs at Google; the summary gives no numbers.
- Evidence: weak as read (summary only, single company, whose engineers already use a monorepo).
- Who disputes it: the summary notes search and dependency management can be built for multi-repo setups.

### Parallel change (Fowler)
- URL: https://martinfowler.com/bliki/ParallelChange.html
- Took: expand, migrate, contract; the failure mode is that the contract step never happens.
- Measured: nothing. I found no measurement of expand-and-contract at all.
- Evidence: argument only.
- Who disputes it: none found.

## Coupling and team structure

### The influence of organizational structure on software quality (Nagappan, Murphy, Basili, Microsoft TR 2008-11)
- URL: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2008-11.pdf
- Took: organisational measures out-predicted code measures for post-release failures.
- Measured: Windows Vista, 3,404 binaries, 50 repeated random splits. Precision and recall: organisational 86.2/84.0, code churn 78.6/79.9, complexity 79.3/66.0, dependencies 74.4/69.9, coverage 83.8/54.4, pre-release bugs 73.8/62.9.
- Evidence: moderate. Careful design, but one product, and it is prediction rather than cause.
- Who disputes it: an industrial replication exists (lead L1 below; I saw only a snippet).

### Exploring the duality between product and organizational architectures (MacCormack, Baldwin, Rusnak)
- URL: https://www.hbs.edu/ris/Publication%20Files/08-039_1861e507-1dc1-4602-85b8-90d71559d85b.pdf
- Took: the mirroring hypothesis, measured.
- Measured: five matched pairs. Propagation cost in the loosely coupled (open-source) product against the tightly coupled one: 7.74 vs 47.14, 8.25 vs 41.77, 23.62 vs 54.31, 7.18 vs 22.59 (and 7.21 vs 24.83), 11.30 vs 43.23. Ratios 2.3x to 6.1x; the abstract's "factor of eight" is not in the pairwise table.
- Evidence: weak to moderate. Five pairs, non-random, static calls only, functionality not controlled, cause unknown (design choice or organisation).
- Who disputes it: its own caveats.

### In search of socio-technical congruence: a large-scale longitudinal study
- URL: https://ar5iv.labs.arxiv.org/html/2105.08198
- Took: the classic congruence result did not show up at scale.
- Measured: 25 large open-source projects, three-month windows, 18 combinations of dependency type, channel and quality indicator. No measurable effect of congruence on bugs or churn; coefficients centred on zero with no consistent sign; any effect "orders" smaller than size of code and number of developers.
- Evidence: moderate to strong for open source. Directly contests earlier small studies, but congruence is defined differently from Cataldo's measure, and it looks at bug density, not resolution time.
- Who disputes it: its authors say congruence still matters and its effect "lies elsewhere". Cataldo's original results I saw only in snippets (lead L2).

### Big Data = Big Insights? Operationalising Brooks' law (Gote et al., ICSE 2022)
- URL: https://ar5iv.labs.arxiv.org/html/2201.04588
- Took: larger teams are less productive per person, and earlier opposite findings were a sampling artefact.
- Measured: 201 GitHub projects stratified over team size, over 100,000 developers and 3 million commits. With controls, doubling team size lowers per-member productivity by about 22 to 30%. No reliable "optimal size": for six of eight measures the best fit was a team of one. Omitting collaboration structure or sampling only small teams can produce a false positive relation (Simpson's paradox).
- Evidence: moderate. Well designed, but commit-based measures of output in open source, not value delivered.
- Who disputes it: the debate with Sornette's group; see next entry.

### Revisiting Aristotle vs. Ringelmann (Gut and Goldman, SBES 2024)
- URL: https://sol.sbc.org.br/index.php/sbes/article/view/30349
- Took: the sublinear and superlinear camps differ mostly because of how they measured.
- Measured: replication of both studies; instrumentation bias contributed more to the gap than the selection bias both teams had proposed.
- Evidence: moderate, abstract only.
- Who disputes it: it partly disagrees with the sampling explanation in the previous entry.

### Bye bye DORA: flaws of the State of DevOps reports (Hackernoon)
- URL: https://hackernoon.com/bye-bye-dora-flaws-of-the-state-of-devops-reports
- Took: the case against survey-based delivery metrics.
- Measured: no re-analysis of DORA's data. Claims: raw data unpublished, self-report can produce the speed and stability link through general positive feeling, outcome measures favour speed, funders benefit from faster deployment.
- Evidence: argument only, written by someone with a competing message and his own surveys. I could not open DORA's primary method statement or Derek Jones's critique (lead L3), so this question is thinly answered.
- Who disputes it: DORA's own psychometric defence, seen only in snippets.

## Code review and inspection

### Expectations, outcomes and challenges of modern code review (Bacchelli and Bird, ICSE 2013)
- URL: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/ICSE202013-codereview.pdf
- Took: people say review is for finding defects; comments say otherwise; understanding is the bottleneck.
- Measured: 17 developers observed, 570 comments coded, 165 managers and 873 developers surveyed. Finding defects was the first motive for 44%. Only 78 of 570 comments (14%) were about defects; code improvement 29%. 91% say unfamiliar files take longer; those who know the code give deeper comments.
- Evidence: moderate to strong, mixed methods, one company.
- Who disputes it: see the Entropic Thoughts entry on the inference drawn from comment shares.

### Modern code review: a case study at Google (Sadowski et al., ICSE-SEIP 2018)
- URL: https://sback.it/publications/icse2018seip.pdf
- Took: review works fast when changes are tiny and one reviewer is the norm; the stated purpose is education, norms and gatekeeping.
- Measured: about 9 million changes. Median change 24 lines, median 1 reviewer, median review under 4 hours. Comments per change peak at 12.5 around 1,250 lines; people under a year in the company get over twice as many comments.
- Evidence: strong on the logs, weak on the survey (44 valid responses). The defect yield of review is not reported.
- Who disputes it: none found.

### Code reviews do not find bugs (Czerwonka, Greiler, Tilford, ICSE 2015)
- URL: https://microsoft.com/en-us/research/wp-content/uploads/2015/05/PID3556473.pdf
- Took: who reviews matters more than that someone reviews; first-time reviewers add little.
- Measured: about 15% of comments indicate a possible defect, at least 50% concern maintainability. A reviewer with no prior exposure has about 33% of comments judged useful by the author, about 67% by the third review of the same code, and reaches the project average by the fourth. Median turnaround about 24 hours; about six hours a week per developer.
- Evidence: moderate. Microsoft data in a position-style paper.
- Who disputes it: next entry.

### Code reviews do find bugs (Entropic Thoughts, blog)
- URL: https://entropicthoughts.com/code-reviews-do-find-bugs
- Took: a share of comments is not a defect yield: at four comments per review, most reviews would contain a defect comment.
- Measured: no new data; relies on Czerwonka and on secondary books.
- Evidence: argument only, but the logical point is correct and limits what the comment-share numbers can show.
- Who disputes it: none found.

### What types of defects are really discovered in code reviews? (Mäntylä and Lassenius, TSE 2009), author's page
- URL: https://mmantyla.github.io/wiki/What+Types+of+Defects+Are+Really+Discovered+in+Code+Reviews%253F.html
- Took: reviews mainly improve how changeable the code is.
- Measured: 9 industrial reviews (388 defects) and 23 student reviews (371). 75% of defects found do not affect visible function.
- Evidence: moderate, small sample, and defect type does not say how many functional defects were missed.
- Who disputes it: none found.

### The impact of code review coverage and participation on software quality (McIntosh et al.), abstract
- URL: https://www.swag.uwaterloo.ca/www/publications/the-impact-of-code-review-coverage-and-code-review-participation-on-software-quality-a-case-study-of-the-qt-vtk-and-itk-projects.html
- Took: poorly reviewed code links to more post-release defects.
- Measured: Qt, VTK, ITK. Low coverage estimated to add up to 2 post-release defects per component, low participation up to 5.
- Evidence: moderate, three projects, observational.
- Who disputes it: next entry. The journal version adds reviewer expertise and says coverage alone does not guarantee few defects (https://rebels.cs.uwaterloo.ca/journalpaper/2015/03/03/an-empirical-study-of-the-impact-of-modern-code-review-practices-on-software-quality.html, abstract opened).

### Review participation replication at Sony Mobile (Shimagaki et al., ICSE 2016)
- URL: https://rebels.cs.uwaterloo.ca/papers/icse2016_shimagaki.pdf
- Took: the standard review metrics did not replicate in a commercial setting.
- Measured: about 20,000 commits, 1,000 authors. Coverage measures were not significant; context-specific measures were (share of in-house work, coefficient -1.44, p = .0001; self-verification associated with more defects, p = .0124).
- Evidence: moderate, single system, but a useful failed replication.
- Who disputes it: none found.

## Independence of checks

### N-version programming with coding agents (Ron, Baudry, Monperrus, arXiv June 2026)
- URL: https://arxiv.org/abs/2606.20158 (full text at https://ar5iv.labs.arxiv.org/html/2606.20158)
- Took: the 1986 result reproduced on AI coding agents, and diversity still paid.
- Measured: 69 [harness, model, language] configurations (5 harnesses, 23 models, 3 languages), 48 passed a 200-case screen, each run on 1,000,000 random inputs from the original specification. Independence predicts 115.36 coincident failures; 429 were observed (pooled z = 29.20). Exact co-failure occurred in 87 of 158 cross-agent pairs against 34 of 52 same-agent pairs. Three-version voting cut mean failures from 387.44 to 130.99 (about 3x); 68.48% of the 17,296 triples had zero observed failures, against 27 single versions. Co-failure clusters crossed agent and language; hotspots were hard or ambiguous parts of the specification, where many agents computed a circumcircle instead of the minimum enclosing circle.
- Evidence: moderate to strong. Large, clean, directly on point; but a recent preprint, one specification, and models are not isolated from harness and language.
- Who disputes it: none found. Authors conclude the strategy is useful; I read the same data as showing it helps much less than independence would.

### NASA report on the Knight and Leveson experiment
- URL: https://ntrs.nasa.gov/api/citations/19870002808/downloads/19870002808.pdf
- Took: dependence is real, yet redundancy still helped.
- Measured: 27 programs (UVA and UCI) from one specification, one million tests each, 45 faults identified. Correlated faults often had no obvious similarity; unrelated faults were triggered by the same input special cases. Three-version systems cut failure probability by about one order of magnitude; two-version systems detected errors with probability about 0.995.
- Evidence: moderate, students, one problem. The original 1986 paper was behind a bot check, so I read this report instead.
- Who disputes it: lead L4 on the later argument about diversity against one good version.

### Are mutants a valid substitute for real faults? (Just et al., FSE 2014)
- URL: https://homes.cs.washington.edu/~rjust/publ/mutants_real_faults_fse_2014.pdf
- Took: mutation detection tracks real fault detection better than coverage.
- Measured: 357 real faults in 5 Java programs, about 230,000 mutants. 73% of real faults coupled to at least one mutant; 17% are beyond mutation analysis by nature (mostly algorithm changes). Mutation score rose in 75% of suite pairs, statement coverage in 46%.
- Evidence: moderate to strong, five well-tested programs.
- Who disputes it: next entry.

### Are mutation scores correlated with real fault detection? (Papadakis et al., ICSE 2018), abstract page
- URL: https://conf.researchr.org/details/icse-2018/icse-2018-Technical-Papers/78/Are-Mutation-Scores-Correlated-with-Real-Fault-Detection-A-Large-Scale-Empirical-stu
- Took: much of the apparent correlation is test-suite size.
- Measured: CoreBench and Defects4J. All correlations are weak when suite size is controlled. Yet among same-size suites, those with higher mutation scores find real faults significantly more often than random suites.
- Evidence: moderate to strong, abstract only. A later paper argues size is not a confounder at all (lead L5), so the statistics are themselves contested.
- Who disputes it: lead L5.

### Coverage is not strongly correlated with test suite effectiveness (Inozemtseva and Holmes, ICSE 2014)
- URL: https://www.cs.ubc.ca/~rtholmes/papers/icse_2014_inozemtseva.pdf
- Took: coverage is not a reliable target.
- Measured: 5 Java systems, 31,000 suites. With size controlled the correlation becomes low to moderate; Joda Time fell from 0.80 to 0.85 down to about zero. Type of coverage mattered little. Effectiveness measured on mutants, not real faults.
- Evidence: moderate, and it depends on the previous two entries for what mutants mean.
- Who disputes it: lead L5.

### A study on the lifecycle of flaky tests (Lam et al., ICSE 2020), abstract
- URL: https://www.microsoft.com/en-us/research/?p=671544
- Took: asynchrony is the leading cause, and a claimed fix is often no fix.
- Measured: six proprietary Microsoft projects. Several "fixed" flaky tests still failed at the same rate when measured. Abstract gives no time-to-fix numbers.
- Evidence: moderate, abstract only.
- Who disputes it: none found.

### A qualitative study on the sources, impacts and mitigation of flaky tests
- URL: https://ar5iv.labs.arxiv.org/html/2112.04919
- Took: unreliable checks erode trust in all checks, and people dismiss real bugs as noise.
- Measured: 14 practitioners and 38 grey-literature articles. 5 of 14 said flakiness undermines trust in the suite and system; 2 reported real bugs mislabelled as flakes. Cited second-hand from an industry report: Google had 16% of tests with some flakiness, 84% of pass-to-fail transitions involved a flaky test, and 2 to 16% of test budget went on reruns. I could not verify those at source; the Google blog page I opened had no article body.
- Evidence: weak to moderate, small interview sample.
- Who disputes it: none found.

### A comprehensive evaluation of capture-recapture models for estimating software defect content (Briand et al., TSE 2000), abstract
- URL: https://pure.ul.ie/en/publications/a-comprehensive-evaluation-of-capture-recapture-models-for-estima/
- Took: estimating remaining defects from reviewer overlap needs more reviewers than anyone actually uses.
- Measured: "When the number of inspectors is too small, no model is sufficiently accurate and underestimation may be substantial." A search snippet of the abstract put the limit at fewer than 4. Full figures not read.
- Evidence: moderate, abstract only.
- Who disputes it: none found.

### How Amazon Web Services uses formal methods (Newcombe et al., CACM 2015)
- URL: https://lamport.azurewebsites.net/tla/formal-methods-amazon.pdf
- Took: writing precise design specs finds design bugs that review and test do not.
- Measured: table of systems with spec size 102 to 939 lines. Results include 2 bugs (S3 network algorithm), 3 bugs (DynamoDB, some needing 35-step traces), 3 bugs (EBS volume management). A 35-step data-loss bug had passed design review, code review and testing. Engineers reached useful results in 2 to 3 weeks. Does not show the code matches the design; missed a liveness bug where liveness was not checked; does not catch retry-storm style degradation.
- Evidence: moderate. Self-reported, no control group, no cost figures.
- Who disputes it: its own limits section.

### Using lightweight formal methods to validate a key-value storage node in Amazon S3 (Bornholt et al., SOSP 2021)
- URL: https://www.cs.utexas.edu/~bornholt/papers/shardstore-sosp21.pdf
- Took: executable reference models plus property tests are affordable, and can be kept up by the owning team.
- Measured: about 44,000 lines of Rust. Reference models 450 lines (about 1%); models and harnesses about 13% of total code. 16 issues kept from production (5 functional, 5 crash consistency, 6 concurrency). Two experts for nine months plus one for three to build; about 18% of model and harness lines last edited by non-experts. Availability, performance and resource exhaustion are out of scope. One cache bug escaped the tests and was caught in manual code review.
- Evidence: moderate, single system, self-reported, no counterfactual.
- Who disputes it: none found.

### Property-based testing in practice (Goldstein et al., ICSE 2024)
- URL: https://cis.upenn.edu/~bcpierce/papers/icse24-pbt-in-practice.pdf
- Took: the hard part is knowing what to check and whether the checks are any good.
- Measured: 30 interviews at one firm. 16 of 30 said writing specifications slowed them; 17 of 30 used differential or model-based properties. 11 of 30 did not scrutinise whether their tests were effective. No measured effect on bugs (10 of 30 reported finding bugs other methods missed).
- Evidence: weak to moderate, one company, self-report.
- Who disputes it: none found.

### An empirical study on the correctness of formally verified distributed systems (Fonseca et al., EuroSys 2017), through The Morning Paper
- URL: https://blog.acolyer.org/2017/05/29/an-empirical-study-on-the-correctness-of-formally-verified-distributed-systems/
- Took: bugs move to the edge of what was proved.
- Measured: 3 verified systems, 16 bugs. 11 in the interface layer between verified and unverified parts, 2 in specifications, the rest in verifiers and libraries. Zero protocol bugs in verified systems; all compared unverified systems had protocol bugs.
- Evidence: moderate. The comparison is not like for like, because the unverified systems had far more field use.
- Who disputes it: the summary's own caution.

## Incremental correctness

### Build systems à la carte (Mokhov, Mitchell, Peyton Jones, ICFP 2018)
- URL: https://www.microsoft.com/en-us/research/uploads/prod/2018/03/build-systems-a-la-carte.pdf
- Took: rebuild only what depends on what changed, stop early if a result did not change, and share results by hash; non-determinism breaks part of this.
- Measured: nothing; this is a formal comparison. Non-determinism relaxes correctness to "one possible output", and combining it with deep constructive traces can produce inconsistent results ("Frankenbuilds").
- Evidence: argument only (precise and formal).
- Who disputes it: none found. I found no measured cache hit rates or hermeticity limits for Bazel before the search budget ended.

### The computational complexity of assumption-based truth maintenance systems (Provan, 1988), abstract
- URL: https://www.cs.ubc.ca/tr/1988/tr-88-11
- Took: tracking every set of assumptions behind every belief is exponential.
- Measured: proofs. Computing minimal supports is exponential in assumptions for almost all Boolean expressions; moderately large problems become infeasible without restructuring.
- Evidence: strong as mathematics about the worst case; says little about the typical case.
- Who disputes it: later work on focused and lazy labelling (seen only in snippets).

### Scaling up logic-based truth maintenance systems via fact garbage collection (Everett and Forbus, 1996)
- URL: https://www.qrg.northwestern.edu/papers/Files/gc-final%28searchable%29.pdf
- Took: recording every reason forever kills the system; forgetting selectively fixes it.
- Measured: in a fielded tutor, one assumption change went from under 1 second to about 15 seconds by the thirtieth change, and the program crashed on the forty-eighth. Rules grew from 2,547 to 21,441 on a 32 MB machine. With garbage collection, 1,000 changes at 3.1 seconds average with no rule growth.
- Evidence: moderate, one application, old hardware.
- Who disputes it: none found. I found no retrospective explaining why truth maintenance stayed niche; the reasons I infer are this cost and the worst-case bound.

## Failure handling

### Crash-only software (Candea and Fox, HotOS 2003)
- URL: https://www.usenix.org/legacy/events/hotos03/tech/full_papers/candea/candea_html/
- Took: one way to stop and one way to start; state kept in dedicated stores; timeouts, leases and retryable requests on everything.
- Measured: casual reboot times (crash faster than clean in all three cases); a prototype completed 78% more requests under fault load.
- Evidence: argument only with light data; a workshop paper.
- Who disputes it: authors say throughput will likely suffer.

### Microreboot: a technique for cheap recovery (Candea et al., OSDI 2004)
- URL: https://www.usenix.org/legacy/events/osdi04/tech/full_papers/candea/candea_html/
- Took: fine-grained restart is an order of magnitude cheaper, within limits.
- Measured: 411 to 601 ms against about 19 seconds for a full restart. Failed requests per injected fault 78 against 3,917 (98% fewer). Effective against 19 of 26 injected fault types. Non-atomic updates to shared state can survive a microreboot in an inconsistent form.
- Evidence: moderate. Injected faults, one stack, authors' own system.
- Who disputes it: its limitations section.

### Mats Cronqvist on AXD 301, Erlang Factory 2010 slides
- URL: https://www.erlang-factory.com/upload/presentations/243/ErlangFactorySFBay2010-MatsCronqvist.pdf
- Took: the famous reliability number is not evidence for "let it crash".
- Measured: the nine-nines figure was a customer claim integrated over about 5 node-years; nobody on the project called it normal. The system contained much more C than Erlang. Stability is attributed to realistic management, test and development working closely, stable infrastructure and no restarts or upgrades.
- Evidence: weak, one insider's slides. I found no controlled or independent measurement of supervision and reliability.
- Who disputes it: this source is itself the dispute.

### Leases (Gray and Cheriton, SOSP 1989)
- URL: https://www.eecg.utoronto.ca/~yuan/teaching/gradOS/papers/89-leases.pdf
- Took: time-limited permission turns crashes and partitions into performance loss rather than errors; a short term gets most of the benefit.
- Measured: V system trace and model. A 10-second term cut consistency traffic to about 10% of the zero-term level. With 100 ms round trip, 10 seconds adds 10.1% delay over an infinite term, 30 seconds adds 3.6%. Depends on bounded clock drift; a fast server clock can violate consistency.
- Evidence: moderate, one old trace plus a model, widely reused since.
- Who disputes it: none found.

### Sagas (Garcia-Molina and Salem, 1987)
- URL: https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf
- Took: long work as steps with compensations; compensation is semantic, not a rollback; others can see partial results.
- Measured: nothing. Some actions cannot be undone; a compensating step can itself fail and may need a person.
- Evidence: argument only. I found no good measurement of sagas in practice before the budget ended.
- Who disputes it: none found.

### Gray failure (Huang et al., HotOS 2017)
- URL: https://www.microsoft.com/en-us/research/wp-content/uploads/2017/06/paper-1.pdf
- Took: the system can report itself healthy while the user sees it broken, and more redundancy can make that worse.
- Measured: no frequency. Azure anecdotes and the statement that gray failure "is behind most cloud incidents".
- Evidence: weak quantitatively; the concept is well supported by examples.
- Who disputes it: none found.

### Metastable failures in distributed systems (Bronson et al., HotOS 2021)
- URL: https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf
- Took: a trigger starts a bad state and a feedback loop keeps it after the trigger is gone; features for reliability, such as retries, create those loops.
- Measured: worked examples only.
- Evidence: argument with illustrative numbers.
- Who disputes it: none found.

### Metastable failures in the wild (Huang et al., OSDI 2022)
- URL: https://www.usenix.org/conference/osdi22/presentation/huang-lexiang (PDF: https://www.usenix.org/system/files/osdi22-huang-lexiang.pdf)
- Took: such failures are common, severe, and retries are the usual sustaining effect.
- Measured: 22 incidents from 11 organisations in the abstract, 21 in the table. At least 4 of 15 major AWS outages in a decade. Retries in over 50%. Outages 1.5 to 73.53 hours. About 50% of triggers involved direct human action; load spikes about 35%. Load shedding used in over 50%.
- Evidence: moderate. Public reports only, so biased to what is disclosed.
- Who disputes it: none found.

### Cores that don't count (Hochschild et al., HotOS 2021)
- URL: https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s01-hochschild.pdf
- Took: silent wrong answers from "working" parts exist, and a self-check can pass while being wrong.
- Measured: on the order of a few bad cores per several thousand machines. One core's AES was self-inverting: encrypt and decrypt on that core returned the original, and only another core exposed the error. Human-flagged suspects confirmed about half the time. Detecting by redoing seems to double the work; correcting may triple it.
- Evidence: moderate, operator's account with little published data.
- Who disputes it: none found.

### XFT: practical fault tolerance beyond crashes (Liu et al., OSDI 2016), abstract
- URL: https://www.usenix.org/conference/osdi16/technical-sessions/presentation/liu
- Took: why Byzantine tolerance is rarely adopted.
- Measured: abstract claims only: extra cost in resources, protocol complexity and performance; many practitioners consider an adversary controlling the network irrelevant.
- Evidence: argument only as to adoption; I found no deployment census.
- Who disputes it: lead L6.

### Simple testing can prevent most critical failures (Yuan et al., OSDI 2014), through The Morning Paper
- URL: https://blog.acolyer.org/2016/10/06/simple-testing-can-prevent-most-critical-failures/
- Took: catastrophic failures mostly sit in error-handling paths and need few nodes to reproduce.
- Measured: 198 sampled failures from 5 systems. 92% of catastrophic cases came from wrong handling of errors the software had already signalled. 98% appear on 3 nodes or fewer.
- Evidence: moderate to strong, random sample, five open-source systems.
- Who disputes it: none found.

## Speculative and redundant execution

### The tail at scale (Dean and Barroso, CACM 2013)
- URL: https://www.barroso.org/publications/TheTailAtScale.pdf
- Took: a short delayed duplicate removes most of the tail at small cost.
- Measured: reading 1,000 keys across 100 servers, a hedge after 10 ms cut the 99.9th percentile from 1,800 ms to 74 ms with about 2% extra load. Waiting until the 95th percentile keeps added load near 5%. With 100 servers at 1-in-100 slow, 63% of user requests are slow.
- Evidence: moderate to strong. Benchmarks on Google's own systems, one company, technique widely reused since.
- Who disputes it: none found.

### MapReduce (Dean and Ghemawat, OSDI 2004)
- URL: https://research.google.com/archive/mapreduce-osdi04.pdf
- Took: re-execution of deterministic steps with atomic commit is enough to survive worker failure.
- Measured: with backup tasks disabled, sort took 44% longer (1283 s against 891 s). One benchmark. With non-deterministic operators the guarantee weakens.
- Evidence: moderate, one benchmark.
- Who disputes it: next entry.

### Reining in the outliers in MapReduce clusters using Mantri (Ananthanarayanan et al., OSDI 2010)
- URL: https://www.usenix.org/events/osdi10/tech/full_papers/Ananthanarayanan.pdf
- Took: speculate according to the likely gain; naive early speculation hurts.
- Measured: outliers inflated job time about 34% at the median; deployment cut average job time about 32% in Bing clusters. An early-speculating variant of an earlier scheme was worse than the original. Restarts capped at three to avoid thrashing. Some exact figures were lost in text extraction.
- Evidence: moderate to strong, production deployment.
- Who disputes it: none found.

### Effective straggler mitigation: attack of the clones (Ananthanarayanan et al., NSDI 2013), abstract
- URL: https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/ananthanarayanan
- Took: clone every small job proactively, because small jobs use little of the total.
- Measured: stragglers averaged 8x slower than the median, lengthening average small-job duration by 47% despite existing mitigation. Cloning sped small jobs by 34 to 46% with about 5% more resources.
- Evidence: moderate, Facebook and Bing traces, abstract.
- Who disputes it: none found.

## Risk-based rollouts

### Site Reliability Engineering, introduction (Google)
- URL: https://sre.google/sre-book/introduction/
- Took: "SRE has found that roughly 70% of outages are due to changes in a live system."
- Measured: the 70% has no citation, sample or method.
- Evidence: weak. Widely repeated, uncheckable.
- Who disputes it: the Ghosh et al. entry below gives a different split, though with different categories.

### Error budget policy, SRE Workbook (Google)
- URL: https://sre.google/workbook/error-budget-policy/
- Took: a mechanical rule: exceed the budget over four weeks and all but P0 and security changes halt.
- Measured: nothing. A template, no effect data.
- Evidence: argument only.
- Who disputes it: none found.

### Canarying releases, SRE Workbook (Google)
- URL: https://sre.google/workbook/canarying-releases/
- Took: exposure limits damage arithmetically, and a canary only sees what its size, duration and load can show.
- Measured: example only: 20% errors on a 5% canary is about 1% overall. One canary at a time, a dozen metrics at most.
- Evidence: argument only.
- Who disputes it: none found.

### How to fight production incidents (Ghosh et al., SoCC 2022), via two secondary sources
- URLs: https://systemsdistributed.substack.com/p/how-to-fight-production-incidents and https://asatarin.github.io/talks/2023-01-how-to-fight-incidents (abstract at https://www.microsoft.com/en-us/research/?p=881646)
- Took: most incidents are not code bugs, and most are mitigated without a fix to the code.
- Measured: 152 Microsoft Teams incidents, May 2021 to May 2022. About 40% code or configuration, about 60% infrastructure, deployment or dependencies. Nearly 80% of code and configuration incidents mitigated without a code or configuration fix. Detected 55% by automated alert, 29% by external users. The two secondary sources differ on category detail (the talk notes are an AI-generated transcript), so only coarse figures should be used.
- Evidence: moderate, single service, secondary reading.
- Who disputes it: the authors warn it may not replicate elsewhere.

## Not covered

The search budget ended before these were reached, so nothing below rests on an opened source.

- **Open-source governance, entirely:** Linux kernel maintainer and patch-review data, trust hierarchies, Apache and Rust decision processes, Ostrom's principles applied to software, bus factor, maintainer burnout, Wikipedia's stigmergic coordination and bots, and Halfaker et al. From memory, unverified and not to be relied on: Halfaker et al. tie the decline of Wikipedia's editor numbers to rejection of newcomers' good-faith work as quality-control automation and rules grew. That needs opening before anyone uses it.
- Borg, Omega and Kubernetes (the article was behind a bot check), so declarative reconciliation has no entry.
- Feature flags and their removal; configuration as an outage cause at Facebook; the Gunawi outage study.
- Fagan's original inspection data, and the inspection-meeting experiments. Measured defect yield of inspection therefore has no opened source here.
- Primary DORA method; any developer productivity study at scale.
- Expand-and-contract and multi-repository change cost: no measurement found.

### Leads seen only in search snippets (not opened, not relied on)

- L1: Caglayan et al., Merits of organizational metrics in defect prediction: an industrial replication, ICSE 2015.
- L2: Cataldo and Herbsleb on socio-technical congruence and resolution time.
- L3: Derek Jones's critique of the State of DevOps data (The Shape of Code).
- L4: Littlewood, Popov, Strigini, N-version design versus one good version, DSN 2000.
- L5: Chen et al., Revisiting the relationship between fault detection, test adequacy criteria, and test set size, ASE 2020.
- L6: Clement et al., Making Byzantine fault tolerant systems tolerate Byzantine faults, NSDI 2009; a reported but unpublished Yahoo observation that Byzantine failures were far rarer than crashes.
- L7: Brindescu et al. on merge conflicts and quality; Kula et al. on outdated dependencies; the Cisco and SmartBear review-size study, which comes from a vendor of review tools.

## What this means for organising AI agent work

Each point separates what was measured from what I infer. Nothing here was measured on a whole system for organising AI agent work.

1. **Agreement between agents is weak evidence of correctness.**
   - Measured: independence fails for humans (Knight and Leveson) and for AI agents across models, harnesses and languages (429 coincident failures observed against 115 predicted). Voting over three still cut mean failures about 3x. Shared errors concentrate where the specification is hard or ambiguous.
   - Inference: never multiply reviewer pass rates as if independent. Using a different model is worth doing but buys less than it appears. Spending effort on the ambiguous parts of a specification may beat adding another checker.

2. **A fresh reviewer is a weak reviewer, and review is not mainly a bug filter.**
   - Measured: about 14 to 15% of review comments concern defects, 75% of findings are about changeability, a first-time reviewer's comments are about 33% useful and 67% by the third review. Standard review metrics linked to defects in three open-source projects and failed to replicate at Sony.
   - Inference: an agent with no history of the code resembles the 33% case, so reviewers need supplied context. Review's human benefits (shared knowledge, education) barely transfer to agents with no lasting memory, so correctness should rest on executable checks, and review kept for what they cannot judge. Comment shares do not tell us how many bugs review catches; that yield is not established here.

3. **Green checks are weak signals, and noisy ones get ignored.**
   - Measured: coverage is low to moderately related to effectiveness once size is controlled; mutation score is better but contested, and 17% of real faults are out of its reach. About 40% of breakage searches at Google were flakes. Claimed flake fixes often did not work. With few inspectors, overlap-based defect estimates are unreliable.
   - Inference: a test written by the agent that wrote the code shares its blind spots. Use mutation or seeded faults to compare checks, not as a pass mark. Treat a check's verdict as a probability, keep a record of each check's reliability, and do not estimate remaining defects from two reviewers' overlap.

4. **Use a merge gate as soon as work runs in parallel; speculation has a price.**
   - Measured: at Uber, about 40% chance of trouble at 16 concurrent changes, and a green main line after a queue. Speculation still costs about 1.9 to 2.6 builds per landed change after tuning. Simple indicators did not predict textual conflicts in open source. 81% of textual conflict chunks were resolved with existing lines.
   - Inference: the textual conflict is the cheap case and an agent can do it; the expensive case is two changes that merge cleanly and break together, which only a check on the merged result finds. Do not plan by predicting overlaps from changed files alone. Below a handful of concurrent changes a plain serial queue is probably enough.

5. **Keep the number of writers per component small.**
   - Measured: at Google, breakages rise with three or more authors on a file; in GitHub data, doubling team size lowers per-person output about 22 to 30%; organisational measures best predicted Vista failures. Against that, one 25-project study found no measurable effect of congruence.
   - Inference: assign components, not just tasks, and limit concurrent writers. Do not build elaborate machinery to match communication to dependency structure on this evidence. The cost of coordination for agents differs from people's, so the size effect may not carry over.

6. **Assume workers vanish; make recovery the normal path.**
   - Measured: microreboots cut failed requests 98% on injected faults; short leases get most of their benefit at about 10 seconds in the original trace; MapReduce survives worker loss by re-execution with atomic commit. Non-determinism weakens those guarantees.
   - Inference: give each piece of work a short renewable claim, keep state outside the worker, and have one start path that resumes from durable state. Agents are not deterministic, so a re-run is a new attempt, not a replay: record which output was accepted. Sagas warn that some steps cannot be undone; mark those before they run.

7. **The dangerous failure is confident and wrong, and a heartbeat will not see it.**
   - Measured: gray failure and silent CPU errors exist in production, though with little published frequency data. One bad core passed its own encrypt-decrypt check. 92% of catastrophic failures in one sample were in handling of errors already signalled. Byzantine protocols are rarely used, mainly for cost.
   - Inference: judge a worker by observing what its output does from the consumer's side, on a different path from the one it used. Do not adopt full Byzantine quorums; an agent that is mistaken is not an adversary. Spend redundancy where errors are costly, and test the error paths.

8. **Hedge cheap and small work; limit retries.**
   - Measured: a 10 ms hedge cost 2% load for a large tail cut; cloning small jobs cost about 5% for 34 to 46%; naive early speculation made things worse. Retries sustained over half of the metastable failures studied.
   - Inference: run duplicates on small read-only tasks, using cheap models, and take the first acceptable result. Never hedge work with side effects. Give every retry loop a budget, because an unattended system cannot be rescued from a retry storm by a human.

9. **Plan to reverse changes, not only to prevent them.**
   - Measured: nearly 80% of code and configuration incidents in one service were mitigated without a code or configuration fix; 29% were first detected by outside users. The widely quoted "70% of outages come from change" has no published source. Error budgets have no outcome data that I found.
   - Inference: with the owner away, an automatic halt rule and a tested way back are probably worth more than another review layer. Treat error budgets as a sensible convention, not a proven one.

10. **Record why a result is believed, coarsely, and allow forgetting.**
    - Measured: fine-grained assumption tracking is exponential in the worst case, and a fielded system recording every reason crashed by its forty-eighth change until it garbage-collected facts. Build systems rebuild by input hash with early cutoff, but the formal correctness needs deterministic tasks or it weakens. Verified systems had their bugs at the unverified boundary.
    - Inference: hash the inputs of a decision or check at the granularity of files or tasks, and invalidate when they change; do not track every belief. Expect failures at the edge between what was checked and what was assumed, and write those assumptions down.
