# 085 · Jarl: coordinators run slices of the backlog: slice tags and views, escalations held by the jarl, one merger for the loop, and the writer named per call

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-levels-slices
**Where:**
**After:** 035, 008, 052, 083
**Branch:** jarl/085-slices
**Worker:** w-jarl-085-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-085
**Since:** 2026-11-03 17:44

## What
Report sections 2, 4 and 5: the owner's shape (a jarl on the strong tier, coordinators on the standard tier, each over a part of the backlog marked by a tag, workers and reviewers per task). Today the reeve exists in prose only, Coordinators: names directors without slices, status --tag scopes but next and resume do not, and a question can go to the owner only.

## Why
Coordinators that do not reach the jarl until they must are what keeps the jarl's context for the owner and for judgement.

## Acceptance
- Coordinators: in the goal names each coordinator with its slice; a slice is the tag slice:<coordinator>; tag refuses a second slice: tag on one issue
- next, status and resume take --slice, built on status --tag's scoping; across slices only leases hold, and next's in-list reservation applies within the asker's slice
- It adds the coordinator's rows to next --as (052): a ready issue, a lease, a proof with no verdict and a changes verdict in a slice are that slice's coordinator's, where 052 alone gives them to the jarl
- ask --kind escalation is held by the jarl and names its slice or issue; it shows in the jarl's list and in the slice's view
- Merger: in the goal names the one coordinator, or the jarl, that raises the merger; every approve not yet merged is that holder's
- Writes that take no --by today take one per call; there is no server-wide default name; an unnamed write shows as unnamed, and the writer is written under format 3
- In a loop with more than one active slice, a lease on an issue that declares no Files or Resources is refused with the command to declare them
- references/jarl.md: the reeve becomes the coordinator, with the four reasons to escalate of report section 5, which 086 quotes as a built-in rule; a level waits on agents it raised and returns only when the ball is on someone it did not raise; tests for each

## Changelog
- Added: A coordinator named in the goal can run its own part of the backlog: tag an issue slice:<name> to put it in that coordinator's part. An issue belongs to one part at most, and the status shows who runs which part.
- Added: A coordinator can look at its own part of the backlog alone: what to start next, the status and the resume each take the part's name. A task waiting in one part never holds back a task in another; only work already started does.
- Added: Asking Jarl what is waiting on a coordinator now lists the tasks of its part: the ones ready to start, the ones being worked on, the work waiting for a reviewer and the work sent back. Tasks in no part stay with whoever runs the loop.
- Added: A coordinator can send a question up to whoever runs the loop, naming its part of the backlog or the task, instead of going to the owner. The question shows on that person's list and in the coordinator's view, and the task it names waits for the answer. The first such question moves the loop to format 3.
- Added: The goal can name the one coordinator, or the person who runs the loop, who starts the merges, with a line such as Merger: odin. Every approved task waiting to be merged, in every part of the backlog, is then on that one list, so only one merge runs at a time.
- Added: Every command that records work can now say who did it: starting a task, recording proof, a failed round, a merge, a question, a note or a change to the goal. Name yourself on each call; nothing fills in a name for you, and where several coordinators work, a task started without a name shows as unnamed. The first named entry moves the loop to format 3.
- Added: The guide for running a loop now describes coordinators, each over its own part of the backlog, in place of a single assistant: when a coordinator should turn to whoever runs the loop (four cases), that each one waits on the helpers it started, and that one named person starts the merges.
- Changed: When more than one coordinator has work in play, a task can only be started once it says which files or shared resources it touches, so work in two parts of the backlog cannot collide unseen. The refusal names the command that adds them.

## Evidence

