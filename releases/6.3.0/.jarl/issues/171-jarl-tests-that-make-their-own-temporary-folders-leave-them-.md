# 171 · Jarl: tests that make their own temporary folders leave them behind when a test file runs alone

**Status:** in-progress
**Kind:** cleanup
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a3
**Where:** skills/jarl/scripts/tests/review-waiver.test.mjs: codeLoop, and the gitRepo and loop helpers
**Branch:** jarl/163-base-and-reopen
**Worker:** w-jarl-163-opus
**Worktree:** /home/me/Worktrees/JarlSkill/163-base-and-reopen
**Since:** 2026-11-08 09:34

## What
A test file run on its own leaves its jarl-waiver-profile folders and similar ones in the system temporary directory; only tests/suite.mjs deletes them.

## Why
The host's rules say a test makes its own folder and removes it when it ends, and the temporary directory has a limit on files.

## Acceptance
A test file run alone removes the folders it made, with the helpers shared

## Evidence

