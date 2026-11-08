# Jarl 6.3.0: the design

**Status:** accepted by the owner on 2026-11-08 and narrowed by him the same day (a-024 to a-028, and the rulings `only-the-current-version-is-supported` and `design-6-3-0-narrowed-no-run-no-digest-no-cost`). Written against the tip of the release branch (JarlSkill a6dcbc3) and the open backlog of this loop. The pieces of work, in order, are in [jarl-6-3-0-work.md](jarl-6-3-0-work.md). The reasoning, the sources and the critiques are in `research/2026-11-08-jarl-the-perfect-loop/README.md`. This document replaces its list of additions: it describes the whole of Jarl 6.3.0 as it is to work.

## 1. The system on one page

Yggdrasil says what a codebase is made of and which rules hold. Jarl says what work is going on, who holds it, and what has been shown. Jarl is a record, and a small set of moves over that record.

Everything hangs on one chain:

**A requirement is written as a line. The line states, when it is written, the method that will prove it. Exactly that is carried out. What the line's method is decides what counts as proof, how deep the review goes and which model can do the work. Lines are carried by as few agents as the problem allows. A line's state is computed from what the record shows.** An issue groups the lines of one coherent thing to be done.

The owner proposed this chain. It is adopted, with three changes from the evidence (section 3).

A piece of work moves like this:

1. Someone with the goal in mind writes an **issue**: why it matters, and its **lines**, each with its **method**.
2. A director picks the **shape** of the work. The default is one agent on the whole issue.
3. The director takes a **lease**: one agent, one branch, one or many issues.
4. The tool gives that agent a complete **brief**. The agent reads nothing else.
5. The agent does the work and records **proof** for each line.
6. A fresh **examiner** reads the lines and the diff, runs the proof again, and hunts for what the lines did not name. The methods set its depth. It does not read the worker's account.
7. The **merger** merges into the target branch (the loop's feature branch, or a slice's own integration branch), runs the repository's **check** on the merged result, and records the **landing**.
8. The **gate** closes the issue when every line has what its method asks for.
9. At any moment every open thing has one **holder**, and the tool tells each holder its next move.
10. What is **reserved** to the owner waits for him and holds only what depends on it. Everything else moves.

One agent alone and dozens of agents use this same chain. Scale adds holders. It never adds another way of working.

Three things Jarl does not do, on purpose: it raises no agent, it decides no law, and it never decides what lands when the repository has a check.

## 2. Glossary

Each concept has one meaning and one home in the record. Nothing else in the system needs a name of its own.

| Term | Meaning | Home |
|---|---|---|
| loop | the record of one body of work | `.jarl/` |
| goal | why the loop exists, its declared checks, model lines, and what is reserved | `goal.md` |
| issue | a unit of record: one coherent thing to be done, its Why, and its lines. A status: `open`, `in-progress`, `done`, `dropped`, `deferred` | one file |
| line | one acceptance line of an issue, with its method | the issue's Acceptance |
| method | how a line will be proved: `test`, `check`, `compare`, `read` or `owner` | a mark at the head of the line |
| shape | how lines are carried by agents. Read from the leases; named with a `shape:<name>` tag where a director wants it counted | derived, or a tag |
| lease | a unit of work: one agent, one branch, one or many issues. An issue tagged `in-place` writes its declared files with no branch | the log |
| brief | the complete text an agent is raised with, assembled by the tool | computed |
| proof | a row naming a line: what an agent ran and what it printed | the issue's Evidence, the log |
| examiner | a fresh agent that gives the verdict on one lease's work. The tool's word for it stays `review` | the issue's Reviews, the log |
| live approve | an approve logged after the issue's last start or round, with no `changes` standing since | computed |
| round | one trip back after a failure. After three (a goal line can change it) the tool prints a takeover block for a fresh worker | the log |
| stale | a lease with no commit, row or log line for 30 minutes (a goal line can change it). Shown, never acted on by the tool | computed |
| landing | a merge, the check on the merged result, and any repair | the merge record |
| gate | what `set done` asks for | computed |
| holder | who moves next on an open thing | computed by `next --as` |
| director | the agent that files, shapes, leases and sends rounds: the jarl, or a coordinator over a slice | a role |
| slice | a part of the backlog under one coordinator | a tag `slice:<name>` |
| question | something waiting on someone's decision. Kinds: `stuck` holds one issue (the default); `stop` holds the issues it names; `lower` to weaken a protection; `charter` on the goal; `ratify` for a provisional decision, which blocks nothing; `escalation` a coordinator to the jarl; `rule` proposes a rule | `asks.md` |
| ruling | a decision in force, and whom it binds | `decisions.md` |
| tier | how strong a model the work needs: `light`, `standard` or `strong`. The goal's `Model (<tier>):` lines say which model that is. A second model line on one tier gives a second model family where a rule asks for one | the issue |

## 3. The chain: lines and methods

### The five methods

