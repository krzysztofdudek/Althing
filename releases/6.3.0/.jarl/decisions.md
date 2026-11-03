# Decisions

## 2026-10-22 · everything-from-the-field-report-into-6-2-1
Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

**Settles:** 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013

**By:** owner

## 2026-11-02 · one-edit-rule-for-issues
Krzysztof, 2026-11-02 (translated from Polish), asked whether Jarl should be able to edit anything in an issue, as one consistent system, and on the proposal that every part of an issue's description is changeable with the old value logged while its history is only retracted or superseded, answered: "Yes". Issue 029 carries it into Jarl 6.2.1 and takes in 017.

**Settles:** 029

**By:** owner

## 2026-11-02 · ci-green-on-github-and-bounded-agents
Krzysztof, 2026-11-02 (translated from Polish): "And CI has to be clean on GitHub for Runes just as for Jarl. Right, I am going to sleep, you know what to do. You work autonomously. Do not let your agents run nondeterministic scripts, because their harness will stop them." Runes 1.1.0 and Jarl 6.2.1 are done only when their CI on GitHub is green on the exact commit that is tagged; Runes' release/1.1.0 is pushed under runes-push-branch so its CI runs on every merge. Workers and reviewers run only the bounded, plainly written commands their briefs allow.

**By:** owner

## 2026-11-03 · only-jarl-now
Krzysztof, 2026-11-03 (translated from Polish): "Well then, if it changes nothing, you do only Jarl, solely and exclusively." Runes 1.1.0 changes nothing Jarl needs, so Jarl 6.2.1 ships on the Runes 1.0.0 it vendors today, and the session works on Jarl 6.2.1 alone. Runes work stops where it stands: release/1.1.0 keeps what is merged, its open issues stay open in the 6.2.0 loop, and nothing of Runes is tagged or published now. Issue 027 (vendor Runes 1.1.0) leaves this release.

**By:** owner

## 2026-11-03 · split-jarl-lib-between-waves
Krzysztof, 2026-11-03 (translated from Polish), choosing option 1 of two (option labels, not his wording): split jarl-lib.mjs now, between waves: after the three packages in flight (028, 002, 015) are merged and before the rest of 6.2.1 starts, as a mechanical move along its sections with no change of behaviour (issue 030), so the remaining issues can run in parallel. No other Jarl package starts while the split is in flight.

**Settles:** 030

**By:** owner

