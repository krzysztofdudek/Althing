# Decision rights: where they are written, where they break, and one table

Who decides what in a Jarl loop, judged against Jarl at JarlSkill 0556c16 and Althing's own rules. Runs are in [simulation.md](simulation.md), and what the real loops show is in [real-loop.md](real-loop.md). The README holds the short form; this note keeps the reasoning and the table.

## Where the rights are written today

| Place | What it says |
|---|---|
| SKILL.md, "The rules that never bend" | decide inside the goal; stop and ask the owner in five cases (the goal or a standing decision would change; a protection would get weaker; a number would enter the code with no origin; a merge conflict cannot be resolved without losing a side's behaviour; the work would reach outside the session); merging to `main` and pushing are the owner's word; a code issue is cleared only by a fresh reviewer; only the merger commits in the main checkout; a worker never approves its own work |
| references/jarl.md, "What goes to the owner" and "An owner who is rarely there" | ask well, keep the loop moving; a provisional decision is a ruling by the jarl plus a ratify item that blocks nothing; `stuck` holds one issue |
| references/jarl.md, "Coordinators: slices of the backlog" | a coordinator never talks to the owner; it escalates for four reasons only; counts are never pushed up; an issue's scope does not grow once leased; one merger holder for the loop |
| references/jarl.md, "Rulings about an area" and "Rules with a scope" | a ruling that reaches a whole type of code runs at once and is ratified by the owner in one batch at close; anyone proposes a rule, the jarl accepts it, or the owner with `--to owner` |
| references/worker.md, the brief | the worker's scope is its issue; it never weakens a test, a check, a rule or a hook (it stops and reports); it never pushes |
| references/reviewer.md | the reviewer judges the issue's acceptance and what the change broke; a finding outside it is filed, never a reason for changes; the issue's own worker never sets `identical-output` |
| references/merger.md | the merger never edits code and never decides scope; it resolves a conflict only when one side is a superset or the hunks are independent; it lands on red only on the jarl's ruling |
| references/commands.md, `ask` | the question kinds `stop`, `stuck`, `lower`, `charter`, `ratify`, `escalation`, `rule` |
| research/2026-11-03-jarl-as-a-loop-tool/report.md, sections 2 and 3 | a table of levels and the ball: every open thing has one holder |
| Althing AGENTS.md, sections 6 and 7; method/working-model.md; method/rulings.md | the owner's word for what cannot be undone or reaches the public, for consent the tools' law keeps for a person, and for what the family is and when it ships; `quality-first-mandate`, `autonomy-quality`, `consent-by-reach`, `code-docs-conflicts`, `questions-wait-for-the-owner` |

A coordinator's own reading of these (SKILL.md, jarl.md, models.md) is about 13,000 words.

## Is the model complete, consistent and cheap?

**Complete: nearly.** Unwritten: who may change an issue's Acceptance after the lease; where a worker's question goes; what a `stop` with no issue does.

**Consistent: mostly.** The ratify route for a provisional decision is described in AGENTS.md section 7, working-model.md and jarl.md. `code-docs-conflicts` and `quality-first-mandate` look opposed and are not, once the first is read whole: the coordinator settles a conflict when one option clearly fixes the thing and breaks nothing for adopters, and asks when the choice breaks existing behaviour or when it is not sure. `quality-first-mandate` lists acts kept outside every mandate. An unsure behaviour-breaking choice goes to the owner; the question holds its issue and the rest of the loop goes on. A second wrong sentence: commands.md says `stop` "halts everything", and `next` holds only the issues a stop names.

**Cheap: no.** Nine places, read in part by every role, for rules most of which the tool or the next-move list already states. Most rows of the table below are built, so a refusal or `next --as` speaks for them at the moment they matter.

## Where a real loop gets stuck

From the two real loops, not from theory:

1. **The owner's attention.** He made 52 of 74 rulings in 6.3.0 and has 8 items waiting in a loop whose digest is separate from this one.
2. **A question with nowhere to go below him.** A worker's `stuck` question lands on the owner (run 2, the technical critique); no holder exists between. No worker has used this path on the record, because the brief names no such command.
3. **Hand-built coordination.** 71 briefs, 16.8 KB each.

## Where a loop could decide what was not its to decide

Seen only on scratch runs, where one agent typed the violations on purpose; the record of two real loops shows none (real-loop.md):

1. The worker narrows its own acceptance, or moves a line away with `split`.
2. The worker tags its own change `identical-output`, which lets a light review clear it. reviewer.md forbids it, and the tool allows it.
3. Any agent writes `--by owner` on an answer.
4. A merger resolves a conflict by picking a side (guided; the tool cannot see it).

For the first, showing the change to the reviewer is proposed instead of refusing it, because no real case exists and the one who judges then sees it. The second stays a refusal because it lowers the review itself. The refusals of Tier, Kind and `decide` proposed in the first draft are withdrawn: no case, and the record already shows who wrote them.

## The three questions

The first draft used reach and reversibility alone and called the five stop cases one-way doors. Four of them can be undone before shipping, and a `yg-suppress` could be read as reversible and the jarl's to make. The order that works:

1. **Is it reserved to the owner?** What leaves the machine or cannot be taken back; what the tools' law keeps for a person; what the product is and when it ships; the five stop cases, held by ruling whether or not they could be undone; whatever the project's goal adds (Althing: AGENTS.md section 6). An unknown case counts as reserved. Ask, and hold only what depends on the answer.
2. **Whom does it bind?** One issue: its worker, inside the acceptance. One slice: its coordinator. The loop: the jarl. The goal or a whole type of code: the owner (`consent-by-reach`).
3. **The owner's by reach, and not reserved?** The jarl decides provisionally and files a ratify item, which blocks nothing.

And one rule beside them: the one who does the work never judges it and never sets what it must prove.

## Who decides what

"Tool" says what the record enforces, built or proposed. A lone agent holds every row but the reviewer's on its own code.

| Decision | Decider | Tool | Guided |
|---|---|---|---|
| the goal, a charter change | owner | | the jarl asks (`ask --kind charter`) |
| anything on the reserved list | owner | | ask first; only dependents wait |
| ratifying a rule, a suppression, a `review_by`, the architecture file | owner | Yggdrasil's own gates | |
| publish, tag, push, merge to `main`, delete a remote branch | owner | | Jarl never does them |
| continue or archive an existing loop | the session's task; the owner when it contradicts the goal | | issue 219 |
| which stages he looks at himself | owner, with the jarl | built: done waits for his tick | |
| backlog shape: issues, order, tier, slices | jarl; a coordinator inside its slice | built: one slice per issue | how to cut slices (218) |
| an issue's Acceptance after the lease | its coordinator or the jarl; a narrowing goes to the owner as a ratify item | proposed (item 3): the reviewer's brief prints the change | |
| what lowers the depth of review: `identical-output`, a line's method | filer or coordinator | proposed (item 3): refused to a holder of the lease | |
| scope growth after the lease | coordinator, as a new issue | built: a note | |
| which agent and model inside the tier | coordinator | built: noted above the ceiling | |
| how to do the work | worker | built: `scope` shows removed tests | never weaken a protection |
| lower a protection | owner | | `ask --kind lower`, through the coordinator |
| a number with no origin | its source | | ask, never invent |
| worker cannot meet its line | its coordinator, then up | proposed (item 2): `stuck` lands on the coordinator | the brief names it |
| approve or send back | a fresh reviewer | built: self refused; code needs fresh; model rule advice by default | |
| a finding outside the issue | reviewer files it | built | |
| a round, a takeover | coordinator | built; 215 | |
| merge order and batches | merger | built | |
| a conflict that loses a side | owner, through the jarl | | merger aborts and reports |
| land on red for a cause outside | jarl | built: needs a tracking issue | |
| done | the gate | built | |
| waive a review | owner | built | |
| a ruling inside the mandate | jarl; a coordinator for its slice (`--applies-to`) | built: scope available | |
| a provisional decision | jarl, then owner | built: ratify answered by owner only | |
| a ruling about a whole type | owner, at close | built | |
| a rule with a scope | jarl; owner for his own | built | |
| escalate | coordinator, four reasons | built | |
| stop | anyone, over what depends on it | built: holds the issues it names | |
| raise agents | jarl: coordinators; coordinators: workers and reviewers; `Merger:` holder: the merger | | workers, reviewers and the merger raise nobody |
| a cost ceiling, barred models | owner | built: noted, never refused | |
| close the loop | jarl; `--force` is the owner's | built: refuses while open | |

## The smallest form an agent reads

The table stays here, for a person and a designer. An agent gets the three questions and the one rule in SKILL.md, and at most three "you do not" lines in its role's reference, carried in its brief as built-in rules. Item 10 of the README retires about 1,800 words from those files to pay for them.

## Enforce, guide, or show

**Enforce** where the record already holds the fact and a wrong move would be silent or would empty a gate of meaning. **Guide** where the call needs judgment. **Show** what neither can catch.

The design of 2026-11-03 cut a permission table for two reasons ([its revision](../../2026-11-03-jarl-as-a-loop-tool/materials/revision.md)): refusing writes by level would be theatre (F-I2), and it would be policing, not recording (M-I5). The first draft of this concept answered only the first, and overreached with seven kinds of refusal. Comparison with the independent design reduced them to one, on what lowers the depth of review; the rest is shown instead. It is theatre no more than the self-approve refusal is, which rests on the same unverified names. It catches the honest failure, an agent easing its own review, and claims nothing against a lying one.

## A human organisation on the same record

Run 3 walked a team of four on one record. Filing, leases, proof and review work as they stand. Three breaks: a lead named as a coordinator cannot clear a colleague's work; the owner is one literal name, so several deciders have nowhere to go; nothing tells a person the ball is on them. An organisation also has real sign-in, against which names could be checked. Nothing is proposed before a real team uses it.
