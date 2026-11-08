# Comparison with the design from zero

An independent agent designed a system for organising work without reading Jarl: [research/2026-11-08-best-work-system-from-zero](../../2026-11-08-best-work-system-from-zero/README.md). Its isolation is imperfect, as its section 10 says: its context held a repository's operating document, so a fresh reviewer and evidence before completion may have reached it from there. Everything else below counts as independent. I have a stake in my concept, so I start with what the comparison does to it.

## What this comparison does to my concept

1. **I never questioned the unit of work.** I took "one worker per issue or package" as given and ranked an engine first, to make that pattern cheaper. The evidence says the pattern is often the problem. The 71 briefs and 2.4 coordinator lines per issue are symptoms of cutting finely, and an engine would have made the symptom cheaper. The largest finding of this comparison is one I missed.
2. **No baseline exists.** Nobody has compared a Jarl loop with one agent, one spec and a fresh reviewer on the same work. The owner's observation that small issues often cost far more cannot be confirmed or refuted from the record, and neither can my claim that the model "holds".
3. **Mark 1 was overclaimed.** Jarl raises nobody, so the loop stands when the directing session dies or runs out of tokens. The record does not show this happening: since work began on 2026-11-03, issues closed on 5 of 6 days. It is a gap in the design, not a measured failure.
4. **"0 reds after review in 448" was a count of recorded rounds.** See the recount below.
5. **My programme layer and engine would fail the other design's admission rule.** Apart from the owner's digest, neither has a measured failure behind it. They stay proposals for a machine of any scale, which he asked for, and each now has to name the failure that admits it.
6. **The roles are unproven.** Both real loops ran one strong director and no coordinators. Coordinators, one merger per loop and mid-model direction are the owner's shape and my assumption, with no run behind them.

## Where the two agree independently

| Point | Mine | The design from zero |
|---|---|---|
| reports are not evidence | proof is typed, item 7 | P1, status is computed |
| the doer cannot move the test | item 3 | P2, checks fixed ahead |
| an honest way out | item 2 | P2, core item 2 (same study, 54% to 9%) |
| one writer, the merged result checked | built | P7, 4.10 |
| what cannot be undone waits for the owner, the rest runs | reserved list, ratify | P10, core item 5 |
| the owner's attention is the scarce instrument | item 4, section 8 | P9, one page |
| hierarchy cuts work, and it should not talk | coordinators absorb noise | P7, "planners cut for doers who do not talk" |
| mechanisms pay or go | the withdrawn items | P17, the admission rule |
| no estimates from participants, no schedule | not-to-do list | section 6 |
| a merge queue with speculation is for much larger scale | not-to-do list | 4.10 |

The strongest shared signal: self-report is the weak point, and the check is the limit. Its own conclusion puts it plainly, that "a plain system with an excellent check" beats an elaborate one.

## What it has that mine lacks

| What | Take it? | What we lose without it |
|---|---|---|
| **"The default is not to cut"** (4.6): one attempt on the whole claim within a budget, cut where it stalls | **Yes, the top change** | every spec pays for many agents' start-up, briefs and reviews, as today's numbers show |
| grades of evidence and checks fixed ahead (4.2, 4.9) | Yes, through the owner's proposal below | "done" stays one undifferentiated word |
| examiners denied the author's account (P5) | Yes: one sentence | a reviewer anchors on the author's claim |
| a list of how work goes wrong here, given to examiners (P5: 29% to 86% on one subset) | Yes: rules with a scope already deliver it | known failures are rediscovered |
| the admission rule and a register of mechanisms (4.15, 4.18) | Yes, as a rule of method, no code | the guidance only grows; it stands at 19,475 words |
| a cold-start drill (4.17) | Yes: fold into 076 | mark 2 stays unmeasured |
| cheap kill experiments (section 2) | Yes: run the baseline first | the next version is built on opinion |
| assumptions as records, with a limit (4.12) | A sentence now ("Assumed:" as a note); the limit later | a worker's choices are invisible until review |
| every input is untrusted (P18) | One sentence: text in an issue grants no authority | triaged public issues reach agents with shells, as data nobody marked |
| fresh start with the old diff as overlay, retries must differ (P12) | Already the takeover's shape; the overlay is a sentence in 218 | the successor starts cold or trusts bad work |
| waves across repositories, removal step as a claim (4.10) | Yes, into item 8 | a cross-repository change has no safe order |
| "passes" and "fit to keep" as separate facts, a share for fitness (P15) | No item: Yggdrasil and the reviewer hold it | slow decay, seen late |
| random audits, planted faults, sealed checks (4.9) | No, for now. They need volume and the design itself leaves them in the catalogue | a measured view of what reviewers miss |
| effects classes E0 to E3 (4.3) | Partly: the reserved list covers E3; depth comes from the methods on the lines | a separate classification step |