| Method | The line says | What counts as proof | Who carries it out |
|---|---|---|---|
| `test` | a behaviour, proved by a test that fails without the change | the worker's rows naming the line, failing before and passing after, and the examiner's row re-running it | the worker writes and runs it; the examiner judges whether it could fail for the right reason, and runs it again |
| `check` | a command, given at filing (`· by: <command>`), or the goal's declared check when none is given | the worker's row and the examiner's row with that command; for the declared check, the landing's record | the worker and the examiner, or the merger on the merged result |
| `compare` | that output stays the same (`· by: <command>`) | two rows, before and after, with identical `--saw`, and the examiner's row | the worker; the examiner checks that the comparison covers everything the change touched, and runs it again |
| `read` | something only judgement can prove | the examiner's approve, which quotes the line | the examiner |
| `owner` | what the owner looks at himself (`· material: … · check: …`, as built) | his tick | the owner |

Every line carries a mark. `new` and `field` refuse a line without one, and the refusal ends with the form that names the five. A lease is refused on an issue with no line, because there is then nothing to prove. All five marks use one grammar, the one `[owner]` already has: `[method] the requirement · key: value · key: value`. A line that a conversion left unmarked reads as `read`. A waiver by the owner, or a profile that asks for no approve, stands in for the approve of a `read` line, as it does for the approve today. `import` may still write its unmarked "Proposed" line, which counts as no line, so that issue cannot be leased until someone writes a real one.

Written out, on an issue:

```
new "Export keeps its name" --why "Two callers import it by name" \
  --acceptance "[test] calling export() with no args returns the empty list" \
  --acceptance "[check] the suite passes" \
  --acceptance "[compare] the report output is unchanged · by: node report.mjs" \
  --acceptance "[read] the docs describe the new default" \
  --acceptance "[owner] the screen reads well · material: the render · check: does it read at a glance"
```

### Who chooses, and how

The one who files the line chooses the method, the cheapest one able to prove it. It is never the worker on the lease. "Able" means the method can actually fail: a `test` must be shown red first; a `check` must name a command whose result depends on the change. If no method can fail, the line is `read`, and the record says so instead of pretending. The tool checks the form of a mark. It cannot check whether the method is good enough, so the examiner's first question is always "does this method prove this line?"

### What is different from the owner's proposal, and why

1. **The register does not replace the examiner.** On 2026-11-08 three serious defects (issues 204, 158 and 095) passed a green suite and were found by reviewers who invented and ran scenarios no line named. A register covers what was thought of. By one static measure 80.2% of agent-written test patches had weak or no oracle (design from zero, P4). So every lease still gets an examiner, and its job includes what the lines left out.
2. **A line can change, but what it was at the lease is kept.** The owner ruled that every part of an issue may be edited with the old value logged (`one-edit-rule-for-issues`). The log already records a change of the lines. In 6.3.0 it records the old text whole instead of its first line, so the tool can say what the lines were when a lease started. The examiner's depth is the deeper of "as at the lease" and "as now", and the brief shows every difference. A worker cannot lighten its own review by editing a line, and no new refusal is needed. This takes over from the "grew after the lease" mark.
3. **Proof stays an agent's word until someone runs it again.** The owner ruled that the tool runs nothing (`design-6-3-0-narrowed-no-run-no-digest-no-cost`). "Exactly that is carried out" is therefore checked by the examiner, who runs every `test`, `check` or `compare` line again and records its own row, under its own name.

### What typed proof costs

A proof row is text an agent wrote. A light worker in this loop recorded a row for a command it never ran, and in outside studies false claims of success were 13% to 89% of failures, depending on model and benchmark (design from zero, P1). The chain still holds, because the worker's row alone does not close a line: the gate asks for a row by someone who has not held the lease as well. Two parties have then said so. Both are still words. What that costs, plainly:

- The examiner pays to run every mechanical line, at any tier, so its share of the tokens (52% on the day measured) will not fall from this design.
- Between the worker's report and the examiner's re-run, a row is only a claim.
- The merger's check on the merged result is recorded by the merger, also as typed text. Where a repository has a check, the check still decides what lands, on the merger's word that it ran it. CI on the exact commit is the only outside witness.

A row names its line. A caller names a line by its number. The row stores a digest of the line's text, and the number is never stored. A row counts for a line only while the digest matches, so inserting or rewording a line cannot move proof onto a different requirement. Every proof row names a line: a row about nothing in particular proves nothing in this chain. A free note stays a note.

Every write names its writer with `--by`, and every lease and verdict names its model. The record could not say who edited 12 acceptance lines in two real loops because older writes named nobody.

**The landing banner.** Today it compares typed `--ran` text with the goal's `Check:` lines, and reads "0 of 158" on a loop whose merges ran the suite. The least change: `merged` notes when its `--ran` matches no declared check and prints the declared ones, and the conversion writes `Check (<name>):` lines in the grammar the tool reads.

### The state of a line

Computed, shown by `show` and counted by `status`:

- **unproved:** no counted row its method accepts. A row counts inside the window the gate already uses: after the issue's last start or reopen.
- **proved:** the rows its method asks for are there, the examiner's included. A `check` on the declared command is proved by the landing.
- **judged:** a live approve exists (`read`).
- **ticked:** the owner's tick (`owner`).

`status` counts lines by method. That count is the honest answer to "how much of this rests on opinion?"

### One record format

Jarl reads one record format, the current one (ruling `only-the-current-version-is-supported`). Its marker is a machine line in `goal.md`, `Format: 4`, written by `init`. A loop with another marker or none is refused on every command, before anything else is read, and the refusal names the file of the skill that describes the conversion, `references/converting-from-6-2.md`. An agent converts a loop by following that file. No conversion command ships: there is one conversion to make, an agent can do it from a description, and the first real use, this loop, tests it.

