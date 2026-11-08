# 226 · Jarl 6.3.0, piece 2: the moves: brief, examiner, next, handover, honest exit

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 225
**Found by:** jarl
**Where:**

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
- [test] a review is offered for a branch only when every issue on it has the worker's rows for its `test`, `compare` and stated `check` lines
- [test] a handover of one issue of a lease is refused, ending with the form that moves the whole lease
- [test] `ask --kind stuck --issue <id> --by <holder>` lands on the director of the issue's slice, on the jarl with no slice, and on the owner when the asker is the director
- [test] `new` notes an empty Why and a `light` issue with a `read` line
- [test] the in-place gate reads git without a hook's variables when a Repo is a name (210), and the NO PROOF note prints its command apart from its colon (223)
- [test] `status` prints one count per stage
- [test] a goal line `Merger (<slice>): <name>` is accepted; `next --as` and the merge queue give each merger the approved work of its own target branch, and a slice's integration branch lands on the feature branch as a merge with its check
- [read] the merger's brief says one writer per target branch, each merger in a worktree of its own, and that only the holder of the main checkout commits `.jarl/`
- [test] the four scenarios of issue 224 show one consistent state across `next`, `next --as` and the merge queue
- [test] the brief caps hold: worker 700 words, examiner 500, merger 900, the issue's own text not counted
- [check] the full suite passes on the merged result
- [read] an independent examiner: the briefs let an agent do its job without reading the skill

## Evidence

