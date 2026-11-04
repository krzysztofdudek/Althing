# 140 · Jarl: ask, log and decide pointed at a directory with no loop crash with a bare ENOENT, where set and field say no such issue

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096f-opus
**Where:** Review of 096 (rev-jarl-096f-opus), Outside the issue

## What
ask, log and decide run in a directory that holds no loop end with a bare ENOENT and no ready line; set, field and the other writes there say no such issue instead of no loop here. The behaviour was there before 096.

## Why
An agent that runs from the wrong directory should be told there is no loop and given the --root form.

## Acceptance
Every command that needs a loop says no loop is found here and ends with the form that names --root, with a test per writing command

## Evidence