So there are no raises and no older readers. Nothing in the tool decides at write time whether a loop may hold a line. The log reader knows one shape of each line: a key and a writer in their fixed places. A review has no ground of compatibility with an older reader, because there is none.

**History in a converted loop.** A loop's past was written by tools that recorded less, and a conversion cannot invent it. A key is generated for each issue. A line with no writer gets the fixed value `unrecorded`. A row that named no acceptance line becomes a history row, which counts for no line. The conversion ends with one line, `converted`. An issue closed before that line is not re-read against today's gate. An issue still open is read by the rules as they are: its unmarked lines are `read`, and its proof is recorded again.

## 4. The shape of the work

The unit of record is the line. The unit of work is the lease. They are separate on purpose: one agent can carry thirty lines, and thirty lines need not mean thirty agents.

**The default is one agent on the whole issue, within what it can hold. It is cut only where it stalls, or where the problem clearly falls apart.** Evidence: two agents sharing code kept 0.59 of solo performance, and success on 46 tasks fell from 68.6% with two agents to 30.0% with four (CooperBench, in the design from zero, P7). Multi-agent work pays on independent pieces and fails on dependent ones (Anthropic, [multi-agent systems](https://www.anthropic.com/research/multiagent-systems)). On the day measured, 13 small issues cost about 2.04 million tokens, or 157 thousand each, and reviewers took more than workers.

**The toolbox.** Each shape is made of commands that exist today.

| Shape | Use it when | How |
|---|---|---|
| **one agent, one spec** | the default | one issue with many lines, one lease, one examiner |
| **package** | several small issues already exist and sit near each other | `set <ids> in-progress` on one branch, one examiner, one commit per issue |
| **fan-out** | lines fall into territories with no shared file or resource, any interface between them is fixed first, and either one context cannot hold it or the owner wants it sooner | a parent with sub-issues, each with its own lease; the parent keeps its own line that proves the whole |
| **sequence** | one step's output is the next step's input | sub-issues chained by After, usually one agent after another |
| **a change by tool** | a mechanical change across many files | one lease; the examiner reads the tool and a sample of what it did |
| **a probe** | what is wanted is unknown | a research issue whose product is findings |

**Who chooses:** the director that takes the lease, by judgement, when it takes the lease. A hand-written table does not choose. The one routing measurement found put hand-written rules last (73 of 100 at $172.56, against $25.66 for a small trained classifier and $54.73 for the strong model alone; TwinRouterBench, one benchmark, on model routing). That is thin evidence and not about shapes, but it is the only measurement there is and it points against a table. The toolbox above is names and reasons. It adds no field, no step and no classification.

**The record learns.** A lease shows how many issues it carried. A director that wants a shape counted tags its issues `shape:<name>`, and `status --group tag` and `models --group tag` already give counts, rounds and clean first passes per tag. No new field is needed. A statistic that chooses for the director is left out: there is no data yet.

**Which model.** The issue's Tier is the prior: `light` when an executable check will catch a mistake, `strong` when only judgement would, a design, a format, or the cause is unknown, `standard` otherwise. This is a two-line prior, not a table, and `models` calibrates it from the record. `new` notes a `light` issue with a `read` line. A lease carrying several tiers runs at the highest.

**Same builder or a fresh one.** Findings go back to the same builder while its context is alive and they are local. Past the round limit, or after its context has gone, a fresh builder takes over with the old diff to use or discard. A retry must differ in something: model, tier or approach. This is built (`round`, `set --handover`, the takeover block).

## 5. From an agent's first call to a release

**An agent raised to do one job** is given its brief and reads nothing else. The brief holds its role, the rules that reach it, the goal's first paragraph, the parent's purpose, its lines with methods, the commands it will use with every value filled, and what it must report. The tool fills it from the lease.

**A director** starts with `resume`: one command, the whole state, computed. No loop yet: `init "<goal>"`. It reads the skill and the director's reference once. If `.jarl/` already holds a loop and the task matches its goal, it continues. It asks the owner only when the task contradicts the goal (issue 219).

**Filing.** Everything seen becomes an issue, or a line of one. A good issue has a Why, checkable lines with methods, Files or Resources, a Tier, and After where it waits on something. Filing one issue with many lines is normal. A finding with a reproduction or a broken line becomes an issue. A matter of wording or taste stays as a Minor point in the verdict, or on the project's list of limitations. A finding in doubt is a defect (`known-limitations-list-for-wording-minors`). The loop converges: in 6.3.0 the generations of review-found issues ran 120, 80, 20, 3, so no count limit is needed.

**Picking.** `next --as <holder>` lists what is on the holder, with the command that moves it. The order stays: the owner's lines, then what is idle, then what holds up the most. Among equals, the end of the line comes first: merge, then review, then rework, then a new start.

**Leasing and raising.** The director runs `set <ids> in-progress "<why>" --branch jarl/<first-id>-<slug> --worker <name> --model <id>`, makes the worktree, and raises the agent with the output of `brief <ids>`. Jarl raises nobody. `next --as --json` carries each routine move whole (role, default model, branch, the command that prints the brief), so a host script or a light model can carry out routine moves. Judgement stays with the director.

**Working.** The worker cuts its branch, works, commits at the failing test and at the fix, and records proof per line with `evidence <id> --line <n> --ran "<command>" --saw "<what-it-printed>"`. Anything else it sees goes under "Found", and it stays in its lane. A choice the issue leaves open it makes and records as a note starting `Assumed:`. If a line cannot be met without weakening something, it says so with `ask --kind stuck --issue <id> --by <worker>`, and stops. A `stuck` named by the holder of the lease lands on the director of that issue's slice, the jarl with no slice, and on the owner when the asker is itself the director. Giving a model that exit cut cheating from 54% to 9% (ImpossibleBench).

**Examining.** Section 6.

**Landing.** The merger takes approved branches from the merge queue, serially, into its target branch: the loop's feature branch by default, or a slice's own integration branch (section 8). A loop works on a feature branch; if the work started on `main`, a director cuts one first, because a merge to `main` is reserved. The merger merges with the record's merge drivers, runs the check on the merged result, and records `merged` with what it ran and saw, as today. Branches sharing no file may go in one batch. On red:

- The batch is rolled back whole and redone one branch at a time, so the branch that fails is found.
- That branch gets a `round` and goes back to a worker with what failed. Two good branches that break together count this way too: the later one goes back and is rebuilt on the merged first. It is examined again before it lands.
- A red with its cause outside the branch is filed as its own issue, and the branch waits. Landing anyway needs the jarl's ruling (`merged --red <id>`, built).

Nobody repairs the feature branch directly. The merger edits no code, and a repair needs an examiner like any other change. A defect found after a landing becomes a small issue whose `Found by:` names the landed issue, with a `check` line, and goes through the same chain. About 4 of 73 merges in this release were repaired directly and left no trace; that stops.

**Closing.** `set done` passes when every line has what its method asks for, a live approve exists (from a fresh examiner on code; a director's approve clears an issue with no code), code has landed, and the owner's ticks are in.

**Across repositories.** Section 8.

**Releasing.** A release is issues, chained by After, under the owner's word: a checklist from a template, his own `owner` lines, the check on the exact commits. Jarl records it and tags nothing.

**Closing the loop.** `close` files the ruling batch and offers each rule for promotion.

## 6. Verification

Five layers, each catching what the one before cannot. Nothing is duplicated.

| Layer | Catches | Cannot catch |
|---|---|---|
| the method, at filing | a requirement that cannot be proved, seen before any work | a method that is weak |
| the worker's proof | the change not doing what the line says | what no line says |
| the examiner | a weak method, what no line named, weakened protection, scope creep | what it does not think of |
| the check on the merged result | two good branches that break together | what the check does not test |
| the owner's tick | whether it is what he wanted | what he does not look at |

**Depth comes from the methods.** There is no separate classification. The tool computes the depth from the lease's lines, and the brief states it.

| The lease's lines (deeper of lease and now) | Examiner |
|---|---|
| all `compare` | a light model is allowed, the one exception to "never weaker"; it checks that the comparison covers everything touched |
| `test` or `check`, no `read` or `owner` | at least `standard`, and not below the worker's tier |
| any `read` or `owner` | one tier above the worker, at least `standard` |
| any issue on Tier `strong` (a filer sets that for a record format, a contract, a design, an unknown cause) | the strongest; a second family where the Model line has one |

The worker's report and free notes do not reach the examiner. A change labelled bug-free lowered detection on small models (design from zero, P5). The evidence is thin, and the fix costs one sentence. `Assumed:` notes do reach it. Proof rows are in the brief as commands to re-run.

**What the examiner does, in this order:**

1. Read every change to the lines since the lease. A change the worker made is a finding; one the director made is read as the new requirement.
2. Ask whether each method proves its line.
3. Run every `test`, `check` or `compare` line again, at any tier, and record each with `evidence --line --by <examiner>`.
4. Judge the `read` lines and quote them.
5. Invent scenarios the lines do not name, at the edges of what the change does, and run them.
6. Check that nothing outside the issue moved and nothing protective was weakened.

Findings are Critical, Important or Minor. Critical or Important is `changes` and a round. Minor alone is an approve. A finding outside the issue is filed with `--outside` if it is a defect.

**One examiner per lease, one branch diff.** The limit of four issues per review goes: a lease is reviewed as one diff, whatever it carries, once every issue on its branch has the worker's rows for its `test`, `compare` and stated `check` lines. One examiner, as the owner ruled (a-027). The gate changes in one way: a `changes` stands until a round or a new commit, so an approve recorded after it by another agent does not clear the issue.

A re-examination after a round reads the new diff and the previous findings, and re-checks every line.

**What the tool enforces.** A self-approve is refused. Code needs a fresh approve. A mechanical line needs a row by someone who has not held the lease. The gate is computed. Nothing else new is refused. The tool cannot verify a name, so it claims no more than the honest case. The depth is computed from the lines as they were at the lease, so editing a line gets the worker nothing.

## 7. Who decides what

Three questions, in this order:

1. **Is it reserved to the owner?** What leaves the machine or cannot be taken back: a publish, a push, a tag, a deleted branch, a merge to `main`. What the tools' law keeps for a person: ratifying a rule, a suppression, a `review_by`, the architecture file. What the product is and when it ships. And the five stop cases: the goal or a standing decision would change; a protection would get weaker; a number would enter the code with no origin; a merge conflict would lose a side's behaviour; the work would reach outside the session. Each project adds to the list in its goal. An unknown case counts as reserved. Ask, and hold only what depends on the answer.
2. **Whom does it bind?** One issue: its worker, inside its lines. One slice: its coordinator. The loop: the jarl. The goal or a whole type of code: the owner.
3. **Is it the owner's by reach and not reserved?** The jarl decides provisionally and files a ratify item, which blocks nothing (built).

One rule beside them: **who does the work never judges it, and cannot ease its own review.**

A choice of behaviour keeps the owner's own ruling (`code-docs-conflicts`): one option clearly fixes the thing and breaks nothing, and the coordinator settles it; it breaks existing behaviour or the coordinator is not sure, and it goes to him. The question holds its one issue.

**What an agent reads about this:** the three questions and the one rule in the director's reference, and at most three "you do not" lines in each role's brief.

| Role | Decides | You do not |
|---|---|---|
| owner | the reserved list, the goal, what he ticks | |
| jarl | backlog shape, slices, rulings of the loop | do the work; touch what is reserved |
| coordinator | shape, leases, rounds inside its slice; escalates for four reasons: a finding outside its slice's goal, a decision that is the jarl's or the owner's, its slice empty or blocked by another, a takeover that failed too | talk to the owner; change the goal or the slice |
| worker | how to do the work, inside its lines | widen scope; weaken a protection; approve anything |
| examiner | approve or changes | fix; merge; set scope |
| merger | merge order, batches | edit code; judge content; override a red check |
| lone agent | all of the above but its own review | examine its own code: it raises a fresh agent where its host allows, and otherwise `ask "start a fresh session to review issues <ids>"` (built) |

Questions go one level up. A worker's `stuck` goes to its director; a coordinator's escalation to the jarl; the jarl's to the owner. The holder rule does this, and nothing is refused on the way.

## 8. How it scales, and what stays the same

Same commands, same record, same chain. What changes with scale is only who holds what.

| Size | Holders |
|---|---|
| one agent, one repository | one agent holds every role but examiner; a fresh session examines on the owner's word |
| a director and a few workers | the director holds the unsliced list; one merger |
| dozens of agents | slices under coordinators; the director reads `next --as jarl` and escalations |
| many repositories | one loop, kept in whichever repository holds the plans, names the others with `new --repo <name>`, with a `Check (<name>):` line per repository |
| a human organisation | the same rows filled by people. Three known breaks: a lead named as coordinator cannot clear a colleague's work, the owner is one literal name, nothing notifies a person. None is built before a real team uses it |

**Coordinators are by need** (a-026). The trigger is reports flooding the director: it adds a slice when it holds more than it can read reports for. Both real loops ran one director and no coordinators, so the blind runs of 076 are the first to test them. A slice is a goal line `Coordinators: <names>` and a `slice:<name>` tag per issue, and the goal's `Merger: <name>` line says who raises the merger. Slices are cut by area, so that files and most After chains stay inside one slice. An After that crosses slices holds its issue until the other is done or dropped, as any After does.

**One loop per body of work.** A larger project is one loop with more slices, not more loops. Loops that exist side by side are separate bodies of work and do not order each other. Each answers for itself (section 10).

**A change across repositories** is a parent issue with one sub-issue per repository, ordered by After so that each step leaves its neighbours working, with the removal step as its own sub-issue. The parent has its own `check` line over the exact commits, run by the director once its sub-issues have landed; a parent with no code of its own closes on the director's approve. A parent is never proved by its children alone. This is built; only the guidance is new. An issue that names two repositories still works, and has two merges and one done.

**Mergers by need** (the owner, 2026-11-08). The rule is one writer per target branch, and not one merger per loop. By default one merger lands everything on the loop's feature branch. A coordinator may keep its own integration branch and its own merger, named by a goal line `Merger (<slice>): <name>`, in a worktree of its own. The jarl cuts the slices so that merging their workers brings no friction, and each integration branch lands on the feature branch through a merge and a check on the merged result, like any landing. Mergers never share a checkout. Each writes the record through the tool, under its lock, and only the holder of the main checkout commits `.jarl/`, so several mergers are not several committers there.

**Yggdrasil and Jarl.** Yggdrasil says what the parts are and which rules hold over them. Jarl says what work is happening on them. The joints: the repository's check is a `Check:` line; ratified rulings go into the graph's logs (built); a filer may use `yg owner` and `yg impact` itself and write the component's name in `Resources:`, so the lease guard keeps two workers off one component even when their files differ. Jarl does not judge architecture, enforce law, or copy law into briefs, because Yggdrasil's own instructions reach agents working in the repository.

Grain's co-change data may inform Files. Ratatoskr governs how the jarl speaks to the owner where it is installed. Urd decides when to ask; `ask` gives the question its home. Researcher runs experiments on Jarl's numbers. Jarl takes over none of these.

## 9. When something fails

| Fails | Seen by | The replacement does | Limit |
|---|---|---|---|
| a worker dies | `branches` marks the lease stale | hands over the whole lease (`set --handover`, every issue on the branch; 216). If the old agent is certainly gone, the new worker continues in the same worktree, and its brief says the tree may be dirty: keep what it can verify, discard the rest. If it may be alive, a new branch from the old tip, and uncommitted work is abandoned | a long test looks like silence; a late typed row from a replaced worker can still count, and the examiner sees it. No real case was found in 26 issues with several workers. A dead agent's spend is unknown |
| a worker goes in circles | the round limit | takes over one tier up, on another model, or with a changed approach | |
| an examiner dies | proof with no verdict past the threshold | raises another; two verdicts corrupt nothing | one review wasted |
| a merge goes red | the merger's check | section 5, Landing | |
| the merger dies | the main checkout holds a merge no `merged` line names | looks at git and the record, re-runs the check, then records it or resets to the merge's parent | a sentence in the director's reference; never infer the check from git |
| a coordinator or the jarl compacts | at its next turn | `resume --as` or `brief --slice` | it cannot tell a live worker from a dead one before the threshold |
| two clones worked apart | `verify` | `renumber`, a handover naming the lease to keep | |
| the owner is away | nothing else stands | his list waits | |
| the directing session dies | nothing inside Jarl | a host runs `resume` when `next --as jarl` holds a move and nothing has written for a set time. The skill gives the recipe | Jarl raises nobody, so without a host this stands. A real limit of mark 1 |

Every recovery starts from the record and git. A compaction is a crash. A summary is not state.

## 10. What the owner sees

`next --as owner --all` lists what is on him in a loop (built): what is reserved and waiting, each with what it holds up; the lines only he ticks, each with its material and what to check; and provisional decisions to ratify, in one batch. Each loop answers for itself: with two loops open he asks each.

`report --metrics` is the page of numbers. He is never asked to read a stream.

## 11. Measuring and retiring

**From the record:**

| Number | Answers |
|---|---|
| lines by method | how much is shown and how much is opinion |
| rounds, `changes`, reds at landing, CI red, reopens, follow-ups naming a landing | where defects were caught |
| cycle and lead time, one count per stage | where work waits |

Cost and refusals are not in the record, by the owner's choice. Cost is read by hand from the agents' token counters when it is wanted.

**What the numbers are for.** Piece 1 is read by hand against the numbers of 2026-11-08. Beyond that the owner's rule holds: cost and the truth of proof come out in use, as with all his tools (2026-11-08).

**The cold-start drill.** A fresh agent given only the record answers a fixed list of questions about its state, and a wrong answer is a defect in the record.

**How mechanisms leave.** A mechanism enters with a measured failure, strong outside evidence, or a mark the owner set, and it names what it costs. Section 12 is the register, and its home after the release is a maintainer's document no agent reads. Each release of Jarl goes through it with the numbers of section 11 and removes what paid nothing. A user's loop has no such step. Guards against rare and severe outcomes stay unless they are shown to do harm, because a rare failure cannot show up in a loop's numbers.

## 12. Every mechanism: what it is for, what it costs, what we lose

K keep, C change, R remove, against the tip.

| Mechanism | For | Cost | Without it | State |
|---|---|---|---|---|
| the record: log, issue files, lock | truth that survives any agent | a file per issue | no replacement possible | K |
| lines with methods | a requirement that says how it is proved | a mark per line; a filer's thought | "done" means one undifferentiated thing | **C**, new marks on the `[owner]` grammar; the log keeps old line text whole |
| the done gate | closing only on what each method asks for | computed | self-reported completion | **C**, per method, with an independent row on mechanical lines; a `changes` stands until a round; rows carry a line digest. `read` lines need no row, so `--without-rows` goes |
| lease | one holder for work; no two on one territory | one call | collisions | K; 216 |
| brief | an agent reads one text | the tool holds the role text | 16.8 KB briefs by hand | **C**, complete; 217 |
| `next --as` | one holder, one next move | computed | a director reasons out every move | **C**, sort; 215; carries the brief command in JSON |
| examiner | what no line names; independent word | 52% of tokens on the day measured | three serious defects that a green suite passed | **C**, per lease, depth from methods, no author's account, scenario hunt |
| the record library, `record.mjs` | the one way code reads and writes the record, used by the tool and its tests | a contract | every test re-implements the record | **C**, one contract, `jarl-record/4`, current format only, older tables gone. `--by` is required at the command line and MCP; the library takes the writer it is given |
| merger and merge queue | one writer; the merged result checked | one agent | broken main line | K; a note when `--ran` matches no declared check; no direct repairs |
| round and takeover | a failed attempt goes back, and past a limit changes | counted | endless rework | K |
| questions and rulings | decisions in one place, with who made them | a call | decisions lost at compaction | K |
| honest exit | a way out instead of a workaround | one line in the brief, one holder rule | workarounds and silence | **C**, routes to the director |
| rules with a scope | a lesson reaches who it concerns | a call | the owner repeats himself | K |
| sub-issues | a cut, and across repositories | built | no fan-out, no wave | K |
| slices and coordinators | when reports flood the director | one more holder | a director drowned at large scale | K, by need |
| tiers and `models` | cost fits the mistake | a field | model chosen by habit | K |
| `identical-output` tag | | | replaced by `compare` | **R** |
| `--without-rows` and the switch-on of the line rule | | | not needed: `read` covers it | **R** |
| the four-issue review unit, package size 2 to 10 | | | a lease is one review | **R** |
| the reviewer's re-run rule by tier | | | replaced: every mechanical row is re-run, whatever the tier | **R** |
| composer mode: external scheduler, format-keeping paths | | 78 mentions, conditional paths | nobody uses it | **R** |
| format raises and older readers: `needFormat`, `needRaisable`, `FORMAT_LINES` and what hangs on them, 103 places in 14 files of code, the frozen older reader, the tests about older readers, every "raises a loop" sentence | | a second path through nearly every write | only the current version is supported | **R** |
| the conversion file | moves a 6.2.0 loop to this format once | a page no role reads unless it converts | a loop left behind has no way forward | **new** |
| `--by` on every write, `--model` on lease and verdict | every claim says who made it | one flag | writers unknown, as in 12 edits in two real loops | **C** |
| profiles, done-gate settings, bot verdicts, waivers, `retract`, the three modes, `import` and `sources`, templates, ranges, promises and waits | what the reference describes | no role reads them unless it uses them | each was asked for by a real loop or the owner | K, on demand, in `commands.md`, `profile.md` and `record.md` |

**The open backlog** is mapped issue by issue in [the work](jarl-6-3-0-work.md).

## 13. What goes from the guidance

**The rule:** a raised agent reads its brief and nothing else. Only a director reads the skill. Everything rarely needed is in `commands.md` and the help, read on demand.

| Role | Reads today | Reads in 6.3.0 |
|---|---|---|
| worker | SKILL.md 3,523, worker.md 1,342, glossary 666: about 5,500 words | its brief: at most 700 words, plus its issue |
| examiner | SKILL.md, reviewer.md 1,589, glossary: about 5,800 | its brief: at most 500, plus its issue and diff |
| merger | SKILL.md, merger.md 2,700, glossary: about 6,900 | its brief: at most 900 |
| coordinator or jarl | SKILL.md, jarl.md 7,401, models.md 2,269, repositories.md 2,528, glossary: about 16,400 | SKILL.md at most 1,200, the director's reference at most 2,500: 3,700. A loop over several repositories adds `repositories.md` at about 1,500: 5,200. `models.md` at about 1,000 is read when a model question comes up |

A test holds each number.

**What goes, from the 088 set (19,475 words today, against a budget of 13,856):**

| From | Words today | After | How |
|---|---|---|---|
| SKILL.md | 3,523 | 1,200 | daily commands table (523, `next --as` names them); number-collision story (383 to 40); calling the tool shortened; raised agents no longer read it |
| jarl.md | 7,401 | 2,500 as the director's reference | citation grammar (600 to 60); step 2's numbers (394 to 40); research import (1,008) and templates (about 350) move to `commands.md`; area rulings (687 to 150); filing cut |
| worker.md, reviewer.md, merger.md | 5,631 | about 500 together | the text moves into the briefs, which the budget above counts; the artifact allowlist (332) goes to the help; `identical-output` (about 150) goes |
| composers.md | 2,920 | about 300 | no composer in the family |
| the shell-quoting paragraph | 5 copies, 395 | 79 | one copy |

The 088 set comes to about 4,500 words, a third of its budget. Of the 14,975 words that leave it, about 2,100 become brief text in the tool, about 1,400 move to `commands.md`, and about 11,500 are deleted or condensed: composers about 2,600, SKILL.md about 2,300, the three role references about 3,000, jarl.md about 3,500. The guidance a director reads falls by two thirds to three quarters, and a worker's by almost nine tenths.

## 14. What is left out, and why

The design is whole without each of these. None is left out for the cost of the record's shape: the record's shape is free, and every entry below was looked at again on that basis.

| Left out | Reason | What we lose |
|---|---|---|
| order between loops, a slice that becomes a loop | truth: no missed order found; loops that must order each other are one loop | a hand-kept order if someone runs two |
| reading Yggdrasil's graph from the tool | truth: the filer can do it today, and no run shows need | collisions by component depend on a filer naming it |
| leases that expire or move by themselves | quality: a false takeover duplicates long work | minutes when no one is looking |
| a generation token on leases | truth: no case in 26 issues with several workers. Its one remaining cost, a field on the row, no longer weighs | a late row from a replaced worker can count until the examiner reads it |
| records of every raised agent | truth: no real failure, about 670 lines | a replacement waits out the 30 minutes |
| sealed checks, random audits, planted faults | truth: they need volume to mean anything, and the evidence on seeding is weak | a measured view of what examiners miss |
| budget windows, a stuck monitor | truth: no evidence yet | spend is seen after the fact |
| a limit on assumptions | truth: no reversed assumption has been costly on the record | `Assumed:` notes are counted, not capped |
| the tool running proof commands | the owner's ruling | every proof row is an agent's word until the examiner re-runs it |
| one digest across loops | the owner's ruling | with two loops open he asks each |
| cost per issue and a record of refused calls | the owner's ruling | cost and wrong guesses are read by hand, from token counters and transcripts |
| verified identity | not possible across hosts | a lying agent is not stopped |
| classes of service, schedules | quality: noisy estimates, refused by `no-effort-estimates` | a finer order at very large scale |

**"What Jarl will not grow".** The five exclusions (a merge queue that refuses, a done that waits for green CI, leases that expire, a release mode that refuses, a schedule) stay out, each on its own reason above; the text no longer sends them to another tool.

## 15. Rulings this design strains, and what only the owner can decide

**`fresh-reviewer-required`, quoted whole:** "Krzysztof, 2026-09-26, answered a question with two options ((a) a fresh reviewer before every merge, as a hard rule of Jarl; (b) a default rule, with the coordinator's review enough for trifles) with "a". A fresh reviewer, an agent that did not write the code, approves every branch before it is merged. The canon keeps saying so; Jarl refuses an approve from the worker (it already did), and the coordinator's approve is not enough for a merge." The design keeps it: every branch still gets a fresh examiner. Depth varies, and one branch can now carry much more. He has marked this ruling for thought. The cheapest course keeps it and reviews fewer units.

**`release-fast-light-models-grouped-reviews`, quoted whole:** "Krzysztof, 2026-11-03 (translated from Polish), agreeing to the analysis session's proposal: "Yes, and grouped reviews too, because I want to release Jarl 6.3.0 quickly." For the rest of the 6.3.0 loop: small issues that a test decides (refusal texts, notes, small views) go to Haiku workers, neighbouring ones in packages; reviews are grouped, one fresh reviewer over up to four small issues of one area, never over a record format change, the core of the direction (052, 083, 084, 085, 086) or an issue with an owner-only line; a reviewer is never weaker than the worker (Sonnet or Opus over Haiku work) and re-runs each command a proof row names; Opus stays on format changes, the core and takeovers. The grouping limit and the split are the analysis session's proposal, not his wording." The four-issue limit goes, and every mechanical line is run again by the examiner. It binds "the rest of the 6.3.0 loop", which is this work.

**`identical-output-light-review`, quoted whole:** "Decided by the analysis session under the standing mandate (autonomy-quality), after the owner said he did not follow the question (a-007): a change meant to alter nothing, whose output is shown identical before and after, keeps its fresh review, which may be a light one that checks only that the comparison covers everything the change touched; the comparison is recorded as evidence. This keeps the rule that nothing closes without someone having looked. Replacing the review stays possible only by the owner's own waiver for named issues (004). Filed for his ratification." Its substance stays, as the `compare` method. The tag goes.

**`016-line-rule-switches-on-at-the-first-line-row`, quoted whole:** "Under autonomy-quality, on the review of issue 201 and the work of issue 016: the rule that each acceptance line needs a counted row that names it (evidence --line, the owner's choice a of a-016) switches on for the whole loop at the loop's first row that carries --line, not per issue. Chosen so that the loops and issues closed before any --line row read exactly as before (no closed issue of a loop is marked, none is refused), a loop that never uses --line is never changed, and no per-issue switch has to be remembered. The rule is written once in references/commands.md. An issue closed without a row naming a line gives its reason with --without-rows." The switch goes: the method decides what a line needs. His choice of `--line` stands. a-022 lapses.

**`conditional-trust`** is kept: where a repository has a check, the check decides what lands. A `read` line closes on an examiner's word, which is testimony, and `status` counts those lines so that this is visible. Proof rows and the merger's record of the check are typed too.

**The canon** says of Jarl that "each issue gets one worker in its own worktree". The design makes it "each piece of work".

**Every format ruling is replaced** by `only-the-current-version-is-supported`, quoted whole: "Krzysztof, 2026-11-08 (translated from Polish), on the design of Jarl 6.3.0: "We do not need backward compatibility, but the skill can have a file describing 6.2.0 -> 6.3.0, in case it is needed, so that an agent can convert for itself. We support only the current version." [...] Jarl supports only its current record format. A loop in an older format is not read as it was; a file of the skill describes the conversion from 6.2.0 to 6.3.0, and an agent converts the loop by following it." (The cut is a sentence on a tool that left.)

**`jarl-pinned-in-loop`, quoted whole:** "A release loop writes its record with one Jarl version from its start to its close, from a checkout that never switches branches during the release; the next Jarl version is checked on frozen copies of the loop, not on the loop itself. The 6.2.0 loop is written with Jarl 6.1.0." It gives way for this release: this loop moves to the new Jarl (a-028).

**Decided by the owner on 2026-11-08, and in force.** The design as narrowed, built by its own method by hand until the tool can carry it, with a return to him if the first piece comes out worse than today's numbers (a-024). Coordinators by need, the trigger being reports flooding the director (a-026). `fresh-reviewer-required` stays with no exception: one independent examiner per change of the program, its depth from the methods; relaxing it waits for a long clean run of one kind of work on the record (a-027). This loop moves to the new Jarl after the core and the moves land (a-028). Only the current version is supported. The tool runs no command, and there is no digest across loops, no cost line and no file of refused calls (`design-6-3-0-narrowed-no-run-no-digest-no-cost`, which replaces his yes on a-025).

**Still open, and his:**

- The release itself, the tag and the push, and the `[owner]` line of the release goal.
- The architecture file calls this loop "written through the driver Jarl, never by hand". A conversion by an agent following a file is that exception once, and a change of `.yggdrasil/yg-architecture.yaml` is his to confirm.
- This loop moves at the fifth piece, after the removals and the conversion file, so that it is converted once. a-028 says after the core and the moves; the wider reading is for his ratification.
- One contract for the record library, `jarl-record/4`, with the earlier versions' tables gone, follows from his ruling; the contract's own page changes with it.

## 16. What is unproven

No part of this has run. The methods on lines and depth from methods are designs resting on outside evidence and one day's numbers. Coordinators have never run in a real loop. The real loops ran strong models under one director. Word budgets are targets until a test holds them. The conversion has not been tried on a real loop. The building of this release by its own method, the moved loop, the blind runs of 076 and the three-arm comparison are the first real tests, in that order.
