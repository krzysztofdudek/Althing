# 163 · Jarl: the cleanup after a merge and the done gate's merge check still read the main checkout's branch, not the repository's declared base

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261105T1426-ybzm
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-074-sonnet
**Where:** Report of the worker of 079 (package B), Found
**Branch:** jarl/163-base-and-reopen
**Merged:** 835fcd05f8a49889f0a1bffefe2d4453aa2bfc82 in ../../../JarlSkill
**CI:** none

## What
Issue 079 made the merge note read the declared base, but cleanUpAfterMerge (lib/commands.mjs, near line 1768) and the done gate's mergeRefusal still read the branch the main checkout has open, so after the base is declared they can disagree with the note about whether a branch is merged.

## Why
One rule for 'merged into the base' should serve the note, the cleanup and the gate.

## Acceptance
The note, the cleanup after a merge and the done gate's merge check use the same base (the declared base, else the branch the main checkout has open), with a test where the two differ

## Changelog
- Fixed: When a repository has a declared base branch, the cleanup after a merge and a loop that closes tasks only on a landed merge now look at that base, as the note about the merge does. Before, they looked at the branch the main checkout had open, so the cleanup could delete the base branch and a task merged into the base could be refused.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test --test-name-pattern='declared base|the done gate' tests/merge-holds.test.mjs (before the fix) · **saw:** fail 3: with the base declared as release and the main checkout on main, the done gate refused a merge that landed in release (not in the base, main) and took one that landed only in main, and the cleanup deleted the declared base branch integration
- **ran (history):** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs tests/merge-cleanup.test.mjs tests/merge-check.test.mjs tests/modules.test.mjs tests/record-contract.test.mjs (after the fix) · **saw:** pass 82, fail 0: the note, the cleanup and the gate read the declared base, else the branch the main checkout has open; the copy of this loop declares no base, and its status, resume, next and report are the same as on the release branch
- **ran (history):** cd skills/jarl/scripts && npm test (the whole suite on the branch tip 58824ff) · **saw:** tests 1548, pass 1526, fail 0, skipped 22; the suite left nothing in its temporary directory
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on two import lines of lib/commands.mjs (group H2 added leaseConflictOf, this group swapped in baseOf and added unmergedText), resolved by keeping both · **saw:** tests 1566, pass 1544, fail 0, skipped 22, merge 835fcd0

