# 074 · Jarl: conflict markers and huge files pass merged and scope unnoticed

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-f8eb971f
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdMerged), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2108 at a1132a8

## What
Claim: Conflict markers were committed by the coordinator and a 124 MB core dump by a worker.

Neither merged nor scope checks added lines for conflict markers or added files for size. Map row fr-42.

## Why


## Acceptance
- scope and merged note each added line that starts a conflict marker (<<<<<<<, =======, >>>>>>>) and each added file over a size the help names, with its path; a note, never a refusal, since Jarl does not block code from landing
- Tests for a marker and for a large file; red on 71ebc5b

## Evidence

