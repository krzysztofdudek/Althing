# 449 · Mimir tool matrix: the table is generated from the data and checked complete

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261029T1431-ffqm
**Tags:** mimir, workplace, tools, docs
**Files:** Mimir/scripts/gen-tools-matrix.mjs, Mimir/test/tools-matrix.test.mjs
**Repo:** ../../../Mimir
**After:** 446, 447, 448
**Found by:** jarl
**Where:** the matrix data of the three probe issues, and Claude Code's from Mimir's own data

## What
A saved script builds the table of tools for the README from src/tools/matrix/*.json, including the degraded modes, without the network and without running probes. Every other place that shows the table reads it; none generates its own.

## Why
One source of truth for what works in which tool, without copying by hand.

## Acceptance
A drift test: the README's table equals the generated one; every cell has a test or a source or is marked not verified in the table; the generator makes no network attempt (a test with connections blocked)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

