# 616 · Althing's own rails read a commit message with git log --format=%B (rails/run.mjs:97) and every obj…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1609-uubf
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363c-opus
**Where:** the review of 363

## What
Althing's own rails read a commit message with git log --format=%B (rails/run.mjs:97) and every object through git's replacement objects, so a repository's i18n.logOutputEncoding or a local git replace changes what the local rails read from what a push sends; CI, in a fresh clone, still reads the original (by reading; the same calls fail in names-range, round 3 of 363, Minors 2 and 6)

## Why


## Acceptance


## Evidence

