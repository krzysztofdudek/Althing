# 581 · Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1335-vzsz
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340b-fable
**Where:** the review of 340
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after printing a companion list that names a 65 MiB file. Seen once on a copy of the e2e-companion fixture with a 65 MiB .sql file mapped into the dependency; the cause was not established, and the branch of issue 340 was not tried with a companion that returns such a file by path.

## Why


## Acceptance


[test] yg aspect-test --dry-run for a reviewer rule whose companion names a 65 MiB file ends with a report naming the file and the limit, never exit 134, red before and green after (or the cause is shown not to exist on the release, with the reproduction recorded) · by: cd source/cli && npm test

## Evidence

