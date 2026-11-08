# 158 · Jarl: the sub-issue tree leaves some loose ends: renumber keeps a stale Parent, a question on a parent does not hold its sub-issues, a split can empty a parent, a cycle names its path oddly, and list indents a hand-made cycle with no top row

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-078-opus
**Where:** Review of 078 (rev-jarl-078-opus), Minor findings and Outside the issue
**Branch:** jarl/203-range-extend-inplace
**Worker:** w-jarl-203-opus
**Worktree:** /home/me/Worktrees/JarlSkill/203-range-extend-inplace
**Since:** 2026-11-08 14:42

## What
(1) renumber leaves a stale Parent behind, as it already does for After (issue 116); this happens only after two copies of a loop are merged (cmdRenumber in lib/commands.mjs). (2) An open stuck or stop question that names a parent does not hold back its sub-issues (nextRows in lib/evidence.mjs). (3) A split may move every acceptance line out of a parent; the parent then shows '(no acceptance yet)' and its section keeps leftover blank lines (cmdSplit). (4) A cycle refusal names the path from the sub-issue, for example '138 -> 138 (the After of 133)' (waitCycle and afterList). (5) With a hand-written parent cycle, list indents the cycle's rows with no top row; verify already reports the cycle (treeOrder and renderList). Also: json of list and show gives every issue parent: null even in a loop with no parent, and report --json leaves it out when null.

## Why
Each is small; together they are what a user of the tree meets first when something goes wrong.

## Acceptance
Each of the six points is corrected or said honestly in the docs, with a test where the code changes; the json treats an empty parent the same way in list, show and report

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/sub-issues.test.mjs, the test file of 8bb097b on the code of the release branch at b3104b1 · **saw:** red: tests 16, pass 14, fail 2 — with an open stop question on parent 001, its sub-issues 003 and 004 (under 002) were offered as ready; report --json left parent out of its rows where list and show give null
- **ran:** cd skills/jarl/scripts && node --test tests/sub-issues.test.mjs tests/next-views.test.mjs tests/slices.test.mjs tests/next-as.test.mjs tests/report-metrics.test.mjs tests/report-slips.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/words.test.mjs tests/skill-shape.test.mjs tests/modules.test.mjs, at 8bb097b · **saw:** green: tests 157, pass 157, fail 0 — a question on a parent holds every issue under it (held-by-question, naming a-1), a question on a sub-issue holds only it, both are named in number order (question a-1, a-2), the answer releases them; list, show and report --json give parent null for an issue with none and the id for a sub-issue; points 1, 3, 4 and 5 are on the known-limitations list and left as they are
- **ran:** every read view (status, resume, report, report --metrics, list, list --all, next, next --all, next --as jarl and owner, verify, decisions, decisions --live, models, branches, goal, profile, sources; show, show --json and brief of each of the 205 issues; show --full and the reviewer's brief of the last 20), text and --json, base b3104b1 against cb00e5e on a copy of the 6.3.0 loop with its repositories linked, ages masked · **saw:** 686 views, each run with both: 1 differs, report --json, whose 205 issue rows each gain parent: null (no issue of the loop has a parent), as list and show already give it; closedGate is 028 alone in both; the copy is unchanged by the views
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at 2b7c932 (release/6.2.1 at f3d0963 merged), TMPDIR from mktemp -d; then node --test tests/queue-views.test.mjs at efcdc93 · **saw:** tests 1686, pass 1663, fail 1, skipped 22 (the record contract test included): the one failure was tests/queue-views.test.mjs, whose exact report row lacked the parent key report --json now carries; the row is expected with parent: null at efcdc93, and that file passes, tests 7, pass 7, fail 0

