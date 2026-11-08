# Flow, lean and queueing: what the field says for an agent loop

Written on 2026-11-08 by a research agent (Opus 5.5 at xhigh) from public sources, for the question of this folder. Kept as it reported, with its own marks of what it did not open and what is its own arithmetic.

## 1. Principles

**P1. Find the constraint and subordinate the loop's pace to it (Goldratt's five focusing steps, drum-buffer-rope).** Mechanism: system output equals the constraint's output; work started faster than the constraint absorbs becomes inventory, and code inventory decays (trunk moves, conflicts, stale context). Agent loop: workers are almost never the constraint (you can spawn more). Likely constraints, in order: the owner (one person, part-time, not scalable); the single merger per trunk (serial by design, capacity ≈ 1 / (merged-check time + conflict repair)); the jarl's and coordinators' attention (every report, review and question lands in one context); review, only if "never weaker than the worker" plus cost caps the reviewer pool. Find it as the stage with work ageing in front of it that is never idle. Grant new worker leases only when the queue in front of the constraint falls below its buffer target (the "rope"). Limit: the constraint moves (step 5, inertia); speed up merge and review and the owner becomes it. Several repositories mean several trunks, each with its own merger and constraint.

**P2. Exploit the constraint before elevating it.** Mechanism: TOC says elevate only "after exploitation and subordination are fully complete"; the constraint "must never ever be starved for inputs, or fed poor quality materials". Agent loop: before adding reviewers or a second merger, remove waste at the constraint: workers run cheap checks before review; reviewers get a compact evidence bundle, not a transcript; the merger only merges and checks; owner questions arrive with context, options and a default. Limit: can mask real capacity shortage; set a re-measure point.

**P3. Keep non-constraints slack; give the constraint a sized buffer.** Mechanism: Kingman: wait ≈ ρ/(1−ρ) × (cₐ²+cₛ²)/2 × service time. Agent loop: run reviewers and coordinators at ≤ 70–80% busy; hold one to two hours of approved branches in front of the merger so it never starves but branches don't age. Agent service times are long-tailed (a rework round doubles a review), so cₛ² > 1 and waits are worse than the textbook case. Limit: slack looks like waste; TOC's "maximise utilisation" applies only to the constraint.

**P4. Set work-in-progress limits from Little's law and measured data.** Mechanism: WIP = throughput × cycle time (Little's paper gives the operations form TH = WIP/CT). Agent loop: cap on branches in flight = measured constraint throughput × target cycle time (e.g. 4 merges an hour × 3 hours = 12). Add per-stage limits, including "approved, awaiting merge" and "awaiting the owner". A coordinator's slice is capped by what its context can hold; the rest lives in the record. Start at today's level, lower until throughput drops, step back one. Limit: an identity over a finite window, not a forecast (Little: "we are in the measurement business, not the forecasting business"); a count-based limit is crude when items differ in size.

**P5. Pull, not push.** Mechanism: ties starts to finishes; the Kanban Guide says new work is pulled only "when capacity exists". Agent loop: a lease is granted only when a slot is free; the jarl never bulk-assigns the backlog. Limit: pulling from a badly ordered queue delivers the wrong work on time (combine with P7).

**P6. Small batches, sized by the U-curve; then cut the per-batch fixed cost.** Mechanism: optimum batch balances holding cost (delayed feedback, branch decay, context loss on replacement, harder review) against transaction cost (agent spawn, context load, worktree, reviewer start-up, check run); the curve's bottom is flat, so err small. Agent loop: package small neighbouring issues only while per-issue fixed cost dominates; cap a package at what a review can still check well; never re-batch small reviewed branches into one large merge (a DORA pitfall). Batching merges with bisection pays only when failures are rare: a batch of 4 passes (1−p)⁴, 81% at p = 5% but 41% at p = 20% (the agent's arithmetic). Incremental tests and cached briefs lower transaction cost and move the optimum smaller. Limit: too-small batches flood the record and the coordinator's inbox.

**P7. Sequence by cost of delay over duration (WSJF/CD3) and use classes of service.** Mechanism: cost of delay is highly skewed, so order dominates speed. Agent loop: issue classes in the record: Expedite (red trunk, security; limit 1, may exceed other limits, per Anderson), Fixed-date (release), Standard, Intangible (debt, a reserved share). Owner questions ordered by how much work each blocks. Limit: estimates are noisy and gameable; "expedite" inflates unless capped.

**P8. Jidoka: stop on an abnormality, fix or revert at once.** Mechanism: a defect caught at its source is cheap; work stacked on it multiplies it. Agent loop: a red merged check halts the merge queue; the merger reverts the last merge if it is not fixed within "a few minutes" (DORA continuous integration) and files an expedite issue. Any agent that meets an abnormality (record contradiction, a failing check it did not cause, an instruction it cannot meet) stops its own piece and raises it in the record rather than working around it. Limit: flaky checks make stops kill flow, so flakiness is itself an expedite item; Toyota's andon is a call for help first, so escalate on a time-box rather than halting everything at once.

