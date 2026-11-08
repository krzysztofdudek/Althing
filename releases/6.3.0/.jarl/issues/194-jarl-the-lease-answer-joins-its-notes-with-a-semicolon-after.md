# 194 · Jarl: the lease answer joins its notes with a semicolon after the spelling note's own full stop, and the offer has no subject when another lease note comes first; the path-note reader and its remembering lines

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-045-opus-h2c
**Where:** skills/jarl/scripts/lib/commands.mjs cmdSet leaseNotes
**Branch:** jarl/194-small-views-and-refusals
**Worker:** w-jarl-194-opus
**Worktree:** /home/me/Worktrees/JarlSkill/194-small-views-and-refusals
**Since:** 2026-11-08 14:42

## What
The lease answer joins its notes with a semicolon after the spelling note's own full stop, which prints .; and when another lease note comes first (another spelling of a model, or a checked --worktree) the offer reads without its subject.

## Why
A note should read as a sentence.

## Acceptance
The notes are joined as separate lines or sentences, each with its subject, and a test holds the case where the spelling note comes first

## Evidence

