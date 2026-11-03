Field report, 2026-11-03, from one long Jarl loop (distilled, no private names)

## 1. Scale

- **Tasks.** 47 filed, 43 done, 4 open (loop record).
- **Reviews.** 136 review verdicts, 74 of them asking for changes (loop record).
- **Fix rounds.** 59 rounds across 24 of 43 closed tasks (loop record).
- **First pass.** About 19 of 43 closed tasks passed it clean. This is derived from the record: 43 closed minus 24 with a round.
- **Reopened and taken over.** 2 tasks were reopened (loop record). One went to a fresh takeover worker after 3 failed rounds.
- **Codebase.** A TypeScript monorepo with a web front end, an API and about 8 shared packages (my estimate).

## 2. Single versus batched reviews

- **Two reviews covered several tasks.** One covered 4 tasks: four question types on one shared control layer. The other covered 2 tasks (loop record: shared merge SHAs). All other reviews covered one task each.
- **The batches missed screen-level problems.** A later UX review of the finished screens produced 45 findings, which became 8 follow-up tasks (loop record).
- **Every code review missed one feature that can never trigger.** A requirements audit today found suggestions gated on 3 of 5 fields in a form that has only 2 of them (found by reading code, not by running it).
- **Batching stopped when the merge policy changed.** The owner switched from one pull request per task to local merges, with the browser suite run in batches. Only 12 of 42 product-repository merges carry the full declared check (loop record). Static review stayed per task.

## 3. What reviews actually caught

Changed code (sizes are my estimates):

- **Unextractable PDF text.** A bitmap font was embedded in the PDF. The fix reordered the font list: about 5 lines, 1 file, a format fix.
- **Fields folded into table rows.** In the slide deck, fields after a table ended up inside the table rows. The fix added layout rules: about 150 lines, 3 files, new behaviour.
- **Demo film defects.** Visual reviewers of the demo films caught stray frames, a duplicated closing and a half-rendered page. These were fixed by re-cutting the film, not in code.
- **Automated pull-request bot.** The bot (a GPT-family model) gave 65 verdicts, 53 of them asking for changes (loop record). Most were wording, naming or test gaps under 20 lines each. A few were real edge cases (my estimate).

Added nothing:

- **A behaviour-preserving refactor.** It routed every look value through one layout description: about 600 lines, 10 files. All 73 rendered pages were byte-identical before and after. The review approved with minors and changed nothing.
- **Strong-tier cleanup reviews.** 5 cleanup verdicts on strong-tier tasks were approvals with nothing to fix (loop record).

## 4. Where a separate review paid off

- **It paid off for format, contract and visual changes.** That means document exports, slide layout, stored answer shapes, and anything a person sees, when the reviewer looked at real renders and not the diff.
- **It wasted time on two kinds of change.** First, refactors already pinned by byte-for-byte or snapshot comparison. Second, documentation-only or test-only changes.
- **What the data in section 3 shows.**
  - Three of the four code-changing finds were format or visual.
  - Both zero-value reviews were refactors with an exact-output check.
  - The deciding factor is the kind of change, not its size: a 5-line font fix mattered more than a 600-line refactor.

## 5. Models

- **Workers.** Sonnet 5.5 did 25 units across bug, cleanup and gap work. Opus 5.5 did 6 units, mostly strong-tier work and takeovers (loop record).
- **Reviewers.** Opus 5.5 gave 71 verdicts, Sonnet 5.5 gave 6, and the pull-request bot gave 65 (loop record).
- **Opus misses.** Opus as reviewer has 3 recorded misses in 71 verdicts (loop record).
- **No Haiku.** Haiku was never used, for three reasons:
  - The goal declares no model per tier, so nothing pointed light work at it.
  - Only 3 units were light tier (loop record).
  - Habit put Sonnet on work and Opus on review.
  - Distrust played a part too. Most tasks touched shared contracts across packages, where a weak first pass costs a full extra round.
- **No comparison with Sonnet.** With no Haiku runs, there is nothing to compare.

## 6. Where Jarl slowed work

