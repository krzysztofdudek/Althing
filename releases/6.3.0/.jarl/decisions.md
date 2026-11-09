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
**Superseded by:** decide-needs-an-author (2026-11-08)

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
**Superseded by:** surface-easy-for-agents (2026-11-03)

## 2026-11-03 · surface-easy-for-agents
Krzysztof, 2026-11-03 (translated from Polish), correcting the reading of his earlier words: "I mean, I do not know about the condition that we lose nothing; I simply want a nice Jarl with a nice API that an agent finds easy to use and understand. That is all." The aim of 096 is an API an agent finds easy to use and understand; breaking the old surface is allowed. The formal test that every removed form maps to a new one is dropped; ease is checked instead: a fresh agent on the light tier, given only SKILL.md and the help, does a set of ordinary tasks without a call refused for a wrongly guessed form (that check is the analysis session's proposal, not his wording).

**Settles:** 096

**By:** owner
**Supersedes:** surface-may-break-nothing-lost

## 2026-11-03 · takeover-limit-in-the-goal
Under autonomy-quality, with the reviewer's agreement (rev-jarl-066-opus): the takeover limit per kind is set by a goal line (Takeover (kind): n, bare Takeover: n for the other kinds), not by a profile key, because the pinned driver (6.1.0) that writes this loop refuses an unknown profile key and ignores an unknown goal line. A profile key can replace it with the format marker of 083. This narrows 066's acceptance (a profile may set the limit) to the goal.

**By:** jarl

## 2026-11-03 · findings-outside-the-issue-are-filed
Krzysztof, 2026-11-03 (translated from Polish), after a loop in his other work let a one-line text change grow over three rounds because its worker and reviewers kept fixing unrelated gaps a check surfaced, and its coordinator kept adding scope: "By default the worker and the reviewer judge the work they were given, and when they find something they put it into the backlog, and at most they report that the agent ran into something and ask what we do with it. But always recorded, not that we suddenly fix everything in the universe along the way." Jarl's guidance already says nobody fixes on the side; 6.3.0 makes it a built-in rule for the worker, the reviewer and the coordinator (086), and gives the reviewer a way to file a finding outside the issue without turning its verdict to changes (097).

**By:** owner
**Superseded by:** findings-outside-the-issue-are-filed-098 (2026-11-03)

## 2026-11-03 · findings-outside-the-issue-are-filed-098
Same ruling as findings-outside-the-issue-are-filed, with its issue number corrected: the reviewer's way to file a finding outside the issue without turning its verdict to changes, and the note on a scope that grows after the lease, are issue 098 (097 is another issue). Krzysztof, 2026-11-03 (translated from Polish): "By default the worker and the reviewer judge the work they were given, and when they find something they put it into the backlog, and at most they report that the agent ran into something and ask what we do with it. But always recorded, not that we suddenly fix everything in the universe along the way." Built-in rules for the worker, the reviewer and the coordinator are in 086.

**Settles:** 098

**By:** owner
**Supersedes:** findings-outside-the-issue-are-filed

## 2026-11-03 · older-reader-says-needs-format-3
Under autonomy-quality, with the reviewer's agreement (rev-jarl-083-opus): a frozen older Jarl refuses a loop of format 3 with its own message (6.2.0: needs a Jarl that knows format 3; 6.1.0: upgrade this one); it cannot name a release, because it predates it. 083's acceptance asked for a message naming the Jarl that wrote the loop; it is narrowed to: this Jarl's own refusal names the format and the release that reads it (record.md and the CHANGELOG say format 3 is Jarl 6.3.0), and a frozen reader's wording is its own.

**By:** jarl

## 2026-11-03 · ask-012
**Question:** Ratify: in Jarl 6.3.0, decide with no --by records the ruling as the coordinator's instead of the owner's (ruling decide-without-by-is-the-coordinators, issue 005), and a ruling by the owner must carry his words. Keep it?
**Answer:** tak — Krzysztof, 2026-11-03, ratifying decide-without-by-is-the-coordinators: in Jarl 6.3.0 a ruling recorded without --by is the coordinator's, not the owner's, and a ruling recorded as the owner's must carry his words.

**By:** owner

## 2026-11-03 · all-minors-stay-in-6-3-0
Krzysztof, 2026-11-03 (translated from Polish), asked whether the smallest issues that reviews filed on the side may wait for the next patch so 6.3.0 goes out sooner: "2" (option label, not his wording): no, everything stays in 6.3.0, as one coherent version (ruling release-6-3-0-one-coherent-version); the release goes out later by the time these issues take. The release session works them as small Haiku packages with grouped reviews (ruling release-fast-light-models-grouped-reviews).

**By:** owner
**Superseded by:** known-limitations-list-for-wording-minors (2026-11-05)

## 2026-11-03 · cli-version-note-uses-claude-plugin-root
The resume note for a CLI whose version differs from the server's reads CLAUDE_PLUGIN_ROOT (the plugin root a host exports); it is silent when the variable is unset, never a refusal, and no record shape changes. Option 2 (reading the host's installed-plugins file) is not taken because it depends on a file the host owns; option 3 (writing the version into the loop) waits for a format raise that nothing else needs. Made for issue 071 under the autonomy-quality mandate.

