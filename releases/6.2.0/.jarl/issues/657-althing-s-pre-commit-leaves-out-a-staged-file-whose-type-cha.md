# 657 · Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, s…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2033-qxiy
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-592-opus
**Where:** the review of 592, 593, 602, 603, 608, 609, 613, 616, 622, 626, 629, 630
**Branch:** jarl/658-names-remote-asked
**Worker:** w-658-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:36

## What
Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, so a link turned into a file is not read, though line 284 treats a type change as handled): a link replaced by a note holding a test entry passed pre-commit with the key; the pre-push refused it. The filter predates this change.

## Why


## Acceptance


[test] Althing's pre-commit reads a staged file whose type changed (a symlink replaced by a regular file, and the reverse) and refuses a test word in it, red before and green after · by: yg check && npm test

## Evidence

