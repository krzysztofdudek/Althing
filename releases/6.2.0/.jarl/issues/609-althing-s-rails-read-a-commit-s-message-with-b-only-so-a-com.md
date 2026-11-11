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

