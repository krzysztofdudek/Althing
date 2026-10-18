# 283 · Jarl: in-flight rows carry derived facts (no rows yet; rows, no verdict; changes requested; approved and queued); set refusing an unknown status such as ready names that view

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#jarl-fr-in-flight-facts
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1192 at 2c12aa3 (set refuses an unknown status)
**After:** 249
**Branch:** jarl/249-views
**Merged:** 07bf1c486df3c2479edaee200b3f6815ed3359b3 in ../../../JarlSkill
**CI:** pending

## What
There is no way to see which in-progress issues have proof and wait for a reviewer. A worker that tried set ready was refused with a bare list of statuses (probe D of the design research/2026-10-08-jarl-field-report-and-repository-names/design.md; jarl-lib.mjs:1192 at 2c12aa3), and ready is a reserved view word meaning "ready to start" in next (:293) (a field report from a loop in another project, item 2). The facts are already in the record: a lease, the rows since its start, the latest verdict, the queue (gateState, :1822-1880). A "ready for review" status is rejected: it is one more write a worker can forget and one more thing to go stale (design, B.2, item 2).

## Why
The jarl decides whom to raise as a reviewer from the in-flight rows. Facts derived from the record cannot go stale and do not guess intent: a worker who records rows partway through its task shows as "rows, no verdict", which is true.

## Acceptance
- status and resume mark each in-flight issue with one fact: no rows since the start; rows since the start and no verdict since the last restart or round; changes requested; approved and queued; --json carries the mark
- set refusing a status the loop does not know (ready, review) names that view, and says that a loop which wants an explicit review status can declare one in its profile
- No new status. Tests: one in-flight issue in each of the four states, and the refusal's message

## Changelog
- Added: status and resume mark each issue in flight with one fact the record already holds and say what comes next (no evidence rows; rows and no verdict; changes requested; approved and queued), in --json too. set ready or review is refused naming these views.

## Evidence

Deferred: Next release (6.3.0), per the design in research/2026-10-08-jarl-field-report-and-repository-names/design.md, Proposed changes

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 07bf1c4 · **saw:** 294 tests, 292 pass, 0 fail, 2 skipped

