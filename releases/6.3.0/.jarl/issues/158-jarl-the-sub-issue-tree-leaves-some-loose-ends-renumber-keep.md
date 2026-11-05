# 158 · Jarl: the sub-issue tree leaves some loose ends: renumber keeps a stale Parent, a question on a parent does not hold its sub-issues, a split can empty a parent, a cycle names its path oddly, and list indents a hand-made cycle with no top row

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-078-opus
**Where:** Review of 078 (rev-jarl-078-opus), Minor findings and Outside the issue

## What
(1) renumber leaves a stale Parent behind, as it already does for After (issue 116); this happens only after two copies of a loop are merged (cmdRenumber in lib/commands.mjs). (2) An open stuck or stop question that names a parent does not hold back its sub-issues (nextRows in lib/evidence.mjs). (3) A split may move every acceptance line out of a parent; the parent then shows '(no acceptance yet)' and its section keeps leftover blank lines (cmdSplit). (4) A cycle refusal names the path from the sub-issue, for example '138 -> 138 (the After of 133)' (waitCycle and afterList). (5) With a hand-written parent cycle, list indents the cycle's rows with no top row; verify already reports the cycle (treeOrder and renderList). Also: json of list and show gives every issue parent: null even in a loop with no parent, and report --json leaves it out when null.

## Why
Each is small; together they are what a user of the tree meets first when something goes wrong.

## Acceptance
Each of the six points is corrected or said honestly in the docs, with a test where the code changes; the json treats an empty parent the same way in list, show and report

## Evidence

