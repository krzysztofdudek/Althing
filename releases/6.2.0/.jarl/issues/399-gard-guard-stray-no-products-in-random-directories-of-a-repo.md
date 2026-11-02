# 399 · Gard guard stray: no products in random directories of a repository

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, guards, hooks
**Files:** Gard/src/guards/stray.mjs, Gard/test/guard-stray.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** owner
**Where:** issue M123 of Mimir's first loop (the block of writes into random directories)

## What
A write of a product (a render, a screenshot, an export, a log) into a directory of a repository that is neither its source nor in an allow list of the rig is refused, with where to write instead. Source files, tests and the rig's own files pass.

## Why
Products scattered through a checkout are the litter the owner cleans by hand; they belong to a place meant for them.

## Acceptance
Tests refuse a PNG written into a random directory with its message and pass a source file and a file under an allowed directory

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

