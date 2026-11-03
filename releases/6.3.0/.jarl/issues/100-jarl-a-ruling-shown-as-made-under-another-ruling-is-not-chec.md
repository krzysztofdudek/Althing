# 100 · Jarl: a ruling shown as made under another ruling is not checked when the line was written by hand or an older Jarl, and the display does not mark it when the cited ruling is later superseded

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 063
**Found by:** rev-jarl-063-opus
**Where:** Review of 063 (2026-11-03): renderDecisions, lib/resume.mjs, cmdDecide

## What
A ruling written by the pinned driver or by hand with a final Made under paragraph is shown as under <slug> without checking the slug; if the cited ruling is later superseded the display still shows under with no mark; --under accepts a ruling that is a rejected area ruling.

## Why
A mandate that no longer holds should show as such to the coordinator reading the ruling.

## Acceptance
The display marks a cited ruling that is not in force or does not exist, and --under refuses a cited ruling that is rejected, each with a test

## Evidence

