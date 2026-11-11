# 561 · Yggdrasil: yg check ends in error[internal] "Aborted()" when a mapped file of a parsed language is …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1150-vqto
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-340-fable
**Where:** the review of 340

## What
Yggdrasil: yg check ends in error[internal] "Aborted()" when a mapped file of a parsed language is about 40 MiB
A generated repository with two .ts files of 40 MiB of repeated prose lines (not valid TypeScript) and two .ts files of 40 MiB of binary bytes: yg check under --max-old-space-size=512 prints "Aborted()" four times, then error[internal] "Unexpected error while running check: Aborted(). Build with -sASSERTIONS for more info." and exits 1, with about 2052 MiB of memory outside the heap at the peak, which points at the parser's own memory. Same result on release/6.2.0 and on the 340 branch, so issue 340 did not cause it. Not tried: a valid source file of that size, or the size at which it starts. A large generated bundle mapped beside the source would meet it, and the message names neither the file nor a way out.

## Why


## Acceptance


## Evidence