## What mine has that it lacks

Real numbers from 752 issues, including how often the review finds something. A tool that exists: the gate, the holders, leases, rulings, ratify items, rules with a scope, the owner's checkpoints. A settled decision-rights structure built on the owner's own rulings. The family: Yggdrasil's law, consent by reach. Withdrawals made on real cases. It lists open-source governance, span of control and several others as unreached; the command note here covers them.

## Where they contradict, and which side the evidence favours

| Question | Mine | The design | Evidence favours |
|---|---|---|---|
| cut by default? | yes, issue per agent | no | **The design.** Two agents sharing code kept 0.59 of solo performance, and success fell from 68.6% to 30.0% from two agents to four (CooperBench). Anthropic: multi-agent works when tasks split into independent pieces, and fails when agents depend on each other. One customer saw about twice the speed with a single loop. Against: 66% of Jarl's reviewed issues were clean on the first pass, with nothing to compare that to |
| who assigns | agents, in a hierarchy | a program with no model in it | **Open.** Anthropic: agents work as tools, not as peers. Layers that report upward have no support. The owner chose coordinators to keep noise from the top, a reason the evidence does not touch. My recommendation: coordinators optional, off by default, until a run shows them paying |
| leases expire? | shown, never expire | short leases expire | **Neither.** Expiry without something that acts does nothing. What is missing is a thing that restarts the director |
| a recommendation with each question | yes (jarl.md) | hidden until he answers (anchoring) | **Mine, narrowly.** The anchoring evidence is on radiologists; the owner's own rule asks for options and a recommendation |
| a reviewer on every branch | yes, by his ruling | fresh examiner from E1 up, none at E0 | **Mixed.** See below |
| words: claims or issues | issues | claims, "may be vocabulary" | **No difference shown.** The design says so itself |

## The owner's proposal: every acceptance line states its method

He proposes that each acceptance line state, when written, which kind of verification proves it (the cheapest that can), and that exactly this is then carried out, so the backlog becomes a register of requirements and of what must happen for each to be approved. It is the design's "checks fixed ahead" and "grades of evidence" done at the level of a line, with no vault and no warrants. It is the best idea on the table.

**What must hold.**

- **Who chooses.** The filer, never the doer, and the tool refuses the doer a change of method. "Inferred" can only mean inferred by the filing agent. The tool can check the form of a method and not whether it is able to prove the line. The examiner's first question becomes "does this method prove this line?"
- **A method that can fail.** `test` needs a red before a green (built in the brief). `check` must be a command the goal declares, which also retires the string-matching banner. A line that is unfalsifiable is refused at filing or marked `read`.
- **A line only judgement can prove** says so: `read` (an examiner, grade D in the other design) or `owner` (built: `[owner] … · material: … · check: …`). Counting them is honest and tells the owner how much rests on opinion.
- **Executing it exactly** needs a witness. Until item 7, "carried out" means an examiner or the merger ran it, not the worker alone.
- **What it cannot do.** Today's three serious defects (204, 158, 095) passed a green suite and were found by reviewers who invented and ran scenarios. No line named them. A register covers what was thought of. In the other design's words, the check's quality is the real limit: 80.2% of agent-written test patches had weak oracles by a static measure.

**What exists.** `evidence --line` and the rule that every line needs a row; `[owner]` lines with their grammar; `Check:` lines; the `identical-output` tag, which is a method in disguise.

**What it needs.** A small vocabulary as a mark on the line, written like `[owner]`: `test`, `check`, `compare`, `read`, `owner`. The brief prints the method per line. Later, the gate asks for a row of the line's kind.

