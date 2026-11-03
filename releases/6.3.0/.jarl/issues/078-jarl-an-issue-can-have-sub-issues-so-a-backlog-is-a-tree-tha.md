# 078 · Jarl: an issue can have sub-issues, so a backlog is a tree that a coordinator can split further, and no acceptance line of a parent is lost in the split

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 035, 083, 085, 086
**Found by:** owner
**Where:**

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

## Evidence

Part of the model (report sections 6 and 9); the parent field is written under format 3 (083).