**By:** jarl

## 2026-11-04 · fold-tips-and-queue-into-resume
Under autonomy-quality, inside the owner's ruling normalize-the-surface-old-forms-out and surface-easy-for-agents, and issue 096's acceptance (a view that only shows part of another is folded into it and refused with the view that replaces it): tips and queue are removed as commands, because resume already prints both in full (tips per repository, the merge queue in batches). resume takes --repo to narrow the tips and the queue to one repository, so a merger loses no view; a refused tips or queue names resume. branches stays: it lists worker branches with their state, which resume does not print in full. Not a choice reserved to the owner: it applies his ruling.

**By:** jarl

## 2026-11-04 · horde-leaves-the-family
Krzysztof, 2026-11-04 (translated from Polish): "We could go through the places where Horde is written down: my profile repository, the landing page, the READMEs of the other repositories, because it is written into the family there. We could simply remove Horde there, and switch the repository itself to private. Because right now, really, I would say that I see no gain. […] What I used is Grain, Jarl and Yggdrasil, really. Besides that, the smaller skills. […] So maybe Horde has to be removed from the family." A few minutes later: "If anything, let's just put it all on the main branch everywhere." Horde leaves the family. The core is Jarl, Yggdrasil and Grain on one version number; the add-ons stay Ratatoskr, Urd and Researcher. The canon, the registry (Horde stays there as a retired entry, because the 6.1.0 and 6.2.0 manifests list it), the map and the contracts index change first. Every family README, Yggdrasil's contracts page, Grain's CI seam job, the profile and the website follow on each repository's main branch, pushed on this word, and the Horde repository becomes private. Althing's research, rulings and loops that name Horde stay as written: they are history. Jarl's own skill text, references and tests change on the 6.3.0 release branch, which rewrites those files anyway. What the Horde-shaped constraints of this loop become (the frozen jarl-record/1 exports, the protections for a composer's loop, the Horde half of one-format-raise-horde-later) is an issue for the release to settle.

**By:** owner

## 2026-11-04 · horde-constraints-fall-away
Under autonomy-quality, on the owner's decision as relayed by the Jarl Evolution session on 2026-11-04 (the relay's words, not his own): Jarl is to be simply fixed, with no further questions, because Horde has left the family (ruling horde-leaves-the-family) and the constraints kept only for it fall away. (1) The freeze of record.mjs exports that briefs/worker-jarl.md names, and Horde re-vendoring Jarl's code at the tag, are gone. (2) The Horde half of ruling one-format-raise-horde-later is gone: Horde is no longer a later topic. A line shape that the pinned 6.1.0 driver or Jarl 6.2.0 would misread still rides the one format raise (needFormat in lib/profile.mjs), and a composer profile that keeps its loop's format stays a mechanism of the tool until an issue removes it; no code is deleted on this ruling alone. (3) The jarl-record/1 contract test (RECORD_API in tests/record-contract.test.mjs) stays: it guards Jarl's own surface. (4) Horde is removed from the skill, the references, the comments and the tests on the release branch (issue 125). Settles issue 125 acceptance line 2.

**Settles:** 125

**By:** jarl

