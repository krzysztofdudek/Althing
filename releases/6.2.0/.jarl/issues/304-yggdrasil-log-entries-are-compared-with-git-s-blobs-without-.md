# 304 · Yggdrasil: log entries are compared with git's blobs without line-ending normalisation, and a log with CRLF in a clone without the eol attribute warns forever

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2328-tzvg
**Tags:** yggdrasil, log
**Files:** Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts, Yggdrasil/source/cli/src/cli/merge-driver.ts
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-221-opus
**Where:** source/cli/src/core/log/log-merge-resolve.ts and the check of merge sides
**After:** 221
**Branch:** jarl/302-log-merge-integrity
**Worker:** w-302-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 10:21

## What


Entries read from the working copy are compared with git's blobs without line-ending normalisation. Without log.md text eol=lf in .gitattributes (a repository initialised before 6.1.0), a log with CRLF returns the warning again after every check. init writes the attribute, which normally prevents this.

## Why


A warning that cannot be cleared teaches users to ignore it.

## Acceptance


The comparison normalises line endings (or reads through git's own conversion), with a test using an eol=crlf attribute; an old repository without the attribute gets one line of advice to add it.

## Evidence

