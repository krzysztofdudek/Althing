# 672 · Yggdrasil: the deterministic worker pool sizes each worker at 20 bytes of tree per byte of source (…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2240-rxfm
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561b-opus
**Where:** the review of 561, 610

## What
Yggdrasil: the deterministic worker pool sizes each worker at 20 bytes of tree per byte of source (cli/det-concurrency.ts:74), but a 64 KiB file can fill a worker's whole 2 GiB of parser memory, so a fill on N workers can peak near N times 2 GiB. Seen with 33 per-file script pairs, 24 of them on such files: 4 workers, peak resident 8.4 GiB, the same on release/6.2.0 at 03ac2699d. On a machine with many cores and less memory than that, the fill swaps or is killed. Minor.

## Why


## Acceptance


## Evidence

