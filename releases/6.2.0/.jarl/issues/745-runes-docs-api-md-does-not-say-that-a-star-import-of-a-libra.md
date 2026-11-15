# 745 · Runes: docs/api.md does not say that a star import of a library makes a generated type of the file's own package answer outside in classifyUse

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261113T1833-mxqt
**Tags:** runes, api
**Files:** Runes/docs/api.md
**Repo:** Runes
**Found by:** rev-732-opus
**Where:** Runes release/1.1.0 at 34b7e2b: classifyUse on AutoValue_Use beside import java.util.*, and on DaggerAppComponent beside import kotlinx.coroutines.*
**Branch:** jarl/740-runes-1-1-0-final
**Worker:** w-740-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-13 18:33

## What
A type that an annotation processor generates into the file's own package has no file in the repository. Beside a star import of a library, classifyUse answers outside for it (before the library star-import reading it answered unfollowed). docs/api.md names the other limits of the new answers but not this one.

## Why
A consumer that stays quiet on outside misses a use of generated code and does not know it.

## Acceptance
[read] docs/api.md names this limit where it describes classifyUse's outside answer, and the CHANGELOG's known limits of 1.1.0 carry it

## Evidence

