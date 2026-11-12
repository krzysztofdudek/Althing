# 540 · Jarl: decide --applies-to accepts a selector that matches nothing

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T0927-htuf
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** skills/jarl/scripts/lib/rules.mjs
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
A rule scoped 'role worker and repo ./repo' was accepted and reached no brief, because the selector is compared with the repository's declared name and the issue prints the path spelling. A field report.

## Why
A rule that silently reaches nobody looks in force.

## Acceptance
[test] decide refuses a repo selector no declared repository has, and the path and the name spellings both match · by: cd skills/jarl/scripts && npm test

## Evidence

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

