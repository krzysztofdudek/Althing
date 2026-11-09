# 090 · Jarl: in a loop of one agent alone, a proof with no verdict shows as the owner's to review without the agent declaring anything

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261103T1043-zala
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 035, 052
**Found by:** review
**Source:** research/2026-11-03-jarl-as-a-loop-tool#lone-agent-review-signal
**Where:**
**Branch:** jarl/090-lone-agent-proof
**Merged:** 3b42ab8 in ../../../JarlSkill
**CI:** none

## What
Fresh review rev-035d-opus of 035: report section 3 gives a proof with no verdict to the owner in a loop with no coordinator able to raise a reviewer, and ruling sixth-scenario-one-agent-alone needs it there, but the lone agent declares nothing new and 052 gives every unsliced row to the jarl, so nothing in the record tells a lone loop from a jarl that raises reviewers itself.

## Why
Scenario 6 of 076 and the owner's ruling ask Jarl to say plainly that the owner must start a fresh session for the review; a record with no signal cannot.

## Acceptance
- The jarl's list shows a proof with no verdict as 'raise a fresh reviewer for N, M; if you cannot raise agents, ask the owner to start a fresh session', with the ask command written out
- Once that question is asked, the item holds the ball on the owner and shows in his digest naming the issues, with nothing declared in the goal
- Tests for both, on a loop with no Coordinators line

## Changelog
- Added: Work on code that waits for a review shows in the list of whoever runs the loop as one line naming all the tasks, with the question that asks the owner to start a fresh session if no reviewer can be raised; once that question is asked, the work shows on the owner's list.

## Evidence

- **ran (history):** node --test tests/lone-agent-review.test.mjs, before the change (TMPDIR under ~/Temp/tmp) · **saw:** 3 tests, 0 pass, 3 fail: no row carries ids, the asked question leaves the proof on the jarl, nothing is reviewing on the owner's question
- **ran (history):** node --test tests/lone-agent-review.test.mjs tests/next-as.test.mjs tests/library-parity.test.mjs tests/next-views.test.mjs tests/queue-views.test.mjs, after the change · **saw:** 32 tests, 32 pass, 0 fail
- **ran (history):** next --as jarl --all on a copy of the 6.3.0 loop under ~/Temp (proof on 083 and 089), before and after · **saw:** before: two separate lines 'proof recorded, no verdict; raise a fresh reviewer'; after: one line '083, 089: ... raise a fresh reviewer for 083, 089; if you cannot raise agents, ask the owner to start a fresh session' with the review and the ask command written out
- **ran (history):** ask "start a fresh session to review issues 083, 089" on the copy, then next --as owner --all and next --as jarl --all · **saw:** owner: 'a-13 start a fresh session to review issues 083, 089: question (stuck), the fresh review of 083, 089 waits on it', holds up 019, 039, 040, 059, 073 and 4 more, and 19 issues waiting on the owner via 083; the jarl's list no longer holds the line
- **ran (history):** the test suite in seven groups of test files (a-f, g-i, jarl, l, m-o, p-r, s-z), TMPDIR under ~/Temp/tmp, after the change; one npm test run was cut at the harness limit and is not counted · **saw:** all seven groups: 0 fail (98, 60, 179, 65, 245, 179, 99 tests; the rest pass or are skipped)
- **ran (history):** node --test tests/lone-agent-review.test.mjs against the first commit's code (scratch copy under ~/Temp), with the two new tests · **saw:** 5 tests, 3 pass, 2 fail: the list cut by a period, a version and a trailing number, and the one-issue wording
- **ran (history):** node --test tests/lone-agent-review.test.mjs tests/next-as.test.mjs tests/library-parity.test.mjs tests/next-views.test.mjs tests/queue-views.test.mjs, after the fix · **saw:** 34 tests, 34 pass, 0 fail
- **ran (history):** ask "start a fresh session to review issues 055 and 089 before 083 lands. 6.3.0 waits" on a copy of the 6.3.0 loop under ~/Temp, then next --as jarl and next --as owner · **saw:** 083 stays on the jarl's list; the owner's question holds only the review of 055; no other issue waits on him
- **ran (history):** the full suite in five groups of test files under ~/Temp/tmp (a-i, jarl, l-o, p-r, s-z), after the fix · **saw:** 0 fail in every group (158, 179, 312, 179, 99 tests; the rest pass or are skipped)
- **ran (history):** after merging the release branch and reading the question's issues with the shared citation rule: the files touched (34 tests), then the full suite in five groups under ~/Temp/tmp · **saw:** 0 fail in every group (158, 179, 312, 187, 108 tests; the rest pass or are skipped); the lone-agent tests with a period, a version and an and-list still pass
- **ran (history):** node --test tests/lone-agent-review.test.mjs on the code of the previous commit (scratch copy under ~/Temp), with the new test for a later issue, hash number, task and version · **saw:** 6 tests, 5 pass, 1 fail: the later number is held by the owner
- **ran (history):** node --test on lone-agent-review, next-as, library-parity, next-views, queue-views, skill-shape, docs-true, after the fix; then the full suite in five groups under ~/Temp/tmp · **saw:** 82 of 82 pass; every group 0 fail (158, 179, 313, 187, 108 tests; the rest pass or are skipped); jarl.test.mjs was cut once under load and passed alone
- **ran (history):** npm test (in skills/jarl/scripts of the release worktree, at 3b42ab8 with 090 merged, TMPDIR under ~/Temp/tmp) · **saw:** 998 tests, 975 pass, 0 fail, 23 skipped

