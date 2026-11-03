# Jarl as a tool for running the work loop of one or many agents: a direction

Draft, 2026-11-03. Proposed, not built: everything under "The direction" is a proposal. What is built is marked as such and cites Jarl at JarlSkill a1132a8 (release/6.2.1). The design still owes three independent Opus critiques before anything from it is filed.

## Inputs

- Jarl at a1132a8: SKILL.md and the references (about 33,000 words in all: SKILL.md 2,763, jarl.md 4,464, commands.md 7,653, record.md 3,950, profile.md 3,399 and seven more), 38 commands, the library at 6,682 lines.
- The field report and its checked map: [research/2026-11-03-jarl-field-report-long-loop](../2026-11-03-jarl-field-report-long-loop/README.md) (44 items; 21 true, 18 partly, 3 not).
- The measurements of [research/2026-11-03-review-granularity-and-light-models](../2026-11-03-review-granularity-and-light-models/README.md): review outcome by size, and [where a unit's time goes](../2026-11-03-review-granularity-and-light-models/materials/time-by-unit.md).
- Two runs made for this report on a scratch copy (below, experiment 3).

## What Jarl is today, in one paragraph

Built: a record (`.jarl/`: goal, issues, an append-only log, rulings, questions, an optional profile) and a tool that writes it through commands that refuse what would make it false (a done without proof or a fresh approve, a self-approve, a forged log line, a cycle of After). Everything else is prose: the jarl's loop (boot, file, pick, raise a worker, review, merge, repeat), the reeve, the relay for hosts that cannot spawn, the briefs, the model rule. Jarl "records, derives and displays; it never blocks code from landing", and leaves gates, planners and expiring leases to a composer such as Horde (composers.md, "What Jarl will not grow"). The field report's verdict on that split: "an excellent memory and a weak guide".

## Thought experiments

### 1. One agent alone

A session with no subagents (a host that cannot spawn, a Workspace topic, a small repository) is jarl and worker at once. Built: a self-approve is refused, so a code issue cannot close until a second agent reviews it; an issue with no branch closes on the jarl's approve. What breaks: nothing tells the lone agent what it is waiting for. The honest state is "the owner must start a fresh session to review issues 7, 9 and 12", and that is exactly where one review over several issues pays most, because each review costs the owner an action. What it needs: the next move and who holds it, and a minimum that costs little to learn (init, new, next, evidence, done, ask, decide), with the crew's machinery out of the way until it is used.

### 2. One coordinator and many workers

Measured on 6.2.0 (127 merged units): a round is a median 14 minutes of work and 8 from the worker's last evidence row to the verdict; a unit has 1.8 to 2.1 reviews. Each unit asks the coordinator for about five moves (lease and raise the worker, read the report and raise a reviewer, read the verdict, send a round or raise the merger, close). With five workers that is a move every few minutes, each costing context: a report read, a brief written by hand (the field report: about 30 reviewer briefs, the same 8 rules in about 90 messages). The context fills, compaction drops what was never recorded (a convention lost cost about 80 minutes of a blocked coordinator), and a stuck worker shows only after six hours with no commit (built: `--stale-hours`, default 6; the report counts about 4 hours of stalls found 9 to 24 minutes late by a watchdog outside Jarl). The coordinator is the loop's bottleneck and its weakest memory. What it needs: Jarl computes each role's next move and the brief for it, every role records its own result, the coordinator reads one line per event, and silence is visible in minutes.

### 3. Several sessions or machines on one loop

Run on a scratch copy with Jarl a1132a8 (commands in [materials/two-clones.md](materials/two-clones.md)):

- Two clones of one committed loop each filed an issue. Both got number 2; git merged them without a conflict, because the file names differ by slug. `list` shows two issues numbered 2, `verify` says "clean — every line of the record is placed, and nothing disagrees", and `show 2` and `set 2 in-progress` reach the first file only, so the second issue cannot be addressed by number.
- A committed loop opened, committed and cloned before its first issue cannot file in the clone: `new` fails with a raw `ENOENT … scandir '.jarl/issues'`, because git keeps no empty directory.

The write lock protects sessions sharing one checkout (built, record.md "The write lock"); across clones nothing does, and a lease taken in two clones is possible by construction (not run). This is the shape of the owner's Workspace (the same topics worked from two computers) and of any loop with more than one driver. Even in one checkout nothing says which session drives what: a question the analysis session filed in the 6.2.1 loop shows in the release session's resume as if it were its own.

### 4. A long loop with the owner away

Built and praised by the report: resume restores the record exactly, after any number of compactions. What breaks is everything never recorded: the owner's standing orders given in chat, the coordinator's conventions, promises, guesses that become facts in the next summary, a question asked in a dialog that a worker's ping cancelled (asked three times before it was answered). And the signal drowns: on the 6.2.0 loop resume printed 102 rulings in force, 309 lines and 41,043 bytes (map fr-28).

### 5. Work that is not code

Films, renders, documents and decisions. Built: a profile can declare statuses, fields and attachment slots; evidence can attach a file with its hash. What breaks: the owner's sign-off is not a state (an issue was closed and reopened by hand), a verdict cannot name the render it judged, and every owner who wants this writes a profile from nothing.

### 6. Speed

Measured on 6.2.0: 83 of 127 units were already packages of two to six issues with one review; per issue a package took a median 17 to 27 minutes against 47 alone; the review is about a third of a round; 13 units took over 30 hours and 83% of their time lay before the first verdict. So one review per issue is not what makes a loop slow. In order: how many units can run at once (limited by overlapping files and by the coordinator), stalls noticed late, the coordinator's cost per move, then reviews shared where the changes are one thing to check, then lighter models on light work (cheaper; whether faster is unmeasured).

### 7. Models

Built: tiers light, standard and strong, model lines per tier in the goal, `models` with `fits`, `below` and `may clear`. Unused in practice: the report's loop declared no model lines, the family's own driver (6.1.0) records no model, and one model under two spellings splits every count (map fr-02). The measuring instrument exists and is not yet usable.

## What comes out

The report's items are not thirty separate wishes. Most of them are one missing concept and three missing properties.

**The missing concept: who holds the ball, and what is the next move.** Every open thing in a loop waits on someone: a ready issue on the coordinator, a lease on its worker, a branch with a report on the coordinator, a pending review on its reviewer, a changes verdict on the worker, an approve on the merger, a merged issue with an owner-only acceptance line on the owner, a question on the owner, an issue waiting After on whoever holds its blocker, a ruling that requires work and has no issue on the coordinator. Almost all of it can be derived from what Jarl already records. New would be only two kinds of entry (a promise by an agent, a wait on a named outside person) and one mark (an acceptance line only the owner may tick). From that one derivation come the next-actions list (fr-17), what waits on the owner in one message (fr-38), the root cause on the owner (fr-37), worker liveness as the age of the holder's last move (fr-07) and most of the register (fr-41). The register is then not a second store beside the record, but a view of it.

**Property 1: a coordinator that can be replaced at any moment.** Test: stop the coordinator mid-loop and start a fresh one, on a lighter model, with nothing but Jarl. Today it loses the conventions, the promises, the dialog questions, which reviewer runs where, and every brief. The fix is generated briefs (fr-24) built from the record and the loop's standing rules (issue 020 of 6.2.1), so a rule written once reaches every agent, and every role records its own result. This is also what makes many workers affordable and light models usable as coordinators: the more Jarl computes, the less the coordinator must hold.

**Property 2: safe with many drivers.** Ids that cannot collide across clones, `verify` that finds two issues with one number, a fresh clone that can file, and each session that drives a loop named, so the ball can sit with a session and not only with a role.

**Property 3: a record that tells the process as it was.** One record for one review of several issues (fr-05), a later green gate counted for the merges it contains and shown apart (fr-04), relayed and bot verdicts apart from fresh ones (fr-06), model names folded (fr-02), an undeclared coordinator name not counted as fresh (fr-22). Without these no question about batching or models can be answered from a loop, including this investigation's own.

**Less to read.** About 33,000 words of references exist because the steps live in prose. When the tool tells the next step and every refusal carries the corrected command (fr-18), the manual a coordinator must hold shrinks to the principles and one call.

**What stays out.** Merging, closing or expiring by itself; a schedule; a hook that runs a host's command; translating Jarl's output; a separate register store. The line "Jarl records, derives and displays" holds: every proposal above derives or refuses at the level of the record.

## Open points for the critics

- Whether the ball can be derived without new state for leases and reviews in flight (a review raised but not yet given is not recorded today).
- How ids should avoid collision across clones without breaking every loop that cites numbers.
- Whether a lighter coordinator on computed moves loses judgement that matters (triage of findings, what goes to the owner).
- Where the line falls between this and Horde, whose mission is a Jarl loop.
