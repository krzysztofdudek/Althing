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
**After:** 244

## What
Architect, section 3.4: the 6.1.1 → 6.2.0 loop changed its goal, directory and branches in one afternoon, and its log does not say so; goal.md changes by hand, although its machine lines change results. Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (A.2 item 2, A.4): the command sets the Check and Coordinators lines only, with Check lines per repository in the form 246 defines; repositories are declared by Jarl itself in .jarl/repos.md (247), never by a goal line, because goal.md is the charter of the owner and a repository joining a loop is routine (this loop took in three add-on repositories in one afternoon). The title phrase "the 246 repositories" means the per-repository Check lines of 246. Amended by the architect scope review of 2026-10-18 (section 4, item 7) and the ruling jarl-release-alone-with-every-jarl-issue: it is part of this release, and goal --set also covers the Model (<tier>): lines that 287 adds, since they move cost and are the word of the owner. Amended by the architect code review of 2026-10-18 (O11 and section 5): there is no --amend (the paragraph amendment the title names is dropped; prose of goal.md stays the owner text, edited by hand), and goal --set is built on the one goalLines reader and writer of 325, so it adds no parser of its own.

## Why



A machine line in goal.md changes what status, report and the done notes say for every issue, and a change to it that leaves no log line cannot be traced.

## Acceptance
- goal prints the goal; goal --set "Check (<name>): …" (and a bare Check:), goal --set "Model (<tier>): …" and goal --set "Coordinators: …" change that machine line with a log entry, written through the goalLines writer of 325; no repository lines and no --amend
- No parser of its own: goal reads and writes only through goalLines; seams.test.mjs stays green and the bold-key line pattern of goal.md still occurs once in jarl-lib.mjs
- Tests: each of the three kinds of machine line set and changed with its log line, a Model line for a tier the profile does not declare refused, and --amend refused as an unknown flag

## Evidence


