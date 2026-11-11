# 182 · Grain: a commit older than the window that touches two former paths of one present-day file counts twice in co-changes

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1239-mnen
**Tags:** grain, cochange, 6.2
**Files:** Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**After:** 048
**Found by:** rev-grain-048
**Where:**
**Branch:** jarl/182-file-lineage
**Worker:** w-182b-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 09:55

## What
After 048 (the whole history on present-day paths) a commit from before the window that changes two former paths of the same present-day file counts twice: the reviewer's case gives 15/17 instead of 12/14. Documented by the worker.

## Why
A slight overstatement of pair support on long histories with many renames.

## Acceptance
Each commit counts once per present-day file outside the window too; a test on the reviewer's case.

## Changelog
- Fixed: a file renamed or moved is counted once per commit in the co-change numbers however many paths a commit named it by, on long histories too, and an edit made under the old name on another branch still counts for the renamed file; a path created again after its file was renamed away is a separate file, so it no longer inherits the renamed file's earlier co-changes: where a file was moved and a new one created at its old path the next day, the old history now stays with the moved file (as git log --follow shows it).

## Evidence


docs: docs/reference.md: where it says a touched path is carried to the path the file lives at today, add that the walk keeps every co-change count under the identity of the file, carried through its renames, so a commit counts once per file in and out of the retained window, and that a path created again after its file was renamed away is another file. Needs: HIST_V, MODEL_V.

ran: tests/cochange-lineage-outside-window.test.mjs on release/6.2.0 then on jarl/182-file-lineage (d7051e6) · saw: red 2 of 3 fail (the file's pair with p.js 15 of 19 where its commits are 12 of 14; footprints 16 commits of the file against 14), green 3 of 3 pass (12 of 14); incremental and cold walks give equal identities; cochange-whole-history updated for the new contract (a path created again keeps only its own commits)
- **ran (history):** tests/cochange-lineage-outside-window.test.mjs (two new tests: a side branch editing the old name after the rename; a side branch dated before an already-walked rename and merged later, incremental against cold) with the vacated-path memory disabled, then enabled (97767f8) · **saw:** red 2 of 5 (the renamed file's pair with its partner absent, expected 8 of 9); green 5 of 5; cochange and history test files 49 of 49 pass. docs: docs/reference.md: also say an edit of a path whose file was renamed away still counts for that file, and only an add makes another file. Needs HIST_V (state gains gone; the bump also stops a saved earlier state being resumed with file counts starting at the resume point) and MODEL_V. Note for the jarl: engine/evals.mjs:288 keeps its own 64-step rename walk, untouched; the plan's rule moves flask src/flask/app.py history (479 commits) to src/flask/sansio/app.py, as git log --follow does, accepted.

2026-10-28 tidy-up: the worktree directory is gone; branch jarl/182-file-lineage keeps 6 commits beyond release/6.2.0 (97767f8), shared with 217; the lease ends and the issue returns to the queue

The worker was killed when the machine ran out of memory with six workers running; its commits stay on jarl/182-file-lineage (tip 164cf259). A new worker resumes the lease.
- ~~**ran (line 203b85d69530):** node --import ./tests/git-env.mjs --test tests/cochange-lineage-outside-window.test.mjs tests/cochange-whole-history.test.mjs, in plugins/grain of release/6.2.0 (b1ddc48, extracted with git archive) with the branch's test files copied in · **saw:** red: 4 of 10 fail. The reviewer's case: new.js~p.js 15 of 19 (expected 12 of 14), footprints 16 commits for the file (expected 14); incremental walk keeps no ids (0 of 3); a file moved onto a deleted file's path: b.js~p.js 16 of 18 (expected 8 of 9, as git log --follow gives); a path created again keeps the renamed file's touches (s.js absent, expected 9 of 10). The two vacated-path tests pass on the release branch (it carried such edits by path)~~
- ~~**ran (line 203b85d69530):** the same command on jarl/182-file-lineage (9b43fb4) · **saw:** green: 10 of 10 pass in both files (12 of 14 for the reviewer's case, footprints 14, incremental equals cold, b.js~p.js 8 of 9)~~
- **ran (line 203b85d69530):** node --import ./tests/git-env.mjs --test tests/cochange-lineage-outside-window.test.mjs (the tip's version) on 8609cf2, the branch before the vacated-path fix, extracted with git archive · **saw:** red: 3 of 6 fail; an edit under the old name on a branch walked after the rename: the renamed file's pair with p.js absent (expected 8 of 9); a branch dated before the rename, incremental against cold: pair absent (expected 8 of 9); moved onto a deleted path: 16 of 18. Green on the tip (row above)
- **retracted:** row 2 · by w-182b-opus · 2026-11-11
  miscounted: 5 of 10 fail on the release branch, not 4; recorded again below
- **retracted:** row 3 · by w-182b-opus · 2026-11-11
  the green run was on 164cf25, before the two comment-only commits; run again on the tip and recorded below
- **ran (line 203b85d69530):** node --import ./tests/git-env.mjs --test tests/cochange-lineage-outside-window.test.mjs tests/cochange-whole-history.test.mjs, in plugins/grain of release/6.2.0 (b1ddc48, extracted with git archive) with the branch's test files copied in · **saw:** red: 5 of 10 fail. The reviewer's case: new.js~p.js 15 of 19 (expected 12 of 14), footprints 16 commits for the file (expected 14); incremental walk keeps no ids (0 of 3); a file moved onto a deleted file's path: b.js~p.js 16 of 18 (expected 8 of 9, as git log --follow gives); a path created again keeps the renamed file's touches (s.js absent, expected 9 of 10). The two vacated-path tests pass on the release branch (it carried such edits by path)
- **ran (line 203b85d69530):** node --import ./tests/git-env.mjs --test tests/cochange-lineage-outside-window.test.mjs tests/rename-chain-no-cap.test.mjs tests/roles-cluster-per-kind.test.mjs tests/cochange-whole-history.test.mjs on jarl/182-file-lineage (9b43fb4) · **saw:** green: 15 of 15 pass (the reviewer's case 12 of 14, footprints 14, incremental equals cold, b.js~p.js 8 of 9, s.js 9 of 10)

Assumed: a file deleted at a path that another file is later moved onto has no present-day path (git log --follow on the moved file never reaches it), so its commits leave the co-change counts and the footprints alike, and its partners' commit sizes lose it on both sides; a file added again at a deleted file's path still adds up with it, as their commits are disjoint (commit 164cf25, by the worker before me, unproved until now).

Assumed: the brief keeps issue numbers out of files, so the branch's code and test comments lose theirs (commits 23a7ba4 for 182, 9b43fb4 for 217, comments only); the repository's older comments keep theirs, outside this lease.