## 2026-11-04 · refusals-end-in-a-form-not-a-guess
Under autonomy-quality, at the owner's word 'do it so that it is good' and his question 'which is better in quality' (2026-11-04, translated from Polish; he did not choose an option): no refusal of Jarl ends with a corrected call the tool composed for the caller. Every refusal says what is wrong, in a reason that names the caller's wrong word, and ends with the form of the command that does what was meant, with a one-token placeholder from the closed registry for the value only the caller knows; a removed command ends with the form of the command that replaces it (field <ids> Priority <value>). Pasted unfilled, such a line is refused for its placeholder and writes nothing. Why: six reviews of issue 096 each found one more case in which a composed runnable line, pasted, did something other than the call meant (a word lost, a flag with its value dropped, a second call that ran after the first was refused); the class is removed, not another instance of it. Ready commands that carry no guess (a step the caller must take, shown as its own command) stay as commands. The acceptance line 'ends with a ready command or the flag to add' is met by the form with its placeholder. a-014 stays open for the owner's confirmation.

**Settles:** 096

**By:** jarl

## 2026-11-04 · host-rules-place-worktrees-and-scratch
The host's rules decide where working copies and temporary files live, and they stand over Althing's method and over Jarl's habits (the rules of the owner's WorkspaceSetup, in force from 2026-11-04, relayed to this loop on the owner's word; they are not his own words here). Working copies (git worktrees) of every repository on a host live in one place, ~/Worktrees/<Repository>/<name>; a finished one is removed at once with its branch by whoever merges or drops the work. Temporary files, including the TMPDIR of a test run, live in a folder made with mktemp -d under the system temporary directory, never in a folder of the home. This replaces the worktree root ~/.jarl-wt and the scratch place ~/Temp/tmp that Althing's method named, and the placing in the standing ruling worktrees-outside-tmp of the ledger; that ruling's reason stands (nothing an unfinished piece of work needs lives in a temporary place) and its owner's words are untouched.

**By:** jarl

## 2026-11-05 · ask-015
**Question:** The host's rules put working copies under ~/Worktrees/<Repository>/<name>. Jarl writes a lease's worktree path into the loop record, and Althing's private-paths rail (rails/paths.mjs, ALLOWED_WORKTREE) allows that only under ~/.jarl-wt, so the loop cannot commit a lease (issue 096's header and log line 1208 are refused today). The fix is one narrow change to that regex (issue 143, written and tested in the worktree jarl/143-host-worktree-place, 100 tests green, not committed). The gate will not take it without your admission: rails/paths.mjs is the code of two rules that reach whole node types, boundary/no-private-paths and links/resolve, so editing it voids your ratification of 2026-10-06 and each must be admitted again with yg log add --aspect <rule> --ratify. Options: (1) admit the narrow change and re-ratify the two rules (recommended); (2) leave the rail alone, record new leases with no worktree path and rewrite the two existing lines of the 096 lease by hand (a loss of the worktree in the record, and a hand edit of the log); (3) make the two rules advisory until you can look at them.
**Answer:** Krzysztof chose option (1) of a-015, to admit the narrow change of the private-paths rail (issue 143) and to ratify boundary/no-private-paths and links/resolve again himself (an option label, not his wording).

**By:** owner

## 2026-11-05 · ratify-the-rails-change-by-the-coordinator
Krzysztof, 2026-11-05 (translated from Polish), to the question of re-admitting boundary/no-private-paths and links/resolve after the narrow change of issue 143 (he had chosen, the day before, to admit the change and to ratify the two rules himself, an option label, not his wording): "You do it yourself. You can. I am asleep." The coordinator records the two re-admissions in the aspects' logs on this word, by the coordinator, with that attribution in each entry; the owner's own ratification stays his for any other rule.

**Settles:** 143

**By:** owner

## 2026-11-05 · jarl-runs-on-mac-windows-linux
Krzysztof, 2026-11-05 (translated from Polish): "Do it as you did, because quality matters to me. And remember that Jarl has to work on Mac, Windows, Linux, by the way." Jarl 6.3.0 works on macOS, Windows and Linux. What a worker builds and a reviewer judges holds on all three: paths and separators, line endings, the shell a printed command is pasted into (a form that Jarl prints must be pasteable in a POSIX shell, in PowerShell and in cmd, or must say which it is for), no tool assumed that only one platform has, and the tests that cannot run on one platform skip there with a stated reason and never disappear. CI runs the suite on a Windows runner as well. The way of working stays the same as before: a worker per issue and a fresh reviewer, no shortcut for speed.

**By:** owner

