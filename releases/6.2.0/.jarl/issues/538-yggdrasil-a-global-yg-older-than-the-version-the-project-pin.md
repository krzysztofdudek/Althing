# 538 · Yggdrasil: a global yg older than the version the project pins runs without a warning

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261111T0927-tfyb
**Tags:** yggdrasil, upgrade
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** the CLI entry point

## What
A field report ran a global yg 6.0.0 in a project pinning 6.1.0. It wrote a cache in the older release's keys, and nothing said so.

## Why
A user believes they run the project's version.

## Acceptance
[test] A yg run inside a project whose pin names a newer version warns and names the pinned binary, or hands over to it · by: cd source/cli && npm test

## Evidence

