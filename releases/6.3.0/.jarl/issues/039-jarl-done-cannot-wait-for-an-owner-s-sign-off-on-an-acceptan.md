# 039 · Jarl: done cannot wait for an owner's sign-off on an acceptance line

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-c417b0bf
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**After:** 035, 052, 083
**Branch:** jarl/039-done-waits-for-owner-signoff
**Merged:** dbf27a2 in ../../../JarlSkill
**CI:** none

## What
Claim: An issue whose acceptance needs the owner's approval of images was set done right after its merge and had to be reopened by hand. Corrected by the sceptic: Severity medium rather than high: the early close was visible and reopened by hand, and 016's listing of unaddressed acceptance lines narrows it; the refusal itself stays the owner's decision.

set 529 done passed on the loop copy with its acceptance line addressed by no row; the gate reads a Proof row and a live approve only. Map row fr-03.

## Why


## Acceptance
- An acceptance line can be marked as one only the owner ticks; the mark refuses a line that does not name the material to review (a path, a link or an artifact) and what to check
- set done refuses while such a line is unticked, naming the line, its material and what to check
- It adds its row to next --as (052): until its material exists the line holds the ball on whoever produces it, then on the owner, and it appears in the owner's digest (next --as owner --all) with the material and the instruction
- The owner ticks the line with one command that records who ticked it and when; issues that wait on it with After stay unoffered until then
- Tests for each, the row in next --as among them; red at 71ebc5b, where done passes with such a line unaddressed

## Changelog
- Added: A step you want to check yourself can be written into a task as a line only you can tick, naming what you are to look at and what to check. Jarl will not close the task until you tick it, and shows it in your list of things to do once there is something to look at.

## Evidence

Ruling ask-006 (stuck): Krzysztof, 2026-11-03 (translated from Polish): "We can do that, add such a mark; there is only one rule. I must get the material I am to review and a clear instruction of what to check. While writing the backlog we will agree with the Jarl which elements I want to accept myself. In another session I had to say 'pause at this stage, I want to see something', instead of it simply letting me verify that stage. So at the level of backlog work it will be said clearly that I want to receive such an artifact. That is all." Option (1) with his rule. The full ruling is owner-sign-off-with-material.

Ruling owner-sign-off-with-material: Krzysztof, 2026-11-03, chose option (1) of a-006 (option label, not his wording) with a rule of his own: an acceptance line may be marked as one only the owner ticks, and done refuses while it is unticked, but such a line must name the material he is to review and a clear instruction of what to check; which elements he signs off himself is agreed with the jarl while the backlog is written, so a stage he wants to see is a stated checkpoint, not a pause he has to call. The analysis session reads it so: the line puts the ball on the owner only once its material exists (until then it is on whoever produces it), it reaches him in the digest with the material and the instruction, and work that must wait for his look waits on that issue (After).

Reshaped by ruling owner-sign-off-with-material; its mark is written under format 3 (083).
- **ran:** node --test tests/owner-sign-off.test.mjs (at release/6.2.1 ffef4cc, before the change) · **saw:** 6 tests, pass 0, fail 6: set 1 done finished was not refused (done passes with an owner line unticked); tick is an unknown command; next --as lists no sign-off row
- **ran:** node --test tests/owner-sign-off.test.mjs (on jarl/039-done-waits-for-owner-signoff) · **saw:** 6 tests, pass 6, fail 0
- **ran:** copy of the 6.3.0 loop: new 111 with an [owner] acceptance line, lease, proof, fresh approve, set 111 done; with the release/6.2.1 Jarl, then with the branch · **saw:** before: 111 -> done; after: 111 waits for the owner's sign-off on acceptance line 2, "the first cut reads well": he reviews demo/cut.txt and checks the pacing; only he ticks it, once he has looked: jarl.mjs tick 111 2 --by owner; next --as owner --all lists it once demo/cut.txt exists; tick 111 2 --by owner, then set 111 done passes
- **ran:** nice -n 15 timeout 1800 npm test in skills/jarl/scripts at 9340daf · **saw:** tests 1020, pass 997, fail 0, exit 0
- **ran:** node --test tests/owner-sign-off.test.mjs on 9340daf with the round-2 test file · **saw:** 9 tests, pass 6, fail 3: the tick line is not whole in resume and the takeover block; resume, status and review say set it done; a composer loop names no reason
- **ran:** node --test tests/owner-sign-off.test.mjs on the branch after the round-2 fix · **saw:** 9 tests, pass 9, fail 0
- **ran:** nice -n 15 timeout 1800 npm test in skills/jarl/scripts on the branch after the round-2 fix · **saw:** tests 1023, pass 1000, fail 0, exit 0
- **ran:** npm test (in skills/jarl/scripts of the release worktree, at dbf27a2 with 039 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1034 tests, 1011 pass, 0 fail, 23 skipped