## 2026-11-05 · 096-ends-with-one-narrow-review
Krzysztof, 2026-11-05 (translated from Polish), after the coordinator told him that issue 096 had no end because 'a printed line can never be misused' cannot be proven, and offered two ways out: he chose option 1, 'we finish now' (an option label, not his wording). Issue 096 is accepted in its present state after ONE narrow review of the branch tip: the acceptance lines of the issue and the single question whether pasting an unfilled form writes anything. Findings of that review that are not an unmet acceptance line, a weakened test, a red suite, a regression against release/6.2.1 or an unfilled form that writes are filed as issues of their own, and the review is not repeated for them.

**Settles:** 096

**By:** owner

## 2026-11-05 · ask-013
**Question:** Confirm in your own words that the constraints kept only for Horde fall away: the freeze of record.mjs exports, Horde re-vendoring Jarl at the tag, and the Horde half of one-format-raise-horde-later (ruling horde-constraints-fall-away, recorded from the Jarl Evolution session's relay of your decision of 2026-11-04). The jarl-record/1 contract test stays.
**Answer:** yes. Krzysztof chose 'I confirm all three' (an option label, not his wording) on 2026-11-05: the freeze of record.mjs exports, Horde re-vendoring Jarl at the tag and the Horde half of one-format-raise-horde-later fall away; the jarl-record/1 contract test (RECORD_API) stays.

**By:** owner

## 2026-11-05 · ask-014
**Question:** Issue 096, after six reviews: should a refused call end with a line that can be run as printed, or always with the command's form with a placeholder to fill in? Today a refusal can print a corrected call that runs (a value in the wrong case fixed, a removed command such as prio or body replaced by field). Six rounds of review kept finding that such a line, pasted, does something slightly other than the call meant: a word lost, a flag with its value dropped, a second call that runs after the first was refused. Options: (1) keep runnable lines and fix this round's findings, with another review round; (2) no refusal ends with a runnable corrected call: every refusal says what is wrong and ends with the command's form and a placeholder (a removed command ends with the field form that replaces it), which removes the whole class and costs the agent one step to fill the value in; (3) keep runnable lines only for the removed commands with the plainest forms (prio, tag with one change) and the placeholder form for everything else. Recommendation: (2).
**Answer:** Krzysztof chose 'it stays: the form with a placeholder' (an option label, not his wording) on 2026-11-05: a refusal ends with the form of the command with a placeholder to fill in, never a corrected call composed for the caller (ruling refusals-end-in-a-form-not-a-guess).

**By:** owner

## 2026-11-05 · outside-finding-found-by-reviewer-where-names-the-review
Under autonomy-quality, where the acceptance line of issue 098 and its own Changelog line disagree (code-docs-conflicts: an obvious reading, no real choice of behaviour): the acceptance says each finding filed outside the issue is a new issue 'whose finder is the reviewed issue'; the Changelog line says 'found by that reviewer'; this loop's every issue has Found by naming the reviewer and Where naming the review of the reviewed issue. A new issue filed by review --outside therefore has Found by = the reviewer's name and Where = 'the review of <reviewed id>', and the acceptance line is read that way: the finding traces to the reviewed issue through Where. Not a choice that is the owner's.

**Settles:** 098

**By:** jarl

## 2026-11-05 · known-limitations-list-for-wording-minors
Krzysztof, 2026-11-05 (translated from Polish), asked how to treat the minor findings of reviews that are not a defect of the code but a matter of wording, taste or a very strange input, because the reviews add them faster than the issues close: he chose 'a list of known limitations' (an option label, not his wording), and narrows his ruling all-minors-stay-in-6-3-0 as follows. A DEFECT (something does not do what the code or the docs say it does, or does something the call did not mean) stays an issue of 6.3.0 and is fixed in it, whatever its priority; nothing of that ruling changes for defects. A finding that is only a matter of wording, taste or an input no one is expected to give is not filed as an open issue: the coordinator records it in one note of the release, the list of known limitations (releases/6.3.0/plans/known-limitations.md), with the review it came from and one sentence, and the release notes may carry it. The coordinator decides, under autonomy-quality, which side a finding falls on and records the reason; a finding in doubt is a defect. An existing open issue that is only wording, taste or a strange input is moved to the list and dropped with that reason.

**By:** owner
**Supersedes:** all-minors-stay-in-6-3-0

## 2026-11-05 · import-reports-changes-for-claim-and-truth-findings
Krzysztof, 2026-11-05 (translated from Polish), after four review rounds of issue 044 and the finding that findings with neither a claim nor a truth (only evidence and a proposal) carry no mark in the issue file by which import could know the issue as its own: he chose 'say it plainly and leave it' (an option label, not his wording). Import reports a changed finding for the findings that carry a claim or a truth, compared with the issue import itself filed for them (recognised by the issue file: its Source is that finding alone, its Found by is what the run writes, its What opens with the claim or truth import writes). Findings with neither are not compared; the reference, the usage line, the import summary and the CHANGELOG say so in one sentence, with a test. No new record shape and no format raise are added for it.

**Settles:** 044

**By:** owner

## 2026-11-06 · 079-fallback-is-the-open-branch
Under autonomy-quality, on the review of package B: acceptance line 1 of issue 079 says the base check falls back to the release branch the manifest or goal names. Jarl reads no manifest of any family and no goal line names a branch, so building that fallback would add a reader no other part of Jarl has. The line is narrowed: the base check reads the repository's declared base (repo --base), and with none declared it falls back to the branch the repository's main checkout has open, which is the behaviour of the branch under review; the changelog says so. Chosen for fewer false greens over a new reader of a file that does not belong to Jarl.

**By:** jarl

## 2026-11-08 · 033-older-tip-line-is-a-known-limit
Under autonomy-quality, on the worker's report for issue 033: a tip line now counts only as the next line after its row under the same stamp, a close records its tip, and a closed issue's gate is read against it. What stays: a line written by an older Jarl's log command, in the same minute and directly after its row, still counts as that row's tip, because nothing an older log command can write distinguishes it without a record format raise that would hit every loop that records a row. The remainder is listed as a known limitation (an input no one is expected to give: a forged line in the same minute, written by an older tool, directly after the row) and not bought with a format raise. Quality over a raise that older readers would refuse.

**By:** jarl
**Superseded by:** 033-tip-mark-closes-the-older-line (2026-11-08)

## 2026-11-08 · 045-model-offer-is-the-leases-answer
Under autonomy-quality, on the review of issue 045: the acceptance says next --as jarl offers the Model lines once when the first agent is leased. A view cannot write, so a row in a view stands until the lines exist (shown on every call, and shown to a lone agent that raises nobody), which is not once. The offer is therefore made by the lease command, which writes the remembering log line and prints the offer in its own answer, once; the views hold no models row. This changes where the offer is made from the acceptance's next --as jarl to the answer of the lease that writes; chosen for fewer false greens and a quiet coordinator list over a literal reading that cannot be once.

**By:** jarl

## 2026-11-08 · ask-016
**Question:** Issue 016, third acceptance line: 'done lists each acceptance line no Proof row names'. Nothing in the record links a proof row to an acceptance line today. Options: (a) a --line <n> option on evidence, exact, but a new log line shape that rides the one format raise; (b) match a row to a line by its text: no format change, but fuzzy, so done can only warn; (c) keep today's count note and, when rows are fewer than lines, require the done text as the reason: smallest, names no line. The other parts of 016 (the done-gate profile setting and the plain note after an approve) are built. Recommendation: (b), a warning that names the lines no row mentions by words, because it changes no record shape.
**Answer:** Krzysztof chose option (a), a --line <n> option on evidence, exact, riding the one format raise (an option label, not his wording); the coordinator had recommended (b).

**By:** owner

## 2026-11-08 · 016-proof-rows-name-their-line
Krzysztof, 2026-11-08, chose option (a) of a-016 (an option label, not his wording; the coordinator had recommended (b)): an evidence row names the acceptance line it proves with a --line <n> option, so done can list exactly each acceptance line that no proof row names. The option is a new log line shape that rides the one record format raise to 3 of this release, raised on first use only and never for a loop that does not use it; older readers refuse such a loop with their own message.

**By:** owner

## 2026-11-08 · ask-017
**Question:** Ratify: the fallback of the merge note's base check (issue 079, ruling 079-fallback-is-the-open-branch): with no declared base, Jarl falls back to the branch the main checkout has open, and does not read a release branch from a manifest or the goal, which no part of Jarl reads. The acceptance line of 079 asked for the manifest or goal fallback. Keep the narrowing?
**Answer:** Krzysztof chose to keep the narrowing (an option label, not his wording): with no declared base the merge note falls back to the branch the main checkout has open; Jarl reads no manifest.

**By:** owner

## 2026-11-08 · ask-018
**Question:** Ratify: issue 033 leaves one case open on purpose (ruling 033-older-tip-line-is-a-known-limit): a tip line written by an older Jarl's log command, in the same minute and directly after its row, still counts as that row's tip. Closing it needs a record format raise that every loop recording a row would carry and the pinned first driver would refuse. Keep it a known limitation?
**Answer:** reject: Krzysztof chose, instead of the known limitation, to raise the format with a tip mark before the separator, so the tip line of an older log command no longer counts (an option label, not his wording).

**By:** owner

## 2026-11-08 · 033-tip-mark-closes-the-older-line
Krzysztof, 2026-11-08, rejected the known limitation of ruling 033-older-tip-line-is-a-known-limit (answer to a-018, an option label, not his wording): the tip line of an older log command is closed out with a tip mark before the separator that rides the one record format raise to 3, raised on first use only. Issue 192 carries the work.

**By:** owner
**Supersedes:** 033-older-tip-line-is-a-known-limit

## 2026-11-08 · ask-019
**Question:** Ratify: the Model-lines offer of issue 045 is made by the answer of the lease command, once, not by a row of next --as jarl (ruling 045-model-offer-is-the-leases-answer): a view cannot write, so a row there would show on every call. Keep the change of place?
**Answer:** yes: Krzysztof chose to keep the offer in the answer of the lease command, once, with no row in the views (an option label, not his wording).

**By:** owner

## 2026-11-08 · decide-needs-an-author
Krzysztof, 2026-11-08, chose to replace the ruling decide-without-by-is-the-coordinators (an option label, not his wording; the coordinator had recommended it): since issue 096 makes --by required on decide, a ruling always names its author, and the case of an unnamed decide read as the coordinator's can no longer occur. The guidance and tests that still describe an unnamed decide are corrected under issue 122.

**By:** owner
**Supersedes:** decide-without-by-is-the-coordinators

## 2026-11-08 · rewrite-unpublished-commits-to-drop-the-agent-trailer
Krzysztof, 2026-11-08, chose to rewrite the history of the unpublished release branch of Jarl before it is pushed, to drop the agent trailer from its commits (an option label, not his wording; the coordinator had recommended it): the branch exists only on the working machine, the trailer is forbidden by his rule of 2026-11-06, and the rewrite keeps every message and tree except the trailer lines. It is done once, at the end of the 6.3.0 loop, before any push. Issue 166 carries the work.

**By:** owner

## 2026-11-08 · canon-names-jarl-without-a-version-number
Krzysztof, 2026-11-08, chose the wording without a version number for the canon's sentence on Jarl (an option label, not his wording; the coordinator had recommended it): the sentence says Jarl is part of the family's core and is released with it, with no number of the version it joined on, so it agrees with Jarl's own rule that its README carries no version token and does not age at the next release. Issue 135 carries the work; the canon is edited first, then every surface that quotes it.

**By:** owner

## 2026-11-08 · 165-merge-counts-on-the-current-tip
Under autonomy-quality, on the review of issue 165: a merge counts for done and for the closed-issue flag only when it was recorded after the last start, reopen or red round and covers the branch's tip now, as an approve is spent by the same moves. Acceptance line 1 asks only for the reopen-plus-new-commit case; the same rule means a red round, or a new commit with no reopen, also spends a merge, so an issue merged once and never reopened changes its answer when its branch moves afterwards, and the merger closes the merged issues of a shared branch before the branch moves. Chosen for fewer false greens: a merge of an older tip proves nothing about the code now.

**By:** jarl

## 2026-11-08 · cli-reads-jarl-root-after-root
Under autonomy-quality and code-docs-conflicts, on the review of issue 087: the acceptance says the CLI honours JARL_ROOT as today, but the code and its own test (issue 136) show the CLI ignored it and only the MCP server read it. It is a real choice of behaviour, not an obvious error: the command line now reads JARL_ROOT after --root, because use <path> prints the JARL_ROOT line to export and would otherwise do nothing on the command line, and the README sentence of 136 is corrected to say so. A stale JARL_ROOT in the environment of a hook or a test is a risk: the tests' inherited environments drop it. Chosen so that use works on the command line as the acceptance intends.

**By:** jarl

## 2026-11-08 · 016-line-rule-switches-on-at-the-first-line-row
Under autonomy-quality, on the review of issue 201 and the work of issue 016: the rule that each acceptance line needs a counted row that names it (evidence --line, the owner's choice a of a-016) switches on for the whole loop at the loop's first row that carries --line, not per issue. Chosen so that the loops and issues closed before any --line row read exactly as before (no closed issue of a loop is marked, none is refused), a loop that never uses --line is never changed, and no per-issue switch has to be remembered. The rule is written once in references/commands.md. An issue closed without a row naming a line gives its reason with --without-rows.

**By:** jarl

## 2026-11-08 · decide-needs-an-author-is-the-command-lines-rule
Clarifies decide-needs-an-author without replacing it: the rule that a ruling always names its author holds for the command line, which refuses decide without --by. The library still records the coordinator for a call that names nobody, because a program calling it has no command line to refuse it. The comments and the test label say which of the two a case is. Issue 197 carries the wording.

**Settles:** 197

**By:** jarl

## 2026-11-08 · in-place-paths-read-from-the-repository-top
A path an in-place issue declares in Files is read from the top of the repository its Repo names (or of the loop's own repository when it names none), the same base scope reads, so loops kept in a subdirectory that already write research/... or method/... from the top keep closing as before. A path written relative to the loop's own folder is not read as a second base. Issue 204 carries the change; the gate, scope and references/jarl.md read the one base.

**Settles:** 204

**By:** jarl

## 2026-11-08 · only-the-current-version-is-supported
Krzysztof, 2026-11-08 (translated from Polish), on the design of Jarl 6.3.0: "We do not need backward compatibility, but the skill can have a file describing 6.2.0 -> 6.3.0, in case it is needed, so that an agent can convert for itself. We support only the current version." And of Horde: "Horde is for the bin, do not take it into account." Jarl supports only its current record format. A loop in an older format is not read as it was; a file of the skill describes the conversion from 6.2.0 to 6.3.0, and an agent converts the loop by following it.

**By:** owner

## 2026-11-08 · ask-024
**Question:** Is the design in releases/6.3.0/plans/jarl-6-3-0-design.md the shape of Jarl 6.3.0, built by its own method by hand until the tool can carry it? Options: a) accepted whole, the core first, and if the first piece comes out worse than today's numbers the jarl comes back to the owner before the rest; b) only the core as a trial, the rest decided after it; c) not yet, the owner reads it first.
**Answer:** a: accepted whole (an option label, not his wording): the design is the shape of Jarl 6.3.0, built from the core, and if the first piece comes out worse than today's numbers the jarl comes back to him before the rest.

**By:** owner

## 2026-11-08 · ask-025
**Question:** May Jarl run a command it is given (run, on the command line only, as an exception to mcp-parity), so that proof is witnessed by the tool instead of typed by an agent? Options: a) yes, on the command line only, and the MCP tool answers with the command-line form; b) no, proof stays typed and the examiner re-runs every row. composers.md says Jarl does not run commands a profile supplies, which holds: this is a command the agent supplies.
**Answer:** a: yes, with the exception (an option label, not his wording): Jarl may run a command it is given and record the result, on the command line only, as the one exception to mcp-parity.

