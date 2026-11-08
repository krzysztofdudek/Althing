# Jarl: the perfect loop

**Question:** What should the work loop Jarl runs be, for one agent on one repository up to dozens of agents on many repositories over weeks, and for a human organisation on the same record, so that it meets the seven marks of a perfect loop the owner agreed to and gives every level clear decision rights; what of it does Jarl 6.3.0 already do; and what is left to do beyond the 6.3.0 backlog?
**Method:** Read Jarl at the 6.3.0 release tip (JarlSkill 0556c16, branch release/6.2.1; run 3 at a6dcbc3): SKILL.md and every reference; the open issues of the 6.3.0 loop; research/2026-11-03-jarl-as-a-loop-tool and releases/6.3.0/plans; the method, the ledger of rulings and AGENTS.md sections 6 and 7; family/map.md and family/canon.md. Read the record of the two largest real loops (releases/6.3.0 at Althing 897afdb and releases/6.2.0) with a script kept in materials. Check claims about behaviour by running the tool on scratch loops. Five research agents (Opus 5.5 at xhigh) read public sources on flow and queueing, command and decision rights, fault tolerance and durable records, review, merge and release practice, and multi-agent coding systems. Three critics (Opus 5.5 at xhigh: fidelity, technical soundness, cost) attacked a first draft, and this text is the revision.
**Status:** concluded
**Conclusion:** The one-loop model (one record, a gate on evidence and a fresh reviewer, one holder for every open thing) holds on the numbers of two real loops, but it has never been compared with one agent on one spec, and comparison with an independent design put the largest change first: the unit of record is not the unit of work, and the default should be not to cut. With its additions 6.3.0 reaches mark 8 in full and the others in part. What was primitive is that every piece of work is handled one way, a loop stops at itself, moves by prose and believes typed text; a machine for a project of any scale needs a chosen shape of work, an engine and a programme layer, the last two each admitted by a measured failure, and the trade between that and a quick 6.3.0 is the owner's. This is a proposal: nothing here is a task until he approves it.

**The result of this research is the design of 6.3.0, `releases/6.3.0/plans/jarl-6-3-0-design.md`. Where it and this text differ, the design governs.** A critic's walk through it is in [materials/critique-design-walk.md](materials/critique-design-walk.md).

The request as it arrived is in [source.md](source.md). The record of the real loops is in [materials/real-loop.md](materials/real-loop.md), the scratch runs in [materials/simulation.md](materials/simulation.md), and what each field says, with every source, in the five `materials/field-*.md` notes. Decision rights have a note of their own, [materials/decision-rights.md](materials/decision-rights.md). The critiques are in `materials/critique-*.md`, and [materials/revision.md](materials/revision.md) answers each finding. [materials/comparison.md](materials/comparison.md) sets this concept against a design made independently and is harder on this one.

## 1. What the real loops say

The first draft read Jarl's gaps from a simulation. The critics sent it back to the record of 752 issues, and the record changed the concept.

- **Once an issue starts it moves.** In 6.3.0 the median from lease to first proof is 0.40 hours, from proof to first verdict 0.45, from approve to merge 0.18. 90% of the issue-hours (72% in 6.2.0) lie before the first lease. Those are calendar hours, with nights, pauses and, in 6.3.0, the days before work began on 2026-11-03 in them. The real loops do not show work piling up in front of review or the merge as a rule.
- **Review earns its place.** 55 of 163 reviewed issues in 6.3.0 drew a `changes` verdict. Every one of 160 closed code issues had a fresh reviewer.
- **Few merges went red after a review, and the record does not say so.** No recorded round follows an approve in 448 merged issues. Yet on the 6.3.0 branch, about 4 of 73 merges needed a repair after review, made directly on the branch and leaving no round; all four came from combining two branches.
- **Agents did not cheat under their own names, as far as the record can show.** No worker narrowed an acceptance line on the record, made a ruling, or closed on a predecessor's proof (0 of 26 issues with several workers). Those loops ran strong models under a strong director, and a format-1 line names no writer.
- **Reviews cost more than the work.** Today's counters: 13 small issues, about 2.04 million tokens, 979 thousand for workers and 1,057 thousand for reviewers, with coordination not counted. No one has compared that with one agent on one spec.
- **The real burdens are elsewhere.** This loop's coordinator sent 71 briefs of 16.8 KB on average. The coordinator writes 2.4 record lines per closed issue. 57 of 223 issues have an empty Why. The owner made 52 of 74 rulings. The 6.2.0 loop is still open with 8 items on the owner that 6.3.0's digest does not show.

Every failure this document claims is listed against the record in [real-loop.md](materials/real-loop.md), with "none found" where none was.

## 2. What was primitive, and what is right

The owner called what exists primitive. This is a plain answer.

**What is right, and stays.** One append-only record that every view is computed from. A done gate that needs evidence and a fresh reviewer. One holder for every open thing, with the command that moves it. A resume that survived every compaction in the field report. The numbers above back all four. Nothing in this concept replaces them.

**What was primitive.**

