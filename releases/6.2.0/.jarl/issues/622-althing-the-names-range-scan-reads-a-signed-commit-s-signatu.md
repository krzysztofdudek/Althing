# 622 · Althing: the names range scan reads a signed commit's signature as text and a tag's non-UTF-8 text as UTF-8

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1627-euid
**Tags:** althing, rails, names
**Files:** Althing/rails
**Repo:** Althing
**After:** 363
**Found by:** jarl
**Where:** w-363-takeover-fable, 363 after the takeover
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What


## Why
A short deny-list entry can match a base64 fragment of a signature and refuse an honest push (a false red), and a tag written in another encoding is decoded wrongly, so a name in it can pass.

## Acceptance
[test] A signed commit whose signature happens to contain a short test word passes, and a tag message written in ISO-8859-2 with a test word is refused, each red before and green after · by: yg check && npm test

## Evidence