- **ran:** node --test tests/slices.test.mjs (on release/6.2.1 code, before the slice change) · **saw:** fail 2: tag accepted a second slice: tag; status printed no slices line
- **ran:** node --test tests/slices.test.mjs (at 67a86c0) · **saw:** pass 2, fail 0
- **ran:** node --test tests/slices.test.mjs (the slice view tests, on the code before --slice) · **saw:** fail 2: next --slice and status/resume --slice refused as unknown flags
- **ran:** node --test tests/slices.test.mjs tests/next-as.test.mjs (at bd8161d) · **saw:** pass 13, fail 0
- **ran:** node --test tests/slices.test.mjs (the coordinator-row tests, on bd8161d's ball) · **saw:** fail 2: odin's and thor's rows were on the jarl
- **ran:** node --test tests/slices.test.mjs tests/next-as.test.mjs tests/lone-agent-review.test.mjs tests/mcp.test.mjs · **saw:** pass 21 and pass 31, fail 0
- **ran:** node --test tests/slices.test.mjs (the escalation tests, on 2d14574's code) · **saw:** fail 3: --kind escalation refused as an unknown kind
- **ran:** node --test tests/slices.test.mjs tests/docs-true.test.mjs tests/resume.test.mjs tests/tense.test.mjs tests/goal-lines.test.mjs tests/next-as.test.mjs · **saw:** pass 57, fail 0
- **ran:** node --test --test-name-pattern 'Merger line' tests/slices.test.mjs (on e3a08f1's code) · **saw:** fail 1: goal --set refused Merger as no machine line
- **ran:** node --test tests/slices.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/goal-lines.test.mjs tests/vocabulary.test.mjs tests/mcp.test.mjs · **saw:** pass 104, fail 0 (goal-lines shape test gains merger: null)
- **ran:** node --test tests/writer.test.mjs (on 5b81517's code) · **saw:** fail: jarl.mjs exports no WRITER_COMMANDS; set, evidence, log and the rest refuse --by as an unknown flag
- **ran:** node --test tests/writer.test.mjs tests/slices.test.mjs tests/mcp.test.mjs tests/vocabulary.test.mjs tests/tense.test.mjs tests/docs-true.test.mjs tests/log-reader.test.mjs tests/format-marker.test.mjs tests/record-contract.test.mjs · **saw:** pass, fail 0 (writer 8 of 8)
- **ran:** node --test --test-name-pattern 'more than one slice in play' tests/slices.test.mjs (on 109d3f8's commands.mjs) · **saw:** fail 1: the bare lease went through
- **ran:** node --test tests/slices.test.mjs tests/lease-holds.test.mjs tests/docs-true.test.mjs tests/help-workflow.test.mjs tests/vocabulary.test.mjs tests/tense.test.mjs · **saw:** pass 22 and pass 42, fail 0
- **ran:** node --test --test-name-pattern 'four reasons to escalate' tests/slices.test.mjs (on 0ed0f66's references) · **saw:** fail 1: jarl.md has the reeve section and no Coordinators section
- **ran:** node --test tests/slices.test.mjs tests/skill-shape.test.mjs tests/vocabulary.test.mjs tests/tense.test.mjs tests/docs-true.test.mjs tests/workflow-texts.test.mjs (at b6980fa) · **saw:** pass 80, fail 0
- **ran:** on a copy of the 6.3.0 loop, release/6.2.1 code: tag 096 +slice:odin +slice:thor; status --slice odin · **saw:** 096 tags: design, slice:odin, slice:thor; unknown flag --slice for status
- **ran:** the same copy at b6980fa: tag 096 +slice:odin +slice:thor; goal --set Coordinators: odin, thor; status --slice odin; log --by odin · **saw:** an issue is in one slice, and 096 would carry slice:odin, slice:thor — keep one; scoped to the slice of odin; slices: odin runs slice:odin (2 in play) · thor runs slice:thor (1 in play); record format 1 then 3; - <stamp> by odin · a named note
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (at b6980fa) · **saw:** tests 1034, pass 1011, fail 0, exit 0
- **ran:** node --test --test-name-pattern 'second slice: tag|refused escalation writes nothing|wait on the jarl, not on the owner' tests/slices.test.mjs (on 00425e2's lib) · **saw:** fail 3: slice:Odin accepted beside slice:odin; profile.json raised by a refused escalation; the wait shown on the owner
- **ran:** node --test tests/slices.test.mjs · **saw:** pass 14, fail 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (round-2 tree, before its commit) · **saw:** tests 1047, pass 1024, fail 0, skipped 23, exit 0
- **ran:** node --test --test-name-pattern 'only the owner ticks is on the slice' tests/slices.test.mjs (merge resolved, the material row still the jarl's) · **saw:** fail 1: the line and the wait behind it were on the jarl
- **ran:** node --test tests/slices.test.mjs tests/owner-sign-off.test.mjs · **saw:** pass 24, fail 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (merged tree, before its commit) · **saw:** tests 1065, pass 1042, fail 0, skipped 23, exit 0

