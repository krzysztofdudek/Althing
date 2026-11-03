# Jarl as a tool for running the work loop of one or many agents: the model

Draft 2, 2026-11-03. Proposed, not built, unless a line says **built** (then it cites Jarl at JarlSkill a1132a8 or release/6.2.1 71ebc5b). The model is what ruling `loop-tool-one-model-five-scenarios` of the 6.3.0 loop asked for: one model before any critic sees it, and five end-to-end scenarios as the acceptance of 6.3.0 (issue 076). It owes three independent Opus critiques and a revision that answers them. The reasoning that led here (thought experiments, measurements, the sceptics' verdicts, the owner's input) is under Background.

## The model on one page

A **loop** is one record of work for one area: a release, a repository, a topic. The record is the only memory; what is not in it does not exist after a compaction.

Work in a loop moves between **levels**: the **owner** (a person), the **jarl** (one strong agent that talks with the owner and shapes the backlog), **coordinators** (medium agents, each running one **slice** of the backlog), and **workers** and **reviewers** (raised per unit of work, on whatever model the task needs). An outside person can hold work too.

Every open thing in the loop has exactly one **holder of the ball** and one **next move**. Jarl derives both from the record and answers one question for anyone who asks: **what is on me now**, as a short ordered list, each line with the command that moves it.

Every level follows one rule: **work until nothing is on you, then return one line naming what you wait on.** A worker returns when its unit is proven or blocked; a coordinator when no move in its slice is its own; the jarl talks with the owner when the owner holds the ball or speaks. Nobody reads another level's chat to learn the state: they read the record.

**Going up** is an entry, not a message: a worker's finding is filed in the record, a coordinator's escalation is a question with the ball on the jarl, a jarl's question is a question with the ball on the owner. **Coming down** is a brief Jarl assembles from the record: the role's contract, the loop's standing rules, the rulings that touch the work, the issue, earlier findings, and the exact command to record the result.

Jarl **records, derives, displays and refuses at the level of the record**. It never raises an agent, wakes one, merges, closes or expires anything. The host raises agents; the agents act; Jarl keeps them honest and tells each one its next move.

## 1. The loop, and finding it

- **Built:** a loop is `.jarl/` with the goal, issues, an append-only log, rulings, questions and an optional profile; `resume` rebuilds the whole state live from it.
- **Built:** every tool call reaches a loop through `root`, else `JARL_ROOT`, else the loop at the root of the session's project, never one in a subdirectory.
- **Proposed:** Jarl lists the loops it can see under a project (any directory holding `.jarl/`), and a call that names none, in a project with no loop at its root or with several, is refused with that list. The skill routes (which loop serves which area); the tool never guesses.

## 2. The levels and their contracts