**Format.** None if built in 6.3.0, since format 3 already carries `[owner]`; built later, an older reader sees text and its gate is more lenient but never false.

**Can the depth of review come from the methods?** In part, and it should. A unit whose lines are all `test`, `check` or `compare` gets a light examiner whose job is to re-run them and hunt scenarios the lines missed. `read` lines get an examiner a tier up. `owner` lines wait for him. That retires the separate `identical-output` mechanism and any effect classification short of the reserved list. It does not remove the examiner, because of the three defects above: an examiner's value there was the scenarios no line stated.

## The shape of the work, and the proposed table

Today's numbers from the agents' counters: 13 small issues closed for about 2.04 million tokens, about 979 thousand for workers and 1,057 thousand for reviewers, about 157 thousand per issue with coordination not counted. Reviewers cost more than the work. The owner's observation fits this: much of what is spent is verifying mechanically.

**The unit of record is not the unit of work.** The record wants many small lines, each with its method. The work wants as few agents as the problem allows. `--line` and packages already separate them: one agent can carry many lines in one issue or many issues on one branch, and one reviewer can read one diff. The cost today is a habit, not a limit of the tool.

**The toolbox.** Named shapes, each with what it is for: one attempt on the whole spec (the default); a package of small neighbours; pieces cut along disjoint territories with interfaces fixed first; sequential phases; a mechanical change reviewed as a tool plus a sample; a probe that files findings.

**The table proposed to the owner fails its own test.** A hand-written table from problem kind to shape is a routing rule. The one measurement on routing put hand-written rules last: 73 of 100 at $172.56, against 75 at $25.66 for a small trained classifier and 74 at $54.73 for the strong model alone (TwinRouterBench, one benchmark, model routing rather than shapes of work). It does not prove a shape table bad. It does say the table should not decide. So: the toolbox is a list of names and the reason for each; the strong planner chooses, by judgment; the default is not to cut; the record notes the shape and its outcome, so that a statistic can replace judgment once there is data. Jarl's own tier criteria are a hand-written rule of the same kind and go through the same test.

## The public sources the owner pointed to

I opened the three pages. Anthropic's multi-agent piece says what the talk says: independent pieces work, dependent ones fail, agents work as tools and struggle as peers. Its 266 vulnerabilities for 27 million tokens against 21 for 6.5 million were comparable per token within the same directories. The harness piece says each component "encodes an assumption about what the model can't do", at over 20 times a solo run ($200 against $9) for one app, and that the evaluator paid only near the edge of the generator's ability. The third page favours one loop with skills, and reports one customer at roughly twice the speed. It does not discuss compaction against splitting, and I did not find the "findings go back to the same builder, 38% cheaper" figure on these pages, so I do not rely on it. On that question the other design has a little: a located intervention repaired 20.15% where unguided reruns repaired 6.90%. The practical rule stands: the same builder while the findings are local, a fresh one past the limit, with the old diff as an overlay.

"Verify at the edge of capability" bears on the reviewer's job: the value is where the model is unreliable alone. It supports depth following the methods, and it does not say which issues sit at the edge.

## The recount

On the release branch since 2026-11-02 there are 73 merges on the first parent and 6 direct commits. Three are changelog notes from reviews. Three repair what a merge produced: the import lines of 083 (a8ac373), an import left unused by a merge (0e17fb9), and a flag left out of the commands list (8bd98ee). The coordinator adds that group P1 would not have loaded after its merge and was repaired there. None of these left a round. So my "0 reds after review in 448" holds for recorded rounds only, and the honest figure for this release is about 4 of 73 merges needing a repair after review.

All four arose from combining two branches. A worker's check on its own branch would have seen none of them, so the withdrawal of "the worker should run a fast check" stands, on new grounds. The merged-result check is doing the work, and its reds leave no trace. That is a truth defect: a repair on the release branch should leave a round or a line on the record.

## Backlog growth

