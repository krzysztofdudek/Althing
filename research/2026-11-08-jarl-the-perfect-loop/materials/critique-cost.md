# Critique: the cost of maintaining and using the concept

Checked against `report --metrics` and `releases/6.3.0/.jarl` (167 leased issues, 163 closed). That loop runs a format-1 driver, so body lines carry no writer.

## Critical

**C1. The worker's honest exit gets refused (items 1 and 4, decision table).**
- Item 4 prints `ask --kind stuck --issue <id>` in the brief. Item 1 refuses a worker's `ask`. The table says it "becomes" an escalation, and also lists `ask --kind lower --issue` as the worker's route.
- Today the jarl holds every escalation (`lib/ball.mjs`), so an escalation to a coordinator does not exist.
- The exit rests on the concept's best number (54% to 9%). As written, each use would trip a refusal, which mark 5 counts as a defect.
- Fix: refuse nothing, and route a worker's question to its coordinator's `next --as` list.

**C2. Item 1 polices failures no real loop has shown.** Run 2 is one agent typing violations on purpose, so it proves only that the tool allows them. In the real loop, 3 of 167 leased issues had an acceptance edit after the lease. Log notes give 003 to the jarl and tie 143 to an owner's ruling. 066 has no writer. Of 74 rulings, the owner made 52, the jarl 22, workers none, and worker.md never tells a worker to use `decide`. Section 7 admits writers have never run in a real loop. My verdict on each bullet:

| Refusal | Verdict |
|---|---|
| Acceptance, Tier, Kind, tag | Keep Acceptance and `identical-output`. Drop Tier and Kind, because the worker is already raised. Drop the uncounted eighth refusal, "must name its writer" |
| `decide` by a holder | Drop. The ruling already shows its author |
| Replaced holder's proof | Keep, as a filter in the done gate |
| Coordinator's ruling scoped to its slice | Defer. No command for widening is named |
| Worker's `ask` | Route (C1) |
| `stop` reach | Correct the sentence in commands.md |
| Owner's words on `answer`, `tick` | Drop. The answer text is already words an agent can type. Keep a digest line |

Two of the seven (the scoped ruling and `stop`) are changed semantics, not refusals.

**C3. Item 2's run lines cost more than the failure they remove.**
- *Failure rate:* the log's only mention of a second merger is the filing of 220, which came from a simulation.
- *Cost:* 99 worker names, 162 reviewer names and at most 73 merge shas give up to 334 raises, so about 670 lines. The coordinator's own writes today are 196 leases, 164 dones and 37 rounds, or 2.4 per closed issue. Run lines take that to about 6.5 and grow the log by a quarter. The report the concept cites ranks "the coordinator's cost per move" among the top three limits on speed.
- *It cannot tell what it claims to.* A live reviewer writes and commits nothing, so "its run silent" is true of live and dead reviewers alike. The built signal, proof with no verdict past the threshold, says the same.
- *It can lie.* A raiser that dies after the line and before the raise leaves a phantom run, the "waits for nobody" case item 2 lists as a loss.
- *Workers are double-recorded,* since the lease already holds them.
- *A second reviewer costs one review and corrupts nothing.*
- Fix: one merge-in-progress mark written by the merger, with death resolved through git. Everything else goes into known limitations, which 220's acceptance already allows. "One merger per checkout" needs a sentence in jarl.md: `Merger:` names who raises, not how many.

**C4. The concept adds words and retires none.**
- SKILL.md plus the five role references hold 19,475 words against a budget of 13,856. The whole skill holds 51,171.
- Searching the README for retire, remove, delete and shrink finds only section 5.6, which replaces 088's file count with words per role. That removes the measure the release is failing.
- The 6.3.0 items add 637 table words, about 14 concepts (run line, merge run, fence, coordinator standing, stage, constraint, reach, door, honest exit, call log, wrong guess and others), plus refusal text and command rows.
- Fix: keep 088's measure. Name the words retired for each word added.

## Important

**I1. A safeguard of item 1 rests on data the log lacks.** The text says the log "already holds" what a changed acceptance said. `bodyLine` keeps only the first line, cut at 120 characters, plus a length. Run 2's one-line acceptance hid this. The reviewer's diff needs the old text stored somewhere, so "Format: None" needs rechecking.