**Slowdowns without value:**

- **Defaults on new tasks.** Every new task defaulted to kind "bug" and tier "standard". The coordinator had to correct them by hand.
- **Command syntax.** Merge records required an explicit SHA. Some commands failed on syntax before working.
- **Bot verdicts.** Relayed bot verdicts were counted as reviews and inflated the review numbers.
- **Batch gates.** When the gate moved to batches, the record could not say "this batch gate covered merges X to Y". Merges therefore look unchecked.

**Slowdowns worth their cost:**

- **Fresh reviewer per task, and the takeover after 3 rounds.** The takeover ended one task's loop of near-misses in one pass.
- **Rulings with ids.** They made a full requirements audit possible in one sitting: every deviation from a ticket pointed to a decision.
- **Resume after context compaction.** It restored the loop state exactly, several times.

## 7. Rules I would build in

- **Batching reviews.** Batch tasks into one review only when they share one contract or one screen. Never batch more than 4. Skip a separate review for a refactor that carries an exact-output check, and record that check as the evidence.
- **Choosing models.** Pick the worker model by tier, declared in the goal, and prompt for those lines when the loop starts. The reviewer must be one rank above the worker for format, contract or visual work. It may be the same rank for light work.

---

# Opinion on Jarl, for the backlog

These come from one 5-day loop: 47 tasks, two workers, one coordinator, many fresh reviewers. Each item is something I hit, and what would have helped.

## Worth keeping

- **Resume.** After several context compactions, resume gave me the loop exactly: rulings, in-flight work, the merge queue, the last log lines. I never had to trust my own summary.
- **Rulings with ids.** Today I audited about 30 tickets against the code. Every deviation pointed to a ruling id. Without that, the audit would have been guesswork.
- **Fresh review as a rule.** No task was closed by its own worker or by the coordinator. It kept me honest when I wanted to merge fast.
- **Takeover after 3 rounds.** One task bounced three times. A fresh worker finished it in one pass.

## Should change

1. **Task kind and tier defaults.**
   - `new` silently records kind "bug" and tier "standard".
   - I filed a demo film as a bug.
   - Ask for the kind, or infer it from the title, and say plainly that it was defaulted.
2. **Model names are not normalised.**
   - The same model appears as `claude-sonnet-5-5` and `claude-sonnet-5.5`, and the same for Opus.
   - That splits every statistic in `models`.
   - Normalise the names on write.
3. **Owner sign-off is not a state.**
   - I set a task to done after merging it.
   - Its acceptance required the owner to approve the images, so I had to reopen it.
   - Acceptance lines that only the owner can tick would let `set done` refuse while one is open.
4. **Batch gates cannot be recorded.**
   - After the switch to local merges with batched end-to-end runs, a green batch could not cover the merges before it.
   - Result: "12 of 42 merges carry the declared check", which understates the truth.
   - Something like `evidence --covers <sha-range>` would fix it.
5. **Batched reviews are not modelled.**
   - Four tasks shared one review and one merge SHA.
   - The record shows four separate reviews, so the batch cannot be analysed.
6. **Relayed bot verdicts mix with real reviews.**
   - 65 of 136 verdicts came from a pull-request bot.
   - They should be a separate class in `models` and `report`.
7. **Worker liveness is invisible.**
   - Twice a worker sat stuck while "in flight": once on a permission prompt nobody could answer, once idle while holding a shared lock.
   - Jarl only knew the task was in flight.
   - Showing the age of the worker's last evidence or commit, with a warning past a threshold, would have saved me hours.
8. **Rulings are not checked against the code.**
   - Two rulings were never implemented: placeholder logos, and read-only old briefs.
   - Nobody noticed until today's audit.
   - A ruling could name the task that implements it, and `check` could flag rulings with no linked, merged task.
9. **External requirements are not tracked.**
   - The tickets live outside the loop.
   - I built a requirements checklist by hand today.
   - Jarl could hold source requirement items, each linked to the task and evidence that covers it. A changed ticket would then show which items to re-check.
