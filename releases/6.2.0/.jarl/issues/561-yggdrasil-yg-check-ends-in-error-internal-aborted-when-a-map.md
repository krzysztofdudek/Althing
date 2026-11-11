# 561 · Yggdrasil: yg check ends in error[internal] "Aborted()" when a mapped file of a parsed language is …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1150-vqto
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340-fable
**Where:** the review of 340
**Branch:** jarl/561-parser-abort
**Worker:** w-561-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 17:47

## What
Yggdrasil: yg check ends in error[internal] "Aborted()" when a mapped file of a parsed language is about 40 MiB
A generated repository with two .ts files of 40 MiB of repeated prose lines (not valid TypeScript) and two .ts files of 40 MiB of binary bytes: yg check under --max-old-space-size=512 prints "Aborted()" four times, then error[internal] "Unexpected error while running check: Aborted(). Build with -sASSERTIONS for more info." and exits 1, with about 2052 MiB of memory outside the heap at the peak, which points at the parser's own memory. Same result on release/6.2.0 and on the 340 branch, so issue 340 did not cause it. Not tried: a valid source file of that size, or the size at which it starts. A large generated bundle mapped beside the source would meet it, and the message names neither the file nor a way out.

## Why


## Acceptance


[test] A mapped file of a parsed language whose parse the parser aborts (about 40 MiB of non-code text or binary bytes) never ends yg check in error[internal]: the file's relations are reported as unread with the reason, the other files are checked, and peak memory outside the heap stays bounded, red before and green after · by: cd source/cli && npm test

## Evidence