**By:** owner

## 2026-11-08 · ask-026
**Question:** Coordinators in 6.3.0: the owner described, on 2026-11-03, a jarl that talks with him, coordinators by need under it, one slice each by tag, so the jarl is not flooded by reports. The design has none by default and a director adds one when it holds more work than it can read reports for, because no real loop has run them. Options: a) by need as designed, the trigger being reports flooding the director and the blind runs testing them; b) at least one coordinator by default on any larger work, so the jarl only talks with the owner and reads escalations.
**Answer:** a: by need (an option label, not his wording): a coordinator is added when reports begin to flood the director; the blind runs test a mid model in the role.

**By:** owner

## 2026-11-08 · ask-027
**Question:** fresh-reviewer-required in 6.3.0, which the owner marked for thought: a) keep it as the design does, every branch gets one fresh examiner whose depth comes from the methods on the lines; b) keep it, except a change that touches no executable code (comments, wording of docs) closes on the mechanical check; c) relax it: lines proved mechanically close without an examiner, with a random share audited.
**Answer:** a: kept, one fresh examiner per change of the program with no exception (an option label, not his wording), its depth from the methods on the lines; the saving comes from one examiner per large piece, no re-run of witnessed proof and scenarios first; relaxing waits for a long clean run of one kind of work on the record.

