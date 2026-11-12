# 541 · Jarl: no view of the rules that reach a role

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261111T0927-xhmw
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** decisions --live
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
decisions --live has no --as or --applies-to filter, so checking a new rule means raising a brief by hand. A field report.

## Why
A rule cannot be checked before use.

## Acceptance
[test] decisions --live --as <role> prints the rules that reach that role · by: cd skills/jarl/scripts && npm test

## Evidence

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

