# Critic's report on "A system for organising work, designed from zero"

## Method

I read the README, first-principles.md and all five notes files in this folder. I read nothing else locally, ran no repository procedure, and used no MCP tool. I did not search for any tool, project or person named in my context, and no result was about them.

I then fetched 20 URLs that the notes or the README already cite (the SLSA threats page is a sibling of the SLSA page the README cites), chosen because the README leans on them or because something looked wrong. One (the Google testing PDF by Memon et al.) came back unreadable, and the tool saved a binary copy that I did not open, so anything I say about that paper rests on the notes alone. The fetch tool passes pages through a small model, so my "checked at source" means "checked through that tool", which is the same weakness the README admits to.

All four web searches I tried were refused because the session's search budget was used up. As instructed, I did not route around that. Every reference below to prior work outside the notes (assurance cases, test-driven development studies, the reusable holdout, mutation testing at Google, error seeding, forge features) is **from memory and unverified**, and I give no URLs for it.

The arithmetic is mine. Where I use cost weights, they are my assumptions and I say so. I did not load the machine's writing-style guide, because the isolation rules forbade reading anything under the home directory.

Each objection separates **Checked** (seen in a source or in the notes) from **Reasoned** (my argument). Objections are ranked by how much damage each would do if true.

## Objections, ranked

### 1. The central guarantee is circular: "done is observed by the environment" only moves the agent's word one step back

**The objection.** The README says "An agent cannot mark anything done. Done is something the environment observes." The environment observes only that a test passed. That test was written by a model, from cases written by other models. A participant still decides what counts as done. It has moved from the doer to the check-writer, and the program then stamps the result with a hash. The word "warrant" gives a model's opinion the look of a physical measurement.

