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