**I2. The lone-agent claim contradicts item 1.** Section 3 says the refusals "catch it grading itself". Item 1 says a lone agent working as the jarl is never treated as a worker. Only the built self-approve refusal applies there. Delete the claim.

**I3. Item 6 costs more than "a file the record does not read".**
- `brief`, `status` and `verify` promise to write nothing. Logging every call breaks that.
- Refusals have no codes. There are about 440 `need(` sites.
- The text does not say whether the file is committed, which matters across clones.
- "Wrong guess" misses the harmful case, a wrong call that succeeds.
- Item 1's new refusals inflate the number.
- Fix: log refused calls only, next version. 076 counts by hand until then.

**I4. Item 3's evidence does not show a constraint.** The 83% covers 13 of 127 units and mixes working with waiting. This loop's median cycle is 1.4 hours against a median lead of 39.3 hours, so work waits in the backlog, not in stages. Mark 9 says the loop "stops starting", while the limit is deferred. "Names the stage" has no rule. Keep the sort (merge before review before rework) and one count line, which is the cheap part.

**I5. The decision table is a tenth place.** The concept counts nine scattered places and removes none. Sixteen of its 29 rows are built, so a refusal or `next --as` already speaks for them. Nine more are one-way doors and owner matters, or say only who raises whom, already in AGENTS.md section 6 and the stop cases. Smallest form: two sentences on reach and reversibility in SKILL.md, and at most three "you do not" lines per role. The table stays in research.

**I6. Item 4 roughly doubles the brief and misses the real gap.** Issue 217's brief is 295 words. The worker's rows alone add 215, before the goal, the parent, the exit and the filing form. 18 of the 32 open or in-flight issues have an empty `Why`, so intent is missing at the filer. Fix: a note from `new` on an empty `Why`, the goal's first paragraph, the exit line, no table rows, and a stated word budget.

**I7. Labels need moving.**
- Items 2 and 6 and most of item 1 leave 6.3.0, as above. The first loop 6.3.0 drives and 076's blind runs should come first. Section 5.9 already calls the mid-model coordinator a hypothesis until those runs.
- Item 5: drop "the owner's ruling now". A question with no effect in this release spends his attention. Its "0 of 158" banner comes from a driver and a `(in x)` suffix, so file that as a bug.
- Item 10 moves to do not do as code. One sentence in the close procedure covers it.
- Item 9 needs the raiser's return line that C3 cuts. It waits with that.
- The do-not-do list is right, and nothing in it should be done. Its speculative queues, CRDT and interface rows are padding.

## Minor

- **M1.** Principles 1, 2, 4, 7 and 10 are honoured and lead to no item. They answer the request and change no decision. Span (17) borrows a limit on human attention, with no measurement for agents. No agent pays while the table stays in research. Mark them as context.
- **M2.** "About 19,000 words for a coordinator" reuses 088's count. By the note's own list (SKILL.md, jarl.md, models.md) the figure is 13,193, and section 5.6 calls that count the wrong measure.
- **M3.** Sections 5.7 and 5.8 change behaviour with no item, label or stated loss.
- **M4.** The fence shares the hole the concept plugs for `field`: an unnamed write passes.

## If only three stay for 6.3.0

1. **The doer cannot change its Acceptance or `identical-output`, and a replaced holder's proof does not count.** These protect the done gate's meaning, read facts mostly recorded already, and add no concept for an agent to learn.
2. **The honest exit, routed to the coordinator, with the goal's first paragraph in the brief.** The outside evidence is strongest here and the words are few.
3. **The end-of-line sort in `next --as` and one count line per stage.** One derivation, no new record, and it moves the jarl's attention to approved work first.

The merge-in-progress mark would be fourth.

## What survives

The separation-of-duties argument survives: the self-approve refusal rests on the same unverified names, so calling all refusals theatre was wrong. Reach and reversibility is the concept's best idea, and it fits in two sentences. Moving the stage limit to next version is right, because a limit needs numbers. The "not to do" verdicts hold. Item 11 costs little, though I found no real duplicate filing in the loop. The ten-part structure mostly exposes costs honestly. Its weakness is one habit: it reads the tool's gaps from a simulation and never reads the 223-issue loop's own numbers, which the tool prints on request.
