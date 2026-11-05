# 078 · Jarl: an issue can have sub-issues, so a backlog is a tree that a coordinator can split further, and no acceptance line of a parent is lost in the split

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 035, 083, 085, 086
**Found by:** owner
**Where:**
**Branch:** jarl/078-sub-issues
**Merged:** 2c798fe in ../../../JarlSkill
**CI:** none

## What
The owner, 2026-11-03: a coordinator that gets an issue from the jarl may see it as better done in smaller pieces (two light ones and a standard one, say), easier to do, to review and to trust; and a backlog is first written as groups and refined deeper while it is analysed, as people work, down to the level of requirements. Today the only relation between issues is a sequence (After) and the backlog is flat. Ids stay flat numbers; the hierarchy is a relation from a sub-issue to its parent.

## Why
A flat list makes every item look equally important and gives a coordinator no recorded way to split work; a split made by hand can drop a requirement silently, as a fix round did in the field (see 058's evidence).

## Acceptance
- An issue can name its parent; a sub-issue can have its own sub-issues; ids stay numbers; After keeps its meaning across levels
- A split moves each acceptance line of the parent to a named sub-issue or keeps it on the parent, and a line moved nowhere is refused, so no line is lost
- next offers only issues with no open sub-issues; a parent whose sub-issues are all done holds the ball on its coordinator to check the parent's own acceptance against the whole, and done on the parent refuses until then
- A sub-issue inherits its parent's slice tag (085), and a rule with a scope whose selector names an issue applies to that issue's sub-issues too (086), so a slice can be a subtree
- list shows the tree; tests for the split, the refusal of a lost line, the parent's check and both inheritances

## Changelog
- Added: A task can be split into smaller tasks, and those split again, so the backlog becomes a tree. Each checkable line of the big task goes to one of the smaller ones or stays with it, and Jarl refuses a split that would lose a line. The big task waits until its smaller ones are done, then its coordinator checks the whole before it can be closed. The smaller tasks keep the order, the part of the backlog and the rules of the big one. The first split moves the loop to format 3, and a new profile that declares a field named Parent is refused.

## Evidence

Part of the model (report sections 6 and 9); the parent field is written under format 3 (083).
- **ran:** node --test tests/sub-issues.test.mjs on release/6.2.1 6847047 (skills/jarl extracted with git archive into a scratch folder, the new test file copied in; TMPDIR the scratch folder) · **saw:** 14 tests, 1 pass, 13 fail: field Parent, the refusals of a missing parent, a cycle and a wait in a circle, the composer loop, next and After through the tree, split and its refusal of a lost line, the parent's check and done, the slice and rule inheritance, drop and reopen, list as a tree, verify; the one pass is the guard that a loop with no parent stays readable by the frozen readers
- **ran:** node --test tests/sub-issues.test.mjs on jarl/078-sub-issues (working tree, before its commit; TMPDIR the scratch folder) · **saw:** 14 tests, 14 pass, 0 fail
- **ran:** node --test tests/refusals-walk.test.mjs tests/refusals-walk-rooted.test.mjs tests/refusals-walk-views.test.mjs tests/refusals-walk-fixtures.test.mjs tests/refusals.test.mjs on the same tree, the walk's valid calls holding split 1 --line 1=2 · **saw:** 34 tests, 34 pass, 0 fail: every generated wrong call of split refused, nothing written, its form refused for its placeholder when pasted
- **ran:** on a copy of releases/6.3.0/.jarl (format 1, no profile.json): the pinned driver files 158 (three acceptance lines), 159 and 160; then this branch: split 158 --line 1=159 --line 2=160; split 158 --line 1=159 --line 2=160 --line 3=158; the driver's list; this branch's list, next --as jarl --all, brief 159, status, set 158 done · **saw:** the first split refused: line 3 of 158 is moved nowhere ... 3: "the docs describe both writers", form split "<id>" --line "<line=id>" ..., no profile.json written; the second: 158 split: line 1 → 159, line 2 → 160, line 3 kept · sub-issues 159, 160, profile.json format 3; the driver refuses: is written for record format 3, and this Jarl reads format 1; list shows 159 and 160 indented under 158; next --as jarl: 159 and 160 ready, each holds up 158, and 158 waits on the jarl via 159, 160; brief 159 shows Parent: 158 and sub-issue of 158 (open); status: waiting on their sub-issues: 158 (159, 160); set 158 done refused: 158 has sub-issues not closed: 159 (open), 160 (open)
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test at jarl/078-sub-issues f0980e0 (TMPDIR the scratch folder) · **saw:** tests 1226, pass 1206, fail 0, cancelled 0, skipped 20, exit 0; the run before the commit had 2 failures, the two tests that pin the list of parts field writes, which now holds Parent, and both lists were extended
- **ran:** node --test tests/proof-notes.test.mjs tests/sub-issues.test.mjs at f0980e0 with the tightened tests (the NO PROOF note to its exact text; the lost-line form) (TMPDIR the scratch folder) · **saw:** 38 tests, 35 pass, 3 fail: the two NO PROOF tests (in-progress;the merge, a space lost) and the split refusal (form split "<id>" --line "<line=id>" --line "<line=id>", no line still to place named)
- **ran:** the same files after the fix, then cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test (the tree committed as f74f3c0; TMPDIR the scratch folder) · **saw:** 38 pass, 0 fail; full suite tests 1226, pass 1206, fail 0, cancelled 0, skipped 20, exit 0
- **ran:** npm test in skills/jarl/scripts of the release worktree, at 2c798fe with 078 merged into release/6.2.1 (TMPDIR a mktemp -d folder under the system temporary directory) · **saw:** tests 1226, pass 1206, fail 0, skipped 20, exit 0