0. **Every piece of work is handled one way.** One worker per issue or package, one reviewer per unit, whatever the problem. Tangled work suffers from being cut, and small work pays many agents' start-up and review.
1. **A loop is an island.** Nothing sits above one loop: no order between loops, no view across them, no single digest for the owner. Two loops are open today and each thinks it is alone.
2. **It moves by prose.** The tool knows what is true. Turning that into the next action is left to an agent reading 19,475 words and writing briefs by hand. `models.md` calls the loop "clerical work over a tool that refuses what is wrong", and clerical work is being done by a language model, one message at a time.
3. **It believes typed text.** A proof row is a sentence an agent typed. A light worker in the 6.3.0 loop recorded a row for a command it never ran. The banner that says whether the check decides what lands compares typed strings, and reads "0 of 158" on a loop whose merges ran the suite.
4. **It organises work by issue numbers, while Yggdrasil knows the structure.** 6 of 223 issues in 6.3.0 declare Files, so the lease guard protects almost nothing there. The owner's sentence was "Yggdrasil gives the structure. Jarl gives the organisation of work", and today one tool ignores the other's graph.
5. **It does not know what it costs.** Cost per issue and refused calls leave no trace.

**The machine, in three layers.**

| Layer | What it is | State |
|---|---|---|
| The loop | record, gate, holders, decision rights | built; 6.3.0 repairs it (items 2, 3, 4, 9, 10) |
| The shape | the planner picks the shape of the work from a named toolbox; the default is one attempt on the whole spec, and a spec cut only where it stalls | 6.3.0 in words (item A), recorded next version |
| The engine | every next move comes out of the tool as data, complete: who, on which model, where, with which brief, and the command that records the result. A host script or a light model carries out the routine moves. Coordinators keep the judgment | first slice 6.3.0, the rest next version (item 1) |
| The programme | many loops and many repositories as one piece of work: order across loops, a slice grown large becoming its own loop, sets of changes that land together, slices and collisions read from Yggdrasil's graph | next version (items 5, 6, 8); its first step, one digest for the owner, in 6.3.0 (item 4) |

The hierarchy he described stays: a jarl that talks with him, coordinators that absorb the noise, workers and reviewers per unit of work. Jarl still raises nobody, and it stays agnostic of models and hosts.

**"What Jarl will not grow", tested against his word.** composers.md draws five exclusions and sends each request to a composer. The family's composer left on 2026-11-04.

| Exclusion | Verdict | Who provides it, and what is lost |
|---|---|---|
| a merge queue that runs the check and refuses | stays out in that form; item 7 lets the tool witness the check | the merger and the repository's CI; until item 7 the check stays an agent's word |
| a done that waits for green CI | stays out | CI is recorded; a red after the merge is seen late. 161 merges of 6.3.0 had no CI to wait for |
| leases that expire or move by themselves | stays out | a coordinator acts; minutes are lost when none is looking |
| a release mode that refuses to tag | stays out | the release skill and each repository's workflow; another user writes their own checklist |
| a computed schedule | stays out; the holds-up order already shows the longest waits | no forecast of finish dates, which the family refuses to estimate |

The exclusions stand on reasons of their own now, and composers.md must say so instead of pointing at a composer nobody has.

## 3. What "perfect" means, and how far 6.3.0 gets

The owner agreed to seven marks. Each is sharpened so a loop can visibly fail it, and three are added.

| # | Mark | 6.3.0 with the items below | What is missing, and why it waits |
|---|---|---|---|
| 1 | The loop does not stand when the owner is away. What is reserved to him waits for him, and holds only the work that depends on it | **partly.** True of questions and rulings, and only while a directing session lives. Jarl raises nobody, so the loop stands when that session dies or runs out of tokens | truth: item C needs a host-side restart, and how often this happens is unmeasured |
| 2 | Any agent can be replaced from the record alone | **partly.** Issues, rulings, questions and rounds carry over. An agent in flight is invisible until it writes, and a replacement waits out the liveness threshold | no real failure found; see the withdrawn run lines |
| 3 | Nothing lands without evidence and a fresh reviewer; defects surface early | **partly.** The gate holds. Proof is typed. Where defects are caught is not counted | risk: item 7 needs a design for hosts and containers |
| 4 | Cost fits the work | **partly.** Tiers, packages and grouped reviews. Cost is unrecorded | truth: nobody has checked what hosts report |
| 5 | An agent reads little, briefs come complete, a refusal ends with a form, a wrong guess is a defect | **partly.** Forms are built. 217 and 088 are in the backlog, and 088's budget stays unmet (section 8). Wrong guesses are counted only in the blind runs | risk: item 12 breaks a promise the tool makes today |
| 6 | The record tells the truth and every view agrees | **partly.** One record, disagreements shown. The banner defect and the "stop" sentence are to be fixed | quality: both are defects for 6.3.0 once filed |
| 7 | Calls, refusals, rounds and cost per issue come out of the record | **partly.** Rounds, waits and reviews do. Calls, refusals and cost do not | as for 4 and 5 |
| 8 | Every decision has one decider. The doer cannot ease its own review, and a change to what it must prove is shown to the one who judges | **reached** with items 3 and 10 | |
| 9 | The loop shows where work waits and finishes before it starts. The owner's queue holds only what depends on him | **partly.** The order and the counts. No limit | truth: a limit needs numbers from a real loop |
| 10 | The loop improves itself by numbers | **partly.** One sentence in the close procedure, and rules with a scope | truth: no loop has yet used its own numbers this way |