10. **Model tiers are not asked for at init.**
    - The goal had no model-per-tier lines, so `models` could rank nothing.
    - `init` should ask for them.

## Smaller

- **Commands.** `merged` requires `--sha` and fails without saying so up front. There is no way to change a task's priority by a field name I would guess (`field prio`).
- **Language.** Report output mixes the goal's language with English headings. One language per loop would read better.

---

# Backlog items

These come from the same loop. Each has a title, what happened and what was expected.

## Bugs

1. **One model is recorded under two names.**
   - Happened: the same model is stored as `claude-sonnet-5-5` and `claude-sonnet-5.5`, and the same for Opus. `models` treats them as four models, and every share is split.
   - Expected: model names are normalised on write, and old records are folded together on read.
2. **`new` records a kind and a tier nobody chose.**
   - Happened: a task titled "Film of the whole epic for the tester and the PO" was filed as kind "bug", tier "standard". The note says tier was defaulted, but says nothing about kind.
   - Expected: the kind is asked for or inferred, and the output says when either value was defaulted.
3. **`merged` without `--sha` fails late.**
   - Happened: the command was refused, and the rest of the line had to be typed again with the SHA.
   - Expected: the usage line says `--sha` is required, or the head of the task's branch is offered as the default.
4. **There is no field name for priority.**
   - Happened: `field <id> prio` fails, and the right name has to be looked up in help.
   - Expected: a `prio` alias, or the error lists the valid field names.
5. **Bot verdicts are counted as fresh reviews.**
   - Happened: 65 of 136 verdicts were relayed from a pull-request bot. `report` counts them in "fresh reviewers", and `models` ranks the bot as a reviewer.
   - Expected: relayed verdicts are a separate class, and they are left out of fresh-review counts.
6. **Merges look unchecked after a batch gate.**
   - Happened: one green full gate on the integration head covered several merges, but "12 of 42 merges carry the declared check" counts only per-merge evidence.
   - Expected: a check recorded on a later commit counts for the merges it contains.
7. **Report output mixes languages.**
   - Happened: `report` and `resume` print the goal's language next to English headings and English log lines.
   - Expected: one language per loop, set at `init`.

## Improvements

1. **Acceptance lines only the owner can tick.** `set done` refuses while such a line is open. That prevents closing a task that waits for the owner's sign-off.
2. **Evidence for a range of merges.** `evidence --covers <from>..<to>` records one batch gate for every merge in the range.
3. **A batch review as a record.** One verdict links to several tasks and one merge SHA, so `report` can show batch size and what came out after.
4. **Worker liveness.** `status` shows the age of each in-flight worker's last evidence or commit, and warns past a set threshold. This catches a worker stuck on a permission prompt or idle while holding a shared lock.
5. **Rulings linked to the tasks that implement them.** A ruling can name its task, and `check` flags rulings with no merged task behind them.
6. **Source requirements in the loop.** Items from external tickets, each linked to the task and evidence that cover it. When a source changes, the loop lists the items to re-check, and `report` can print the requirements checklist.
7. **Model tiers asked for at `init`.** Prompt for the "Model (<tier>)" lines. Without them, `models` can rank nothing.
8. **A skip-review rule for exact-output refactors.** A task that carries a byte-for-byte or snapshot comparison can record that comparison as its review evidence, and the record says so.
9. **A batching rule in the guidance.** Batch tasks into one review only when they share one contract or one screen. At most 4 tasks per review.
10. **A reviewer rank rule.** The reviewer is one rank above the worker for format, contract or visual work, and may be the same rank for light work. `models` warns when this is broken.

---

# What would make Jarl a perfect experience for an agent coordinator

Written by the coordinating agent of this loop. It ran for 5 days, with 47 tasks, two long-running workers, about 30 fresh reviewers, several context compactions and one process change midway. Everything below comes from friction I actually hit. Where I guess, I say so.

The short version: today Jarl is an excellent memory and a weak guide. It records what happened very well. It rarely tells me what to do next. It almost never stops me from doing something I will regret. The best experience would flip that balance.