| Level | Model (the loop's lines) | Starts from | May write | Returns or goes up when |
|---|---|---|---|---|
| owner | a person | the digest: everything with the ball on the owner | answers, rulings, sign-offs | (never raised) |
| jarl | strong | `resume` as jarl: escalations, slices' health, what is on the owner | the goal, issues and their order, slices, rulings, questions to the owner | the owner holds the ball, or the owner speaks |
| coordinator | medium | its slice's brief: standing rules, its slice, what is on it | leases, verdicts it relays, merges via its merger, issues it finds (into its slice), questions to the jarl | nothing in its slice is its own move |
| worker | per task (tier) | the unit's brief | evidence, notes, findings as notes | the unit is proven, or blocked with the reason recorded |
| reviewer | fresh, never below the worker | the review brief | one verdict | after the verdict |

- **Built:** workers, reviewers, a merger and one reeve (a long-lived coordinator on the standard tier reporting to the jarl on four occasions) exist as roles in the guidance; `Coordinators:` in the goal names who counts as a coordinator; a self-approve is refused; a coordinator's approve is not fresh.
- **Proposed:** the jarl and every coordinator are named in the record (the goal's lines), each coordinator with its slice; a write names who made it (`--as`, or the session's configured name), so the record knows which level and which coordinator moved what.
- **Proposed:** a level writes only what its row allows; a write outside it is a note on stderr, never a refusal, until the owner rules otherwise (the record keeps it honest; it does not police).

## 3. The ball

Who holds each open thing, derived from the record (proposed unless noted):

| Open thing | Holder | Next move |
|---|---|---|
| ready issue with no slice | jarl | assign a slice, or lease it |
| ready issue in a slice | that coordinator | lease and raise a worker |
| lease (in progress) | its worker | prove it; past the loop's threshold with no row, log line or commit: its coordinator, "check the worker" |
| branch with proof and no verdict since | its coordinator | raise a reviewer |
| review raised, no verdict yet | that reviewer (new: a review lease) | give the verdict; past the threshold: its coordinator |
| changes verdict | the worker (a round) | fix; after three rounds: the coordinator, a takeover (built) |
| approve, not merged | the coordinator's merger | merge and record it |
| merged, an acceptance line only the owner may tick | owner | sign off |
| question to the jarl | jarl | answer |
| question to the owner (built: `ask`) | owner | answer |
| ratify item (built) | owner | yes or reject; blocks nothing |
| issue waiting on After (built) | whoever holds its blocker, shown as "waits on X via N" | none of its own |
| ruling whose Settles issues are not done (built: Settles) | the jarl | file or link the work |
| promise (new kind) | the agent that made it | keep it, or close it with the reason |
| external wait (new kind) | the named outside person | the agent checks it at the time it names |
| rule in force (built: rulings; standing brief, issue 020) | nobody | obey it |

- **Proposed views:** `next --as <holder>` (what is on me, at most seven lines, most blocking first, each with its command, then a count of the rest); the owner's digest (one message); the jarl's view (escalations and each slice's counts, stuck units and empty slices). `status` and `resume` end with the asker's list.
- **Proposed liveness:** the age of the holder's last move (row, log line, commit) against a threshold in minutes set in the goal. **Built:** `status --stale-hours` takes a fraction, but reads commits only, and `resume` always uses six hours.
- **Proposed honesty:** a note may be marked unchecked; an unchecked statement holds the ball on its author until it is checked and cannot be cited by a ruling.

## 4. Slices

- A slice is a label on an issue naming the coordinator that runs it, one per issue; an issue with none is the jarl's. The owner's own suggestion is a tag; the model keeps the label to one value per issue, because an issue in two slices would be worked twice.
- A coordinator's `next`, `status` and `resume` cover its slice; the jarl's cover everything. **Built:** `list --tag` filters; `next`, `status` and `resume` take no filter.
- Issues a coordinator files land in its slice; the jarl may move them.
- Two slices never collide on code. **Built:** `next` never offers an issue whose files or resources an in-progress issue holds, anywhere in the loop. A unit waiting on another slice's files shows "held by slice B, issue N"; if it waits past the threshold it becomes the jarl's.
- A slice is handed back when it is empty or its coordinator is retired; the jarl reassigns it. A fresh coordinator takes a slice with one brief and loses nothing (scenario 2).

## 5. Going up, coming down

- **Up from a worker:** findings are notes or new issues in the record, never only a chat report; the worker ends with one line.
- **Up from a coordinator** (proposed: `ask --to jarl`): only (a) a gap or finding outside its slice's goal, (b) a decision that is the jarl's or the owner's, (c) its slice is empty or blocked by another slice, (d) a takeover that failed too. Counts are never pushed: the jarl reads them when it wants. This replaces the reeve's four occasions, of which "the counts every few merges" was a push.
- **Up from the jarl:** `ask` as built, kinds included; the owner reads the digest.
- **Down:** the jarl assigns slices and rules; a coordinator raises workers and reviewers with briefs.

## 6. Briefs

- **Proposed:** `brief --role <jarl|coordinator|worker|reviewer|takeover|merger> [<id>|--slice <s>]` assembles, at the moment it is asked, the role's contract, the loop's standing rules (020), the rulings that touch the work, the issue as `show` prints it, the findings of earlier rounds, the proof rows, the model line for the role, and the exact command that records the result. A brief is never stored, so it is never stale.
- **Built:** `show` already prints the record half of a brief, and the third `round` prints a takeover block. **Built in Althing, outside Jarl:** `ws brief <role> --issue <id>` renders brief templates per release, because the family's own loops needed this and Jarl did not have it. Loop-level templates (`.jarl/briefs/`) would let any loop do the same.
- The guidance an agent must read shrinks to its brief and its row of the table in section 2; the references stay for whoever wants depth.

## 7. Models

- The goal names a model per level and per tier: `Model (jarl)`, `Model (coordinator)`, `Model (light|standard|strong)` for workers; the reviewer rule stays (fresh, never below the worker). Chosen by judgment, as the owner ruled (a-001); `init` asks for the lines and accepts "not yet". **Built:** tier lines and `models`; names are stored as given, so one model under two spellings splits counts (issue 038).
- **Built:** the profile can bar models or name a ceiling only once issue 006 lands; 006 stays, read per level.

## 8. Many sessions and machines

- **Built:** a write lock serialises every writer in one checkout; across clones only git's merge stands between them, and two clones can give two issues one number (issue 031).
- **Proposed ids:** each named driver (a jarl or coordinator session on a given machine) files from its own reserved block of numbers, recorded once in the committed goal; issue 022 (reserved numbers for a series) becomes that mechanism. Readable numbers stay; two drivers never take the same one; a reservation made twice in two clones is caught by the detection 031 adds.
- **Proposed:** a lease taken in two clones shows after the merge as a conflict with the ball on the jarl.

## 9. What Jarl stays, and the line with Horde

- Jarl stays on its line (composers.md, "What Jarl will not grow"): it records, derives, displays and refuses at the level of the record. Everything above is a derivation, a view, a refusal or a note. Raising and waking agents is the host's, and the protocol "work until nothing is on you" is what lets a host's ordinary subagents run it.
- Horde is the mission on the law: an architect plans onto Yggdrasil's graph before anyone writes, a landing gate runs the checks and refuses, the owner charters the mission, and agents are raised and retired with no standing seats. Its record is a Jarl loop. The levels here are the loop's own shape for any work, law or no law; a Horde mission may map its architect onto the jarl and run its tickets as one slice, but it adds the plan, the gate and the charter that Jarl will never carry.

## 10. Acceptance: five scenarios (issue 076)

1. **Delegation.** A jarl files a backlog, splits it into two slices and assigns two coordinators; each coordinator sees only its slice; the jarl sees only what is on the jarl; the owner's digest holds only what is on the owner.
2. **Replacement.** A coordinator stopped mid-slice is replaced by a fresh one with only its slice's brief, and nothing it needs is missing: standing rules, promises, open questions, reviews in flight.
3. **Stuck worker.** A lease with no row, log line or commit past the threshold shows in its coordinator's list with the command to act.
4. **Two machines.** Two clones file, lease and merge on one loop; no two issues share a number, and a double lease shows as a conflict for the jarl.
5. **Owner returns.** One command prints in one message everything on the owner, most blocking first, each with what it holds up.

Each is a test that drives a scratch loop through the role commands with no model in it, red on release/6.2.1 71ebc5b, and once a live run with real agents whose record is kept in this folder.

## 11. What becomes of the waiting issues

| Issue | Becomes |
|---|---|
| 052 next actions | section 3, `next --as`: kept, the core |
| 042 stuck worker | section 3 liveness: reshaped (holder's last move, threshold in minutes in the goal) |
| 057 resource holder | section 3 liveness: folded into 042 |
| 069 root cause on the owner | section 3, "waits on X via N": folded into 052 |
| 070 owner digest | section 3: kept |
| 073 register | sections 3 and 5: reshaped into the ball (promise and external wait kinds, unchecked notes); validity by date or event kept on promises and waits only |
| 039 owner sign-off lines | section 3: kept (an acceptance line only the owner ticks holds done) |
| 058 briefs | section 6: kept, with loop-level templates |
| 056 undeclared coordinator name | section 2: reshaped into named levels and writers |
| 063 a ruling cites its mandate | section 2: kept (a ruling by the jarl or a coordinator names the mandate it rests on) |
| 068 coordinator slips | report per coordinator: kept, low |
| 061 rulings cut, 062 every ruling printed | `resume` as jarl or coordinator prints the rulings that touch its open work, whole, then a count: merged into one issue |
| 064 since view | kept small: a filter over the log, ending with the asker's list |
| 045 model lines at init | section 7: reshaped (lines per level and tier) |
| 051 reviewer rank by kind | dropped: models by judgment (a-001); the fresh, not-below rule stays |
| 040 batch review record | kept: one verdict on several issues carries one batch id |
| 050 batching rule | kept in the guidance: one review over issues that are one contract or one screen; the limit (the report's 4 or the package's 10) is the owner's |
| 049 exact-output instead of review | folded into 004 as the waiver's evidence; the recommendation is a light review that checks the comparison covers the change |
| 055 commit after approve | kept as a note on `merged` when the approved tip is not the merged tip (002 records tips); refusal is the owner's call |
| 041 relayed and bot verdicts | kept: counted apart; whether a bot's approve may clear is the owner's (recommended: no) |
| 059 visual review | reshaped small: a verdict may name the artifact it judged; done already checks a profile's required slots; no gate at merge (Jarl never blocks landing) |
| 044 external requirements | reshaped small: `import` reports findings whose text changed since filing; requirement items as a concept wait for a later release |
| 048 the loop's language | recommended dropped: the owner's call |
| 006 model ceiling | section 7: kept |
| 007 review queue with batches | section 3: reshaped (the coordinator's list offers ready units grouped by the batching rule) |
| 022 reserved numbers | section 8: becomes the id mechanism |
| 031 (its id design part) | section 8 |

## 12. Open points for the critics

- Whether a review lease (a review raised, no verdict yet) is the only new state the ball needs, or leases need more.
- Whether per-driver number blocks are the right id design, against a suffix per clone or a renumbering at merge.
- Whether "work until nothing is on you, then return one line" holds on hosts whose subagents cannot be resumed, and how it meets the relay for hosts where a raised agent cannot raise agents (built: jarl.md, the reeve's relay).
- Whether a medium coordinator on computed moves loses judgement that matters (triage, what goes up).
- Whether the line with Horde holds once Jarl has levels.
- Whether the levels make Jarl heavier for one agent alone: the minimum must stay `init`, `new`, `next`, `evidence`, `set done`, `ask`, `decide`.

## Background

### Inputs

- Jarl at a1132a8: SKILL.md and the references (about 33,000 words in all: SKILL.md 2,763, jarl.md 4,464, commands.md 7,653, record.md 3,950, profile.md 3,399 and seven more), 38 commands, the library at 6,682 lines.
- The field report and its checked map: [research/2026-11-03-jarl-field-report-long-loop](../2026-11-03-jarl-field-report-long-loop/README.md) (44 items; 21 true, 18 partly, 3 not).
- The measurements of [research/2026-11-03-review-granularity-and-light-models](../2026-11-03-review-granularity-and-light-models/README.md): review outcome by size, and [where a unit's time goes](../2026-11-03-review-granularity-and-light-models/materials/time-by-unit.md).
- Two runs made for this report on a scratch copy (below, experiment 3).

### What Jarl is today, in one paragraph

Built: a record (`.jarl/`: goal, issues, an append-only log, rulings, questions, an optional profile) and a tool that writes it through commands that refuse what would make it false (a done without proof or a fresh approve, a self-approve, a forged log line, a cycle of After). Everything else is prose: the jarl's loop (boot, file, pick, raise a worker, review, merge, repeat), the reeve, the relay for hosts that cannot spawn, the briefs, the model rule. Jarl "records, derives and displays; it never blocks code from landing", and leaves gates, planners and expiring leases to a composer such as Horde (composers.md, "What Jarl will not grow"). The field report's verdict on that split: "an excellent memory and a weak guide".

### Thought experiments

#### 1. One agent alone

A session with no subagents (a host that cannot spawn, a topic in a notes repository whose topics are loops, a small repository) is jarl and worker at once. Built: a self-approve is refused, so a code issue cannot close until a second agent reviews it; an issue with no branch closes on the jarl's approve. What breaks: nothing tells the lone agent what it is waiting for. The honest state is "the owner must start a fresh session to review issues 7, 9 and 12", and that is exactly where one review over several issues pays most, because each review costs the owner an action. What it needs: the next move and who holds it, and a minimum that costs little to learn (init, new, next, evidence, done, ask, decide), with the crew's machinery out of the way until it is used.

#### 2. One coordinator and many workers

Measured on 6.2.0 (127 merged units): a round is a median 14 minutes of work and 8 from the worker's last evidence row to the verdict; a unit has 1.8 to 2.1 reviews. Each unit asks the coordinator for about five moves (lease and raise the worker, read the report and raise a reviewer, read the verdict, send a round or raise the merger, close). With five workers that is a move every few minutes, each costing context: a report read, a brief written by hand (the field report: about 30 reviewer briefs, the same 8 rules in about 90 messages). The context fills, compaction drops what was never recorded (a convention lost cost about 80 minutes of a blocked coordinator), and a stuck worker shows only after six hours with no commit unless the coordinator knows to ask for less (built: `status --stale-hours` takes a fraction, so 0.5 flags half an hour, but resume always uses 6 and only commits count, never rows or log lines; the report counts about 4 hours of stalls found 9 to 24 minutes late by a watchdog outside Jarl). The coordinator is the loop's bottleneck and its weakest memory. What it needs: Jarl computes each role's next move and the brief for it, every role records its own result, the coordinator reads one line per event, and silence is visible in minutes.

#### 3. Several sessions or machines on one loop

Run on a scratch copy with Jarl a1132a8 (commands in [materials/two-clones.md](materials/two-clones.md)):

- Two clones of one committed loop each filed an issue. Both got number 2; git merged them without a conflict, because the file names differ by slug. `list` shows two issues numbered 2, `verify` says "clean — every line of the record is placed, and nothing disagrees", and `show 2` and `set 2 in-progress` reach the first file only. Worse, as the sceptic found ([materials/sceptic.md](materials/sceptic.md)): the log line of a move carries the number and no file, so list and resume apply every move of 2 to both issues; after `set 2 dropped` both read dropped, and verify then advises writing the log's state into the second file, which drops an issue nobody dropped. Two branches of one checkout that each file an issue and then merge end the same way. The merge driver flags change nothing, because no driver covers the issue files, while SKILL.md, jarl.md and repositories.md promise that numbers never collide.
- A committed loop opened, committed and cloned before its first issue cannot file in the clone: `new` fails with a raw `ENOENT … scandir '.jarl/issues'`, because git keeps no empty directory.

The write lock protects sessions sharing one checkout (built, record.md "The write lock"); across clones nothing does, and a lease taken in two clones is possible by construction (not run). This is the shape of a notes repository whose topics are loops worked from two computers and of any loop with more than one driver. Even in one checkout nothing says which session drives what: a question the analysis session filed in the 6.2.1 loop shows in the release session's resume as if it were its own.

#### 4. A long loop with the owner away

Built and praised by the report: resume restores the record exactly, after any number of compactions. What breaks is everything never recorded: the owner's standing orders given in chat, the coordinator's conventions, promises, guesses that become facts in the next summary, a question asked in a dialog that a worker's ping cancelled (asked three times before it was answered). And the signal drowns: on the 6.2.0 loop resume printed 102 rulings in force, 309 lines and 41,043 bytes (map fr-28).

#### 5. Work that is not code

Films, renders, documents and decisions. Built: a profile can declare statuses, fields and attachment slots; evidence can attach a file with its hash. What breaks: the owner's sign-off is not a state (an issue was closed and reopened by hand), a verdict cannot name the render it judged, and every owner who wants this writes a profile from nothing.

#### 6. Speed

Measured on 6.2.0: 83 of 127 units were already packages of two to six issues with one review; per issue a package took a median 17 to 27 minutes against 47 alone; the review is about a third of a round; 13 units took over 30 hours and 83% of their time lay before the first verdict. So one review per issue is not what makes a loop slow. In order: how many units can run at once (limited by overlapping files and by the coordinator), stalls noticed late, the coordinator's cost per move, then reviews shared where the changes are one thing to check, then lighter models on light work (cheaper; whether faster is unmeasured).

#### 7. Models

Built: tiers light, standard and strong, model lines per tier in the goal, `models` with `fits`, `below` and `may clear`. Unused in practice: the report's loop declared no model lines, the family's own driver (6.1.0) records no model, and one model under two spellings splits every count (map fr-02). The measuring instrument exists and is not yet usable.

### What the sceptic changed

A fresh Opus sceptic checked the field report's 39 findings at a1132a8 ([sceptic.md](../2026-11-03-jarl-field-report-long-loop/materials/sceptic.md)): 20 stand, 18 stand with a correction, 1 is refuted, and severity moved down on 10 and up on none. The pattern in the corrections matters more than the counts. In at least nine places, what the report asked for is already in Jarl, and neither the coordinator in the field nor the analyst who read the code found it: a ruling names the issues it settles (`decide --settles`); `--stale-hours` takes a fraction of an hour; a profile can declare its own kinds with required file slots that done checks; the package rule groups small neighbouring issues under one review; `show` prints the record half of a brief, and the third `round` prints a takeover brief; `import` and `sources` track external items against issues; every move is a dated log line a since view could filter; and a standing order recorded with `decide`, or a question filed with `ask`, already survives every compaction. Most of the losses in the report came from records not made, not from records Jarl cannot hold.

So the first gap is not capability but guidance: the tool does not bring the right existing command to the agent at the moment it is needed, and 33,000 words of prose do not do it either. That moves the weight of the direction below toward the ball and the next move, which can name the existing command (for example: "worker 22 silent 40 minutes: status --stale-hours 0.5", "ruling X settles 40, which is not done"), and away from new commands.

### First synthesis, before the model

The report's items are not thirty separate wishes. Most of them are one missing concept and three missing properties.

**The missing concept: who holds the ball, and what is the next move.** Every open thing in a loop waits on someone: a ready issue on the coordinator, a lease on its worker, a branch with a report on the coordinator, a pending review on its reviewer, a changes verdict on the worker, an approve on the merger, a merged issue with an owner-only acceptance line on the owner, a question on the owner, an issue waiting After on whoever holds its blocker, a ruling that requires work and has no issue on the coordinator. Almost all of it can be derived from what Jarl already records. New would be only two kinds of entry (a promise by an agent, a wait on a named outside person) and one mark (an acceptance line only the owner may tick). From that one derivation come the next-actions list (fr-17), what waits on the owner in one message (fr-38), the root cause on the owner (fr-37), worker liveness as the age of the holder's last move (fr-07) and most of the register (fr-41). The register is then not a second store beside the record, but a view of it.

**Property 1: a coordinator that can be replaced at any moment.** Test: stop the coordinator mid-loop and start a fresh one, on a lighter model, with nothing but Jarl. Today it loses the conventions, the promises, the dialog questions, which reviewer runs where, and every brief. The fix is generated briefs (fr-24) built from the record and the loop's standing rules (issue 020 of 6.2.1), so a rule written once reaches every agent, and every role records its own result. This is also what makes many workers affordable and light models usable as coordinators: the more Jarl computes, the less the coordinator must hold.

**Property 2: safe with many drivers.** Ids that cannot collide across clones, `verify` that finds two issues with one number, a fresh clone that can file, and each session that drives a loop named, so the ball can sit with a session and not only with a role.

**Property 3: a record that tells the process as it was.** One record for one review of several issues (fr-05; today a reader can rebuild it from identical verdict lines), a later green gate shown apart from a merge's own check (fr-04 was refuted: one `merged <ids>` already records one check for several merges, but it overwrites each issue's own merge sha and the banner cannot tell the two apart), relayed and bot verdicts apart from fresh ones (fr-06), model names folded (fr-02), an undeclared coordinator name not counted as fresh (fr-22). Without these no question about batching or models can be answered from a loop, including this investigation's own.

**Less to read.** About 33,000 words of references exist because the steps live in prose. When the tool tells the next step and every refusal carries the corrected command (fr-18), the manual a coordinator must hold shrinks to the principles and one call.

**What stays out.** Merging, closing or expiring by itself; a schedule; a hook that runs a host's command; translating Jarl's output; a separate register store. The line "Jarl records, derives and displays" holds: every proposal above derives or refuses at the level of the record.

### The owner's shape: a jarl, coordinators by slice, workers and reviewers

The owner's input of 2026-11-03 (README) names the shape the direction should serve: a jarl on a strong model that talks with him and works the backlog, one or more coordinators on a medium model, each over its own slice of the backlog (a tag is enough to mark a slice), and workers and reviewers on whatever model the task needs, all as subagents. A coordinator does not reach the jarl until it has to.

Built, in prose only: the reeve (jarl.md, "The reeve: handing the loop down") is one long-lived coordinator on the standard tier that runs the loop and reports to the jarl on four occasions only (a research issue or a gap the goal did not foresee, an owner's answer that changes the goal, the counts every few merges, an empty queue), with a relay for hosts where a raised agent cannot raise agents. The tool knows none of it: `next`, `resume` and `status` take no slice (only `list --tag` filters by tag), a lease does not name the coordinator that raised its worker, and nothing records a question to the jarl as distinct from a question to the owner. In practice the family's own release loops run without a reeve: one strong session does everything.

What the direction adds for it: the ball can sit with the jarl, a named coordinator, a worker, a reviewer, the owner or an outside person; a coordinator's next moves and its resume cover its slice only; going up is an entry with the ball on the jarl (the reeve's four occasions become the rule for what such an entry may be), never a message the jarl must read to find out; and a slice is a tag the jarl assigns, so several coordinators can run one loop without sharing a context. Files already keep two coordinators from colliding (`next` never offers an issue whose files an in-progress issue holds, across the whole loop).

### Routing to the right loop

Built: every tool takes `root`, the absolute path of the checkout that holds the loop; without it the server's `JARL_ROOT`; without that, the loop at the root of the session's project, never one in a subdirectory (commands.md, "Which loop a call reaches"). A loop kept in a subdirectory, such as a topic in a notes repository, is reached only by passing `root` on every call, and a call that forgets it fails where the project has no loop at its root, or reaches the wrong loop where it has one. What the owner asks for: the skill holds the general routing (which loop serves which area), and the tool tells the agent what it needs: the loops it can see under the project, and a refusal that lists them when a call names none and the choice is not obvious, instead of a silent default.

