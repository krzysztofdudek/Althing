# 253 · Jarl: a goal command — print the goal, set a machine line (Check, Coordinators, repository) with a log entry, amend a paragraph with a reference to a ruling (optional, if the 246 repositories go in)

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:**
**After:** 246

## What
Architect, section 3.4: the 6.1.1 → 6.2.0 loop changed its goal, directory and branches in one afternoon, and its log does not say so; goal.md changes by hand, although its machine lines change results. Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (A.2 item 2, A.4): the command sets the Check and Coordinators lines only, with Check lines per repository in the form 246 defines; repositories are declared by Jarl itself in .jarl/repos.md (247), never by a goal line, because goal.md is the owner's charter and a repository joining a loop is routine (this loop took in three add-on repositories in one afternoon). The title's "the 246 repositories" now means 246's per-repository Check lines. Optional in 6.2.0, as before, after 246 if it goes in.

## Why



A machine line in goal.md changes what status, report and the done notes say for every issue, and a change to it that leaves no log line cannot be traced.

## Acceptance
goal prints the goal; goal --set "Check (<name>): …" (and a bare Check:) and goal --set "Coordinators: …" change that machine line with a log entry; goal --amend "<text>" --ruling <slug> changes a paragraph only with a reference to a ruling; no repository lines; tests

## Evidence


