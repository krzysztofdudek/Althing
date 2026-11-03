# 055 · Jarl: a commit after the approve does not spend it

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-876684c1
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**After:** 035
**Branch:** jarl/055-commit-after-approve
**Worker:** w-jarl-055-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-055
**Since:** 2026-11-03 13:34

## What
Claim: Done and merged should check that the evidence and the approve are newer than the last commit on the branch.

The gate's window opens at start, reopen or round, never at a commit (help of set). Map row fr-20; issue 002 records branch tips.

## Why


## Acceptance
- merged notes when the tip an approve recorded (002) is not the tip being merged, naming both; a note, never a refusal
- Tested

## Changelog
- Fixed: Recording a merge now warns when the branch got new commits after its review was approved. The warning names the reviewed commit and the merged one, and gives the commands that show the difference and record a new review. The merge is still recorded.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs (new tests, before the change in lib/commands.mjs) · **saw:** tests 17, pass 12, fail 5: each failing test 'did not match /APPROVED ON ANOTHER TIP/' (moved after approve, fast-forward, squash, review after the note, several repositories); the no-note cases already passed
- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs (after the change) · **saw:** tests 17, pass 17, fail 0
- **ran:** copy of the 6.3.0 loop under ~/Temp with a scratch clone of JarlSkill: review 055 approve on ffbadec49bfc, a commit on the branch, merge, then merged 055 --sha d649a02a --keep with the release-branch Jarl and with this branch · **saw:** release-branch Jarl: only NO PROOF FROM THE WORKER. This branch: also 'APPROVED ON ANOTHER TIP — 055's approve by rev-scratch (fresh) was recorded on jarl/055-commit-after-approve at ffbadec49bfc, and the branch stands at 21d453d9b393 at this merge ... see it: git -C <repo> log --oneline ffbadec49bfc..21d453d9b393 and git -C <repo> diff ...; if it was meant to land, record a review ...'. The log lines both wrote are identical; the pinned driver Jarl 6.1.0 reads the copy (show, list, status exit 0)
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip d3e6fcd, TMPDIR under ~/Temp/tmp) · **saw:** tests 930, pass 906, fail 1, skipped 23: the one failure is the timing bound of 'resume stays fast on a loop of hundreds of issues' (resume took 7703 ms against 6000) at load average about 20 with another suite running; that test alone, rerun at once: pass 1, fail 0. The change does not touch resume
- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs (review fix: the repro test and the first-parent commands test added, before the change in lib/commands.mjs) · **saw:** tests 19, pass 15, fail 4: the repro (approve at A, commit c, merge c, commit d before merged) gave only MERGE WITHOUT THE BRANCH; the base-merged-into-branch test and the two tests asserting the commands failed on the old log/diff commands
- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs (after the change, commit 25c6cb1) · **saw:** tests 19, pass 19, fail 0: the repro names the approved tip and the branch tip; the commands list only the branch's own commits after a base merge; the merge of the approved tip alone stays silent
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip 25c6cb1, TMPDIR under ~/Temp/tmp) · **saw:** tests 932, pass 909, fail 0, skipped 23, exit 0