## 2026-11-03 · ask-002
**Question:** Does the 6.2.1 loop pause until the direction from research/2026-11-03-jarl-as-a-loop-tool is settled? Context: the jarl-lib split (030) is in flight and changes no behaviour; most open issues are bugs or gaps the direction does not touch; three do: 007 (a review queue with batches: the batching rule waits for the measurement), 006 (a model ceiling: the model rules wait for the Haiku measurement) and 022 (reserved numbers: the id design of 031 changes how numbers are taken). Options (labels, not the owner's wording): (1) partial pause: 030 runs to the end, then the bugs and the untouched gaps go on, and 007, 006 and 022 wait for the direction; (2) full pause after 030: nothing new starts until the direction is settled, bug fixes included; (3) no pause: everything goes on, and 007, 006 and 022 may be built in a shape 6.3.0 reworks. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03 (translated from Polish), before answering: "Generally I will rather do one release, if not two." Asked whether that means one release with a partial pause, he answered "yes" (translated from Polish): option (1) of this question and one release of the two offered (option labels, not his wording). The full ruling is one-release-partial-pause.

**By:** owner

## 2026-11-03 · one-release-partial-pause
Krzysztof, 2026-11-03 (translated from Polish): "Generally I will rather do one release, if not two", and "yes" to the reading put to him (a-002). The work of the 6.2.1 loop and the direction of research/2026-11-03-jarl-as-a-loop-tool ship together as one release, numbered 6.3.0; a separate small patch goes out only if the duplicate-number defect (031) harms someone first. The loop pauses in part: the jarl-lib split (030) runs to its end, the bug fixes and the gaps the direction does not touch go on, and 007 (a review queue with batches), 006 (a model ceiling) and 022 (reserved numbers) wait until the direction is settled, because the batching rule, the model rules and the id design come from it. The renumbering itself (the release directory, its nodes, the goal, and the JarlSkill release branch, whose rename and push are his word) is done after 030 merges, so the split in flight is not disturbed; that timing is the analysis session's choice, not his wording.

**By:** owner

## 2026-11-03 · field-report-findings-held-for-triage
The 38 findings of research/2026-11-03-jarl-field-report-long-loop that survived the sceptic are not imported yet: the owner said, 2026-11-03 (translated from Polish), that after reading the summary he will go through the topics worth taking in and decide which go to the backlog and which into the 6.3.0 preparation. They are filed from materials/findings.json as he decides them, each with its Source; until then findings.json and issue 035 track them, and nothing of them is lost.

**By:** jarl
**Superseded by:** field-report-findings-all-into-6-3-0 (2026-11-03)

## 2026-11-03 · ask-001
**Question:** How does part 2 of research/2026-11-03-review-granularity-and-light-models run? Context: in 6.2.0, 83 of 127 merged units were already packages with one review, and a review took a median 8 minutes against 14 of work (materials/time-by-unit.md); whether a shared review misses more cannot be read from the record, because nothing says what was there to find. Options (labels, not the owner's wording): (1) replay on finished 6.2.0 work in Runes and JarlSkill, where the first reviewer's findings are known: 18 changes put back to the state their first reviewer saw (12 with a known Important finding, 6 that passed clean), reviewed in 6 groups of 3 by a fresh Opus and each alone by a fresh Opus, plus each alone by Haiku as a first reader; and 10 small bug fixes redone from their base by Haiku and by Sonnet, checked by the tests the accepted fix added and reviewed by Opus without being told the model; about 20 worker runs and about 62 reviews, nothing touches the release; (2) a live pilot in the 6.2.1 loop as first planned: no extra workers, but few simple issues, under 5 per model, no known answer for what a review missed, and it waits for 030; (3) the replay now, and a live trial of the review queue (007) once it is built. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03 (translated from Polish): "As for the measurement, Haiku: no. We will not do the measurement. We will rather choose models by feel." None of the options: part 2 of research/2026-11-03-review-granularity-and-light-models does not run, and models are chosen per task by judgment. A further clause of his about matching the right model to the right task came through garbled in transcription and is not quoted; it was flagged to him.

**By:** owner

## 2026-11-03 · release-6-3-0-one-coherent-version
Krzysztof, 2026-11-03 (translated from Polish): "Overall I would pull everything into 6.3.0; I would not do 6.2.1. The work done in 6.2.1 is one topic, but officially it goes into 6.3.0: that is done on purpose, to release it as one coherent version together with the fixes." No 6.2.1 is released: its work ships in 6.3.0, as one-release-partial-pause already says, and these are his own words for the renumbering. Whether everything also covers every checked finding of the field report, including the ones the analysis session placed after 6.3.0, is asked separately.

**By:** owner

## 2026-11-03 · ask-003
**Question:** Does 'everything into 6.3.0' (ruling release-6-3-0-one-coherent-version) cover all 38 checked findings of research/2026-11-03-jarl-field-report-long-loop, including those the analysis session placed after 6.3.0 (external requirements beyond import and sources, a visual verdict per image, a since view, a statistic of the coordinator's slips, the loop's language)? Options (labels, not the owner's wording): (1) all 38 are filed into this loop now, each one the direction touches waiting on 035, and the design keeps or drops each with a reason; (2) all but the after-6.3.0 group, which is filed and deferred to the release after; (3) the owner goes through them topic by topic as first planned (ruling field-report-findings-held-for-triage). Recommended: (1).
**Answer:** The owner chose option (1) (option label, not his wording), 2026-11-03: all 38 checked findings of research/2026-11-03-jarl-field-report-long-loop are filed into this loop now; each one the direction touches waits on 035, and the design keeps or drops each with a reason. The full ruling is field-report-findings-all-into-6-3-0.

**By:** owner

## 2026-11-03 · field-report-findings-all-into-6-3-0
The owner chose, 2026-11-03, option (1) of a-003 (option label, not his wording): all 38 findings of research/2026-11-03-jarl-field-report-long-loop that survived the sceptic are filed into the 6.3.0 loop now, each with its Source. Those the direction of research/2026-11-03-jarl-as-a-loop-tool touches wait on 035 (After), and the design keeps, reshapes or drops each with a reason; the rest are bug fixes and gaps outside the direction and go on under one-release-partial-pause.

**By:** owner
**Supersedes:** field-report-findings-held-for-triage

## 2026-11-03 · loop-tool-one-model-five-scenarios
Krzysztof, 2026-11-03 (translated from Polish): "Fine.", to the analysis session's proposal: before any critic sees it, the draft of research/2026-11-03-jarl-as-a-loop-tool is rewritten as one model (the levels and what each may read, write and raise, the ball, the way up, slices of the backlog per coordinator, generated briefs, safety with many sessions and machines, the line with Horde), and five end-to-end scenarios become the acceptance of 6.3.0 as a whole: a jarl splits the work between two coordinators and hears only what concerns it; a coordinator is replaced mid-slice with nothing lost; a stuck worker shows within minutes; two machines on one loop collide on nothing; the owner coming back reads one message of what waits on him. The issues waiting on 035 are mapped onto the model.

**By:** owner

## 2026-11-03 · ask-004
**Question:** Does 6.3.0 change how Jarl writes its record, once, with Horde re-vendoring Jarl in the same release? Context: the model's owner-only acceptance mark, one record for one review of several issues, a collision-proof key per issue so two clones can be repaired (technical critique I5), and the writer named on a write all change what the log or the issue file carries, so the record format rises; Horde vendors Jarl v6.1.0 (format 1 only) and already cannot read a loop the current Jarl starts (technical critique I10). Options (labels, not the owner's wording): (1) one format raise in 6.3.0 for every such change, the jarl-record/2 contract, and a Horde issue in this release to re-vendor Jarl, so the release is no longer Jarl alone; (2) no format change in 6.3.0: only what derives from what is already written (the list of what is on whom, briefs from the record, rules with a scope if they fit), and the mark, the shared-review record, the per-issue key and the writer wait for a later release. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03 (translated from Polish): "Fine, that suits me, it can be one. Horde is a topic for later, not now." He chose option (1) for Jarl (option label, not his wording) and left out its Horde part. The full ruling is one-format-raise-horde-later.

**By:** owner

## 2026-11-03 · one-format-raise-horde-later
Krzysztof, 2026-11-03 (translated from Polish): "Fine, that suits me, it can be one. Horde is a topic for later, not now." 6.3.0 raises Jarl's record format once, for every change the model needs that an older reader would misread (the owner-only acceptance mark, one record for one review of several issues, a collision-proof key per issue, the writer on a write, and any other such line the revised model keeps), with the record contract that goes with it. Horde is not part of 6.3.0: it re-vendors Jarl in a later release, and 6.3.0 stays Jarl alone. Added by the analysis session, not his wording, so that leaving Horde for later breaks no mission: Jarl 6.3.0 never raises the format of a loop run under a composer's profile (Horde's missions), and the features that need the new format stay off there until the composer reads it.

**By:** owner

## 2026-11-03 · ask-005
**Question:** Two machines on one loop: is 'caught and repaired at the next merge' acceptable in place of 'collide on nothing' (ruling loop-tool-one-model-five-scenarios)? Context: with the format raise of one-format-raise-horde-later, every issue gets a collision-proof key, so two issues that took one number in two clones are told apart and renumbered at the merge, and numbers are taken over every branch the clone knows; but the same issue leased in two clones before either pushes is only seen after the merge, because Jarl never pushes or fetches by itself (technical critique I4, I5). Options (labels, not the owner's wording): (1) caught at the merge: the record is never mixed, a doubled number is renumbered, a double lease shows to the jarl as a conflict, and the coordinator's brief says to pull before leasing and push right after, so a double lease is rare but possible; (2) prevented: a lease counts only once it is pushed, the coordinator's list shows a lease not yet on the remote and refuses to treat it as held, which needs a reachable remote for every lease. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03: "1": option (1), caught at the merge (option label, not his wording). The full ruling is two-machines-caught-at-merge.

**By:** owner

## 2026-11-03 · two-machines-caught-at-merge
Krzysztof, 2026-11-03, chose option (1) of a-005 (option label, not his wording): for two machines on one loop, 'collide on nothing' in ruling loop-tool-one-model-five-scenarios reads as caught and repaired at the next merge. The record is never mixed: every issue carries a collision-proof key, numbers are taken over every branch the clone knows, a number taken twice is renumbered at the merge, and a lease taken in two clones shows to the jarl as a conflict. The coordinator's brief says to pull before leasing and push right after; Jarl itself never pushes or fetches. Scenario 4 of issue 076 is narrowed to this.

**By:** owner

## 2026-11-03 · ask-006
**Question:** May an acceptance line be marked as one only the owner can tick, and does done refuse while such a line is unticked (issue 039)? Context: done reads a proof row and a fresh approve and never an acceptance line; in the field a task whose acceptance needed the owner's sign-off on images was closed after its merge and reopened by hand. Options (labels, not the owner's wording): (1) the mark exists, the line holds the ball on the owner, and done refuses until he ticks it; (2) the mark exists but done only warns and closes; (3) no mark: the owner's sign-off stays a separate question. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03 (translated from Polish): "We can do that, add such a mark; there is only one rule. I must get the material I am to review and a clear instruction of what to check. While writing the backlog we will agree with the Jarl which elements I want to accept myself. In another session I had to say 'pause at this stage, I want to see something', instead of it simply letting me verify that stage. So at the level of backlog work it will be said clearly that I want to receive such an artifact. That is all." Option (1) with his rule. The full ruling is owner-sign-off-with-material.

**By:** owner

## 2026-11-03 · owner-sign-off-with-material
Krzysztof, 2026-11-03, chose option (1) of a-006 (option label, not his wording) with a rule of his own: an acceptance line may be marked as one only the owner ticks, and done refuses while it is unticked, but such a line must name the material he is to review and a clear instruction of what to check; which elements he signs off himself is agreed with the jarl while the backlog is written, so a stage he wants to see is a stated checkpoint, not a pause he has to call. The analysis session reads it so: the line puts the ball on the owner only once its material exists (until then it is on whoever produces it), it reaches him in the digest with the material and the instruction, and work that must wait for his look waits on that issue (After).

**Settles:** 039

**By:** owner

## 2026-11-03 · identical-output-light-review
Decided by the analysis session under the standing mandate (autonomy-quality), after the owner said he did not follow the question (a-007): a change meant to alter nothing, whose output is shown identical before and after, keeps its fresh review, which may be a light one that checks only that the comparison covers everything the change touched; the comparison is recorded as evidence. This keeps the rule that nothing closes without someone having looked. Replacing the review stays possible only by the owner's own waiver for named issues (004). Filed for his ratification.

**Settles:** 049

**By:** jarl

## 2026-11-03 · ask-007
**Question:** May a comparison showing that a change's output is identical before and after stand in for the fresh review of a change meant to alter nothing (issue 049)? Context: in the field report a rearrangement of about 600 lines in 10 files left all 73 generated pages identical to the byte, and its review found nothing; issue 004 already plans an owner's waiver of review for named issues. Options (labels, not the owner's wording): (1) the review stays, but light: a cheap reviewer checks only that the comparison covers everything the change touched; (2) with the owner's waiver for that issue (004), the comparison recorded as its evidence replaces the review; (3) a full review as today. Recommended: (1).
**Answer:** Withdrawn as a question: the owner said he did not follow it; the option that keeps the review was taken under the mandate, ruling identical-output-light-review, filed for his ratification.

**By:** jarl

## 2026-11-03 · ask-009
**Question:** Does Jarl print in the loop's language (issue 048)? Context: Jarl prints English whatever the language of the goal and the titles; in the field a loop's goal and titles were Polish, and reviewers read Polish titles over English text. Options (labels, not the owner's wording): (1) Jarl stays English and a loop may be written in any language; (2) a loop names its language at init and Jarl prints in it, which means every printed text exists in each language Jarl supports. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03 (translated from Polish): "Jarl is language-agnostic; the environment and the user decide. We do not define it." The full ruling is jarl-language-agnostic.

**By:** owner

## 2026-11-03 · jarl-language-agnostic
Krzysztof, 2026-11-03 (translated from Polish): "Jarl is language-agnostic; the environment and the user decide. We do not define it." Jarl gets no language setting and no translated output: a loop's goal, titles and text are in whatever language its user writes, and the agent speaks to its user in the user's language. Issue 048 is dropped on this ruling.

**Settles:** 048

**By:** owner

## 2026-11-03 · ask-010
**Question:** Does a sixth scenario, one agent alone, join the five of ruling loop-tool-one-model-five-scenarios (issue 076)? Context: the owner's aim is a loop for one agent or many; both the fidelity and the maintenance critic found the lone agent missing from draft 2. The scenario: a loop runs from init to close with init, new, next, evidence, review, set done, ask and decide, no goal line beyond the goal, and the owner's review shown as his to start. Options (labels, not the owner's wording): (1) yes, six scenarios; (2) no, the five stay. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03 (translated from Polish): "yes", after the question was put to him again in plain words (a sixth exam for one agent working alone, with no coordinators: Jarl asks for no extra setup and says plainly when the owner must start a fresh session to review). Option (1) (option label, not his wording). The full ruling is sixth-scenario-one-agent-alone.

**By:** owner

## 2026-11-03 · sixth-scenario-one-agent-alone
Krzysztof, 2026-11-03 (translated from Polish): "yes", to adding a sixth scenario to the five of ruling loop-tool-one-model-five-scenarios: one agent alone runs a loop from init to close with init, new, next, evidence, review, set done, ask and decide, no goal line beyond the goal, and when a review is needed Jarl says plainly that the owner must start a fresh session to review the named issues.

**Settles:** 076

**By:** owner

## 2026-11-03 · ask-011
**Question:** May an approve given by an automatic reviewer (a bot on pull requests) ever clear an issue in place of a fresh reviewer (issue 041)? Context: in the field report a bot gave 65 of 136 verdicts and Jarl counted them as fresh reviews. Options (labels, not the owner's wording): (1) never: a bot's verdicts are recorded and counted apart, its findings are welcome, but only a fresh agent's or a person's approve clears; (2) yes, where the owner's ruling names the bot for a loop. Recommended: (1).
**Answer:** Krzysztof, 2026-11-03 (translated from Polish): "1, but it also depends on the loop: whether we iterate locally or on pull requests (to a feature branch, for example). There, other bots may come in, like CodeRabbit or Copilot. As a rule I work only in local mode. The loop should define what an approved issue means." The full ruling is approval-defined-by-the-loop.

**By:** owner

## 2026-11-03 · approval-defined-by-the-loop
Krzysztof, 2026-11-03 (translated from Polish): "1, but it also depends on the loop: whether we iterate locally or on pull requests (to a feature branch, for example). There, other bots may come in, like CodeRabbit or Copilot. As a rule I work only in local mode. The loop should define what an approved issue means." Each loop defines what an approved issue is: which reviewers' approves clear it (a fresh agent, the owner, a bot the loop names) and what must come with them. With no definition, option (1) of a-011 holds: a bot's verdicts are recorded and counted apart, its findings are welcome, and only a fresh agent's or the owner's approve clears. Built today: a profile's done gate already says approve fresh or none, requires-merged and required slots; the definition extends that.

**Settles:** 041

**By:** owner

## 2026-11-03 · subagents-can-nest
Krzysztof, 2026-11-03 (translated from Polish): "In general a subagent can run subagents; there is no problem with that." On the owner's hosts a coordinator raised by the jarl raises its own workers and reviewers and waits on them, so nothing reaches the jarl but escalations (research/2026-11-03-jarl-as-a-loop-tool, report section 5). The relay of references/jarl.md stays for hosts where a raised agent cannot raise agents. Not verified by a run in the investigation; scenario 1's live run checks it.

**By:** owner

## 2026-11-03 · decide-without-by-is-the-coordinators
Under autonomy-quality: in Jarl 6.3.0 a ruling recorded with no --by is the coordinator's, not the owner's (issue 005), so nothing is attributed to the owner that he did not say; a ruling by the owner carries his words. This changes a default an older loop relied on.

**By:** jarl

## 2026-11-03 · ask-008
**Question:** Ratify identical-output-light-review: a change meant to alter nothing keeps a light fresh review that checks the comparison covers the change; only your own waiver for named issues (004) replaces the review.
**Answer:** ok — Krzysztof, 2026-11-03, ratifying identical-output-light-review: a change meant to alter nothing keeps a light fresh review that checks its comparison covers the change; only his own waiver for named issues (004) replaces the review.

**By:** owner

## 2026-11-03 · release-fast-light-models-grouped-reviews
Krzysztof, 2026-11-03 (translated from Polish), agreeing to the analysis session's proposal: "Yes, and grouped reviews too, because I want to release Jarl 6.3.0 quickly." For the rest of the 6.3.0 loop: small issues that a test decides (refusal texts, notes, small views) go to Haiku workers, neighbouring ones in packages; reviews are grouped, one fresh reviewer over up to four small issues of one area, never over a record format change, the core of the direction (052, 083, 084, 085, 086) or an issue with an owner-only line; a reviewer is never weaker than the worker (Sonnet or Opus over Haiku work) and re-runs each command a proof row names; Opus stays on format changes, the core and takeovers. The grouping limit and the split are the analysis session's proposal, not his wording.

**By:** owner

## 2026-11-03 · retracted-note-reason-hidden-from-workers
Decided by the analysis session (design of research/2026-11-03-jarl-as-a-loop-tool), asked by 019's worker: what a worker reads (show, and later the brief of 058) hides a retracted note and the reason of its retraction alike, and says only how many notes were retracted, so an absence is never silent; the reason stays in the log and in the full history, where the coordinator and reviewers read it. A reason often restates the claim it retracts, and a correction that a worker must follow is written as a new note, not as a reason. A note's retraction reuses the shape of a row's retraction and rides the single format raise of 083.

**Settles:** 019

**By:** jarl

## 2026-11-03 · ambiguous-number-cannot-close
Under autonomy-quality: for a number the log cannot attribute (shared now or once), Jarl 6.3.0 refuses approve, merged and done instead of reconstructing each file's proof, because six reviews found a new way for a reconstruction to close an issue on another's proof. Such work is filed again under a new number; the per-issue key (084) removes the case. This narrows issue 031 to detection, refusal and honest docs.

**By:** jarl

## 2026-11-03 · normalize-the-surface-old-forms-out
Krzysztof, 2026-11-03 (translated from Polish): "Yes, we normalize. But the old ones out too." Jarl 6.3.0 normalizes its command surface (one command for every field of an issue, one meaning per flag name, one name for free text, one rule for the author, read views folded around next --as, every refusal ending with a ready command) and removes the old forms instead of keeping them as aliases. Added by the analysis session, not his wording: a removed form is refused with one line naming the form that replaces it, so nothing is left to guess; Althing's skills and brief templates move to the new forms when its driver Jarl moves to 6.3.0, and Horde when it re-vendors Jarl.

**By:** owner

## 2026-11-03 · surface-may-break-nothing-lost
Krzysztof, 2026-11-03 (translated from Polish): "It can be breaking. The API surface for the agent is flexible, and we break nothing as long as we lose nothing." The surface of 096 may change incompatibly; what must hold is that no capability is lost: every function a removed form had is reachable through a new form, and every loop written before stays readable.

**Settles:** 096

**By:** owner