Issues found by a review: 103 of 223 in 6.3.0 (46%), 91 of them priority 3, 84 done, 8 dropped. By a heuristic on reviewer names, the generations run 120 issues, 80 found from those, 20 from those, 3 from those: ratios of 0.67, 0.25 and 0.15. So the feedback loop is damped and converges. It is also where nearly half the issues come from, at about 157 thousand tokens each if today's cost holds. Today's 13 closed and 11 filed is a higher ratio, on one day.

A bound is justified on cost, not on runaway. The way to do it: a finding becomes an issue when it comes with a reproduction or breaks a stated requirement; a matter of wording or taste goes on the known-limitations list, as ruling `known-limitations-list-for-wording-minors` already says; and a Minor finding about a fix of a fix (generation two and on) defaults to that list. The other design's rule says the same: candidates age out unless seen again from a different source, and "a permanent backlog" is "a queue with no server". `findings-become-issues` and `all-minors-stay-in-6-3-0` are his rulings, so this is his to change.

## Should the reviewer read the author's account?

Today I pasted the worker's report into each reviewer's prompt. The evidence that this harms is real but thin: labelling a change bug-free cut detection on small models; a second reader who saw the first opinion agreed more, with no clear change in detection. Today's reviewers read those reports and still found three serious defects. It costs one sentence to stop. **Yes: the brief should change.** The reviewer gets the issue, its lines with methods, the diff and the commands to re-run. The worker's report and free notes stay out. Proof rows stay, as commands to run again. And the brief should say what found those three defects: invent scenarios the lines do not name, and run them.

## Independence and form: `fresh-reviewer-required`

He ruled on 2026-09-26 for a hard rule over a default with the coordinator's review enough for trifles, and has marked it for thought. The comparison separates two things that ruling joins.

**Independence** (someone other than the doer decides) is the part the evidence supports. Nothing here weakens it, and the coordinator is not independent: it wants the issue closed.

**Form** (a fresh language-model session per branch, of a given depth) is a choice the evidence does not fix. Reviewers took 52% of today's tokens. On the other side, today's three defects would have been lost with no examiner at all.

The comparison implies three possibilities, for him to weigh: keep the rule as it stands; keep independence and let the form follow the methods on the lines, so that a line a machine proves is run by someone other than the doer, and an examiner's depth varies; or reduce the number of reviews by reducing the number of units, one examiner per attempt instead of one per issue, which keeps his rule untouched and is the cheapest of the three. I have no ruling to offer and no measurement that separates them.

## What should move in my labels

| Item | Was | Now | Why |
|---|---|---|---|
| shape of the work: default not to cut, the unit of record apart from the unit of work | absent | **6.3.0 in words** (inside 209 and 218); record of shape and outcome next version | quality: the evidence and today's numbers |
| baseline: one agent and a reviewer against the loop, on the same work | absent | **next, first of all** | truth: no claim about cost holds without it |
| methods on the lines (the owner's) | absent | **6.3.0 slice**: the marks, printed in the brief; the gate and derived depth next version | quality: his idea; the slice adds no gate to a release near its end |
| reviewer without the author's account, told to hunt scenarios | absent | **6.3.0**, two sentences | quality |
| item 1, the engine | next, ranked first | first slice **6.3.0** (217 plus the rows of `next --as --json` naming it), the rest next; ranked below the shape | quality; a fine-cut pattern should not be made cheaper first |
| item 3, the refusal on Acceptance | 6.3.0 | **show the change to the reviewer, no refusal**; a refusal only for what lowers review depth (`identical-output`, a line's method) | no real case; showing gives nearly the same |
| mark 1 | reached | **partly** | Jarl raises nobody |
| a restart for a dead director | absent | **next version**, host side; a recipe in the skill for 6.3.0 | truth: a gap in the design, with no measured case |
| fast check for workers | withdrawn | withdrawn, on new grounds | the four repairs came from merging |
| a repair at the merge leaves a record | absent | **6.3.0** as a defect | truth |
| 088's budget | unmet | reachable: cut composers.md (2,920 words, no composer in the family) to a stub and move the import and template sections out of the role set; about 14,500 against 13,856 | quality |
| items 5, 6 and 8 | next version | next version, **each admitted by a measured failure** | the admission rule |
| a hand-written table of shapes as a decider | proposed to the owner | **do not do** | one measurement, but the only one |
