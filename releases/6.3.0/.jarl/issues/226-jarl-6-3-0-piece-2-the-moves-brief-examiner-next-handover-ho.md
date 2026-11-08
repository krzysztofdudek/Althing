# 226 · Jarl 6.3.0, piece 2: the moves: brief, examiner, next, handover, honest exit

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 225, 231
**Found by:** jarl
**Where:**
**Branch:** jarl/226-moves
**Worker:** w-jarl-226-opus
**Worktree:** /home/me/Worktrees/JarlSkill/226-moves
**Since:** 2026-11-08 21:23

## What
the design's sections 5, 6 and 9, where an agent is told what to do: the complete brief, the examiner, `next --as`, handover, the honest exit. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 2.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [read] before the briefs are written, the history of the role text they replace is read and the real failure each part was the lesson of is named; `releases/6.3.0/plans/skill-lessons-kept.md` lists each lesson and where it now lives
- [test] `brief <ids>` takes every issue of one lease and prints complete text for the worker: role, the goal's first paragraph, the parent's purpose, lines with methods, branch and worktree from the lease and git, the loop root, the script's absolute path, the rules that reach it, at most three "you do not" lines, each command with every known value filled, and what it must report; a lease carrying several tiers takes the highest; a takeover's brief says the tree may be dirty
- [test] the same for the examiner with `--role reviewer`: the changes to the lines since the lease, the depth and the tier, the six steps, the proof rows as commands to re-run, the `Assumed:` notes, the previous findings after a round, and neither the worker's report nor any other free note
- [test] `brief --role merger` prints the merger's whole procedure, including the three cases of a red check
- [test] depth is computed from the lines as the table of section 6 says, the deeper of as at the lease and as now, for every row of that table
- [test] `next --as --json` gives each raise-move its role, default model, branch and the command that prints its brief
- [test] after the round limit `next --as` shows a takeover as due, with the command that raises it, until one is recorded
- [test] among moves of equal idleness and hold-up, `next --as` lists merge before review before rework before a new start
- [test] `next --as` does not offer a lease for an issue with no line
- [test] a review is offered for a branch only when every issue on it has the worker's rows for its `test`, `compare` and stated `check` lines
- [test] a handover of one issue of a lease is refused, ending with the form that moves the whole lease
- [test] `ask --kind stuck --issue <id> --by <holder>` lands on the director of the issue's slice, on the jarl with no slice, and on the owner when the asker is the director
- [test] `new` notes an empty Why and a `light` issue with a `read` line
- [test] the in-place gate reads git without a hook's variables when a Repo is a name (210), and the NO PROOF note prints its command apart from its colon (223)
- [test] `status` prints one count per stage
- [test] a goal line `Merger (<slice>): <name>` is accepted; `next --as` and the merge queue give each merger the approved work of its own target branch, and a slice's integration branch lands on the feature branch as a merge with its check
- [read] the merger's brief says one writer per target branch, each merger in a worktree of its own, and that only the holder of the main checkout commits `.jarl/`
- [test] the four scenarios of issue 224 show one consistent state across `next`, `next --as` and the merge queue
- [test] the brief caps hold: worker 700 words, examiner 500, merger 900, the issue's own text and the loop's own rules and repository list not counted
- [check] the full suite passes on the merged result
- [read] an independent examiner: the briefs let an agent do its job without reading the skill

## Changelog
- Added: A worker, a reviewer or a merger is raised with one complete brief the tool prints, every command filled in, and reads nothing else for its role. What each agent is told to do next now shows a takeover that is due, sends a stuck worker's question to whoever directs its work, and lists the work nearest to landing first.

## Evidence

