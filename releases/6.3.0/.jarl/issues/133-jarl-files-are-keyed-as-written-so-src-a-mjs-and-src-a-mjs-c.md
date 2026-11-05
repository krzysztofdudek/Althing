# 133 · Jarl: files are keyed as written, so ./src/a.mjs and src//a.mjs count as different from src/a.mjs and next misses the overlap

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096b-opus
**Where:** Review of 096 (rev-jarl-096b-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Worker:** w-jarl-128-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/128-fields-and-refusals
**Since:** 2026-11-05 13:37

## What
fileKeysOf in lib/repositories.mjs keys an issue's files as they were written; a path with a leading ./ or a doubled slash is a different key from the plain one, so next offers two issues that share a file and field Files --add adds the same file twice. The behaviour was there before issue 096.

## Why
next keeps workers off one another by file; a spelling difference defeats it.

## Acceptance
Files that differ only by a leading ./, a doubled or trailing slash or a backslash are one key in next, in check and in field Files --add, and a test holds it

## Changelog
- Fixed: a file written with a leading ./, a doubled or trailing slash, a . in the middle or, on Windows, backslashes is now the same file as the plain path. next and the leases hold an issue back on it, scope finds it in the diff, and field Files --add and --remove no longer add or miss it twice.

## Evidence

- **ran:** node --test tests/file-keys.test.mjs on the code before the change · **saw:** 5 failed: ./src/a.mjs, src//a.mjs and src/a.mjs/ counted as different files in next, the lease, scope and field Files --add
- **ran:** node --test tests/file-keys.test.mjs tests/repositories.test.mjs after the change; a read of every issue of a copy of the real loop with the one normaliser · **saw:** pass 52, fail 0; of 162 issues and 22 declared files one file changed (a directory written with a trailing slash), and the issues grouped by shared file are identical before and after

