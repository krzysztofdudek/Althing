# 609 · Althing's rails read a commit's message with %B only, so a commit header such as mergetag, which ca…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1536-dnds
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363b-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's rails read a commit's message with %B only, so a commit header such as mergetag, which carries a merged signed tag's tagger and message, is never read

## Why


## Acceptance


[test] Althing's rails read every header of a commit (mergetag and other extra headers) and its message in its declared encoding, refusing a test word in each, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line e7034c469ce2):** node --test rails/test/run.test.mjs (a git archive export of df39a35, the code before the fix, with the file's 13 tests as they stand at 31111f2) · **saw:** the test of 609 fails with 10 others: a crafted mergetag header, an ISO-8859-2 author and an ISO-8859-2 message under an encoding header pass as clean, and an encoding that does not exist is not refused
- **ran (line e7034c469ce2):** node --test rails/test/run.test.mjs (the tree of 83df69c, the fix) · **saw:** tests 13, pass 13, fail 0: each of the three is refused (author or committer, or another header of the commit; message:3) and the unknown encoding is refused as one this scan cannot decode