## 1. Tell me what to do next

`resume` gives me everything, and then I have to work out the next step myself. After a compaction this is the hardest moment: I have a summary I must not trust and about 200 lines of state.

What I want at the bottom of `resume` and `status`: a short, ordered list of next actions, each with the exact command or step.

- "Worker on task 22 has left no evidence and no commit for 47 min. Check its thread."
- "Task 40 is merged, but acceptance line 3 needs the owner. It stays open; ask the owner."
- "3 merges since the last full gate: run the gate on the integration head, then `evidence --covers a..b`."
- "Ruling `placeholder-logos` has no linked task. File one, or link it."
- "Task 30 waits on 40, which waits on the owner. Nothing to do here."
- "Merge queue is empty and no worker is free: nothing to start."

Order the list by what blocks the most work. Show at most 7 items, plus a count of the rest. This one feature would have saved me more time than anything else on this page.

## 2. Say what you did for me

Every value I did not give should be printed as defaulted, on its own line:

```
filed 47 · kind: bug (defaulted, give --kind) · tier: standard (defaulted, give --tier)
```

Today the tier default is explained at length, but the kind default is silent. I filed a film as a bug and only saw it in `models` days later. Defaults also skew every statistic built on them, so a silent default is a data bug, not only a UX one.

## 3. Errors that carry the fix

Each refusal should contain the corrected command, ready to copy:

- `field 12 prio 1` → "No field 'prio'. Did you mean `priority`? Valid fields: … Example: `jarl field 12 priority 1`."
- `merged 40` → "`merged` needs `--sha`. The head of task 40's branch is 7c4baedc. Run `jarl merged 40 --sha 7c4baedc`, or pass `--sha HEAD`."
- `review 40 approve` without `--by` → name the flag and show one line of example.

An agent pays for every wrong guess with a full round trip: read the help, re-type, re-run. With good errors that becomes zero round trips.

## 4. Guards on the irreversible steps

Closing, merging and dropping are the steps I regret. Jarl should check before it accepts them:

- `set done`:
  - refuse while an acceptance line is marked owner-only and unticked;
  - refuse while a review asks for changes with no later approve;
  - refuse while no evidence row exists after the last commit.
- `merged`:
  - warn if the SHA is not on the integration branch;
  - warn if the approved review is older than the last commit on the task branch.
- `review approve`:
  - warn if the reviewer name matches the worker of that task;
  - warn if the reviewer is the coordinator.

`report` today counts "orchestrator 3" among fresh reviewers. The guard and the count should agree on what fresh means.

In this loop I set task 40 to done right after merging it. Its acceptance needed the owner's sign-off on images, so I reopened it by hand. A guard would have caught that in one line.

## 5. Know whether workers are alive

The single biggest waste of time in this loop was not Jarl. It was workers that stopped while the record said "in flight":

- one sat for hours on a permission prompt nobody could answer;
- one ended its turn while waiting for a shared container;
- one held a shared lock while idle, which blocked the other worker.

Jarl cannot see threads, but it can see its own record. For each in-flight task, show:

- the age of the last evidence row;
- the age of the last commit on the task branch;
- the age of the last log line.

Past a threshold set in `goal.md` (say 30 minutes), show a warning in `status` and in the next-actions list. Better still, give a hook: a command Jarl runs to ask the host for the thread's run state, configured per loop.

## 6. Shared resources as first-class

Workers shared one dev container through a lock file. Jarl did not know the container existed. Allow declared resources:

```
Resource: devcontainer · lock ~/path/to/lock
```

Then `status` can say: "devcontainer held by task 40 for 22 min, last evidence 21 min ago: probably idle." `claim` could take the resource and `evidence` could release it. Half of my watchdog checks were exactly this question, asked by hand every 15 minutes.

## 7. Record the process as it really is

Midway, the owner changed the process:

- from: one pull request per task, with the full gate per task;
- to: local merges into one integration branch, with the browser suite run in batches.

Jarl kept counting the old way. Its report now says that 12 of 42 merges carry the declared check. That reads as negligence, but every merge was in fact covered by a later batch gate.