**Checked.**
- The README's own P4 cites 80.2% of agent-written test patches having weak or no explicit oracle ([All Smoke, No Alarm](https://arxiv.org/html/2606.18168v1)). Yet section 4.7 gives no quality gate for the sealed checks beyond having been "seen to fail".
- The same-specification study found common failures across agents, and the paper says "the observed pattern is similar in both groups" for same-agent and cross-agent pairs ([Ron et al.](https://ar5iv.labs.arxiv.org/html/2606.20158)). So a check-writer and a code-writer can share a blind spot.
- Section 4.7 places no family requirement on the sealed-check author at all ("a fresh party"), although this is the gate with the strongest authority.
- SLSA, the README's stated precedent, says it "does not address source threats" and checks where and how something was built, not what the code does ([SLSA threats](https://slsa.dev/spec/v1.0/threats)). Provenance is a fact about process. "Extending" it "to all claims of completion" turns it into a claim about meaning, which it never made.
- In the report on the 16-agent compiler, the author says "it's important that the task verifier is nearly perfect, otherwise Claude will solve the wrong problem" ([Anthropic](https://www.anthropic.com/engineering/building-c-compiler)). That is the real constraint, and the design spends its effort on the machinery around the verifier.
- Test-based graders in one audit accepted wrong work 8.5% of the time and rejected correct work 24% of the time on one benchmark, though only 0.3% and 1.1% on a better-built one ([DeepSWE coverage](https://venturebeat.com/ai/deepswe-blows-up-the-ai-coding-leaderboard-crowns-gpt-5-5-and-finds-claude-opus-exploiting-a-benchmark-loophole/); 30 tasks, LLM judge). Grader quality dominates, and it varies widely.

**Reasoned.** "A check counts only if it has been seen to fail" is much weaker than it sounds. A test of new behaviour fails on the old code trivially, because the function does not exist or the route returns 404. A test with no real assertion clears that bar. In reverse, the rule would disqualify most of a mature suite: at Google 91.3% of test targets passed at least once and never failed (notes), so they are "not yet evidence" until someone pays for a mutation run for each one.

Fitness and knowledge claims do not have even this much. A fitness warrant is an examiner's opinion. A knowledge claim's check is "that an answer exists which would change a decision", and a model judges that too. So for several kinds of claim, "observed by the environment" is simply false.

**How sure.** High on the logic. Medium on how much it matters in practice, since independent test-writing plausibly does help.

**To answer it.** Show, on replayed real histories, the false-accept and false-reject rate of sealed checks written this way, against tests written by the project's maintainers. Drop the language of observation for anything that rests on a model-authored oracle.

### 2. The acceptance criteria come from a vote among cheap models, which the design says proves nothing

**The objection.** P3 says "Agreement proves little" and section 6 refuses "votes, panels or debates to decide correctness". Section 4.3 then says that where three cheap readers agree, "the cases become candidates for the checks", and in the worked example the checks are "written from the agreed cases". So correctness is decided by a three-model vote. It is the upstream vote that defines every downstream pass.

These cheap readers also effectively hold a veto over a stronger author, since a check derived from their cases can reject work. Section 4.7 forbids exactly that ("An examiner weaker than the author can only raise leads, not reject").

**Checked.** The stated basis for reading disagreement as ambiguity is wrong. The judgement in P3 says "since failures cluster at ambiguity". The measured sentence just before it says "hard or ambiguous". At source, the paper's detailed analysis says that for most logic conditions "the dominant mechanisms are concrete implementation errors rather than specification mistakes", and it ties real ambiguity to only two of them ([Ron et al.](https://ar5iv.labs.arxiv.org/html/2606.20158)). The README's example of "three readers can share one misreading", the circumcircle, is not a misreading of anything. It is an implementation mistake on a hard sub-problem.

**Reasoned.**
- Language models differ from each other by sampling noise even on clear text. Three readers each writing five cases give fifteen differently phrased cases with different inputs. The worked example is clean only because two readers happened to pick the same boundary input.
- Deciding whether two free-text readings "differ" takes semantic judgement. So does deciding whether a difference is "reversible" or "about what the product should be". The program has no model, so some model is doing it, unaudited.
- That second classification decides whether the owner is asked at all, and section 4.10 gives it to the participant.

**How sure.** High on the contradiction. Medium on noise swamping signal, which is untested, as the README admits.

**To answer it.** Seed wants with known ambiguities and known non-ambiguities, then report precision and recall of "readers differ". Say who compares the readings. Stop building oracles from agreement, or stop saying agreement is worthless.

### 3. The Number is not a bound, and it sits at the top of the owner's page

**The objection.** The conclusion and section 1 promise "a stated bound on how much of what was accepted is wrong". The formula does not deliver a bound, for reasons the README partly admits and then ignores when it decides what to show him first.

**Reasoned, with arithmetic.**
- **The bound moves the wrong way.** The bound is 3/(n·s). The README says counterfeit scores are "a ceiling" on s. A ceiling on s in the denominator makes the printed number a *floor* on the true upper bound. An upper bound that is known to be understated is not an upper bound.
- **s is not defined for the audit.** Section 4.7 says counterfeits "enter the examiners' stream", then uses "the audit is known from counterfeits to catch a fraction s". Unless audits are also seeded, s measures a different party. If they are seeded, each seed costs a full strongest-model audit.
- **s has its own error, which is ignored.** With 15 of 30 seeds caught, the 95% interval on s is about 0.33 to 0.67. Using the low end, 30 clean audits give about 30%, not 20%.
- **Survivorship.** Counterfeits are built from defects that were eventually found. Defects no model ever notices never become counterfeits. Real escapes have also already survived sealed checks and two examiners, so they are selected to be hard for these models. s on seeds will exceed s on the real population, by an unknown amount, in the direction that flatters.
- **It handles only zero findings.** One reproduced finding at n = 30, s = 0.5 gives about 32%. Two give about 42%. Audits will find things, and the README does not say what the page says then.
- **Sample sizes.** At s = 0.5, a 10% bound needs 60 clean audits and a 5% bound needs 120. At the stated audit rates, 60 audits means 240 accepted R2 claims, 600 R1, or 3,000 R0, all with zero findings and all on one stable mix of models. Five R2 claims a week yields one audit every 0.8 weeks, so 30 audits take about 24 weeks. The README itself says model-specific rates expire within months and that a model change makes "every mechanism due for re-test". For most projects the honest display is "unknown" permanently.
- **Risk classes are mixed.** With audit rates of 2%, 10%, 25% and 100%, a single pooled figure needs reweighting that the README never specifies.

**Checked: it cannot see the largest category of bad work.** Section 4.7 says "Only reproduced problems count as audit failures." The README's own P15 reports that about half of test-passing pull requests would not be merged, and the maintainers' rejection categories explicitly include code quality ("verbose, does not conform to standards") ([METR](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/)). You cannot write a reproduction for unmaintainable code. So a page saying "at most X% wrong" is silent about the failure the design's own evidence ranks as most common, and it reads as if it covered it.

The same reproduction rule also guts the fitness examiners, whose purpose is that failure.

**Reasoned: the diagnostic for recognised counterfeits is a logic error.** "If counterfeits are caught far more often than real problems are found by audit, the counterfeits are being recognised." Counterfeits are defective by construction. Audited items mostly are not. At a 5% defect prevalence and equal detection of 0.5, counterfeits are caught 20 times as often as audits find problems, with no recognition at all. The test fires always and means nothing.

**Reasoned: no decision hangs on it.** The README never says what the owner should do differently at 20% than at 35%. By the design's own first principle, a measure that changes no decision is waste.

**How sure.** High on all the mathematics and logic.

**To answer it.** Show raw counts ("31 audited, 2 reproduced problems, none on maintainability"). Remove the word "bound". Seed the audit stream, or drop s. State the decision each value triggers.

### 4. A much simpler thing gets most of the benefit, and the README nearly says so

**The objection.** Section 5 says "If only the first three are built, I would expect most of the benefit." Those three are clean-environment CI tied to an exact commit, read-only tests plus an instruction allowing "I cannot do this", and a short decisions page with defaults.

**Reasoned, with prior art from memory.** All of these can be configured today. A forge's required status checks are bound to the head commit and set by CI, not by the author, which is already "no status field an agent can set". Protected test paths give read-only checks. One line in a prompt gives the honest exit. A merge queue is the landing line. Path ownership is territories. A file with decisions and defaults is the page.

The simpler system is one strong agent working through a plain file of wants, each with acceptance examples, with:
- required CI on the exact commit, and tests the agent cannot edit;
- one fresh-context reviewer who does not see the author's account;
- a merge queue once there is more than one writer;
- an assumptions-and-decisions file;
- staged rollout with automatic rollback;
- the remaining money spent on making the test oracle excellent.

That covers section 5's items 1 to 6 with no ledger and no new program, because item 6 falls out of running the checks on every landing.

**Checked.** The notes contain the strongest evidence for this, and the README leaves it out:
- The compiler project used no orchestrator, only file locks in git ("I don't use an orchestration agent"), and the author put his effort into tests ([Anthropic](https://www.anthropic.com/engineering/building-c-compiler)).
- Anthropic's long-running harness used a feature list, a progress log and git (notes).
- The harness-design post found a full harness "over 20x more expensive" and said its evaluator is worth its cost only for tasks beyond what the current model does reliably alone. It also said to "find the simplest solution possible, and only increase complexity when needed" ([Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps)). In fairness, that post also found the harness output clearly better, but the conclusion is about when, not always. The README cites this source only for context resets.

**Reasoned.** Models change every few months and the README admits harness pieces expire with them. A system of about fifty mechanisms, most needing data to tune, will spend much of its life being re-validated against models that have already moved on.

**How sure.** High that the simple system captures most of the top-ranked items. Medium on whether it is actually better at large scale, which is exactly what is unmeasured.

**To answer it.** Run B1 plus an assumptions file and the honest exit (call it B1+) as a fourth arm in the section 2 trial. The design must beat B1+, not B1.

### 5. The core is mostly renaming. What is original is what has no evidence

**The objection.** Name by name:

| README's term | Existing thing (from memory, unverified) |
|---|---|
| Claim with evidence, kept in a structured record | Assurance or safety cases (claim, argument, evidence), in use for decades; requirements traceability; acceptance criteria and behaviour scenarios |
| Compare claimed against warranted, "the difference is the work" | Reconciliation loop of a declarative controller; a build system's goal against its current state |
| Warrant that expires by input hash | Content-hashed test results in a build cache |
| Attempt in a sealed environment | A CI job or an isolated worktree |
| Status only from the environment | Required status checks |
| Sealed checks | Hidden tests, holdout sets |
| Counterfeits | Error seeding (1970s), fault injection, threat image projection, gold questions |
| Random deep audit | Independent verification on a sample, acceptance sampling |
| Risk classes | Assurance levels in safety-critical standards |
| Landing line | Merge queue |
| Wave | Expand-and-contract, staged rollout |
| Revocation ("I did not come across this practice anywhere") | Forensic labs re-reviewing every case of a discredited analyst; blood-bank look-back; a certificate authority (which the README itself names as the source) |

The README concedes at section 2 that "claims rather than tasks" may be vocabulary and at section 9 that there is no data. Yet its opening conclusion states flatly "The best system is not a task tracker."

**Reasoned.** "Claims" are tickets with acceptance criteria. "Attempts" are runs. The only substantive shift is that status is computed rather than typed, and CI already computes it. The test proposed in section 2 (same checking machinery, two front ends) gives the point away: it treats the claim idea as a front end.

The pieces that are genuinely new are the Reading Test, AIMD on work size, the assumption cap, the owner-prediction precedent and warrant revocation by examiner. The README rates them untested, and most sit at the bottom of section 5. The research survey was also cut before Kubernetes reconciliation, feature flags and open-source governance (section 9), so the claim to have designed "from zero" could not be checked against the closest prior art. Assurance cases do not appear in the notes at all.

**How sure.** High on the mapping; the prior art is from memory but well known.

**To answer it.** Add a table of exactly this kind to the README and state what is left once the known parts are removed.

### 6. The checking costs multiples of the doing, and the worked example fails the design's own bar

**Reasoned.** The worked example is a one-sentence change in one repository, so it is a "Small work" case: "Single-claim changes in one repository", failing if "Cost is more than 10% above B0". Count its model runs:
- 3 readers;
- at least 1 check author;
- 2 attempts, the second stronger;
- 1 fix after the key leak;
- 2 examiners, and presumably 2 again after the fix;
- 1 audit.

That is about 12 model runs against 2 to 4 for B0 or B1.

With my assumed weights (mid attempt 1, strong attempt 3, cheap reader 0.1, check author 1, examiner 0.5, audit 3), the design costs about 9 in expectation (11 when audited). B0 costs about 4 and B1 about 5. That is about 2.3 to 2.8 times B0 and 1.8 to 2.3 times B1, before mutation runs, the seeded share, clean-environment time and renewal. The small-work test allows 1.1 times B0 and the medium test allows 1.5 times B1.

If "small" quietly means "low risk", then a small billing change appears in no test at all.

**Section 1 misstates scale.** "At the smallest scale almost all of this disappears." Risk and size are independent. A one-line change to billing, authentication or a schema is R2 or R3 and enters level 3 at once (section 4.13: "R2 work, or many weeks of work"). So does anything left unattended, since level 2 starts when "work outlasts one sitting of the owner", which is the case the whole design is for. Levels 0 and 1 are not the intended use. In any codebase with a critical path, the rule will put a large share of changes in R2.

"Every level is entered because of something measured" is also untrue. The conditions describe the work. None of them measures need.

**Checked.** The single cost figure in the notes for a full multi-role harness is more than 20 times ($200 against $9), n = 1 ([Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps)). The README does not mention it.

**Mechanism count.** By my count the design names about fifty distinct mechanisms. No cost per item is estimated for any of them, although section 4.15 requires exactly that of every one.

**How sure.** High on the contradiction. Medium on the ratio, which depends on my weights.

**To answer it.** Publish a costed run-count for R0 to R3 and restate the small-work bar. If R2 small work costs 2 to 3 times, say so, and argue that it pays for itself.

### 7. "A small ordinary program with no language model" is false as designed

**The objection.** The README gives the program jobs that need semantic judgement, and it hides the models that do them. It also rests P11, "programs coordinate", on evidence that points the other way.

**Reasoned.** The program is said to:
- classify a one-sentence want as R2 ("The program classifies this as R2, because it touches billing paths") before any diff exists, which no rule can do from English;
- find that readers "differ";
- record "what it predicted he would say";
- recognise "a class of question";
- compose a page of behaviour in prose "cut to fit the minutes he says he has";
- rank asks by "how long it takes to read";
- check that a retry truly states "another reading";
- decide whether a failure was "because of size".

Each is either a language model under another name or a self-report by a participant. The README also says a monitor, a witness classifier and a router will exist, and the design around the program needs bisection, speculation, mutation, sequential tests, control charts and waves. "Small" does not survive this list.

**Checked.**
- The monitor in the paper the README cites is itself a 0.6B model ([Fail-Fast](https://arxiv.org/abs/2608.03222)).
- The "trained router" is a logistic regression over a sentence embedding, and in that same table the **rule-based router was the worst option**: 73/100 at $172.56, against Opus alone at 74/100 for $54.73 and the trained router at 75/100 for $25.66 ([TwinRouterBench](https://arxiv.org/html/2605.18859)). P11 omits the rule-based result. That paper's authors call the frontier-model router failure "a case study of one frontier model under one prompt template".
- The "manager agents" row in section 6 says "a program does this better". Nothing in the notes compares a program to a manager agent.
- Cursor reports that a planner-and-worker hierarchy "solved most of our coordination problems" and that a flat structure made agents risk-averse ([Cursor](https://cursor.com/blog/scaling-agents)). P7 quotes only the sentence about locks.

**Reasoned: the program meets the unforeseen.** A provider outage looks like "stuck", so the window halves. A CI outage fails everything. A direct push to main desynchronises the ledger. Two claims that cannot both hold cause warrants to flip indefinitely. A deterministic program with no judgement will run these faithfully, burning budget, while the owner is away and "nothing nags".

Who changes the program, and under what gate, is never said. It is the one piece whose compromise defeats everything.

**How sure.** High.

**To answer it.** List every model call the system actually needs, including the ones now called "program". Add an escalation path for states that the rules do not cover.

### 8. The owner is worse informed and has less control than the design claims

**Checked, and applying the design's own evidence to itself.** P9 cites radiologists scoring 20 to 46% when the AI was wrong. Every ask has a model-written framing, model-written options, model-stated costs and a default that takes effect if he does nothing. A default is an AI recommendation with inertia added. P5 says a reviewer must not see the author's story, yet the owner's only view is the system's own story. P11 says models cannot predict their own success, yet the asks quote "what each costs". P9 also reports clinicians' unaided skill falling after AI exposure (Budzyn). The design removes him from the code permanently and offers only an optional spot check to hold it off.

**Checked.** P8 cites 60% faster resolution from naming and reminding the blocker ([Nudge](https://arxiv.org/abs/2011.12468v5)). The design's main blocker is the owner, and "Nothing nags".

**Reasoned.**
- **Assumptions surface too late.** The page shows "the few largest by weight", where weight is work resting on it. So he sees an assumption only after much has been built on it, when it costs most to reverse.
- **The small ones are never seen.** They pile up as sediment. If the cap trips, new work stops, and he drains the backlog at three asks per sitting. The "30 minutes to be back in control" bar then cannot be met. If 140 assumptions accumulate in two weeks, three asks a sitting is more than 40 sittings.
- **The weight cannot be computed.** It needs "the amount of work resting on it", which is a dependency record, and section 6 rejects "full reason graphs". In practice it depends on agents declaring what they rely on, which is self-report by a party whose work stops if it declares too much. P1 says self-report is worthless.
- **No close steering.** "He is not shown activity, agents, task counts or diffs." An owner who wants to look at a design, redirect mid-flight, or see what is in progress has no provided mode, and the attention metric counts looking as a cost.
- **No dates.** Time estimates are excluded (section 6). The flow notes' conclusion 9 recommended a scored forecast log with intervals from past error, and the README silently dropped it. An owner with a customer or an investor cannot answer "when?".
- **The spot check contradicts the rest.** He is "never used as a reader of code" and "not shown diffs", yet he is asked to judge an accepted item, and "sometimes it is a counterfeit". A counterfeit "cannot land", so he cannot try its behaviour. So he reads a diff, or the system builds a fake deployment for him. Either way the system is deceiving its owner with his scarcest resource.
- **The owner is graded by the system.** "Owner wrong... Managers who overrode a validated test hired worse." The test in that study was validated. Warrants are not, and the Number at 20% says so.

**How sure.** High on contradictions. Medium on actual harm to him, which needs a trial.

**To answer it.** Provide a steering mode. Show assumptions by reversal cost when they are made, not by accumulated weight after. Test whether the owner overturns defaults at a rate that shows he is judging.

### 9. Reversibility of the code is confused with reversibility of the effects, and nothing ships while he is away

**Reasoned.** The worked example classifies a change to who is charged as "reversible with a flag". Turning off the flag does not refund a customer or restore one wrongly blocked. By the table's own definition ("R3: irreversible or outward-facing") this change is R3, so the design's flagship example breaks its own table.

"Reversibility is produced" turns this into a loophole. Any change can be flagged and thereby lowered in class, and "the planning step prefers" it. Flags multiply untested combinations. The research on them was not reached (section 9).

The table's R2 cell says "program, under his standing grant" may start "the outward act", but an outward act is R3 by definition, so the cell describes an empty set.

Section 4.9 says "anything outward-facing or irreversible needs his word". If that is meant, nothing reaches users during a 14-day absence, so no "late verdicts" arrive either. The system then accumulates assumptions for two weeks with its only real-world signal switched off. If it is not meant, the design's central safety promise is unclear.

R0 "no behaviour change" is undecidable by a rule, in general. Taken at its word it covers the refactor, which is the class of work most likely to change behaviour silently, and gives it no examiners, no sealed checks and a 2% audit.

**How sure.** High.

**To answer it.** Define reversibility in terms of effects on the world, classify after the diff exists as well as before, and state whether a release needs his word.

### 10. The self-improvement loop cannot test the expensive mechanisms and will remove what it cannot measure

**Reasoned.**
- Withdrawal is on "low-risk work". Under the table in 4.1 the expensive mechanisms are absent or optional there: two families never applies below R2, and the Reading Test and sealed checks are off at R0 and conditional at R1. What is not reliably present cannot be withdrawn. Section 4.10 asks the owner to weigh "the withdrawal result" for R2 and R3 work, which by construction is from a different population.
- **Power.** Detecting a rise in escapes from 5% to 10% needs about 434 items per arm in a fixed trial, and 1% to 2% about 2,300. A sequential test saves perhaps half. At "a small share" of 5%, that is thousands of low-risk items per mechanism, with 90-day outcome signals, and all of it restarts when models change.
- "A mechanism that cannot show an effect is removed" treats absence of evidence as evidence of absence. A guard against rare catastrophe is the mechanism least able to show an effect at small sample, and it will be the first to go.

**Checked.** Section 4.15 says this is "the method by which airlines found that much of their maintenance did nothing". The notes describe fleet data plotted against age while intervals were stretched, with no randomisation, and say the safety claim could not be verified ("I found no before-and-after accident figures"). P17 says the withdrawal method is also "argued from... A/B practice", and section 9 lists A/B testing as not reached.

**How sure.** High.

**To answer it.** State the mechanisms that can actually be withdrawn and at what volume. Change the default to "keep unless harm from keeping is shown" for anything guarding against rare, severe outcomes.

### 11. Sealed and read-only checks collide with normal maintenance

**Checked.**
- Read-only tests do "not eliminate other cheating methods such as special-casing or operator overloading", and hiding tests degrades legitimate performance ([ImpossibleBench](https://arxiv.org/html/2510.20270)). The design hides half regardless and does not measure the cost.
- Holdout tests "are not foolproof", produced false alarms on legitimate solutions, and three heuristic solutions passed them ([EvilGenie](https://arxiv.org/html/2511.21654v1)). The notes record this and the README does not.

**Reasoned.**
- **Intended change is the common case.** Most feature work legitimately changes existing tests. If the public half is read-only and the rest are unseen, every intended behaviour change collides with a check that is now correctly out of date. The doer can only take the honest exit. The README has no mechanism for retiring or superseding a claim, so the ledger only grows.
- **Sealed checks need an interface that does not exist yet.** A check written "never seeing the candidate" must bind to names and shapes. So sealed checks work only at existing public surfaces, or after an interface claim that adds a step.
- **The retry loop leaks the sealed set.** The worked example gives the next attempt "the sealed failure described as behaviour". Three tries is an oracle query loop, and the machine-learning literature on adaptive reuse of holdouts (from memory) is about exactly this.
- **"The gap... is a live measure of gaming" is wrong.** Any honest worker iterating against visible tests passes them more often than unseen ones. That is ordinary generalisation error. Per claim the sample is also a handful of checks.
- **Unappealable false rejection.** The doer cannot see or challenge a wrong sealed check. After three tries it becomes a cut or an ask, charged to the owner.
- **The build configuration is the side door.** Test config, fixtures, mocks and dependency versions live in the diff unless every one is frozen.

**How sure.** High on all but the size of the effects.

**To answer it.** Define the path for a check that is correctly obsolete. Rename the gap, or control for what an honest worker would show. Budget the leak.

### 12. Much real work has no place in it

**Reasoned.**
- **Design, taste, exploration.** "A claim that cannot yet be checked is a want on its way to being a claim." For a UI redesign, the only oracle is the owner, who has three asks per sitting. Exploratory work becomes a "knowledge claim" whose check is itself a model's opinion.
- **Existing behaviour.** On day one, none of the working product is claimed. "The difference is the work", so what already works is not protected or described. The ledger is silent about 99% of the product until someone pays to back-fill it. The README never mentions adopting this on an existing codebase.
- **Slow, flaky or absent tests.** "A flaky check is quarantined and its verdict carries no weight." At Google about 40% of breakage searches were flakes, and claimed flake fixes often did not work (notes). On a flaky suite the warrant base can evaporate, and on a project with no tests, level 0's only check does not exist.
- **Large refactors and migrations.** An attempt holds a territory, disjoint and declared in advance. The notes record that no indicator (including files changed) predicted conflicts, and they warn against planning overlaps from changed files. A large refactor discovers its territory as it goes. The README does not say what happens when an attempt must step outside. Expand-and-contract has no measurement in the notes.
- **The first day.** No counterfeits, no failure list, no routing record, no s, no Number, no precedents, no windows. Level 3 requires counterfeits "built from real history".
- **Lost work.** "An expired lease means the attempt never happened." On a long attempt that is real money with no checkpoint.
- **Ledger growth.** A warrant per renewal in an append-only store (see objection 14) is on the order of a million entries a year in a busy repository. "Can be read by a stranger with no tools" stops being true early.

**How sure.** High that these are gaps, because the README is silent. Medium on how bad each is.

**To answer it.** Walk through three worked examples: a UI redesign, a 12-month migration on a legacy codebase without tests, and adoption on an existing product.

### 13. The ledger must be both open and secret

**Reasoned.** P13: the ledger "can be read by a stranger with no tools". P12: "It restarts from the ledger. It holds no state of its own." P16: "What measures a participant stays out of its sight." Section 4.6: "the sealed checks... are out of reach". Git is named "a natural home".

Sealed checks, counterfeit identities, audit selections and diagnostics must persist somewhere. If they are in the ledger, participants who read it can read them, and the cold-start drill hands them to a fresh agent. If they are elsewhere, the program has hidden state and the ledger is not the complete record. A counterfeit that re-opens a historic defect is also findable in the repository's history, which the examiner sees around the change, unless history is filtered.

**How sure.** High. The fix is architecturally possible but changes the claims made.

**To answer it.** Specify the partition, who can read what, and how the program restarts from it.

### 14. Warrant expiry is either CI or unaffordable

**Reasoned.** With 1,000 claims, each depending on 5% of modules, and 20 landings a day touching 3 modules each, about 14% of warrants expire per landing, or about 2,850 re-verifications a day (each warrant about three times a day). There are two cases.

If renewal is re-running tests, it is the CI every merge queue already performs, and the ledger of warrants is a derived cache of CI results, which should not be an append-only primary record. If renewal includes the examiners, that is about 5,700 model reviews a day. The worked example re-runs only "the check", which means the fitness part of the warrant silently survives a change to the code it judged. That contradicts "expires by itself when anything it depended on changes".

File or module hashes are also too coarse in both directions. A shared utility or lockfile expires nearly everything, while data, configuration, third-party APIs, traffic and time change nothing in the hash. Warrants are tied to "an exact state of the code" and the product's behaviour is not a function of that alone. Ordering puts "anything whose expiry blocks other work" first, so a busy repository services its own re-verification before new work.

**Checked.** Google's dependency-based selection at distance 10 saved about 42% of resources (notes), so 58% still ran, at a company with far better dependency data than most. The README calls carry-over "the early cutoff", but in the cited paper (per the notes) early cutoff means stopping when a *result* did not change. Carrying over results whose inputs did not change is ordinary incremental rebuild.

**How sure.** High on the dichotomy; my numbers are illustrative.

**To answer it.** Say which parts of a warrant renew how, and what a warrant says about anything outside the commit.

### 15. The sandbox does not contain the thing that leaves it

**Reasoned.** "Poisoned work item or file: It can only act within its sealed environment." The output of the sealed environment is code, which then lands by design. A malicious issue that causes a backdoor which passes the checks has an effect outside the sandbox, through the front door. IssueTrojanBench (cited in P18) is about precisely this path. Tests do not look for backdoors. Section 2's Poison test ("any planted instruction gains an effect outside the sealed environment") would catch this and would fail.

Similarly the Lie test requires that no such change ever lands, while the Number openly allows a fifth of accepted work to be wrong. Both cannot be the standard. Section 6 explicitly declines to defend against malicious agents, and dependency additions and network access in the sandbox are not discussed.

**How sure.** High.

**To answer it.** Treat the diff as the attack path. Add dependency and egress rules.

### 16. Perverse behaviour the design does not handle

**Checked.** The honest exit was measured only on impossible tasks, and the fetched text reports no false-abort rate on solvable ones ([ImpossibleBench](https://arxiv.org/html/2510.20270)). Newer models show near-zero cheating on that test in one vendor's table (cited in P2), so the mechanism ranked second "directly addresses" a rate that may already be close to nil.

**Reasoned.**
- **Using the exit to dodge hard work.** "The honest exit costs the participant nothing", does not count against the window, and sends the cost to the claim's author, often the owner. Nothing samples exits to see whether a stronger agent could have done the work. Add that, or the cheapest way to fail looks like integrity.
- **Salami slicing.** The class is computed from what a change can touch. Splitting one R2 change into several local R1 changes lowers the ceremony, and cutting is done by an agent.
- **Under-declaring assumptions** to keep work from stopping at the cap.
- **Selection in routing.** "The cheapest configuration with an adequate record" selects over time for whatever passes these particular gates most cheaply, with no individual agent needing to learn anything.
- **Examiners that flag everything** catch every counterfeit. The reproduction rule limits this but leaves "a lead" with undefined consequences.
- **Deterrence with nothing at stake.** P16 says to tell agents some work will be re-examined. The hand-hygiene and auditor results concern people with careers. A fresh agent has no memory, no reputation (no scoreboard, by section 6) and no sanction to fear. The cited anti-scheming work says part of the fall may be awareness of being tested, not real change.
- **Revocation storm.** A single examiner configuration found bad downgrades every warrant it touched, which triggers mass re-examination, a shape the design's own retry-storm evidence warns about.
- **Rediscovery.** "Being seen a second time raises their standing." By P3, models repeat each other's errors. Rediscovery by correlated agents is agreement, not independent confirmation.

**How sure.** High that these are unhandled. Medium on frequency.

**To answer it.** Audit a sample of exits. Monitor class distribution. Give each of these a row in the failure table of 4.11.

### 17. Further internal contradictions

All reasoned from the README's own text.

- **Audit independence is unsatisfiable.** R2 uses two families of examiners. The audit must be by "the strongest available party, from a family other than the examiners". With two or three frontier families, the third is usually not the strongest, and the rule on weaker examiners then applies to the auditor.
- **AIMD against control charts.** Section 4.14: "a change is only made on a signal", with citations against reacting to noise. Section 4.4 halves the window on one failed attempt.
- **AIMD against no estimates.** "Unless the claim is larger than the current window" needs a size for a claim before it is done, in a design that refuses estimation. No unit is given. TCP has uniform packets and a clean, frequent signal; this has rare, costly events with task difficulty mixed in.
- **Money limit.** "Every want... has a... money limit, set when it is created", again with no estimates and, on the first day, no history.
- **Root-cause ceremonies are dropped**, but "every escape produces... a structural change", which requires exactly that analysis, performed by somebody. It also pushes against "budgets on rules".
- **"No scoreboards for participants"**, yet routing is by each configuration's record, and "other people... are just other configurations".
- **"P15: health is a budget"** has no mechanism. Section 4.5's ordering (expiry, then finishing, then owner's priorities) has no place for it. It appears only as a diagnostic and in section 5's list.
- **"Lies in its report: its report is not an input to anything"**, while witness inspection (4.7) compares what the doer "said" with what it did.
- **"A stream of approvals rots"** (section 6) against section 9's "Whether approval quality falls with volume" under no data found.
- **Retries.** Each retry "must state what is different", but the program has no model, so it can check only that a sentence was written. The rule is presented as enforced and it cannot be.

**How sure.** High.

### 18. The falsification plan cannot be run at a price anyone would pay

**Reasoned.** Halving wrongly accepted outcomes from 10% to 5% needs about 434 outcomes per arm; from 5% to 2.5%, about 900. Each is "multi-week work across repositories", in three arms, judged by one owner blind to how the outcomes were made, with 90-day outside signals. Add four more scenario tests, plus a two-front-end test. It also requires the whole system to exist first, and the bars are, as the README says, the author's judgement.

The honest statement is that the design cannot be falsified before it is built, which is the opposite of what section 2 implies. There is no staged kill criterion that stops the project early.

**How sure.** High on the sample sizes. Replayed histories could reduce the cost if the outcome unit is the single claim, but those outcomes are clustered and the effective sample shrinks.

**To answer it.** Define the cheapest experiment that could kill the thesis in weeks, for example only the Reading Test against known ambiguities, or sealed checks against maintainer tests.

### 19. What a design of this ambition is missing entirely

Reasoned, from what the README does not contain.

- Incident response and a hot-fix lane. A production fire goes through what, exactly?
- A way to adopt it on an existing product.
- Retiring or superseding a claim, and handling claims that conflict.
- The cost and sequence of building this system, and who maintains it.
- Data and schema changes as a first-class hard case.
- Deciding what to build at all. Wants arrive and are refined; no discovery, no comparison of options, no portfolio beyond "coarse priority bands".
- Dependency and supply-chain risk, secrets, licence and copyright provenance of generated code, compliance.
- Environments where only one vendor is allowed, which makes "two families" impossible.
- Vendor outage.
- The owner's own succession. One human is a single point of failure, and he is deliberately kept out of the code.
- People, if they take part. "Just other configurations" means seeded reviews, hidden tests and a ban on talking between colleagues, while the README cites that monitoring response depends on perceived fairness.
- Dates and commitments to anyone outside.

**How sure.** High that they are absent.

### 20. What should be dropped

Reasoned.

- The Number as a headline; replace with raw counts.
- Counterfeits shown to the owner.
- AIMD on window size, until a unit and a signal exist.
- Owner-prediction precedents, which have the weakest case and cost trust.
- Randomised withdrawal as an automatic remover.
- Cells and everything at level 4, which has no evidence and no user.
- Warrants as primary ledger entries; derive them from CI.
- The word "claim" as a thesis (keep "acceptance criteria").
- The rule against agents communicating, until stretch S2 below is resolved.
- The blanket "two families", until the code-specific result is reconciled.

The ledger itself should be a plain file until something measured shows that it should not be.

## Every evidence stretch I found

"Basis" says whether I confirmed the point at source (through the fetch tool) or only in this folder's notes.

| # | README's wording | What the source actually supports | Basis |
|---|---|---|---|
| S1 | P7 "One writer per area"; "breakages rise when three or more authors touch a file" | The same study reports breakages *fall* with two authors compared with one. It concerns authorship of a file, not concurrent writers | Notes only (PDF unreadable) |
| S2 | 4.4 "Conflict rates did not fall when agents talked. They fell when a plan was fixed at the start." Section 6 uses this to ban any channel | The paper says "communication does significantly reduce the merge conflicts between patches" for several models. The first-turn "Plan" is counted among the agents' own speech acts, and the comparison is of trajectories with and without one. Nothing says the plan was fixed from outside. What did not move was overall success ([CooperBench](https://arxiv.org/html/2601.13295)). The README states the opposite of the source on conflicts | Source |
| S3 | Section 6 "Manager agents... Overhead of 285% or more, and a program does this better" | 285% is the turn overhead of centralised coordination over a single agent. It is not a comparison with a program, which was not tested. The README omits that centralised was best on the decomposable task (+80.8%) and best at containing errors (4.4×, against 17.2× for independent agents, the arrangement closest to this design's non-communicating attempts). About 4,800 tokens per trial, no coding benchmark ([Kim et al.](https://arxiv.org/html/2512.08296v2)) | Source |
| S4 | P7 cites [Cursor](https://cursor.com/blog/scaling-agents) for "twenty agents with locks running at the throughput of two or three" | Same report: hierarchy "solved most of our coordination problems", and without it "agents became risk-averse". The finding that cuts against the design is left out | Source |
| S5 | P11 cites TwinRouterBench under "Programs coordinate" | The rule-based router was by far the costliest (73/100 at $172.56, against $25.66 trained and $54.73 for Opus alone). The winner is a trained classifier. The frontier failure is "one prompt template" ([source](https://arxiv.org/html/2605.18859)) | Source |
| S6 | P12 "An outside monitor saved 14.6 to 20.4% of tokens, and a fresh start... raised resolution from 66.6% to 71.8%" | The savings are at a 5% false-positive rate and the resolution rise at 25%. Different operating points, joined in one sentence. At 25% a quarter of healthy runs are killed. Also one 27B model ([Fail-Fast](https://arxiv.org/abs/2608.03222)) | Source |
| S7 | P3 judgement "since failures cluster at ambiguity"; 4.3 "share one misreading, as when many agents computed a circumcircle" | The paper says "the dominant mechanisms are concrete implementation errors rather than specification mistakes" outside two logic conditions, though one caption says "difficult or ambiguous". The circumcircle is an implementation error on a hard sub-problem ([Ron et al.](https://ar5iv.labs.arxiv.org/html/2606.20158)) | Source |
| S8 | P5 "Two at most, of different families", from "56.7% against 42.7%" | Overall cross-model against fresh same-model was "not statistically significant". "For code artifacts, CCR outperforms all XMR conditions" (40.7 against 37.2, no intervals), that is, same-model fresh review was best on code. Korean artifacts, one writer, and a matcher that "can credit a finding that does not identify the error" ([source](https://arxiv.org/html/2610.01471)). The README gives only the union figure | Source |
| S9 | P5 "labelling a change as bug-free cut detection... and removing the description restored it" | Restoration was never measured on the labelled-pairs study. It was measured only on selected attacked PRs (12 of 12; 16 of 17, with the latter needing an extra instruction, redaction alone giving 11 of 16, and denominators the tool flagged as doubtful). Authors say it "conflicts with common workflows" ([source](https://arxiv.org/html/2603.18740v1)) | Source |
| S10 | P5 lists Cooper 2022 in support of blinding | Detection did not clearly differ (OR 1.029, interval spans 1). Blinding changed agreement and precision. As evidence for "examiners must not see the first account" it is close to a null | Notes |
| S11 | 4.11 "Tampers with checks: It cannot" | Read-only "does not eliminate other cheating methods such as special-casing or operator overloading" ([ImpossibleBench](https://arxiv.org/html/2510.20270)). The row's next sentence partly concedes this, but "it cannot" is not what was found | Source |
| S12 | P2 "the honest exit is probably the cheapest high-value mechanism" | Measured only on impossible tasks; the fetched text reports no false-abort rate on solvable tasks. Little effect on one of three models. Newer models show 0 to 3% on this test (one vendor) | Source, notes |
| S13 | P2 Scheel and Kaplan under "Fix the test of success before the work exists" | Those measure rates of positive findings in science, chiefly the removal of publication bias. Neither concerns the quality of work done. Direct software evidence (test-first studies, which from memory are mixed) was not consulted | Notes; prior art from memory |
| S14 | P1 "Ontario's mandated checklist had self-reported compliance of 92 to 100% and no measurable effect" placed under "Done is a fact observed by the environment" | Ontario had no audit, so false compliance is not shown. The offered explanations are "commentary, not tested". Alternatives: an already good system, three-month windows. In Alberta, 41% rose above 90% later, and adoption and appropriate completion are different measures | Notes |
| S15 | P1 "I extend it from builds to all claims of completion" | SLSA "does not address source threats" and verifies provenance, not what the code does ([SLSA](https://slsa.dev/spec/v1.0/threats)) | Source |
| S16 | Section 2 "Throughput was the wrong measure...: a randomised study... measured 19% slower" | The study *used* time on task to expose a perception gap. It supports "do not trust perception", and it does not show that throughput is a bad measure. METR's own February 2026 follow-up (−18%, interval includes zero) is in the notes and not mentioned | Notes |
| S17 | P15 "in 806 repositories that adopted agent tools"; "complexity about 42%" | Cursor only. The same paper also says 25.1% in its discussion, and cites tables that do not support it ([He et al.](https://arxiv.org/html/2511.04427v3)). The notes flagged the mismatch, the README dropped the flag | Source |
| S18 | P15 "Structural erosion rose in 77% of agent trajectories" | 53% for human repositories in the same study. The metric is not validated against human judgement. The comparison that gives the number its meaning is omitted | Notes |
| S19 | P9 and 4.12 "Trained askers with 3.0 questions matched a model asking 5.1"; "Three by default" | Most likely per issue, not per sitting; the paper does not confirm the unit. The simulated user is GPT-5 reading the full issue, so it cannot tire, and this is no evidence about an owner's attention ([CLARITI](https://arxiv.org/html/2604.14624)) | Source |
| S20 | 4.7 "Differential tests against old behaviour... cheap and expose much ($0.105 per patch)" | The comparison is against "the developer-written oracle patch", which real work does not have. Of 77 flagged and sampled, 28.6% were certainly incorrect and 66.2% could not be determined ([source](https://arxiv.org/html/2503.15223v2)) | Source |
| S21 | 4.6 "perfect selection 64 to 70%, actual 55 to 57%" | AI21 also reports 59.7% with surrounding code and 60.9% with test filtering, the kind of selector this design prefers. Trae's 60.6 to 62.8% rising to 68.2% is left out | Notes |
| S22 | 4.15 "the method by which airlines found that much of their maintenance did nothing, applied continually" | Fleet plots while stretching intervals, not random withdrawal; percentages do not reconcile; "I found no before-and-after accident figures" | Notes |
| S23 | Section 6 "Full reason graphs: Worst-case exponential, and historically they collapsed"; section 8 | Provan is about computing minimal supports and "says little about the typical case". Everett and Forbus is one application on a 32 MB machine, and garbage collection fixed it. Plain dependency tracking is what build systems do, as P14 itself cites | Notes |
| S24 | P14 citation decay under "Belief expires" | Citation frequency, "a stand-in for value". It says nothing about truth expiring | Notes |
| S25 | P8 "finishing cases first cut duration 12%", then 4.5 "finish what has been started" | Optimal only "when the case completion hazard rate function increases", and the opposite holds if it falls ([Kellogg](https://www.kellogg.northwestern.edu/academics-research/research/detail/2016/multitasking-multi-armed-bandits-and-the-italian-judiciary)). Agent attempts plausibly get less likely to finish as they age. Six judges; new cases wait longer | Source |
| S26 | 4.11 "Managers who overrode a validated test hired worse" applied to the owner | The test was validated; warrants are not. The notes flag that discretion wins where the judge has information, and P6's Duflo result shows that | Notes |
| S27 | 4.12 "Elaborate value-of-information ranking is not justified" (Lowell) | Active learning for labelling NLP data, abstract only, no numbers. A different problem | Notes |
| S28 | P3 "Polling at 25 times the cost shows no consistent accuracy gain"; section 6 refuses panels | The notes record the authors saying extra samples *do* help in verified domains such as code. Omitted | Notes |
| S29 | P9 Vaccaro "did worse than the better party alone", leading to "Do not make him a reviewer" | Same paper: the combination beat the human alone (g = 0.64) and gained when the human was stronger (g = 0.46). I² 97.7%. A strong engineer as owner is the second case | Notes |
| S30 | P12 "Restarts capped at three" (Mantri), before "After three tries" | Task restarts in a compute cluster. No relation to agent retries. Opposing evidence in the notes on blind resampling (Try Again, Don't Look Back) is not mentioned | Notes |
| S31 | P16 and 4.13 Nagin on perceived fairness applied to participants | The link to fairness is an association, among human employees. Agents perceive nothing of the kind | Notes |
| S32 | 4.3 "Only 34% of responses matched intent" | Commanders themselves judged 53%; 34% is after the authors reclassified six cases. No comparison condition | Notes |
| S33 | P7 "decomposable work gained over 70%" | Finance tasks only, no coding benchmark, about 4,800 tokens | Source |
| S34 | P4/4.7 reliance on checks; DeepSWE cited only for git history | Same article gives 8.5% false accepts and 24% false rejects by test graders, directly relevant to sealed checks and left out | Source |
| S35 | P8 "228 of 562 categorised rejections" | Count is as in the notes, but the notes call it "about 38%", and 228/562 is 40.6%. One of them is wrong | Notes |
| S36 | Conclusion "The best system is not a task tracker" | Section 9 lists "Whether claims improve on tasks" under no data found | README itself |
| S37 | P17 cites the harness post only for context resets | The same post's main quantitative fact is "over 20x more expensive", and it concludes the evaluator is conditional on task difficulty ([Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps)) | Source |

## Verdict

This design presents ordinary practice under new names at its valuable end, and untested, data-hungry machinery at its original end. Its central guarantee rests on model-written checks built from a vote it elsewhere calls worthless. The Number offered to the owner is not a bound, cannot see the design's own most common failure and will read "unknown" for most projects. The worked example fails the design's own cost bar by a factor of two or more, and several sources are quoted against what they found, including on the rule that agents must not talk. Build B1 plus an assumptions file and an honest exit, spend the rest on the quality of the oracle, and add any further mechanism only when a measured failure demands it.
