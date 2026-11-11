# 581 · Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1335-vzsz
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-340b-fable
**Where:** the review of 340

## What
Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after printing a companion list that names a 65 MiB file. Seen once on a copy of the e2e-companion fixture with a 65 MiB .sql file mapped into the dependency; the cause was not established, and the branch of issue 340 was not tried with a companion that returns such a file by path.

## Why


## Acceptance


## Evidence