What I want:

- **A process ruling that changes the counting.** For example, "from now on, a check on a later integration commit covers the merges it contains."
- **`evidence --covers <from>..<to>`.** It records one batch gate for a range of merges.
- **Report lines that tell the two cases apart:** "covered by a batch gate (n)" and "never covered (n)".

## 8. Batch reviews as a record

Four tasks shared one review and one merge. The record shows them as four separate reviews with the same SHA. So no question about batching can be answered from the data, not even the one this research asks.

Allow one verdict linked to several tasks. `report` can then show:

- batch sizes;
- rounds per batch;
- what surfaced later in the batched tasks.

## 9. Write reviewer and takeover briefs for me

I hand-wrote about 30 reviewer briefs and 2 takeover briefs. Each one was a chance to forget something, such as a ruling, an acceptance line, or the "no rm on a glob" rule.

`jarl brief <id> --role reviewer|worker|takeover` could assemble each brief from the record:

- **Reviewer:**
  - title, why and acceptance;
  - the diff range;
  - the rulings tagged to the task's area;
  - the findings of earlier rounds, so a fresh reviewer checks that they were fixed;
  - the evidence rows;
  - the exact `review` command to run at the end.
- **Takeover:**
  - all of the above;
  - a short "what failed in each round";
  - the files touched.
- **Worker:**
  - the standing rules of the loop: no push, the lock, foreground commands, commit rules.

A stated wish of mine: each standing rule written once in `goal.md` and injected into every brief. Today I repeated the same 8 rules in every message to every worker.

## 10. Visual review as its own kind

Most valuable finds in this loop were visual: renders of documents and frames of films. They live awkwardly in a text-review record.

A review kind `visual` would help, with:

- `--artifact <path>` on evidence and on review, to name which render or which film cut was judged;
- a verdict per artifact;
- in `report`, a separate count of visual reviews and what they caught.

The owner made a standing rule that every render gets an independent visual reviewer. Jarl had no way to enforce it. With a kind, it could refuse `merged` on a task tagged `renders` that has no visual verdict after its last commit.

## 11. Requirements from outside, linked to the work

The work came from about 30 external tickets. Today I built the requirements checklist by hand, with three analyst agents and about an hour of work.

What Jarl could hold instead:

- **Source items.** One per requirement or acceptance line, each with its origin (ticket id, comment id).
- **Links.** Each item linked to the task that covers it, the evidence and the ruling that changed it.
- **`jarl sources check`.** Lists the items with no covering task, the items whose task is not merged, and the items changed by a ruling without owner approval.
- **`jarl sources diff`.** After a re-import, shows which items changed upstream and which tasks to re-check.

This would turn "did we build what was asked?" into one command, and keep the answer true as the tickets move.

## 12. Rulings that are checked, readable and scoped

- **Ruling text in `resume`.** Answered questions show the question, not the decision. `ask-4`, `ask-5` and `ask-6` appear as "**Question:** …" in the list of rulings in force. To learn what was decided I have to open each one. Show the answer.
- **Truncation.** Each ruling is cut mid-sentence at about 160 characters. Print a one-line decision written for that purpose, then the id.
- **Number.** 47 rulings print every time. Show the 5–10 that touch tasks in flight or open, then "and 37 more: `jarl decisions`".
- **Implementation.** A ruling that requires work should name the task. `check` flags rulings with no merged task behind them. Two rulings in this loop were never implemented, and nobody noticed for days.
- **Authority.** Some rulings were made by the coordinator under a mandate from the owner. The mandate is itself a ruling. Let a ruling cite its mandate, and let `check` warn when a coordinator ruling falls outside every mandate.

## 13. A "since" view for watchdogs

I ran a 15-minute watchdog outside Jarl. Each tick I re-read everything to find what had changed.

`jarl since 15m`, or `since <timestamp>`, would print only:

- new log lines;
- state changes;
- new evidence;
- new verdicts.

It would end with the next-actions list. A watchdog tick would then cost 20 lines, not 200.

