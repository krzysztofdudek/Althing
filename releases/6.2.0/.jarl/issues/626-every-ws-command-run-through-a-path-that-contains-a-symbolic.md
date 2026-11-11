# 626 · Every ws command run through a path that contains a symbolic link does nothing and exits 0 (doctor,…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1752-jwxp
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363f-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Every ws command run through a path that contains a symbolic link does nothing and exits 0 (doctor, status, check, release), because the run-directly check at the end of workspace/ws.mjs compares import.meta.url, which node resolves through links, with process.argv[1] as given; a script or a hook that trusts its exit code sees a silent success (found in round 3 after the takeover of 363, where the names hook depends on it)

## Why


## Acceptance


[test] Every ws command run through a path that holds a symbolic link (a linked Althing, a link above it) runs its command, as run by its real path, red before and green after · by: yg check && npm test

## Evidence