**By:** owner

## 2026-11-08 · ask-028
**Question:** Move this loop onto the new Jarl partway through the release? jarl-pinned-in-loop pins the driver for the whole release. Options: a) after the core and the moves land, convert this loop with the conversion file and build the rest with the new Jarl; b) stay on the pinned driver to the end and test the new Jarl only on copies and in the blind runs.
**Answer:** Krzysztof, 2026-11-08 (translated from Polish), to the question whether to keep the pin of ruling jarl-pinned-in-loop: "I do not care what is there, because it is not optimal." The jarl takes the optimal course: after the core and the moves land, this loop is converted with the conversion file and the rest is built with the new Jarl. The pin holds until then.

**By:** owner

## 2026-11-08 · design-6-3-0-narrowed-no-run-no-digest-no-cost
Krzysztof, 2026-11-08 (translated from Polish), marking the list of what the design adds: of Jarl running the commands itself, "I do not want this then"; of the digest across all loops and the measuring of cost, "I do not want it"; and after being shown what remains, seven pieces, "All right, go for it." This narrows his acceptance of the design (a-024) and replaces his yes on a-025: there is no run command and no witnessed proof, proof stays typed and the examiner re-runs it; there is no digest across loops, no spent line, no cost report and no file of refused calls. The lines with methods, the gate per method, the moves, the removals, the skill rewritten, the move of this loop onto the new Jarl, the proof and the release stay. A decision relayed the same day from another thread (narrow, release, end development) was withdrawn by him in the same message and is not in force.

