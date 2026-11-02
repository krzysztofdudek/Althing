# 413 · Gard: Yggdrasil in a shell, in progressive mode, with a drift job against the team's main

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** gard, workplace, drift, yggdrasil
**Files:** Gard/src/drift/yggdrasil.mjs, Gard/test/drift-yggdrasil.test.mjs
**Repo:** ../../../Gard
**After:** 365, 391, 403, 466
**Found by:** owner
**Where:** issue M81 of Mimir's first loop; the measurement of issue 365 decides the layout first

## What
Following the conclusion of issue 365: a rig's architecture graph runs as one of its checks in the CI container, in Yggdrasil's progressive mode when the rig says so, so an agent can pull the code toward the agreed state while a person working on the raw repository does what they like; a job reports when the graph disagrees with the team's main branch; a gate rule in the rig can block a push of a repo whose graph check fails, locally only, leaving no trace in the team's repository. Gard itself knows Yggdrasil only as a command of the rig's checks.

## Why
The owner, 2026-10-24: a rig with its own Yggdrasil works as a gate for agents in the context of a project whose team does not take the rules in.

## Acceptance
With a fake yg, the check passes the progressive mode in its arguments, the job reports drift and no drift, and the push rule blocks on a failing graph while the team's repository stays clean

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