## 14. Output sized for agents

- **`models` prints about 40 KB.** I needed 10 lines. Give a summary first (per model: units, clean share, rounds) and the full breakdown behind `--full`.
- **`--json` on every read command.** Then an agent can filter instead of reading everything.
- **Clean output.** The loop's repository runs its own architecture check on every commit, and that output lands in my context each time. Jarl's own commit and push could run it quietly and print one line.

## 15. One language, set once

The goal is in the owner's language. Headings, log lines and notes are in English, and task titles are a mix. Reviewers then read a Polish title over an English acceptance. Set the language at `init`. Use it for every printed line, and warn when a new title is in a different one.

## 16. Model tiers asked at the start

The goal had no "Model (<tier>)" lines, so `models` could not rank, place or advise anything. `init` should ask for them, offer a sane default (light: small model, standard: middle, strong: largest), and let me say "I don't know yet". Then `models` can say "Haiku was never tried on light work: 3 candidates".

## 17. Model names normalised

`claude-sonnet-5-5` and `claude-sonnet-5.5` are one model. Normalise them on write, keep an alias table, and fold old records on read.

## 18. Ranking the most valuable changes

1. Next-actions list in `resume` and `status` (section 1).
2. Guards on `set done` and `merged` (section 4).
3. Worker liveness from record ages (section 5).
4. Generated briefs for reviewer, worker and takeover (section 9).
5. Batch evidence and batch reviews (sections 7 and 8).

---

# Things I have not said yet, for the maintainer

These did not fit the questions above. I want them on the record anyway.

1. **The record kept me honest more than once.**
   - Twice I was about to tell the owner something was finished when the record said otherwise.
   - That is the core value of Jarl. Every feature should protect it.
   - When a new feature trades honesty of the record for speed, I would not build it.
2. **The three-round takeover is the best rule in Jarl.**
   - One task bounced between a worker and reviewers for three rounds, each fixing a near-miss and creating another.
   - A fresh worker with all findings in hand finished it in one pass.
   - My guess is that the round limit could be 2 for format and visual work, where each round is costly to verify.
3. **Rounds are not equal.**
   - A round triggered by one minor wording note counts the same as a round triggered by a broken export.
   - Weight rounds by the most severe finding, or at least record that severity. Without it, "rounds per task" mixes noise with signal.
4. **The coordinator's own mistakes are invisible.**
   - Closing too early, merging without the gate, giving a worker an instruction that blocks it: none of this is a statistic.
   - A small coordinator slips section in `report`, built from reopens, reverted states and refused commands, would show where the coordinator, not the workers, needs better rules.
5. **Blocked-on-owner should propagate.**
   - Task 30 waits on 40, and 40 waits on the owner. Today 30 shows only "waiting (after 40)".
   - Show the root cause: "waiting on the owner, via 40". Owners act on what they can see.
6. **Questions to the owner should batch.**
   - The owner reads in bursts.
   - A `jarl ask --digest` that prints every open question, decision waiting and sign-off in one plain message would match how owners actually work.
   - The coordinator would paste it once instead of asking five times.
7. **Two entry points, CLI and MCP tools, can drift.**
   - I used both in this loop: the CLI by habit, the MCP tools after compaction because the host told me to.
   - If they ever disagree on flags or output, an agent will not notice.
   - One version string printed by both, and a warning when they differ, would be enough.
8. **Evidence should name its artifacts.**
   - Half the evidence in this loop was films and renders.
   - The evidence row says "rendered 73 pages", but not where they are or whether they still exist. The machine empties scratch folders after 7 days.
   - An `--artifact` flag with a path, plus a check that warns when an artifact is gone, would keep the evidence verifiable.
9. **Metrics show their n, and that is right.**
   - Every share in `models` comes with its count and is hidden below 5.
   - Keep that discipline everywhere, even when it makes output longer. It is the reason I trusted the numbers enough to quote them in this report.
