# 133 · Jarl: files are keyed as written, so ./src/a.mjs and src//a.mjs count as different from src/a.mjs and next misses the overlap

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096b-opus
**Where:** Review of 096 (rev-jarl-096b-opus), Outside the issue

## What
fileKeysOf in lib/repositories.mjs keys an issue's files as they were written; a path with a leading ./ or a doubled slash is a different key from the plain one, so next offers two issues that share a file and field Files --add adds the same file twice. The behaviour was there before issue 096.

## Why
next keeps workers off one another by file; a spelling difference defeats it.

## Acceptance
Files that differ only by a leading ./, a doubled or trailing slash or a backslash are one key in next, in check and in field Files --add, and a test holds it

## Evidence

