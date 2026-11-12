# 560 · Yggdrasil: yg check decodes every mapped text file whole in its scan for suppress markers without a…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1150-tetf
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340-fable
**Where:** the review of 340
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: yg check decodes every mapped text file whole in its scan for suppress markers without a reason, so the heap must hold the largest mapped text file
After the relation pass stopped keeping text (issue 340), one reader of whole files is left in a plain yg check: runSuppressionsScan in source/cli/src/core/suppressions/scan.ts:150-157 reads each mapped file into a buffer, probes it for binary content, and decodes each text file into one string to look for the marker token. A trace of every decode over 10 MiB on the 340 branch shows this call and no other. Measured on that branch: two text files and two .bin files of 100 MiB each die under --max-old-space-size=64 and finish at 128 with peak heap 220 MiB and 304 MiB of buffers; with 24 MiB files the peak is 68 MiB against 24 MiB with 1 MiB files. The files are read one at a time, so the need is the largest text file and not the sum. A binary file is read whole to probe its first 8000 bytes. The same code is on release/6.2.0. A streamed search for the token would keep the scan flat.

## Why


## Acceptance


[test] yg check's scan for suppress markers reads a mapped text file in bounded pieces, so two 100 MiB text files pass under --max-old-space-size=64 with every marker still found, red before and green after · by: cd source/cli && npm test

## Evidence

