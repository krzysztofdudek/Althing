# 205 · Jarl: smaller points of the line rule and the artifact mark found by the last reviews

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-200-opus-m1b
**Where:** lib/review.mjs the note after an approve; lib/log.mjs the artifact mark reader; tests that read CHANGELOG.md
**Branch:** jarl/203-range-extend-inplace
**Worker:** w-jarl-203-opus
**Worktree:** /home/me/Worktrees/JarlSkill/203-range-extend-inplace
**Since:** 2026-11-08 14:42

## What
(1) In a loop that names lines, the note after an approve that says there is no Proof row since the gate's window opened still prints the evidence form without --line, next to a form that has it. (2) A verdict line written by the pinned 6.1.0 driver or the installed 6.2.0 whose finding opens with the word artifact followed by a path and the log separator is read by the current Jarl as naming an artifact, so report counts it and the brief lists the finding twice; the model mark has the same ambiguity with older lines. (3) Only docs-true and version read CHANGELOG.md; tense and vocabulary read the skill, its references and the README, so a doubled changelog entry (as a merge once left) is caught by no test.

## Why
Every note should print the form that works, an older writer's line should not be taken for a mark, and a doubled changelog entry should fail a test.

## Acceptance
The note prints the evidence form with --line where the loop names lines; the two marks are read only from lines a writer that sets them wrote (or the ambiguity is on the known-limitations list with its reason); a test fails when the Unreleased section of CHANGELOG.md holds the same entry twice; a test for each

## Evidence

