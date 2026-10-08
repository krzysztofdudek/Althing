# 282 · Jarl: an issue declares exclusive resources (Resources:), loop-wide, and next never offers two issues holding one

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#jarl-fr-resources
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1537 at 2c12aa3 (next)
**After:** 249

## What
Parallel workers collide on shared resources that next cannot see: ports, a database server, machine load (a field report from a loop in another project, "works badly"). A pseudo-file such as resource:gate half-works: within one repository two issues declaring it hold each other in next (probe A of the design research/2026-10-08-jarl-field-report-and-repository-names/design.md); across two repositories they do not, because next keys a file as a (repository, path) pair (probe B; jarl-lib.mjs:1541-1560 at 2c12aa3); and as an issue's only declared file it makes check report every real change as outside the issue (probe C; :2300). After cannot say "either order, but not together" for more than two issues without inventing an order. So a resource is not a file: it gets its own header field, loop-wide (design, B.2, W1).

## Why
Two heavy runs at once turn right work red for a cause outside the branch. Althing has the same need and meets it by hand ("one heavy run at a time", method/environment.md).

## Acceptance
- An issue header field Resources: holds names, loop-wide, not files; next does not offer an issue whose resource an in-progress issue holds, and 249's held group names the holder; check, queue and the file rules never read it
- No capacity and no runtime lock: a resource is held for a lease's whole life; contention during a test run belongs to the repository's own harness or the workspace's run lock, and how many heavy workers run stays the jarl's choice; SKILL.md says so
- Tests: two issues in two repositories that share a resource are never offered together by next; an issue that declares a resource passes check on its real files

## Evidence

Deferred: Next release (6.3.0), per the design in research/2026-10-08-jarl-field-report-and-repository-names/design.md, Proposed changes

