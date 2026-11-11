# 541 · Jarl: no view of the rules that reach a role

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261111T0927-xhmw
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** decisions --live

## What
decisions --live has no --as or --applies-to filter, so checking a new rule means raising a brief by hand. A field report.

## Why
A rule cannot be checked before use.

## Acceptance
[test] decisions --live --as <role> prints the rules that reach that role · by: cd skills/jarl/scripts && npm test

## Evidence

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

