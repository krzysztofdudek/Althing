# 283 · Jarl: in-flight rows carry derived facts (no rows yet; rows, no verdict; changes requested; approved and queued); set refusing an unknown status such as ready names that view

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#jarl-fr-in-flight-facts
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1192 at 2c12aa3 (set refuses an unknown status)

## What
There is no way to see which in-progress issues have proof and wait for a reviewer. A worker that tried set ready was refused with a bare list of statuses (probe D of the design research/2026-10-08-jarl-field-report-and-repository-names/design.md; jarl-lib.mjs:1192 at 2c12aa3), and ready is a reserved view word meaning "ready to start" in next (:293) (a field report from a loop in another project, item 2). The facts are already in the record: a lease, the rows since its start, the latest verdict, the queue (gateState, :1822-1880). A "ready for review" status is rejected: it is one more write a worker can forget and one more thing to go stale (design, B.2, item 2).

## Why
The jarl decides whom to raise as a reviewer from the in-flight rows. Facts derived from the record cannot go stale and do not guess intent: a worker who records rows partway through its task shows as "rows, no verdict", which is true.

## Acceptance
- status and resume mark each in-flight issue with one fact: no rows since the start; rows since the start and no verdict since the last restart or round; changes requested; approved and queued; --json carries the mark
- set refusing a status the loop does not know (ready, review) names that view, and says that a loop which wants an explicit review status can declare one in its profile
- No new status. Tests: one in-flight issue in each of the four states, and the refusal's message

## Evidence

Deferred: Next release (6.3.0), per the design in research/2026-10-08-jarl-field-report-and-repository-names/design.md, Proposed changes

