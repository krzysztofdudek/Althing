# 074 · Jarl: conflict markers and huge files pass merged and scope unnoticed

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-f8eb971f
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdMerged), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2108 at a1132a8
**Branch:** jarl/074-merge-and-files
**Worker:** w-jarl-074-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/074-merge-and-files
**Since:** 2026-11-05 13:37

## What
Claim: Conflict markers were committed by the coordinator and a 124 MB core dump by a worker.

Neither merged nor scope checks added lines for conflict markers or added files for size. Map row fr-42.

## Why


## Acceptance
- scope and merged note each added line that starts a conflict marker (<<<<<<<, =======, >>>>>>>) and each added file over a size the help names, with its path; a note, never a refusal, since Jarl does not block code from landing
- Tests for a marker and for a large file; red on 71ebc5b

## Changelog
- Added: scope and the recording of a merge now point out each added line that starts a conflict marker and each added file over 64 MiB, the largest file Jarl accepts as an attachment, with its file. They only say so and never stop a merge.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/added-content-notes.test.mjs, lib/rounds.mjs and lib/commands.mjs at the release tip · **saw:** pass 1, fail 4: scope prints no note for a conflict marker line or for an added file of 64 MiB + 1 bytes, and merged prints none for a marker or a large file the merge brought in
- **ran:** cd skills/jarl/scripts && node --test tests/added-content-notes.test.mjs tests/modules.test.mjs, on the branch · **saw:** pass 8, fail 0: notes 'a.txt:2 starts a conflict marker · <<<<<<< HEAD', '=======', '>>>>>>> feature' (not 8 characters, not inside prose), 'core.dump is an added file of 67108865 bytes, over the 67108864 bytes (64 MiB) Jarl accepts as an attachment'; a file of exactly 64 MiB and a modified file are not noted; ok stays true