- **ran:** [line 1] read the history of references/worker.md, reviewer.md, merger.md (git log, pickaxe per phrase) and wrote releases/6.3.0/plans/skill-lessons-kept.md · **saw:** the lessons list names each part's failure and where it now lives; no agent attribution in it
- **ran:** [line 2] node --test tests/moves-briefs.test.mjs: the worker's brief test · **saw:** RED at c42d4e2: fail 8 of 8 (lib without the new brief); GREEN at d8171ce: 8 pass
- **ran:** [line 3] node --test tests/moves-briefs.test.mjs: the examiner's brief test · **saw:** RED at c42d4e2 (fail 8); GREEN at d8171ce: pass
- **ran:** [line 4] node --test tests/moves-briefs.test.mjs: the merger's brief test · **saw:** RED at c42d4e2 (fail 8); GREEN at d8171ce: pass
- **ran:** [line 5] node --test tests/moves-briefs.test.mjs: depth is computed from the lines · **saw:** RED at c42d4e2 (fail 8); GREEN at d8171ce: pass, every row of the table and deeper-of lease and now
- **ran:** [line 6] node --test tests/moves-briefs.test.mjs: next --as --json gives each raise-move · **saw:** RED at c42d4e2 (fail 8); GREEN at d8171ce: pass
- **ran:** [line 7] node --test tests/moves.test.mjs: takeover due · **saw:** RED at 7bad5bb (fail); GREEN at 906c33b and d8171ce: pass
- **ran:** [line 8] node --test tests/moves.test.mjs: merge before review before rework before a new start · **saw:** RED at 7bad5bb (fail, order fixture); GREEN at 906c33b and d8171ce: pass
- **ran:** [line 9] node --test tests/moves.test.mjs: no lease for an issue with no line · **saw:** RED at 7bad5bb (fail); GREEN at 906c33b and d8171ce: pass
- **ran:** [line 10] node --test tests/moves.test.mjs: a review is offered only with the worker's rows · **saw:** RED at 7bad5bb (fail); GREEN at 906c33b and d8171ce: pass
- **ran:** [line 11] node --test tests/moves.test.mjs: a handover of one issue of a lease is refused · **saw:** RED at 7bad5bb (fail); GREEN at 906c33b and d8171ce: pass, the refusal ends with the form
- **ran:** [line 12] node --test tests/moves.test.mjs: a stuck question lands on the director · **saw:** RED at 7bad5bb (fail); GREEN at 906c33b and d8171ce: pass
- **ran:** [line 13] node --test tests/moves.test.mjs: new notes an empty Why and a light issue with a read line · **saw:** RED at 7bad5bb (fail); GREEN at 906c33b and d8171ce: pass
- **ran:** [line 14] node --test tests/in-place.test.mjs tests/proof-notes.test.mjs · **saw:** RED at 97b3e16: 2 failed (named Repo under a hook's GIT_DIR; NO PROOF note glued to the colon); GREEN at 6a207f9: 39 pass
- **ran:** [line 15] node --test tests/moves.test.mjs: status prints one count per stage · **saw:** RED at 7bad5bb (fail); GREEN at 906c33b and d8171ce: pass
- **ran:** [line 16] node --test tests/moves.test.mjs: Merger (<slice>) goal line, each merger's target, the integration branch landing · **saw:** RED at 55b0263 (fail); GREEN at b6d5106 and d8171ce: pass
- **ran:** [line 17] read the merger brief text (lib/brief.mjs, renderMerger) and tests/moves-briefs.test.mjs · **saw:** it says one writer per target branch, each merger in a worktree of its own, only the holder of the main checkout commits .jarl/
- **ran:** [line 18] node --test tests/moves.test.mjs: the four scenarios of the views · **saw:** RED at 55b0263 (fail, 4 scenarios); GREEN at b6d5106 and d8171ce: pass, next, next --as and the merge queue agree
- **ran:** [line 19] node --test tests/moves-briefs.test.mjs: the word caps · **saw:** GREEN at d8171ce: worker under 700, examiner under 500, merger under 900 (issue text not counted); RED at c42d4e2 with the rest of the brief tests
- **ran:** [line 20] cd skills/jarl/scripts && TMPDIR=<one mktemp folder> nice -n 15 timeout 590 node tests/suite.mjs · **saw:** branch tip d8171ce: tests 1778, pass 1756, skipped 22, fail 0, exit 0

Assumed: a brief of part of a lease is completed to the whole lease with a note, and a lease beside no lease or two leases is refused, since one agent is raised on one lease

Assumed: a slice's integration branch is named jarl/slice-<slice>, read from the goal line Merger (<slice>): <name>; while that branch does not exist the slice's work lands on the feature branch queue

Assumed: any handover records the takeover that was due, and a takeover's brief says the tree may be dirty after any handover, whatever the reason given

Assumed: a stuck asked by neither a lease holder of its issue nor its director stays the owner's, as before; a stuck that names no issue too

Assumed: the text of a brief lists the loop's own rules; the role's shipped rules stay in its JSON but are not repeated in the text, since the steps say them once

Assumed: an approved branch whose base already holds it with no merge recorded is a record-only row of the queue and a 'record the merge' move, which replaces 'leaves the queue by itself'

Assumed: the examiner's and worker's commands name the runtime by its short name (the basename of the running process) and the tool by its absolute path, printed by the one builder
- **ran:** [round 1, lines 2 3 4 5 6 12 16 19] node --test tests/moves-briefs.test.mjs tests/moves.test.mjs · **saw:** RED at e32434b: fail 12 of 34; GREEN at 88990ab and 5d0ee8b: all pass (in-place worker, proof rows, merger commands and steps, depth by tier and across handover, takeover raise, resume stuck, one merger state, idle form, caps with long goal)
- **ran:** [round 1, line 16] node --test tests/moves-briefs.test.mjs (a slice's merger told its branch does not exist) · **saw:** RED at 9aa3006: fail 1; GREEN at e86cd0a: pass
- **ran:** [round 1, line 20] cd skills/jarl/scripts && TMPDIR=<one mktemp folder> nice -n 15 timeout 590 node tests/suite.mjs · **saw:** branch tip 5d0ee8b: tests 1790, pass 1768, skipped 22, fail 0, exit 0

Assumed: until a slice's integration branch exists, its approved work queues to the feature branch and belongs to the feature branch's merger alone, in next --as, the raise, and the merge queue; the slice's merger takes it once the branch exists

Assumed: the caps count the role's own text: the issue's block, its proof rows, rounds, findings and Assumed notes do not count; the goal counts and is cut at 60 words with the pointer to goal.md

Assumed: an integration branch with commits but no recorded merge is in neither the queue nor next --as: there is nothing known to land until a merge is recorded on it

