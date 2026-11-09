# 463 · Gard: a log of the guards' refusals and gard guards report

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261029T1434-kbud
**Tags:** gard, workplace, guards, hooks
**Files:** Gard/src/guards/log.mjs, Gard/src/guards/report.mjs, Gard/test/guard-log.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** jarl
**Where:** the field trials of issues 422 and 460 classify every refusal as right or false; Mimir's first loop dropped its log of refusals, so nothing records them today

## What
Every refusal of a guard and every pass with a warning is appended to a log in Gard's home (the time, the guard, the root, the kind of action, and the command or path cut to a short length with no secret shapes in it), and gard guards report --since <period> groups them by guard and root. The log is local, rotated by size, and never leaves the computer.

## Why
Whether the guards get in the way can only be judged from what they actually refused during real work.

## Acceptance
A test triggers three guards and reads them back grouped in the report; a refused command holding a token-like string is logged with that part masked

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

