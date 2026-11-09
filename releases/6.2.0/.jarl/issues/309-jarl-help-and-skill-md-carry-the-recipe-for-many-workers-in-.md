# 309 · Jarl: help and SKILL.md carry the recipe for many workers in worktrees (which mode, who commits .jarl, who files tickets, what in-progress …

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261015T1110-brok
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-help-worktree-recipe
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs:229
**After:** 337
**Branch:** jarl/309-workflow-recipe
**Merged:** 3e2fae1f768b264961379eb4057394812bf6a798 in ../../../JarlSkill
**CI:** pending

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

## Changelog
- Changed: The help text ends with a short section for a session with several workers in worktrees: which call needs the main checkout, who commits the loop, who files issues, what an issue in progress means and what list hides. The assistant tools answer the same text.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).
- **ran (history):** cd skills/jarl/scripts && node --test tests/help-workflow.test.mjs (before the section was added, on branch jarl/309-workflow-recipe) · **saw:** 2 tests failed: 'the section opens with its heading' for the usage text and for the jarl_help answer
- **ran (history):** cd skills/jarl/scripts && nice -n 15 npm test (branch tip 0460775) · **saw:** tests 758, pass 736, fail 0, skipped 22; help-workflow tests pass: usage, --help output and jarl_help all end with the same Parallel workers in worktrees section naming the five points
- **ran (history):** jarl status, resume, next --all, report, list --all, queue, branches, show --full for 309 250 100 330 1 337 200, and the --json forms of status, resume and next, on a copy of the loop, release tip vs branch tip, cmp · **saw:** every output byte-identical (the loop declares no Model lines, so no model suffix to differ; on a copy with Model lines added, next and resume are identical too, 23 and 10 [model X] rows, no suggestion in either)
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 3e2fae1 · **saw:** 760 tests, 738 pass, 0 fail, 22 skipped

