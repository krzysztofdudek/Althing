# 148 · Jarl: set done accepts a code issue with a lease and no merge, and status then flags the same issue as closed with a gate that does not hold

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** haiku-usability-run
**Where:** Usability run of 096 (a Haiku test subject, 16 calls, 0 refused); the transcript is in research/2026-11-03-jarl-as-a-loop-tool/usability-run-096.md

## What
On a scratch loop, an issue leased with a branch (a code issue by the skill's definition) was given one proof row and one fresh approve, and set done accepted it with no merge recorded. The review reply had said the merger merges first and a worker never sets done. status then listed it as 'closed, gate does not hold: a code issue done with no merge recorded' with a repair that reopens it. The skill never says a merge is needed before done, and the help's list of what done needs has no merge in it.

## Why
A command that accepts a close and a view that calls the same close broken disagree about one rule, and an agent follows the command.

## Acceptance
Either set done on a code issue with no recorded merge is refused with the form that records the merge, or the status flag and the review reply no longer call it broken; SKILL.md and the help state which; a test holds the chosen rule, and a loop with no repository (nothing to merge) is covered

## Evidence

