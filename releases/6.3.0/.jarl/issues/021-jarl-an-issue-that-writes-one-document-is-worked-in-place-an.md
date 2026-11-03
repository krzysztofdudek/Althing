# 021 · Jarl: an issue that writes one document is worked in place, and the reference says who commits it

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
In a loop of research issues that each write one markdown file, a worktree, a branch and a merge per issue was ceremony; the loop ruled that such issues write their declared file in place and the coordinator commits. The rules say only the merger commits, which leaves a loop with no merges in doubt.

## Why
Document work is a common shape of a loop; the skill should support it rather than leave each coordinator to invent it.

## Acceptance
- An issue may be marked as worked in place on its declared files; next keeps two such issues off one file, as it does now
- The references say who commits in that case and when, and that the merge steps do not apply
- A test for the in-place mark and the file guard

## Evidence