Measured by: issue-hours held by the owner (1); a drill that stops an agent at a random step and counts what is lost (2, not built; 076 scenario 4 is the nearest); the stage at which each defect was caught (3); rounds and cost per merged issue (4); words per role and wrong guesses after a refusal (5).

Not "perfect", as the owner said: zero friction everywhere, mechanisms that change nothing, a new record format in every release.

## 4. Principles from the world's best practice

Each comes from a field note in `materials/`, which gives the mechanism, the limits and the sources. The first group drives a decision below; the second is honoured today and is here as context.

| # | Principle | From | 6.3.0 | Leads to |
|---|---|---|---|---|
| 1 | Routine moves belong in code; the model does the judgment | durable workflow engines (field-fault-tolerance 8); Anthropic and Cursor on planners and workers (field-agents P3, P9) | **Not.** The coordinator derives and writes every move | item 1 |
| 2 | Give the worker an honest way to say it cannot be done | an abort option cut cheating from 54% to 9% (field-agents N7); impossible requirements breed false reports (field-command) | **Not.** "Stop and report", with no command in the brief | item 2 |
| 3 | Intent travels two levels down, in the owner's words | mission command: responses matched intent in 34% of 32 episodes even in a correct format (field-command) | **Partly.** The brief has no goal; 57 of 223 issues have no Why | item 2 |
| 4 | The doer never judges its work or sets what it must prove | separation of duties (field-agents P11, field-delivery P7) | **Half.** Self-approve refused; acceptance open | item 3 |
| 5 | One filter per level, with alarms able to pass it | CCIR, the kernel's chain where 1.3% of patches reach the top (field-command) | **Partly.** One digest per loop | item 4 |
| 6 | Add levels only when span fails; keep chains short | incident command, the kernel (field-command) | **Partly.** Nothing above a loop, no guide for when to split | items 5, 8 |
| 7 | Two changes conflict when they share a target, not a file | build graphs (field-delivery P4) | **Not.** Files, and only when declared | item 6 |
| 8 | Proof can be run again; an agent's text is testimony | agents over-report and prompts barely help (field-agents P5) | **Partly.** ran/saw rows are typed | item 7 |
| 9 | Find the constraint; finish before starting; measure before limiting | theory of constraints, Kanban, Little's law (field-flow P1, P4, P5) | **Not.** `next` offers all that is ready | item 9 |
| 10 | Tie the right to decide to reversibility, and let the owner list what is reserved | one-way and two-way doors; the delegation board (field-command) | **Partly.** Scattered in nine places | item 10 |
| 11 | Measure flow as a balanced set, never as targets | DORA (field-flow P14) | **Partly.** Rounds, cycle time, reviews | items 11 to 13 |
| 12 | Size review by what it can check | field-delivery P6, field-flow P6 | **Partly.** A count of four | item 14 |
| 13 | Change the standard work after a deviation | kaizen, blameless postmortems (field-flow P13) | **Partly.** Rules with a scope | one sentence at close |

Honoured today, context only: one source of truth computed from a log; every claim says who made it; a compaction is a crash and work restarts from the record; the main line moves only to a state checked on the merged result; a fresh context is the main gain in review; one holder for every open thing; a supervisor that holds no work and escalates repeated failure; transfer of command as a briefing from the record.

