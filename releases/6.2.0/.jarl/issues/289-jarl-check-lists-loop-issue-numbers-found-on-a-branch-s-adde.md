# 289 · Jarl: check lists loop issue numbers found on a branch's added lines, as a note that does not change ok

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, check
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-11-jarl-model-calibration-and-field-notes#jarl-mc-check-issue-numbers
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2280 at 2c12aa3 (check reads changed file names, never their lines)

## What
check reports commits, the diff inside the declared files and the change in tests and assertions, but never reads the lines a branch adds. A loop issue number (issue NNN, #NNN for an id of this loop) written into code, a comment, a test, a doc or a graph entry points nowhere once the loop ends, and nothing catches it. The brief asks workers not to (issue 250); this is the mechanical counterpart.

## Why
A brief is testimony and weaker models drop it; a note from the check the jarl already runs before merging makes the slip visible while the branch can still be fixed. It stays a note: numbers, never a verdict.

## Acceptance
- check lists, per file and line, each added line that names an id of this loop as issue NNN or #NNN, as a note; the commit subject is not read; ok does not change; --json carries the list
- Tests: a branch adding both forms is listed, a number that is not an id of the loop is not, removed lines and the commit subject are ignored, and ok is unchanged

## Evidence

Deferred: Next release (6.3.0), per the design research/2026-10-11-jarl-model-calibration-and-field-notes/design.md, Proposed changes

