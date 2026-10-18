# 281 · Jarl: status --tag <t> scopes status (counts, in flight, stale, waiting, CI) to the issues carrying one tag

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#jarl-fr-status-by-one-tag
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1579 at 2c12aa3 (status)
**After:** 283, 249
**Branch:** jarl/249-views
**Worker:** w-p6-sonnet
**Since:** 2026-10-18 18:15

## What
In a loop with many scopes, status --by tag prints one line per tag (104 lines on the 6.2.0 loop, 66 of them one per tag), and list --tag gives the issues but not the in-flight, stale, waiting and CI sections status computes (a field report from a loop in another project, item 5; STATUS_BY in jarl-lib.mjs:1643 at 2c12aa3). The design research/2026-10-08-jarl-field-report-and-repository-names/design.md (B.2, item 5) adds one flag on one view, reusing everything status already computes.

## Why
A jarl who directs one scope of a large loop needs status for that scope, and today assembles it by hand from list and status.

## Acceptance
- status --tag <t> computes the sections of status (counts, in flight, stale, waiting, CI) over the issues carrying the tag only, and --json carries the same shape
- Tests: a loop with two tags; status --tag on each gives that tag's issues only, in every section

## Evidence

Deferred: Next release (6.3.0), per the design in research/2026-10-08-jarl-field-report-and-repository-names/design.md, Proposed changes

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).