10. **What I would not add.**
    - Automatic merging.
    - Automatic closing.
    - Any step that lets the record say "done" without a person or a fresh reviewer having looked.
    - Every slip I made in this loop would have become worse with more automation and better with more guarding.

---

# Design issue: one register for everything that is in force or waiting on someone

## The problem

The owner keeps work in a workspace repository as topics. Each topic is one Jarl loop. Beside the loop, the topic holds loose files: a state note, design notes, a spec. The workspace mechanism is separate from Jarl, and that separation is fine. But in practice, a lot of what belongs in the loop ended up in those loose files or in the agent's memory:

- **Standing orders.** The owner said "do not open pull requests, work only locally" and "every render gets an independent visual reviewer" in chat. They lived in the context summary and were repeated by hand in every message to every worker.
- **Things waiting on the owner.** These were sign-off of renders, whether to make a third film, when to push the integration branch, a font licence, and a change on the machine's setup. All five sat in the state note. Jarl's "Questions to the owner" said 0.
- **Things waiting on outside people.** Answers from the product owner in ticket comments and data exports promised by colleagues lived in a spec chapter that nobody refreshed.
- **Promises by the agent.** Examples: "I will tell you when the film is ready" and "a reviewer will watch it before you do". They lived only in chat.
- **Working conventions of the coordinator.** "Reviewers run in the background on the largest model" was never written down. A context compaction dropped it silently, and for the next 5 hours reviewers ran in the foreground and blocked the coordinator for about 80 minutes (transcript analysis).
- **Guesses.** The agent wrote "most likely the setup script reverted the reviewer setting". The next context summary stated it as fact. It was never checked.

Every item above sometimes rests on the owner, sometimes on the agent, and sometimes simply holds. Today there is no single place that says which. The agent has to remember, and after a compaction remembering means trusting a summary.

The goal is for Jarl to hold all of this mechanically, so fewer things are written loosely in files that in the end have to be "in the loop" anyway.

## Scope: two levels, both inside the loop

- **Loop level.** It binds the whole loop, every worker, every reviewer and every session that drives this loop, until revoked. Example: "no pull requests, local merges only".
- **Issue level.** It binds one issue. Examples: "this document moves to the new template" on issue 40, and "owner signs off the renders" on issue 40.

Machine-wide rules stay outside Jarl, in the machine's own instructions, which are changed through the machine setup repository.

## One entry shape

Every entry, at either level, has the same fields.

1. **Scope:** the loop, or issue N.
2. **Kind:**
   - **rule:** in force; nobody has to act, everybody has to obey;
   - **decision:** settled, with its reason;
   - **question:** someone must choose or answer;
   - **sign-off:** someone must look at something (a path, a film, a render) and confirm;
   - **action:** someone must do something outside the loop, such as change the machine setup, sign in or set a secret;
   - **promise:** the agent committed to do or report something;
   - **external wait:** an answer or data from a named person outside the loop, with where it will appear.
3. **Ball:** who must move next.
   - the owner;
   - the agent (coordinator or a named worker);
   - an outside person, named;
   - nobody, for an entry that is simply in force.

   This field is the core of the design. It answers "who is this waiting on?" for every entry.
4. **State:** open, answered, in force, revoked, expired. An answered question turns into a decision or a rule in force automatically, with an id, a date, the owner's own words and who recorded it.
5. **Validity:**
   - until revoked;
   - until a date ("until the demo on day X");
   - until an event ("until the integration branch is merged", "until issue 40 closes").
6. **Blocks:** the issues this entry holds up. Status can then say "30 waits on the owner, through the sign-off on 40", and not just "after 40".
7. **Certainty, for statements of fact:** checked, or a guess. A guess has the ball with the agent ("verify") and cannot become a decision until it is checked.

## How entries are created

- **Rules from chat.** When the owner says something that reads like a rule, the agent records it at once and confirms it in one line: "Recorded as loop rule R-12: no pull requests, until revoked." The owner can correct or revoke it in one word.
- **Questions to the owner.** They are created in the register first; a dialog in the chat is only a view of them. In this loop, two dialog questions were cancelled by an incoming worker ping. One of them, "may I push the integration branch?", was then asked twice more. A question that lives in the register survives that.
- **Promises.** The agent records a promise when it makes one, and closes it when it keeps it.
- **External waits.** Each one names who, what, since when, and how to check. The agent checks them on a tick, not from memory.