The outside evidence also sets a limit on this whole design. In the MAST study of 1,642 traces, verification failures are about a quarter of multi-agent failures; the rest are system design and misalignment between agents (field-agents P1, the agent's own sums). A perfect record will not stop an agent from misreading a spec. The filer's acceptance lines, the fresh reviewer and Urd carry that part.

## 5. The model of the loop, end to end

### Roles

The owner, the jarl, coordinators over slices, workers, reviewers, one merger per loop, and a lone agent that holds every role but the reviewer's on its own code. A supervisor raises, watches, replaces and escalates, and never does the work. With the engine in place, a coordinator becomes cheaper to run: the routine moves are data, and it keeps the judgment calls (splitting, rounds or takeover, what to escalate).

### Decision rights

The analysis and the full table are in [materials/decision-rights.md](materials/decision-rights.md). Three questions, in this order:

1. **Is it reserved to the owner?** Reserved are: what leaves the machine or cannot be taken back (a publish, a push, a tag, a deleted branch, a merge to `main`); what the tools' law keeps for a person (ratifying a rule, a suppression, a `review_by`, the architecture file); what the product is and when it ships; and the five stop cases of SKILL.md, which he holds by ruling whether or not they could be undone. Each project lists its own in the goal; Althing's is AGENTS.md section 6. An unknown case counts as reserved. The jarl asks, and only the work that depends on the answer waits.
2. **Whom does it bind?** One issue: its worker, inside its acceptance. One slice: its coordinator. The loop: the jarl. The goal or a whole type of code: the owner.
3. **It is the owner's by reach and not reserved?** The jarl decides provisionally and files a ratify item, which blocks nothing (built).

One rule beside the three: **the one who does the work never judges it, cannot ease its own review, and every change it makes to what it must prove is shown to the one who judges.**

A choice of behaviour keeps the owner's own ruling, whole (`code-docs-conflicts`): one option clearly fixes the thing and breaks nothing for adopters, the coordinator settles it; it breaks existing behaviour, or the coordinator is not sure, the question goes to him. The first draft read that ruling away. The question holds its one issue, and the rest of the loop moves. Section 8 asks whether he wants more than that.

**What the tool does about it.** It refuses where the record holds the fact and a wrong move would be silent (self-approve, fresh review, the done gate, the owner's ticks and waiver, item 3). The skill guides where the call needs judgment. What neither can catch stays visible: a typed `--by owner` cannot be told from the owner, so what he is shown is every act in his name. A refusal keyed on a name catches the honest failure, an agent that grades itself. It stops nobody who lies about the name, and this document claims no more.

The table does not become a tenth place an agent reads. Item 10 puts two sentences and at most three "you do not" lines per role where the agent already reads, and retires the words it replaces.

### The flow of an issue

| Step | Holder | The tool refuses or records | The brief or skill asks |
|---|---|---|---|
| 1. Filed | jarl or coordinator | records the fields; notes an empty Acceptance, and with item 2 an empty Why | checkable acceptance, Files or Resources, Tier, After |
| 2. Ready | derived | offers only what no file, After or question holds | |
| 3. Leased | coordinator | refuses a held issue, file or resource | one issue or a package of neighbours on one tier |
| 4. Worked | worker | proof as rows; with item 3 a change to the acceptance is shown to the reviewer | a failing test first; the honest exit (item 2) |
| 5. Reviewed | a fresh reviewer | refuses a self-approve; code needs a fresh approve; the model rule is advice unless the profile makes it a gate | another model, never weaker; re-run on light work; acceptance met literally |
| 6. Sent back | coordinator | counts rounds; prints the takeover block | same agent resumed or a fresh one (218) |
| 7. Queued | derived | the merge queue, in batches | |
| 8. Merged | merger | records the sha and the check text; notes when branch or base is missing | merge, run the check on the merged result, roll back on red |
| 9. Done | gate | refuses without proof, a live approve, the merge and the owner's ticks | |
| 10. After | jarl | records CI | |
| 11. Released | owner's word | a checklist of issues chained by After; the ratification batch at close | the release skill |

### How it scales

| Shape | What changes |
|---|---|
| one agent, one repository | nothing to declare. The minimum is built. A fresh session reviews, on the owner's word. It grades its own acceptance as it always could; only the self-approve refusal applies to it |
| a jarl and a handful of workers | the end-of-line order tells the jarl what to finish first |
| coordinators, dozens of agents, weeks | slices; the engine (item 1) keeps the coordinator's cost per move from setting the ceiling |
| many loops, many repositories | the programme layer: one digest (item 4), order across loops and a slice grown large becoming a child loop (item 5), sets that land together (item 8), slices and collisions from the graph (item 6) |
| a human organisation | run 3 walked a team of four people on one record: filing, leases, proof and review work as they stand. Three things break: a team lead named as a coordinator cannot clear a colleague's work; the owner is one literal name, so an organisation with several deciders has nowhere to put them; and nothing tells a person that the ball is on them. People also sign in to real systems, so an organisation would want names checked against that. No item is proposed before a real team asks, and no real human loop exists to learn from |

Span: a guideline of one supervisor to about five comes from incident command (field-command). It is a limit on human attention, unmeasured for agents, and a starting value at most. The kernel's rule of two or three levels is the better guide.

### How it recovers

| What fails | What shows it | What the replacement does | Limit |
|---|---|---|---|
| a worker dies | `branches` marks the lease STALE past the threshold (built) | hands over; cuts a new branch from the old tip when the old agent may be alive; a takeover brief that starts from a dirty worktree (218) | a long test looks like silence |
| a worker goes in circles | rounds reach the limit (built; 215 for the view) | a takeover one tier up, or the issue becomes a question | |
| a reviewer dies | proof with no verdict past the threshold | raises another; two verdicts corrupt nothing | one review wasted |
| a coordinator dies or compacts | its escalations stop; the jarl reads `status --slice` | `brief --slice` and `resume --slice --as` (built) | it cannot tell a live worker from a dead one before the threshold |
| the merger dies | the main checkout holds a merge no `merged` line names | looks at git and the record, re-runs the check, then records it or resets to the merge's parent | until item 15 this is a sentence in jarl.md, not a view |
| the jarl compacts | at the next turn | `resume --as jarl` (built) | |
| two clones worked apart | `verify`, lease conflicts (built) | `renumber`, a handover naming the lease to keep (built) | |
| the owner is away | nothing else stands | his digest waits for him (built) | |

### How it is measured

| Number | Source | Mark | State |
|---|---|---|---|
| cycle and lead time, rounds, reopenings, follow-ups, fresh share | the log | 3, 4 | built |
| count per stage | the log | 9 | item 9 |
| time per stage | [real-loop.mjs](materials/real-loop.mjs) shows it can be read from the log | 1, 9 | not proposed as code until a loop needs it |
| refused calls | a file beside the record | 5, 7 | item 12 |
| cost per merged issue | a line written when an agent returns | 4, 7 | item 11 |
| where each defect was caught | the log | 3 | item 13 |
| words each role reads | a test | 5 | 088 keeps its measure; a per-brief budget is added |

Agents running, tokens without the issues they bought, lines written and issues filed stay out.

### What Jarl needs from the family, and what it must not take over

| Tool | Jarl takes | Jarl must not take over | What is lost without it |
|---|---|---|---|
| Yggdrasil | the check; ratified rulings into the graph's logs (built); with item 6, `yg owner` and `yg impact` to see which component an issue touches | judging architecture, enforcing law, a second store of rules | slices and collisions stay guessed from files, when anyone declares them |
| Grain | files that change together, as material for packages and Files (guidance) | computing co-change | a filer guesses neighbours |
| Ratatoskr | how the jarl speaks to the owner (where installed) | the conversation | Jarl keeps its own short section |
| Urd | when to ask instead of guessing; `ask` gives the question a home | the discipline | none: they already fit |
| Researcher | experiments on the loop's method, on Jarl's numbers | an experiment engine | a method change rests on one loop's numbers |

## 6. What is to be done beyond the backlog

Ranked by how much each improves a real loop. Every label's reason is quality, risk or truth. "Real case" points at [real-loop.md](materials/real-loop.md). Items A and B come from the comparison with the independent design and rank above the rest, and item C comes from the objection that mark 1 was overclaimed ([comparison.md](materials/comparison.md)); nothing beyond a small core is built before a measured failure admits it, and item 1 and items 5, 6 and 8 must each name theirs.

### A. The shape of the work, and a baseline (6.3.0 in words, recorded next version; the baseline first)

**What.** The unit of record (an acceptance line) is separated from the unit of work (one attempt). The default is one attempt on the whole spec, cut only where it stalls. A named toolbox says when to do otherwise: a package of small neighbours, pieces along disjoint territories with interfaces fixed first, sequential phases, a mechanical change reviewed as a tool plus a sample, a probe. The planner chooses by judgment and the record notes shape and outcome. No hand-written table decides. Before anything else in the next version: the same work done by one agent and a fresh reviewer, and by the loop, compared on cost and defects. **Why.** Cutting harms tangled work (CooperBench; Anthropic's multi-agent piece); the design from zero's "the default is not to cut"; hand-written routing rules were the worst router in the one measurement found. **Real case.** Today's 157 thousand tokens per small issue, with reviewers above workers. The owner's own observation. No baseline exists. **What we lose.** Every spec pays for many start-ups and reviews, and no claim about Jarl's cost can be tested. **Format.** None; `--line` and packages already allow it. **Label reason.** Quality for the words (inside 209 and 218); truth for the record, which needs data.

### B. Every acceptance line states its method (the owner's proposal; 6.3.0 slice, gate next version)

**What.** Each line carries a mark like `[owner]`: `test`, `check`, `compare`, `read`, `owner`, chosen at filing by the filer as the cheapest that can prove it, and printed in the brief. Next version: the gate asks for a row of the line's kind, `check` must be a declared command (which retires the string-matched banner), and review depth comes from the methods. A line only judgment can prove says so. **Why.** Checks fixed ahead and grades of evidence (the design from zero, P2, 4.2) at the size of one line. **Real case.** Today's three serious defects passed a green suite and were found by reviewers hunting scenarios no line named, so the register does not replace the examiner. **What we lose.** "Done" stays one undifferentiated word and the depth of review stays a separate decision. **Format.** None. **Label reason.** Quality; the gate waits on risk, in a release near its end.

### C. The loop keeps a director alive (next version, host side; a recipe in the skill for 6.3.0)

**What.** Something outside the agents starts a fresh session on `resume` when work is ready and nothing has written for a set time. Jarl still raises nobody. **Why.** Mark 1; crash and restart from the record (field-fault-tolerance 4). **Real case.** None measured. Since work began on 2026-11-03, issues closed on 5 of 6 days, and the one stop on record was a deliberate move between machines. This is a gap in the design, not a measured failure, and the admission rule applies to it too. **What we lose.** The loop stands whenever its one session does. **Format.** None. **Label reason.** Truth: how often a director's death stands a loop is unmeasured.

### 1. Moves as data: the engine (first slice 6.3.0, the rest next version)

**What.** `next --as <who> --json` gives every routine move whole: the role, the tier's default model, the complete brief (217), the branch and working place, and the command that records the result. A host script or a light-model coordinator can carry out a move without reading the skill. Jarl still raises nobody. **Why.** Durable workflow engines separate deterministic orchestration from work (field-fault-tolerance 8); a strong planner over cheap workers beat the alternatives (field-agents P7). **Real case.** 71 briefs at 16.8 KB; 2.4 coordinator lines per closed issue; a coordinator's reading set above 13,000 words. **What we lose.** The coordinator's cost per move sets the ceiling on scale, and the loop stays as expensive as the model that reads the prose. **Format.** None; a JSON shape, itself a contract. **Label reason.** A first slice in 6.3.0 (217, and the rows of `next --as --json` naming the full brief) for quality. The rest waits on truth: 076's blind runs and the first real 6.3.0 loop must show which moves are routine. Item A comes first, because an engine for a fine-cut pattern makes the wrong thing cheaper.

### 2. The honest exit, and intent in the brief (6.3.0)

**What.** `ask --kind stuck --issue <id> --by <worker>` from a lease holder is refused by nothing and lands on its coordinator's list (with no slice, the jarl's); the coordinator answers it or takes it up. The brief names that command as the way out when the acceptance cannot be met without weakening something. The brief opens with the goal's first paragraph, and `new` notes an empty Why. No table rows go into the brief; a test holds its word budget. **Why.** An abort option cut one model's cheating from 54% to 9% (field-agents N7), and requirements nobody can meet breed false reports (field-command). **Real case.** No worker on the record hit an impossible acceptance; light workers are new in this release. 57 of 223 issues have no Why. **What we lose.** A worker that cannot meet its line has two exits, a workaround or silence, and the brief names neither its purpose nor a way out. **Format.** None; one holder rule in the ball. **Label reason.** Quality: the strongest outside evidence for the least words, and light workers arrive in this release (`release-fast-light-models-grouped-reviews`).

### 3. What the doer changes is shown, and what lowers review it cannot change (6.3.0)

**What.** The reviewer's brief prints every acceptance change since the lease, which needs the log to keep the old text whole instead of its first line. A worker cannot set what lowers the depth of its review: the tag `identical-output`, or a line's method (item B). The refusal ends with the form that files the change as a finding. A narrowing by the jarl goes to the owner as a ratify item, as 079's did (a-017). Library callers keep their contract. **Why.** Separation of duties (field-agents P11); checks fixed ahead (the design from zero, P2). The first draft refused every change to the acceptance; the comparison dropped that, because showing the change to the one who judges gives nearly the same with no new refusal. **Real case.** None attributable: 12 post-lease edits in 470 leases, none shown to be a worker's. The refusal on the tag stands because reviewer.md promises it and the tool breaks it, and because a tag that lowers review reaches a light reviewer. **What we lose.** "Acceptance met" could mean a line the worker rewrote, unseen. **Format.** None: an audit line grows. **Label reason.** Truth: a promise the skill makes and the tool breaks is a defect under the ruling of 2026-11-05.

### 4. One digest for the owner across loops (6.3.0)

**What.** `next --as owner --all --loops` reads every loop under the checkout, as `use` lists them, and prints one list, most blocking first. **Why.** One filter per level (field-command); a person who is often away must not have to know which loops exist (field-flow P12). **Real case.** 6.2.0 holds 8 items on the owner that 6.3.0's digest omits. Run 3 reproduced it. **What we lose.** "On the owner (N)" is true of one loop and false of his work. **Format.** None: read-only. **Label reason.** Truth, and mark 1 cannot be claimed without it.

### 5. Order across loops, and a slice that becomes a loop (next version)

**What.** An issue may wait on an issue of another loop, by key. A slice grown past what one coordinator can hold becomes a loop of its own, and the parent keeps one issue whose proof is the child's report at close. Issue 024 is the first step. One merge queue per repository follows, with a tool command that commits the record under its lock, because the merger today also commits `.jarl/` and two committers there are the collision the rule forbids. **Why.** Growth by modules, two or three levels at most (field-command); each trunk has its own constraint (field-flow P1). **Real case.** Two loops open side by side, with order kept by hand. Nobody has yet been slowed by one queue per loop. **What we lose.** A project past one loop's size is held together by a person's memory. **Format.** A new reference shape: inside the next raise. **Label reason.** Risk: a format decision, to be made once and from a real multi-loop run.

### 6. Organising work by the graph (next version, the owner's word on the edge)

**What.** Where a repository has a graph and a working `yg`, an issue may name a component instead of guessing files; `yg owner` and `yg impact` tell Jarl which issues touch the same component; a jarl cuts slices from subtrees; an issue that reaches a type or a contract is flagged for a tier up. 6.3.0 can already write a component as a `Resources:` name, and the guidance says so. **Why.** Conflicts live in targets, not files (field-delivery P4). **Real case.** 6 of 223 issues declare Files in 6.3.0, 405 of 529 in 6.2.0. Merge conflicts are real and were cheap (import lines in 031, 083 and a package). **What we lose.** "Jarl gives the organisation" stays disconnected from "Yggdrasil gives the structure". **Format.** None. It adds a read edge the canon does not list, so it is his call. **Label reason.** Truth: no loop has run with components declared.

### 7. Proof the tool witnessed (next version)

**What.** The tool runs a declared command through the repository's own environment, as a background job with a handle, and records the exit code, the counts and the state of the tree, marked as witnessed. Only commands the goal declares count as checks. Typed rows stay, marked as testimony. **Why.** field-delivery P1, field-agents P5. **Real case.** One row for a command never run. **What we lose.** Every proof and merge check stays an agent's word, and a reviewer re-runs them at a reviewer's price. **Format.** A mark in a fixed place, inside the next raise; the first draft's promise that older readers would cope was wrong (technical I6). **Label reason.** Risk: MCP calls are synchronous, worktrees in containers are out of reach, Windows is unrun. It moves the line "Jarl does not run commands".

### 8. Sets of changes that land together (next version)

**What.** A named set of issues across repositories, in a stated order, with one check over their exact commits, generalising what Althing's `ws` does for its releases. **Why.** Shared queues across repositories (field-delivery P11, Zuul). **Real case.** Family releases need it, and `ws` answers it for the family only. Today an issue naming two repositories has two merges and one done. **What we lose.** Anyone else's cross-repository change lands by hand. **Format.** None if built on tags. **Label reason.** Truth: port what `ws` has proved, and do not design it twice.

### 9. Finish before starting (6.3.0)

**What.** Below the idle and holds-up order, `next --as` sorts a holder's moves from the end of the line (merge before review before rework before a new start), and `status` prints one count line per stage. No limit and no named constraint. **Why.** field-flow P1, P5. **Real case.** The p90 of 25.9 hours from proof to verdict came from built work left unreviewed; no stage is a constraint as a rule. **What we lose.** A new start can outrank a finished branch. **Format.** None. **Label reason.** Quality, at the cost of one sort.

### 10. One home for decision rights, and words retired (6.3.0, inside 088)

**What.** Two sentences and the three questions in SKILL.md, and at most three "you do not" lines in each role reference. The table stays in research. Retired with it: the citation grammar in jarl.md (600 words to about 60), the artifact allowlist in reviewer.md (332 to about 40), four of five copies of the shell paragraph (316), and the repeated account of colliding numbers in SKILL.md, jarl.md and repositories.md (about 650). **Why.** The cost critic's count: the first draft added words and retired none. **Real case.** 19,475 words against a budget of 13,856. **What we lose.** A tenth place to read. **Format.** None. **Label reason.** Quality. About 1,800 words go and about 300 come, which leaves about 18,000. The budget of 13,856 is within reach (about 14,500) only if composers.md, 2,920 words for a role no family tool now holds, shrinks to a stub, and the import and template sections of jarl.md (about 1,400 words) move out of the role set (section 8).

### 11 to 15. Next version

| # | What | Real case | What we lose | Format | Label reason |
|---|---|---|---|---|---|
| 11 | cost per issue, a line when an agent returns | none measured; mark 7 names it | model choice stays by feel | a fixed mark, next raise | truth: what hosts report is unchecked |
| 12 | a log of refused calls only, in an ignored file, with a migration | counted by hand in 076's plan | "a wrong guess is a defect" stays invisible outside tests | none | risk: a promise that a refused call writes nothing, tested today |
| 13 | where each defect was caught | 0 reds after review in 448; 99 `changes` | mark 3's "early" cannot be shown | none | truth: nothing yet moves on it |
| 14 | review units cut by lines and shared inputs | about half against a quarter around 400 lines (6.2.0, confounded) | a large unit reviewed as one | none | truth: the split is confounded |
| 15 | a view of a merge with no `merged` line, with a sentence in jarl.md for 6.3.0 | none found | a compacted holder could raise a second merger | none | truth: no case; the sentence covers it meanwhile |

### Withdrawn after the critics

- **Run lines for every raised agent** (the first draft's item 2). About 670 lines for 334 raises, with no real failure, a reviewer that cannot be told apart from a dead one, and a phantom after a raiser's death. Issue 220's answer: known limitations plus the sentence of item 15.
- **Fencing by name, and "a replaced holder cannot write".** A name cannot fence: the same name can be re-leased, an unnamed row passes, two clones cannot refuse. A real generation token needs a format change, and 0 of 26 real issues closed on a predecessor's proof. What is lost: a late row from a replaced worker can count until the reviewer reads it.
- **One merger per main checkout in 6.3.0.** Five mergers would be five committers of `.jarl/`. It returns with item 5.
- **The merge run.** It excluded nobody and could not tell a live merger from a dead one.
- **Refusals of Tier, Kind and `decide`, a stop scoped by the raiser, a coordinator's forced scope, the owner's words on `answer`.** No real case. The tool already shows who wrote each of them.
- **A note on a repeated filing, and the close step as code.** 0 repeats in 752 issues; one sentence in the close procedure does the second.
- **"Workers should run the fast check."** About 4 of 73 merges in 6.3.0 needed a repair after review, and all four came from combining two branches, which a check on the worker's branch cannot see. worker.md stands. The defect is elsewhere: those repairs left no round, so the record undercounts them.

### Not to do

| Proposal | Why not | What is lost |
|---|---|---|
| speculative parallel merge queues | they pay when a check is long against the merge decision; our checks take minutes | at much larger scale, serial merge time; revisit when a real loop's merge wait grows |
| classes of service and cost-of-delay scores | the estimates are noisy and gameable (field-flow P7); Priority and After order the work | a finer order in a very large backlog |
| verified identity for agents | not possible across hosts | a lying agent is not stopped. A human organisation could check real sign-ins, and that returns with a real team |
| copying Yggdrasil's law into briefs | Yggdrasil's own instructions reach agents working in the repository | a worker raised where those instructions are not loaded; rules with a scope carry what must reach it |
| a consensus store or a CRDT record | keys and union merge cover the cases seen; two clones can still lease one issue, and that is caught at the merge | prevention in place of detection across clones |
| read-back of intent before work | fluent restatement proves parsing, not judgment (field-command), and costs a turn on every issue | a misreading is found at review, one round later |
| planted defects to measure reviewers | they measure the detection of planted errors, and most evidence of that kind is thin (field-agents P6) | an early number on reviewers' recall |
| a user interface | the JSON views exist | a person reads a terminal or builds a page |

### Defects found on the way, to file when the coordinator files

A repair made directly on the release branch after a merge, which leaves no round or line; the `stop` sentence in commands.md against what `next` does; "its scope grew" printed for a narrowing; the landing banner's reading of `Check:` lines with a suffix; the flow text that says "never weaker" where the default is advice; `identical-output` settable by the worker (inside item 3).

## 7. Where this disagrees with 6.3.0 or the backlog

| What | The disagreement | Label | What is lost if it stays |
|---|---|---|---|
| "No permission table, because Jarl cannot verify who an agent is" (2026-11-03, F-I2 and M-I5) | one refusal, on what lowers the depth of review, is neither theatre nor a table of levels | 6.3.0, the owner's word | a worker can rewrite its line |
| "What Jarl will not grow" sends requests to a composer | the composer left; each exclusion needs its own reason and provider | 6.3.0, words | a reader is sent to something that does not exist |
| "stop halts everything" (commands.md) | it holds the issues it names; the sentence is wrong | 6.3.0, defect | an agent believes the loop has stopped |
| "One review covers at most four", a package two to ten | one number: a package is at most what one review checks, unless its issues are one contract (209) | 6.3.0, inside 209 | a package of ten pays for three reviews of one diff |
| 088's test counts files | keep it, and add a budget per brief | 6.3.0 | an agent's real reading goes unmeasured |
| "The loop itself is clerical work" for mid-model coordinators (models.md) | a hypothesis until 076's blind runs | next version: item 1 settles it | a claim no run supports |

## 8. What the owner must decide

1. **The trade.** Ship 6.3.0 with items A (words), B (slice), 1 (first slice), 2, 3, 4, 9 and 10 and the open backlog, reaching mark 8 in full, and build the rest next, from a baseline and a real loop's numbers? Or hold 6.3.0 until they exist? Recommended: the first, for a reason of truth: the engine's shape should come from a loop that has run on 6.3.0, and his own ruling asked for 6.3.0 quickly.
2. **What "a machine" means to him.** Does Jarl give out complete moves that a script or a light model carries out (item 1), with coordinators kept for judgment? Recommended: yes.
3. **The refusal on what lowers review** (item 3): it partly reverses the decision of 2026-11-03, on one tag and one mark.
4. **Behaviour choices while he is away.** His ruling stands as written (recommended), or may an unshipped behaviour choice be decided provisionally and ratified?
5. **A read edge from Jarl to Yggdrasil** (item 6). The canon lists none.
6. **May Jarl run a declared command** (item 7)? It changes a stated line. No answer is needed until that item is taken up.
7. **Issue 220:** known limitations plus one sentence (recommended), or the run lines the critics took apart.
8. **The word budget.** About 18,000 against 13,856. Ship over budget, or cut composers.md and move two sections to reach about 14,500.
9. **Who decides when several people are owners** in a human organisation: left until a real team asks.
10. **`fresh-reviewer-required`, which he has marked for thought.** The comparison separates independence, which the evidence supports, from the form of one fresh model session per branch, which it does not fix. Three possibilities are in [comparison.md](materials/comparison.md); the cheapest keeps his rule and reduces the number of units reviewed. No recommendation.
11. **`findings-become-issues` and `all-minors-stay-in-6-3-0`.** 103 of 223 issues came from reviews. The loop converges (ratios 0.67, 0.25, 0.15 by generation), and a bound is justified on cost alone: a finding needs a reproduction or a broken requirement, and Minor findings about a fix of a fix go on the known-limitations list. His rulings, his call.

## 9. What the critics found

Three critics attacked the first draft. Each report is in `materials/critique-*.md`, and [materials/revision.md](materials/revision.md) answers every finding.

- **Fidelity:** the rule of reach and reversibility failed its own test cases and dropped two reasons in the owner's own list; the concept never answered "primitive"; marks and labels did not meet; a ruling of his was half quoted. All accepted: decision rights now start from what is reserved, section 2 answers him, section 3 is the marks table, and his ruling stands whole.
- **Technical:** a name cannot fence, the merge run excludes nobody, one merger per checkout makes five committers of `.jarl/`, and "the log already holds the old text" was false. All accepted: the first three are withdrawn, and item 3 grows the audit line.
- **Cost:** the honest exit was refused by the same draft; run lines cost more than the failure they remove; the concept added words and retired none; it never read the real loop. All accepted: item 2 routes the exit, the run lines are gone, item 10 retires words, section 1 is the real loops.
- **What survived all three:** the separation of duties as a principle, the hierarchy he described, one format raise, a limit that waits for numbers, and the "not to do" verdicts, though their losses have been rewritten.
- **Not taken, or only in part:** the cost critic's filter that would stop a replaced holder's proof from counting, and the technical critic's generation token, both withdrawn on 0 of 26 real cases; the cost critic's advice to spend no question on witnessed proof (section 8 lists it and asks for no answer now); the fidelity critic's request for a human scenario is met by a walk, and no layer for people is proposed before a real team exists.

## 10. What was not checked

- **No proposed item was built or run with real agents.** Claims about 6.3.0's behaviour come from scratch runs with one agent typing every role. Run 3's "team" was one agent too.
- **The real loops were run mostly by one strong director on strong models,** and a format-1 record names no writer. "None found" means none on that record. Light workers and mid-model coordinators have not run in the field.
- **Calendar hours are not work hours.** The 90% before the first lease includes nights, pauses and the owner's own ordering, and the script cannot separate them.
- **The thresholds** (400 lines, four issues, spans of about five) come from other fields and are unmeasured here.
- **The field notes are the agents' readings,** with each unopened source marked; several sources are vendor material, and a few figures come from summaries.
- **What hosts report about an agent's tokens** and whether a host keeps a raised agent alive after its raiser dies were not checked.
- **No real human team** has used the record. **Windows and macOS** were not run.
