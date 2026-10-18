# 249 · Jarl: next lists together the ready issues, those waiting on After and those held by a file — contrary to the description 'issues that can run now'

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**After:** 280

## What
Confirmed in the 6.2.0 loop: next shows 142 and 143 with the note '(after 010, 075)' and the release issue 224 among the ready ones; the jarl of a loop in another project reports the same (the notes 'after' and 'waits on').

## Why
The output does not show at a glance the set that is ready to start, and that is what next is for.

## Acceptance
next by default lists only issues ready to start; --all adds groups with headers: held by a file in progress (who holds it), waiting on After (on what), held by an open stuck or stop question; an issue without declared files marked '(no files declared)'; next --json keeps the rows and adds a group field; SKILL.md consistent with the output; tests for each group.

## Evidence


