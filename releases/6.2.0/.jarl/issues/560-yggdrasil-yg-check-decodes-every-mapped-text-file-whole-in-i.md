# 560 · Yggdrasil: yg check decodes every mapped text file whole in its scan for suppress markers without a…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1150-tetf
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-340-fable
**Where:** the review of 340

## What
Yggdrasil: yg check decodes every mapped text file whole in its scan for suppress markers without a reason, so the heap must hold the largest mapped text file
After the relation pass stopped keeping text (issue 340), one reader of whole files is left in a plain yg check: runSuppressionsScan in source/cli/src/core/suppressions/scan.ts:150-157 reads each mapped file into a buffer, probes it for binary content, and decodes each text file into one string to look for the marker token. A trace of every decode over 10 MiB on the 340 branch shows this call and no other. Measured on that branch: two text files and two .bin files of 100 MiB each die under --max-old-space-size=64 and finish at 128 with peak heap 220 MiB and 304 MiB of buffers; with 24 MiB files the peak is 68 MiB against 24 MiB with 1 MiB files. The files are read one at a time, so the need is the largest text file and not the sum. A binary file is read whole to probe its first 8000 bytes. The same code is on release/6.2.0. A streamed search for the token would keep the scan flat.

## Why


## Acceptance


## Evidence

