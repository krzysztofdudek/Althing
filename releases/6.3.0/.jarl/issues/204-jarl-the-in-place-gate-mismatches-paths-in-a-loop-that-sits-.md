# 204 · Jarl: the in-place gate mismatches paths in a loop that sits in a subdirectory of its repository, a declared symlink can never close, and the gate reads the hook's git variables

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-023-opus-l1b
**Where:** lib/commands.mjs inPlaceRefusal and touches; lib/git.mjs git versus gitHere

## What
(1) In a loop that sits in a subdirectory of its repository (as Althing's loops do) the in-place gate matches a declared path by equality or by ending against paths relative to the top of the repository: an unrelated uncommitted other/docs/a.md blocks done for docs/a.md, and a commit that changed only other/docs/a.md closes the issue though its own file was never touched. (2) A declared file that is a symlink can never close an in-place issue. (3) The gate uses git(), which keeps a hook's GIT_DIR and related variables, rather than gitHere. (4) Every --by write of this Jarl raises a format-1 loop to 3, after which the pinned 6.1.0 driver refuses it: the coordinator must not run this Jarl with --by on the real loop before the family driver moves.

## Why
The gate must test the issue's own file in the repository's own terms.

## Acceptance
The gate compares paths relative to the top of the repository, a symlink is resolved or refused with a form, the gate runs git without a hook's variables, and item 4 is said once in the release notes; a test for each of the first three

## Evidence