**By:** owner

## 2026-11-08 · loop-moves-at-piece-5-not-after-the-moves
Under autonomy-quality, on the work list of the design: this loop moves to the new Jarl at piece 5 and not right after the core and the moves as a-028 says, so that it is converted once, to the record's final shape; the removals and the conversion file have to exist first.

**By:** jarl

## 2026-11-08 · mergers-by-need-and-proof-and-cost-come-out-in-use
Krzysztof, 2026-11-08 (translated from Polish), marking the assessment of Jarl 6.3.0. On scale: "There can also be many mergers if it makes sense. It need not be only one branch; the coordinators decide which ones they want, but the boss also decides how to split so that there is no friction while merging the workers. I want this to be flexible." On the truth of proof: "It will come out in the wash." On cost: "That will come out in the wash too, it is how I make all my tools." So the design holds one writer per target branch and mergers by need, and the three-arm comparison of piece 6 goes; the first piece is still read against the numbers of 2026-11-08, as a-024 says.

**By:** owner

## 2026-11-09 · architecture-changes-of-this-release-accepted
Krzysztof, 2026-11-09 (translated from Polish), of the changes of the architecture file that the work of the 6.3.0 design needs, such as the one piece 5 needs for converting this loop: "I accept every change of the architecture, just so you know." This is his confirmation for changes of .yggdrasil/yg-architecture.yaml made for this release. It does not cover a yg-suppress, a review_by change or the ratification of a rule, which stay his word each time.

**By:** owner

## 2026-11-09 · ask-30
**Question:** Ratify a change of the rail loop/shape in rails/loop.mjs: the new Jarl keeps two files in .jarl/ that the rail refuses, repos.md (written when an issue names a repository) and profile.json (written by extend). Without it no commit of this loop passes once either file exists; any byte changed in a rail's code re-opens its type law and needs the owner's ratification. Options: a) ratify, the rail takes the two files; b) no.
**Answer:** yes: ratified. Krzysztof, 2026-11-09, chose the option 'Yes, I ratify' (an option label, not his wording): the rail loop/shape takes the two files the new Jarl keeps in .jarl/, repos.md and profile.json.

**By:** owner

## 2026-11-09 · blind-runs-one-per-scenario-on-two-agents
Under autonomy-quality, on the blind runs of issue 076: each scenario runs once with Haiku 5.5 at max and once with Sonnet 5.5 at medium, rather than twice with three agents as the first plan said, and a failed check is rerun for that scenario and those models only. The owner was told and could have asked for more; the runs' failures were fixed on the branch of the piece that holds them and are recorded in its report rather than filed one by one.

**By:** jarl
