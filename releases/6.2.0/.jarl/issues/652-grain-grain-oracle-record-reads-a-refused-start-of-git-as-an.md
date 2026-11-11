# 652 · Grain: grain oracle record reads a refused start of git as an answer, on cd0c0fcf and on this branc…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2003-qber
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-573b-opus
**Where:** the review of 573, 587, 588, 605, 606, 612, 631

## What
Grain: grain oracle record reads a refused start of git as an answer, on cd0c0fcf and on this branch alike: a refused 'git ls-files' stops it with 'it is not a git checkout, or its index is empty' (oracle.mjs:75-82, through trackedFiles in history.mjs, which returns null on any error), and a refused 'git remote get-url origin' writes the record with repo null (originUrl in history.mjs). oracle returns at grain.mjs:84-88, before the end-of-command check of a swallowed start failure (grain.mjs:441), so nothing catches either. Seen with the stub of open-file-limit-never-changes-the-answer.test.mjs on a staged copy of the Grain tree with its oracle graph. Also (rev-573b-opus, minors of the large-files package): headSha (history.mjs:39-45) quietly returns no commit when git could not start, so grain oracle record writes asOf unknown instead of naming the limit, as round 1's tip did; and process-start.mjs:41-46 (catFile) starts git itself through a spawnSync handed in, against its own comment and the analysis-layer rule's text (the finished-result form batchOut(r) keeps history.mjs under budget too).

## Why


## Acceptance


[test] A refused git start in grain oracle record (ls-files, remote get-url, the HEAD lookup) stops with the open-files message, never answers as no git, no remote or no commit, and process-start.mjs takes finished results instead of starting git, red before and green after · by: cd plugins/grain && npm test

## Evidence

