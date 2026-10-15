# 309 · Jarl: help and SKILL.md carry the recipe for many workers in worktrees (which mode, who commits .jarl, who files tickets, what in-progress …

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-help-worktree-recipe
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs:229

## What
Claim: A coordinator of about five parallel workers in worktrees did not find the three decisions the skill already makes (the default mode keeps the loop out of git and every call takes the main checkout as root; the merger is the only one who commits a committed loop; in-progress is the lease), and so reported as defects what is the design: an uncommitted loop, a shared log.md, a ticket that stays in-progress after an approve, a list it did not know how to filter.

SKILL.md:20-24 (modes), :184 (the lease), :402-409 (worker rules) hold them; help prints each command's usage and nothing on a worktree workflow (jarl.mjs:75-115, :229); jarl-lib.mjs:1109-1114 hides finished work from list by default and filters by status, kind, tag, prio, grep and match; a field report from a private deployment of 6.1.0, sections 3.3, 3.4, 3.5 and 4 (source.md). Related: issue 250 (a chapter on a loop that drives several repositories).

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: help ends with a short workflow section (or help workflow): for a session with parallel workers, the default mode with root set to the main checkout on every call; who commits .jarl/ (the merger, never a worker) in the committed mode; who files tickets (the coordinator, or a worker with root set to the main checkout); in-progress means held by a worker; list hides finished work and filters by tag, status, priority and text. The same text enters SKILL.md where it is missing. Tests: help's last section names the four points. 6.2.0.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

