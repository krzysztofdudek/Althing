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

## Changelog
- `yg check` and `yg suppressions` read a mapped text file in pieces when they look for `yg-suppress` markers, so a text file larger than the memory they are given no longer stops them. Every marker in such a file is still found and reported. A source file over 64 MiB, which no syntax tree is built for, has its markers read line by line, as a file in a language with no grammar has.

## Evidence

### Proof

- **ran (line 1d5ec62219d2):** cd source/cli && npx vitest run tests/e2e/suppress-scan-large-files-memory.test.ts tests/unit/core/suppress-scan-pieces.test.ts (red on the base: yg check under --max-old-space-size=64 died with heap out of memory on two 100 MiB text files) · **saw:** green after: 19 tests passed; yg check under --max-old-space-size=64 reports all 6 missing-reason markers of the two 100 MiB files

