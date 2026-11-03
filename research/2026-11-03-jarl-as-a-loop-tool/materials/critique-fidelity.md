# Critique: fidelity to the owner's intent

**Question:** Does report.md (draft 2) give the owner what he asked for on 2026-11-03, without adding, dropping or softening anything, and without deciding his choices silently?
**Method:** One fresh critic, read-only. I compared report.md against the owner's words in README.md ("Why this question", "The owner's further input"), the rulings of the 6.3.0 loop dated 2026-11-03 (one-release-partial-pause, release-6-3-0-one-coherent-version, field-report-findings-all-into-6-3-0, loop-tool-one-model-five-scenarios), ask a-001 and its answer, the field report's source.md (its list "What I would not add"), the list of issues waiting on 035, issue 004, and the reeve and relay text of jarl.md at JarlSkill. Technical soundness and maintenance cost are left to the other two critics.
**Status:** done
**Conclusion:** The model follows the owner's shape closely: a jarl that talks with him, coordinators over parts of the backlog, workers and reviewers per task, models by judgment, escalation by entries and no pushed counts. It keeps the field report's warning in the places it names (the owner-only acceptance line holds done, the fresh reviewer rule stays, a bot's approve is left to him). One gap is critical: on a host where a raised coordinator cannot raise its own workers, the built relay routes every spawn and every report through the jarl, which is the spam he asked to remove, and the model leaves this as an open point. Nine findings are important: two places where the model decides something that is his (a slice as a one-value label, advisory write rules), one row that reverses his a-003 choice (044), one row that stretches a-001 (051), one scenario softened against the ruling (two machines), the lone agent missing from the model, two columns the ruling asked for, a vocabulary too heavy to explain in a few sentences, and a worker's new issue that can land on the jarl. Four findings are minor.

## Critical

### C1. On the owner's host the coordinators may not be able to raise workers, and the relay then floods the jarl

- **Where:** sections 5, 9 and 12 (third open point); Background, "The owner's shape".
- **What is wrong:** The owner said plainly: "Here we are talking about subagents, not T3 Code threads", and "the point is not to spam the Jarl". In the model a coordinator raises its workers and reviewers. jarl.md already describes the case where an agent raised by the jarl cannot raise agents: the coordinator sends the jarl one line per spawn and the jarl forwards one line per report. With two coordinators and five workers each, that is a line in the jarl's context for every spawn, every round and every report. The jarl then becomes the switchboard he described as the problem ("the subagents go through it, report to it that the work is done, and generally swamp it"). The model lists this as a question for the critics and never answers whether his shape works as subagents on the host he uses.
- **Change:** Add a short section to the model, "How the shape runs as subagents", that says, for the host the owner runs, whether a coordinator subagent can raise its own workers. If it can, say so and stop. If it cannot, name the shape that keeps the jarl quiet and count what reaches it: for example, spawn lines go to a file the jarl acts on without reading, and the jarl's view shows only escalations. If no such shape exists without separate threads, put the choice to the owner as a question, because he excluded threads himself. Make scenario 1 run on that host with the relay in force and count the lines the jarl receives.

## Important

### I1. A slice is decided as a one-value label, while the owner suggested tags

- **Where:** section 4, first bullet.
- **What is wrong:** The owner said "for example by tag, because the tag system is universal and anything can go there". The model keeps "the label to one value per issue", with a sound reason (an issue in two slices would be worked twice). It never says whether a slice is an ordinary tag with a rule on top or a new field, and it does not flag the departure from his suggestion as his to accept. His phrase "if it created the backlog and there is a hierarchy in it" is not answered either: the model never says how a slice relates to a grouping the backlog already has.
- **Change:** State the mechanism in one line, for example "a slice is a tag of the form `slice:<name>`, and Jarl refuses a second slice tag on one issue". Add one sentence on hierarchy: the jarl may cut slices along an existing grouping (tags, After chains). File the one-value rule for ratification (`ws jarl ask --kind ratify`) with its reason.

### I2. Write rules per level default to the lenient choice, against the field report's warning

- **Where:** section 2, third bullet; the coordinator's row ("verdicts it relays").
- **What is wrong:** The model makes a write outside a level's row "a note on stderr, never a refusal, until the owner rules otherwise". That picks the default for him. The field report says the opposite: "Every slip I made in this loop would have become worse with more automation and better with more guarding", and it asks for nothing that "lets the record say done without a person or a fresh reviewer having looked". A worker writing a verdict, or a coordinator writing an approve it did not receive from a reviewer, is exactly such a step. The phrase "it does not police" also contradicts the model's own line that Jarl "refuses at the level of the record".
- **Change:** Split the writes. A write that moves an issue toward done (a verdict, `set done`, `merged`) made outside its level's row is refused. Every other write outside the row stays a note. Put that split to the owner as a question with the lenient option beside it, and drop "it does not police".

### I3. Row 044 defers part of a finding to a later release, which the owner declined in a-003

- **Where:** section 11, row 044 (external requirements).
- **What is wrong:** a-003 offered option (2), "all but the after-6.3.0 group, which is filed and deferred to the release after". External requirements were in that group by name. The owner chose option (1), and ruling field-report-findings-all-into-6-3-0 says "the design keeps, reshapes or drops each with a reason". The row says "requirement items as a concept wait for a later release", which is option (2) again.
- **Change:** Give 044 one of the three outcomes the ruling allows. Either keep the reshaped part in 6.3.0 and drop the concept of requirement items with its reason, or ask the owner whether a deferral is acceptable for this one finding.

### I4. Row 051 reads more into a-001 than the owner said

- **Where:** section 11, row 051 (reviewer rank by kind).
- **What is wrong:** a-001 refused a measurement: "We will not do the measurement. We will rather choose models by feel." The rank rule from the field report (the reviewer one rank above the worker for format, contract or visual work) is a rule of judgment taken from the field. It is not a measurement. Dropping it "because models are chosen by judgment" stretches his answer. A clause of his about matching the right model to the right task came through garbled and was flagged to him, so the record does not hold his full intent on exactly this point.
- **Change:** Keep the rule as guidance in the reviewer's brief, with no `models` warning and no counting, or ask the owner, and repeat the garbled clause back to him in the same question.

### I5. Scenario 4 softens what the ruling says about two machines

- **Where:** section 10, scenario 4; section 8, last bullet.
- **What is wrong:** Ruling loop-tool-one-model-five-scenarios says "two machines on one loop collide on nothing". The model lets two clones lease the same issue and shows the double lease after the merge as a conflict for the jarl. That is a collision caught after two workers may have done the same work. The model does not say that it narrows the ruling's wording.
- **Change:** Say in section 10 which collisions the model prevents (numbers) and which it only catches (leases). Then either design the prevention (for example, a lease counts only once its commit is pushed, and a pull that brings a second lease refuses the later one), or ask the owner to accept "caught at the next pull" in place of "collide on nothing".

### I6. The model leaves out the lone agent, and its minimum has no review

- **Where:** "The model on one page"; section 2; section 12, last open point.
- **What is wrong:** The owner asked for "a tool for running the work loop of one or many agents. That was the idea from the start." The one-page model describes only the many. The lone agent appears in Background and in an open point, and that point's minimum (`init`, `new`, `next`, `evidence`, `set done`, `ask`, `decide`) has no review. Either the minimum is incomplete, or a lone agent reaches done without anyone having looked, which breaks the field report's warning.
- **Change:** Add one paragraph to the one-page model: one agent holds the jarl's, the coordinator's and the worker's rows at once; the look comes from a fresh reviewer session or the owner's sign-off, and the ball shows it ("the owner starts a fresh session to review 7, 9 and 12"). Add `review` to the minimum. Say whether one of the five scenarios covers the lone agent, or why none needs to.

### I7. The levels table lacks the read and raise columns the ruling asked for

- **Where:** section 2, the table.
- **What is wrong:** The ruling asks for "the levels and what each may read, write and raise". The table has "Starts from" and "May write". Who may raise whom, which is the core of the owner's hierarchy (the jarl delegates to coordinators; coordinators raise workers and reviewers), is spread across section 5. What a coordinator may read outside its slice is not stated anywhere.
- **Change:** Add "May read" and "May raise" columns. For example: the coordinator reads the whole record and acts on its slice; the coordinator raises workers, reviewers and its merger; the jarl raises coordinators.

### I8. The model has too many new terms for the owner to retell it in a few sentences

- **Where:** "The model on one page"; sections 2, 3 and 7.
- **What is wrong:** The page brings in about a dozen terms: level, slice, holder of the ball, next move, driver, digest, review lease, promise, external wait, unchecked note, brief. "The reeve" also survives in section 2 beside "coordinator". Strength has two vocabularies: the owner's strong, medium and weak, and Jarl's strong, standard and light, and the table mixes them ("medium" for the coordinator, "tier" for workers). The owner's own picture fits in four sentences, and the model never gives them.
- **Change:** Open the model with three or four sentences in his terms. For example: "A jarl on a strong model talks with you and shapes the backlog. It splits the backlog by tag among coordinators on a medium model. Each coordinator raises workers and reviewers for its part, on models chosen per task, and goes up only for the four reasons in section 5. Jarl tells each of them what is on them now and refuses a done that nobody looked at." Map the two strength vocabularies once. Say that the reeve becomes the coordinator.

### I9. An issue a worker files can land on the jarl

- **Where:** section 3, first row; section 5, "Up from a worker"; section 4, third bullet.
- **What is wrong:** Section 4 puts the issues a coordinator files into its slice. Section 5 lets a worker file findings as new issues, and nothing says which slice they land in. An issue with no slice belongs to the jarl (section 3, first row). With several coordinators and many workers, every finding filed as an issue reaches the jarl, which is the spam the owner asked to avoid.
- **Change:** Say that an issue filed by a worker or reviewer lands in the slice of the coordinator that raised it. Only the coordinator moves an issue up, by the escalation rule.

## Minor

### M1. The routing question gets only an implicit answer

- **Where:** section 1.
- **What is wrong:** The owner asked: "Is it possible to give a specific sub-area?" The answer is yes (built: `root` on every call), but a reader has to work it out from the bullets. Passing `root` on every call also stays the agent's burden, and forgetting it was the failure he described.
- **Change:** Open section 1 with "Yes: every call takes `root`". Add a sentence on whether a session can name its loop once instead of on every call, or say why it cannot.

### M2. Two passages justify record fixes by a measurement the owner refused

- **Where:** Background, "Property 3" ("Without these no question about batching or models can be answered from a loop"); Background, experiment 7 ("The measuring instrument exists and is not yet usable").
- **What is wrong:** After a-001 these reasons point at work he declined. The fixes stand without them.
- **Change:** Give honesty as the reason: the record says what happened (one review of several issues, relayed verdicts apart, one model under one name).

### M3. The one-line rule reads the jarl as a queue to drain

- **Where:** "The model on one page", fourth paragraph; section 2, the jarl's row.
- **What is wrong:** The owner described the jarl as the agent he thinks with: it "talks with me about the concept; it thinks at a high level". "Work until nothing is on you, then return one line" fits coordinators and below. Applied to the jarl, it turns that conversation into a status line.
- **Change:** Say that the one-line rule binds coordinators, workers and reviewers. The jarl talks with the owner in full, and its view gives it the state when it wants it.

### M4. "Within minutes" from the ruling has no default

- **Where:** section 3, liveness; section 10, scenario 3.
- **What is wrong:** The ruling says "a stuck worker shows within minutes". The model sets the threshold in the goal with no default, so a loop that never sets it gives no promise in minutes.
- **Change:** Have `init` ask for the threshold in minutes and offer a default (the field report suggests 30). Write that default into scenario 3.
