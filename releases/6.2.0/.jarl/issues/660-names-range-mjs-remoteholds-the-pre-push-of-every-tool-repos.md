# 660 · names-range.mjs remoteHolds (the pre-push of every tool repository, since 363) leaves out the commi…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2100-wdab
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-658-opus
**Where:** the review of 657, 658

## What
names-range.mjs remoteHolds (the pre-push of every tool repository, since 363) leaves out the commits that pull-request refs reach, as in Important 1 of 657/658: a contributor's or dependabot's pull request merged locally in a tool repository and pushed is not scanned for the commits a host lists under refs/pull; asking only for heads and tags in remoteHolds closes both.

## Why


## Acceptance


## Evidence

