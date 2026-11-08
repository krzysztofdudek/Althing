# 190 · Jarl: the brief lists a finding three times when 6.1.0 wrote its log line without a lead-in and a later Jarl wrote the same finding, and the any-order pairing grows with the cube of the review lines

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-157-opus-f4
**Where:** skills/jarl/scripts/lib/brief.mjs findingsOf
**Branch:** jarl/182-resume-and-brief
**Worker:** w-jarl-182-opus
**Worktree:** /home/me/Worktrees/JarlSkill/182-resume-and-brief
**Since:** 2026-11-08 10:43

## What
(1) The same finding opening with model from one reviewer on one day, given once by the 6.1.0 driver (no lead-in, no Reviews entry) and once by 6.2.0 or the current Jarl, is listed three times and the note says nothing tells the two apart, though the missing lead-in does (20 of 2699 mixed-writer variants). (2) Pairing in any order, which runs only for an out-of-order file, grows with about the cube of the review lines: 17 ms at 62 lines, 1.2 s at 252.

## Why
A brief should list a finding once, and a pairing should stay cheap.

## Acceptance
The pairing uses the missing lead-in as a difference between a 6.1.0 line and a later one, and the any-order pairing is quadratic or capped with a note; a test holds each

## Evidence