## How the owner uses it

- **"What is waiting on me?"** Any agent answers in one message: every entry with the ball on the owner, from the loop and all issues, most urgent first, each with what it blocks.
- **"What is in force?"** The loop rules in force, one sentence each.
- **"What did you promise?"** The agent's open promises.

## How the agent uses it

- **`resume` and `status`.** Three short blocks:
  - on the owner;
  - on the agent;
  - rules in force.

  Each entry is one full sentence, not a line cut at 160 characters.
- **Briefs.** Every worker, reviewer and takeover brief gets the loop rules in force injected. A rule written once reaches everyone. In this loop the same 8 rules were retyped into about 90 messages.
- **Guards.**
  - Closing an issue is refused while it has an open entry with the ball on the owner. That would have stopped the early close of issue 40.
  - Merging is refused while a loop rule says "local only" and the target is a remote branch.
- **Conventions survive compaction.** The coordinator's own working conventions (reviewers in the background, which model reviews) are loop rules too. After a compaction they come back with `resume`, not from a summary.

## Promotion out of the loop

Some loop rules turn out to be the owner's permanent practice, not this loop's. "Every render gets an independent visual reviewer" is one of them. Promotion is an entry like any other: an action, ball on the owner. It says "move rule R-7 into the machine's instructions through the setup repository". Once that is done, the loop rule is marked as superseded and points to where it now lives.

## What the transcript of this loop shows this would have fixed

These come from a read-only analysis of the full session transcript, about 5,800 records over 25 hours.

- **Open items lost in compactions.** Three items waiting on the owner were dropped by the compactions:
  - the wording of the "no activation plan" message, asked 7 times and never answered;
  - an advisory architecture warning;
  - the owner's veto on a disclaimer line the agent applied by default.
- **A working convention lost in a compaction.** The convention was "reviewers run in the background on the largest model". Losing it cost about 80 minutes of coordinator time blocked.
- **The same question asked three times.** Dialog questions were cancelled by worker pings. The owner answered the push question only on its third asking, with "do not push, I will look later".
- **The owner asked for status 6 times in 7 hours.** The agent's frequent status messages did not answer "what is left and what is on me". A "waiting on me" view would.
- **A guess recorded as a fact.** A guess about what reverted a setting became a fact in the next summary.
- **A regression reported as an open question.** The agent presented a regression as an open question to the owner: "where should the logo go?" The owner replied, in effect, "I don't see the logo at all". An entry has to say whether it is a choice or a defect.
- **Language rule broken, then kept.** About 72 of 107 coordinator messages before the first compaction were English, despite the owner's rule "answer in Polish, one message". After the compaction, 37 of 39 were Polish, because the summary stated the rule plainly. A loop rule in force would have held from the start.

## Other transcript findings worth the maintainer's attention

- **Stalls.** Workers or the shared container stalled for about 4 hours in total, in more than a dozen stalls of 10–40 minutes each:
  - turns ended while waiting for the container;
  - a lock was held while idle;
  - two container rebinds killed the other worker's gate (exit 137);
  - an inner gate lock went stale;
  - a permission prompt nobody could answer.

  A 15-minute watchdog found them 9–24 minutes late.
- **Real defects caught by fresh reviewers.** A year printed with a thousands separator ("2,030"). A test user's name in renders. A one-frame debugger tooltip in a film. A brand name mispronounced by the speech engine, caught by transcribing the voice samples.
- **The three-round takeover** was used 4 times, and each takeover finished its task.
- **Two coordinator slips** were caught by others:
  - a 124 MB core dump was committed by a worker and caught by the round-2 reviewer; history was rewritten;
  - merge conflict markers were committed by the coordinator, because a `grep -v` filter on the merge output hid the conflict status; a helper agent caught it.
