# 039 · Jarl: done cannot wait for an owner's sign-off on an acceptance line

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-c417b0bf
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**After:** 035

## What
Claim: An issue whose acceptance needs the owner's approval of images was set done right after its merge and had to be reopened by hand. Corrected by the sceptic: Severity medium rather than high: the early close was visible and reopened by hand, and 016's listing of unaddressed acceptance lines narrows it; the refusal itself stays the owner's decision.

set 529 done passed on the loop copy with its acceptance line addressed by no row; the gate reads a Proof row and a live approve only. Map row fr-03.

## Why


## Acceptance
- An acceptance line can be marked as one only the owner ticks; the mark refuses a line that does not name the material to review (a path, a link or an artifact) and what to check
- set done refuses while such a line is unticked, naming the line, its material and what to check
- Until its material exists the line holds the ball on whoever produces it; then on the owner, and it appears in the owner's digest with the material and the instruction
- The owner ticks the line with one command that records who ticked it and when; issues that wait on it with After stay unoffered until then
- Tests for each; red at 71ebc5b, where done passes with such a line unaddressed

## Evidence

Ruling ask-006 (stuck): Krzysztof, 2026-11-03 (translated from Polish): "We can do that, add such a mark; there is only one rule. I must get the material I am to review and a clear instruction of what to check. While writing the backlog we will agree with the Jarl which elements I want to accept myself. In another session I had to say 'pause at this stage, I want to see something', instead of it simply letting me verify that stage. So at the level of backlog work it will be said clearly that I want to receive such an artifact. That is all." Option (1) with his rule. The full ruling is owner-sign-off-with-material.

Ruling owner-sign-off-with-material: Krzysztof, 2026-11-03, chose option (1) of a-006 (option label, not his wording) with a rule of his own: an acceptance line may be marked as one only the owner ticks, and done refuses while it is unticked, but such a line must name the material he is to review and a clear instruction of what to check; which elements he signs off himself is agreed with the jarl while the backlog is written, so a stage he wants to see is a stated checkpoint, not a pause he has to call. The analysis session reads it so: the line puts the ball on the owner only once its material exists (until then it is on whoever produces it), it reaches him in the digest with the material and the instruction, and work that must wait for his look waits on that issue (After).

