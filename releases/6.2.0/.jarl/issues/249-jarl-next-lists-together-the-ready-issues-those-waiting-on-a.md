# 249 · Jarl: next lists together the ready issues, those waiting on After and those held by a file — contrary to the description 'issues that can run now'

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**After:** 280
**Branch:** jarl/249-views
**Merged:** 07bf1c486df3c2479edaee200b3f6815ed3359b3 in ../../../JarlSkill
**CI:** pending

## What
Confirmed in the 6.2.0 loop: next shows 142 and 143 with the note '(after 010, 075)' and the release issue 224 among the ready ones; the jarl of a loop in another project reports the same (the notes 'after' and 'waits on').

## Why
The output does not show at a glance the set that is ready to start, and that is what next is for.

## Acceptance
next by default lists only issues ready to start; --all adds groups with headers: held by a file in progress (who holds it), waiting on After (on what), held by an open stuck or stop question; an issue without declared files marked '(no files declared)'; next --json keeps the rows and adds a group field; SKILL.md consistent with the output; tests for each group.

## Changelog
- Changed: next now lists only the issues ready to start; next --all adds the held and waiting ones in groups, and --json rows carry a group. An issue with no declared files is marked (no files declared). An issue with an open stuck or stop question on it is held back.

## Evidence


- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 07bf1c4 · **saw:** 294 tests, 292 pass, 0 fail, 2 skipped