**P9. Poka-yoke: make the wrong move impossible, not merely forbidden.** Mechanism: a prompt rule decays as context fills; a tool refusal does not. Agent loop: the merger refuses a branch without a recorded approval from a different, not-weaker model; a worker cannot commit outside its declared files; done without evidence is refused. Limit: a refusal that does not say why invites workarounds.

**P10. Protect review quality from queue pressure and size review capacity from arrivals.** Mechanism: congested reviewers rationally inspect less exactly when risk is rising (Bartolucci and Vivo); language-model judges favour their own outputs (Panickssery et al.). Agent loop: needed review rate = branches an hour × (1 + mean re-review rounds); reviewers = rate × mean review time ÷ utilisation of at most 0.75. One shared reviewer queue, not per-coordinator pools: two reviewers at 80% on separate queues wait 4 service times, pooled about 1.8 (Erlang C, the agent's arithmetic). Never put queue length or urgency in a reviewer's brief; set review depth by risk class. Limit: judging reviewers by throughput produces rubber stamps.

**P11. Decentralise decisions with explicit policies and a decision ledger.** Mechanism: centralised decisions queue at the top; local decisions under shared rules are fast (Reinertsen's decentralised control; Kanban's explicit policies). Agent loop: the record states what a worker, a coordinator and the jarl decide alone; standing rulings retire whole classes of owner questions; a replacement agent reads and applies the same rules. Limit: without a ledger the rules drift across agents.

**P12. Treat the owner as an intermittent server.** Mechanism: waiting on a server who is often away includes the vacation time, whatever the load. Agent loop: every question carries a cheap-to-reverse default; work proceeds on the default or on other items; questions are batched one at a time, highest cost of delay first, on a predictable cadence; track the age of the oldest open question and the owner's minutes per merged issue. Limit: a default he reverses is rework, so choose defaults by how cheap they are to reverse.

**P13. Standard work, kaizen and the five whys.** Mechanism: a written standard makes deviation visible; improvement changes the standard. Agent loop: briefs are the standard work; after an escaped defect, a reopen or a red trunk, ask why until a policy, check or guard is reached, and change it in the record. Limit: the five whys are not repeatable (different people reach different causes); demand evidence at each step; "the model made a mistake" is never a root cause.

**P14. Measure flow outcomes as a balanced set, never as targets.** Mechanism: DORA warns metrics as goals get gamed (Goodhart) and must be used as a set in tension. Matter: lead time filed → merged and verified (percentiles, with a service level expectation such as "85% within X"); work item age per stage (ProKanban: "by far the most important"); throughput of merged, verified issues; post-merge failure rate (merges that turned the trunk red or were reverted, DORA's change fail rate); rework share (issues fixing earlier merges); time to get a red trunk green again; review escape rate (defects found after approval ÷ approvals); owner minutes and owner-queue age per merged issue; cost per merged issue. Vanity: agents running, agent utilisation, tokens spent, lines generated, issues filed, branches opened, worker "done" before merge, approval rate as a goal, tests added. Limit: small loops give too few items for stable percentiles, so report counts with medians.

## 2. Numbers

- **Kingman / M/M/1** (cₐ = cₛ = 1, denominator the mean service time): wait = 1, 4, 9 and 19 service times at ρ = 0.5, 0.8, 0.9 and 0.95.
- **Google, Sadowski et al. 2018** (9 million reviewed changes over two years): median change 24 lines; over 35% of changes touch one file and about 90% fewer than 10; median reviewer count 1, fewer than 25% have more than one; median wait for first feedback under 1 hour for small changes and about 5 hours for very large ones; overall median latency under 4 hours, against 14.7 to 19.8 hours (three Microsoft projects), 17.5 (AMD) and 24 (another Microsoft study); median reviewer time 2.6 hours a week (logged over 5 weeks).
- **Google engineering practices:** one business day is the maximum time to respond to a review.
- **SmartBear on a Cisco team** (a vendor study; the page gives no sample size): review 200 to 400 lines at a time, under 500 lines an hour; 60 to 90 minutes finds 70 to 90% of defects.
- **Nudge** (randomised trial, 147 repositories, 8,500 overdue pull requests): reminders cut resolution time by 60% against overdue pull requests with no reminder; 73% of reminders rated positive; scaled to 8,000 repositories, 210,000 reminders a year with similar results.
- **DORA 2024:** with more AI adoption, an estimated 1.5% less throughput and 7.2% less stability. The "per 25% more adoption" framing comes from secondary write-ups; the report itself was not opened.
- **DORA 2025** (about 5,000 respondents): AI now goes with more throughput but still with less stability; "without robust control systems … an increase in change volume leads to instability".
- **Faros 2026** (vendor telemetry, about 22,000 developers and 4,000 teams, each organisation's lowest and highest AI-adoption periods compared, correlational): task throughput +33.7%, pull-request merge rate +16.2%, median time to first review +156.6%, median time in review +441.5%, pull requests merged with no review +31.3%, incidents per pull request +242.7%, bugs per developer +54%.
- **DORA on batch size and continuous integration:** a batch takes hours to a couple of days, more than a week is too big; merge to trunk at least daily; tests about 10 minutes at most; a build that cannot be fixed in a few minutes is reverted.
- **Anderson:** the expedite class has a limit of 1 and may exceed the limits elsewhere.
- **Maersk, Arnold and Yüce** (one company, no control group, several practices changed together): the top 25% of requirements by cost of delay were worth about 1,000 times the bottom 25%; lead time fell from 208 to 108 days.
- **CD3 example:** 61% less delay cost than first-in-first-out (a three-item illustration, not data).
- **Reinertsen, as quoted in Ries's review** (his surveys of course participants): 2% of product developers measure queues; 15% know their cost of delay; executives reported 98.5% utilisation.
- **Flow efficiency of 15 to 25% for knowledge work:** unverified; no primary source found.

## 3. Anti-patterns an agent loop is likely to fall into

Maximising parallelism: many workers feeding one merger leaves ageing branches, conflicts and rework (Reinertsen's "worship of efficiency"). Speeding up a stage that is not the constraint: faster or cheaper workers while review or merge is the bottleneck. More agents or stronger models before removing waste at the constraint. Pushing the whole backlog out at once, and keeping work in progress in agents' heads, where compaction loses it. Large AI-generated changes, or small ones regrouped before review. Review under pressure: shallow approvals, merges with no review (Faros +31.3%), same-model judging. Merging onto a red trunk; tolerating flaky checks. Inflating "expedite". The owner as an unmanaged queue: blocking work while he is away, no defaults, no ordering. Managing timelines instead of queues: "percent done" instead of queue sizes and ages. Metrics as targets (issues closed a day, agent utilisation). Starving the constraint, or feeding it bad input: the merger idle behind review; a strong reviewer spending its time on lint failures.

## 4. Sources

Opened:

- https://global.toyota/en/company/vision-and-philosophy/production-system/ — jidoka, the stop cord, andon, just-in-time, kaizen.
- https://www.toyotauk.com/how-we-manufacture/glossary.html — andon, poka-yoke, kanban, muri and mura defined.
- https://en.wikipedia.org/wiki/Kingman%27s_formula — the formula and its 1961 reference.
- https://people.cs.umass.edu/~emery/classes/cmpsci691st/readings/OS/Littles-Law-50-Years-Later.pdf — Little 2011: the finite-window form, "measurement not forecasting", TH = WIP/CT.
- https://kanbanguides.org/the-kanban-guide/2020.7 — pull, the four flow metrics, service level expectations, explicit work-in-progress policy.
- https://prokanban.org/blog/the-kanban-pocket-guide-chapter-6-the-basic-metrics-of-flow — work item age as the most important flow metric.
- https://qconsf.com/sf2009/dl/qcon-sanfran-2009/slides/DavidAnderson_NewApproachesToRiskManagement.pdf — class-of-service policies.
- https://www.tocinstitute.org/five-focusing-steps.html — the five focusing steps; exploit before elevate.
- https://www.informit.com/articles/article.aspx?p=2928185&seqNum=6 — Leffingwell quoting Reinertsen on utilisation, batch size and work-in-progress limits (secondary).
- https://www.startuplessonslearned.com/2009/07/principles-of-product-development-flow.html — Ries's review: the 2%, 15% and 98.5% figures, the twelve sins.
- https://blackswanfarming.com/cost-of-delay-divided-by-duration/ — CD3 and its example.
- https://blackswanfarming.com/black-swan-farming-using-cost-of-delay — the Maersk case study.
- https://framework.scaledagile.com/wsjf — WSJF as cost of delay over duration.
- https://dora.dev/guides/dora-metrics/ — the five metrics and the warnings against misuse.
- https://dora.dev/capabilities/working-in-small-batches/ — batch thresholds; large AI pull requests as a pitfall.
- https://dora.dev/capabilities/continuous-integration/ — revert a broken build; tests of about 10 minutes.
- https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report — the −1.5% and −7.2% figures.
- https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report — throughput up, stability still down; the control-systems quote.
- https://dora.dev/research/2025/dora-report/ — "AI as an amplifier".
- https://faros.ai/blog/ai-acceleration-whiplash-takeaways — the 2026 telemetry figures.
- https://storage.googleapis.com/gweb-research2023-media/pubtools/4476.pdf — the Google code review case study.
- https://google.github.io/eng-practices/review/reviewer/speed.html — the one-business-day limit.
- https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/ — 200 to 400 lines a review and the inspection rate.
- https://arxiv.org/abs/2011.12468 — the Nudge trial.
- https://arxiv.org/html/2605.27202 — Bartolucci and Vivo: congested reviewers inspect less.
- https://arxiv.org/abs/2404.13076 — language-model judges favour their own outputs.

Not opened: Reinertsen's and Goldratt's books themselves; a primary source for the flow-efficiency figure; RedMonk's write-up of DORA 2024 (the source of the "per 25%" framing).
