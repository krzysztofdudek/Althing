# 309 · Jarl: help and SKILL.md carry the recipe for many workers in worktrees (which mode, who commits .jarl, who files tickets, what in-progress …

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-help-worktree-recipe
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs:229
**After:** 337

## What
Claim: A coordinator of about five parallel workers in worktrees did not find the three decisions the skill already makes (the default mode keeps the loop out of git and every call takes the main checkout as root; the merger is the only one who commits a committed loop; in-progress is the lease), and so reported as defects what is the design: an uncommitted loop, a shared log.md, a ticket that stays in-progress after an approve, a list it did not know how to filter.

SKILL.md:20-24 (modes), :184 (the lease), :402-409 (worker rules) hold them; help prints each command's usage and nothing on a worktree workflow (jarl.mjs:75-115, :229); jarl-lib.mjs:1109-1114 hides finished work from list by default and filters by status, kind, tag, prio, grep and match; a field report from a private deployment of 6.1.0, sections 3.3, 3.4, 3.5 and 4 (source.md). Related: issue 250 (a chapter on a loop that drives several repositories).

## Why


A coordinator who cannot find the three decisions the skill already makes reports the design as defects and works around it. Amended by the architect's scope review of 2026-10-18 (sections 4, item 5, and 7.1): the help half stays here and the SKILL.md half moves into 250's rebuild, so the text has one home in SKILL.md and is not written twice. The workflow text is appended to the usage text, so help and the MCP tool jarl_help both end with it; a help workflow topic is not used, because the jarl_help tool of the vendored Runes 1.0.0 adapter takes no fields and would never reach it, and a Runes change is out of this release.

## Acceptance
- The usage text that help prints, and jarl_help answers with, ends with a short workflow section: for a session with parallel workers, the default mode with root set to the main checkout on every call; who commits .jarl/ (the merger, never a worker) in the committed mode; who files tickets (the coordinator, or a worker with root set to the main checkout); in-progress means held by a worker; list hides finished work and filters by tag, status, priority and text
- No help workflow topic and no new command: the section is part of the one usage text
- The SKILL.md half (the same four points where SKILL.md lacks them) is done in 250, not here
- Tests: the last section of help and of the jarl_help reply names the four points. 6.2.0.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).

