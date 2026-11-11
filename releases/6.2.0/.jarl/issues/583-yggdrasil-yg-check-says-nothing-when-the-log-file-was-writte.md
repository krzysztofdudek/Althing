# 583 · Yggdrasil: yg check says nothing when the log file was written with CRLF line endings, though it now reads such a log correctly

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** light
**Key:** 20261111T1345-scfh
**Tags:** yggdrasil, log
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** w-302-opus, round 2 of 302 (a minor of rev-302-fable left undone)

## What


## Why
A log rewritten with CRLF by an editor or git's autocrlf reads correctly, but the next writer may mix endings; a warning with its own code tells the user once, where today they learn nothing.

## Acceptance
[test] yg check on a log written with CRLF line endings prints a warning with its own code that names the file and says how to restore LF, and none for an LF log · by: cd source/cli && npm test

## Evidence

