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
**After:** 244, 246, 287

## What
Architect, section 3.4: the 6.1.1 → 6.2.0 loop changed its goal, directory and branches in one afternoon, and its log does not say so; goal.md changes by hand, although its machine lines change results. Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (A.2 item 2, A.4): the command sets the Check and Coordinators lines only, with Check lines per repository in the form 246 defines; repositories are declared by Jarl itself in .jarl/repos.md (247), never by a goal line, because goal.md is the owner's charter and a repository joining a loop is routine (this loop took in three add-on repositories in one afternoon). The title's "the 246 repositories" now means 246's per-repository Check lines. Amended by the architect's scope review of 2026-10-18 (section 4, item 7) and the ruling jarl-release-alone-with-every-jarl-issue: in Jarl 6.2.0 (no longer optional), and goal --set also covers the Model (<tier>): lines that 287 adds, since they move cost and are the owner's word; it therefore comes after both 246 and 287.

## Why



A machine line in goal.md changes what status, report and the done notes say for every issue, and a change to it that leaves no log line cannot be traced.

## Acceptance
- goal prints the goal; goal --set "Check (<name>): …" (and a bare Check:), goal --set "Model (<tier>): …" (287) and goal --set "Coordinators: …" change that machine line with a log entry; goal --amend "<text>" --ruling <slug> changes a paragraph only with a reference to a ruling; no repository lines
- Tests: each of the three kinds of machine line set and changed with its log line, a Model line for a tier the profile does not declare refused, and an amend without --ruling refused

## Evidence


